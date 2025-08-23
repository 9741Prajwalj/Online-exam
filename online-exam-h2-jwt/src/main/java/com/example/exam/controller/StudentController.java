package com.example.exam.controller;
import com.example.exam.dto.SubmitAnswerDTO; import com.example.exam.model.*; import com.example.exam.repository.UserRepository; import com.example.exam.service.*; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/student") @CrossOrigin public class StudentController {
 private final ExamService examService; private final QuestionService questionService; private final ResultService resultService; private final UserRepository userRepository;
 public StudentController(ExamService examService, QuestionService questionService, ResultService resultService, UserRepository userRepository){ this.examService=examService; this.questionService=questionService; this.resultService=resultService; this.userRepository=userRepository; }
 @PreAuthorize("hasRole('STUDENT')") @PostMapping("/submit") public Result submit(@RequestBody SubmitAnswerDTO dto, Authentication auth){
  Exam exam = examService.get(dto.getExamId()); List<Question> questions = questionService.byExam(dto.getExamId()); Map<Long,String> answers = dto.getAnswers(); int score=0;
  for(Question q:questions){ String ans = answers.get(q.getId()); if(ans!=null && ans.equalsIgnoreCase(q.getCorrectAnswer())) score++; }
  User student = userRepository.findByUsername(auth.getName()).orElseThrow(() -> new RuntimeException("Student not found: "+auth.getName()));
  Result r = Result.builder().exam(exam).student(student).score(score).status("COMPLETED").build(); return resultService.save(r);
 }
}
