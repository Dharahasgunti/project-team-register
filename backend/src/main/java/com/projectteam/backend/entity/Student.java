package com.projectteam.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(
    name = "student_records",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_student_roll_number",
            columnNames = "roll_number"
        )
    }
)
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Roll number is required")
    @Size(max = 30)
    @Column(name = "roll_number", nullable = false, length = 30)
    private String rollNumber;

    @NotBlank(message = "Student name is required")
    @Size(max = 100)
    @Column(name = "student_name", nullable = false, length = 100)
    private String studentName;

    @NotBlank(message = "Team name is required")
    @Size(max = 100)
    @Column(name = "team_name", nullable = false, length = 100)
    private String teamName;

    @NotBlank(message = "Project title is required")
    @Size(max = 200)
    @Column(name = "project_title", nullable = false, length = 200)
    private String projectTitle;

    public Student() {
    }

    public Student(String rollNumber, String studentName,
                   String teamName, String projectTitle) {
        this.rollNumber = rollNumber;
        this.studentName = studentName;
        this.teamName = teamName;
        this.projectTitle = projectTitle;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }
}
