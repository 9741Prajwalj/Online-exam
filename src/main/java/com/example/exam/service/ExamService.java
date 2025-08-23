package com.example.exam.service;
import com.example.exam.model.Exam; import com.example.exam.repository.ExamRepository; import org.springframework.stereotype.Service; import java.util.List;
@Service public class ExamService {
 private final ExamRepository repo; public ExamService(ExamRepository repo){ this.repo=repo; }
 public Exam create(Exam e){ return repo.save(e); }
 public List<Exam> all(){ return repo.findAll(); }
 public Exam get(Long id){ return repo.findById(id).orElseThrow(() -> new RuntimeException("Exam not found: "+id)); }
 public void delete(Long id){ if(!repo.existsById(id)) throw new RuntimeException("Exam not found: "+id); repo.deleteById(id); }
}
