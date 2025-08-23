package com.example.exam.model;
import jakarta.persistence.*; import lombok.*;
@Entity @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Result {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false) private Exam exam;
 @ManyToOne(optional=false) private User student;
 private Integer score; private String status;
}
