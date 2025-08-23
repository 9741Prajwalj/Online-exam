package com.example.exam.model;
import jakarta.persistence.*; import lombok.*;
@Entity @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Question {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false) private Exam exam;
 @Column(length=1000) private String text;
 private String optionA; private String optionB; private String optionC; private String optionD;
 private String correctAnswer;
}
