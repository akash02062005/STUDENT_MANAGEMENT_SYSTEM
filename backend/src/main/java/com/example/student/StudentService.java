package com.example.student;

import com.example.student.auth.User;
import com.example.student.auth.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired(required = false)
    private StudentRepository repository;

    @Autowired
    private UserRepository userRepository;

    private final String CSV_PATH = "D:\\tmp\\cgpa_data.csv";

    private final Map<String, Student> fallbackStore = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
    }

    public void importDepartmentData() {
        if (isRepositoryActive()) {
            repository.deleteAll();
            // Optional: userRepository.deleteAll(); // Only if you want to clear student users too
        }
        fallbackStore.clear();

        try (BufferedReader br = new BufferedReader(new FileReader(CSV_PATH))) {
            String line;
            int lineNumber = 0;
            while ((line = br.readLine()) != null) {
                lineNumber++;
                if (lineNumber <= 4) continue; 

                String[] v = line.split(",");
                if (v.length < 67) continue;

                Student s = new Student();
                String regNo = v[1].trim();
                s.setStudentId(regNo);
                
                String name = v[2].trim();
                String[] nameParts = name.split(" ");
                s.setFirstName(nameParts[0]);
                s.setLastName(nameParts.length > 1 ? nameParts[1] : "");
                
                s.setDepartment("CSE");
                s.setEmail(regNo + "@univ.edu");
                s.setAge(20);

                try {
                    double s1 = parseDoubleSafe(v[21]);
                    double s2 = parseDoubleSafe(v[43]);
                    double s3 = parseDoubleSafe(v[65]);

                    s.setGpa1(Math.min(10.0, s1));
                    s.setGpa2(Math.min(10.0, s2));
                    s.setGpa3(Math.min(10.0, s3));

                    double cumCgpa3 = parseDoubleSafe(v[67]);
                    s.setCgpa1(s1);
                    s.setCgpa2(round((s1 + s2) / 2.0));
                    s.setCgpa3(Math.min(10.0, cumCgpa3));

                    double trend = ((s2 - s1) + (s3 - s2)) / 2.0;
                    double s4 = Math.min(10.0, Math.max(0.0, s3 + (trend * 0.7)));
                    s.setGpa4(round(s4));
                    s.setCgpa4(round(Math.min(10.0, (s.getCgpa3() * 3 + s4) / 4.0)));

                    double s5 = Math.min(10.0, Math.max(0.0, s4 + (trend * 0.5)));
                    s.setGpa5(round(s5));
                    s.setCgpa5(round(Math.min(10.0, (s.getCgpa4() * 4 + s5) / 5.0)));

                    s.setAttendance(75 + new Random().nextInt(25));
                    s.setBacklogs(s1 < 5.0 ? 1 : 0 + (s2 < 5.0 ? 1 : 0) + (s3 < 5.0 ? 1 : 0));
                    s.setAtRisk(s.getCgpa3() < 7.0 || s.getBacklogs() > 0);
                    s.setPlacementScore(round(Math.min(100.0, s.getCgpa5() * 10 - (s.getBacklogs() * 15))));

                } catch (Exception e) {
                    continue; 
                }

                if (isRepositoryActive()) {
                    repository.save(s);
                    // Generate Personalized Student Login
                    if (userRepository.findByUsername(regNo).isEmpty()) {
                        String prefix = s.getFirstName().substring(0, Math.min(2, s.getFirstName().length())).toUpperCase();
                        String suffix = regNo.length() >= 3 ? regNo.substring(regNo.length() - 3) : "000";
                        String password = prefix + suffix; // e.g., AA002

                        User studentUser = new User();
                        studentUser.setUsername(regNo);
                        studentUser.setPassword(password);
                        studentUser.setRole("STUDENT");
                        studentUser.setStudentId(regNo);
                        userRepository.save(studentUser);
                    }
                } else {
                    fallbackStore.put(s.getStudentId(), s);
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("Local student dataset not found at " + CSV_PATH);
        }
    }

    public List<Student> getAllStudents() {
        return isRepositoryActive() ? repository.findAll() : new ArrayList<>(fallbackStore.values());
    }

    public List<Student> getTopPerformers() {
        return getAllStudents().stream()
                .sorted(Comparator.comparingDouble(Student::getCgpa5).reversed())
                .limit(10)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getDepartmentAnalytics() {
        List<Student> all = getAllStudents();
        Map<String, Object> analytics = new HashMap<>();

        if (all.isEmpty()) return analytics;

        analytics.put("trajectoryAvg", Arrays.asList(
            round(all.stream().mapToDouble(Student::getGpa1).average().orElse(0)),
            round(all.stream().mapToDouble(Student::getGpa2).average().orElse(0)),
            round(all.stream().mapToDouble(Student::getGpa3).average().orElse(0)),
            round(all.stream().mapToDouble(Student::getGpa4).average().orElse(0)),
            round(all.stream().mapToDouble(Student::getGpa5).average().orElse(0))
        ));

        long eligible = all.stream().filter(s -> s.getCgpa5() >= 7.5 && s.getBacklogs() == 0).count();
        analytics.put("placementEligible", eligible);

        Map<String, Long> spread = new HashMap<>();
        spread.put("Elite (9.0+)", all.stream().filter(s -> s.getCgpa3() >= 9.0).count());
        spread.put("Advanced (8.0-9.0)", all.stream().filter(s -> s.getCgpa3() >= 8.0 && s.getCgpa3() < 9.0).count());
        spread.put("Stable (7.0-8.0)", all.stream().filter(s -> s.getCgpa3() >= 7.0 && s.getCgpa3() < 8.0).count());
        spread.put("At-Risk (< 7.0)", all.stream().filter(s -> s.getCgpa3() < 7.0).count());
        analytics.put("gradeSpread", spread);

        return analytics;
    }

    public Optional<Student> getStudentByStudentId(String studentId) {
        return isRepositoryActive() 
            ? repository.findByStudentId(studentId) 
            : Optional.ofNullable(fallbackStore.get(studentId));
    }

    public void deleteStudent(String studentId) {
        if (isRepositoryActive()) repository.findByStudentId(studentId).ifPresent(repository::delete);
        fallbackStore.remove(studentId);
    }

    public Student saveStudent(Student student) {
        if (isRepositoryActive()) return repository.save(student);
        fallbackStore.put(student.getStudentId(), student);
        return student;
    }

    public List<Student> getSortedStudents(String sortBy) {
        List<Student> students = getAllStudents();
        Comparator<Student> comparator = switch (sortBy) {
            case "name" -> Comparator.comparing(Student::getFirstName);
            case "cgpa" -> Comparator.comparingDouble(Student::getCgpa5).reversed();
            default -> Comparator.comparing(Student::getStudentId);
        };
        students.sort(comparator);
        return students;
    }

    private boolean isRepositoryActive() {
        return repository != null;
    }

    private double parseDoubleSafe(String val) {
        if (val == null || val.trim().isEmpty() || val.contains("U")) return 0.0;
        try {
            return Double.parseDouble(val.trim());
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
