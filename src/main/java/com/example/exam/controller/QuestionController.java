package com.example.exam.controller;
import com.example.exam.model.*; import com.example.exam.service.*; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.web.bind.annotation.*; import java.util.List;
@RestController @RequestMapping("/api/questions") @CrossOrigin public class QuestionController {
 private final QuestionService questionService; private final ExamService examService;
 public QuestionController(QuestionService questionService, ExamService examService){ this.questionService=questionService; this.examService=examService; }
 @PreAuthorize("hasAnyRole('ADMIN','FACULTY')") @PostMapping public Question create(@RequestBody Question q){ Exam exam = examService.get(q.getExam().getId()); q.setExam(exam); return questionService.create(q); }
 @GetMapping("/by-exam/{examId}") public List<Question> byExam(@PathVariable Long examId){ return questionService.byExam(examId); }
}
