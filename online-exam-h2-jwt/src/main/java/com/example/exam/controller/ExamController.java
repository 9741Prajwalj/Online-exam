package com.example.exam.controller;
import com.example.exam.model.Exam; import com.example.exam.service.ExamService; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.web.bind.annotation.*; import java.util.List;
@RestController @RequestMapping("/api/exams") @CrossOrigin public class ExamController {
 private final ExamService examService; public ExamController(ExamService examService){ this.examService = examService; }
 @GetMapping public List<Exam> all(){ return examService.all(); }
 @PreAuthorize("hasAnyRole('ADMIN','FACULTY')") @PostMapping public Exam create(@RequestBody Exam e){ return examService.create(e); }
 @GetMapping("/{id}") public Exam get(@PathVariable Long id){ return examService.get(id); }
 @PreAuthorize("hasAnyRole('ADMIN','FACULTY')") @DeleteMapping("/{id}") public void delete(@PathVariable Long id){ examService.delete(id); }
}
