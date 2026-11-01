package com.projectteam.backend.service;

import com.projectteam.backend.entity.Student;
import com.projectteam.backend.repository.StudentRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // View all student records
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // View one student record
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Student record not found"
                ));
    }

    // Add a new student
    @Transactional
    public Student addStudent(Student student) {

        if (studentRepository.existsByRollNumber(student.getRollNumber())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "A student with this roll number already exists"
            );
        }

        student.setId(null);

        return studentRepository.save(student);
    }

    // Update the team name and project title
    @Transactional
    public Student updateStudent(Long id, Student updatedStudent) {

        Student existingStudent = getStudentById(id);

        existingStudent.setTeamName(updatedStudent.getTeamName());
        existingStudent.setProjectTitle(updatedStudent.getProjectTitle());

        return studentRepository.save(existingStudent);
    }

    // Delete a student
    @Transactional
    public void deleteStudent(Long id) {

        Student student = getStudentById(id);

        studentRepository.delete(student);
    }
}
