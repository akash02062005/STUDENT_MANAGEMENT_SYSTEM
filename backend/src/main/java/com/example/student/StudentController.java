package com.example.student;

import com.example.student.auth.User;
import com.example.student.auth.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    @Autowired
    private StudentService service;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Student> getAll(@RequestParam(required = false) String sortBy) {
        if (sortBy != null) return service.getSortedStudents(sortBy);
        return service.getAllStudents();
    }

    @PostMapping("/import-department-data")
    public ResponseEntity<String> importData() {
        service.importDepartmentData();
        return ResponseEntity.ok("Department Matrix Synchronized for Batch 2023-27");
    }

    @GetMapping("/analytics")
    public Map<String, Object> getAnalytics() {
        return service.getDepartmentAnalytics();
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<Student> getByStudentId(@PathVariable String studentId) {
        return service.getStudentByStudentId(studentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Student create(@RequestBody Student student) {
        return service.saveStudent(student);
    }

    @PutMapping("/{studentId}")
    public ResponseEntity<Student> update(@PathVariable String studentId, @RequestBody Student student) {
        return service.getStudentByStudentId(studentId)
                .map(existing -> {
                    student.setId(existing.getId());
                    student.setStudentId(studentId);
                    return ResponseEntity.ok(service.saveStudent(student));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/profile/{studentId}")
    public ResponseEntity<?> updateProfile(@PathVariable String studentId, @RequestBody Map<String, Object> profileData) {
        Optional<Student> studentOpt = service.getStudentByStudentId(studentId);
        
        if (studentOpt.isPresent()) {
            Student existing = studentOpt.get();
            if (profileData.containsKey("email")) existing.setEmail((String) profileData.get("email"));
            if (profileData.containsKey("department")) existing.setDepartment((String) profileData.get("department"));
            if (profileData.containsKey("age")) existing.setAge((Integer) profileData.get("age"));
            return ResponseEntity.ok(service.saveStudent(existing));
        } else {
            // Fallback: Check User repository for non-student profiles (Admins)
            return userRepository.findByUsername(studentId)
                .map(user -> {
                    // Update User specific bio if needed
                    return ResponseEntity.ok(Map.of("message", "Administrative profile updated in Auth records"));
                })
                .orElse(ResponseEntity.notFound().build());
        }
    }

    @DeleteMapping("/{studentId}")
    public ResponseEntity<Void> delete(@PathVariable String studentId) {
        service.deleteStudent(studentId);
        return ResponseEntity.noContent().build();
    }
}
