package com.example.student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "students")
public class Student {
    @Id
    private String id;
    private String studentId; // Mapping to REG.NO from Excel
    private String firstName;
    private String lastName;
    private String email;
    private String department;
    private int age;
    
    // Semester GPAs (10-point scale: 8.5 out of 10)
    private double gpa1;
    private double gpa2;
    private double gpa3;
    private double gpa4;
    private double gpa5;
    
    // Cumulative CGPAs (10-point scale: 8.5 out of 10)
    private double cgpa1;
    private double cgpa2;
    private double cgpa3;
    private double cgpa4;
    private double cgpa5;
    
    // Core Elite Hub Features
    private int attendance; // Percentage (0-100)
    private double placementScore; // Calculated (0-100)
    private boolean isAtRisk; // Flags students below 7.0 CGPA
    private int backlogs;
}
