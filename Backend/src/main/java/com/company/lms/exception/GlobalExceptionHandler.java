package com.company.lms.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(Exception.class)
	public ResponseEntity<String> handleAll(Exception ex) {

		ex.printStackTrace(); // 🔥 VERY IMPORTANT

		return ResponseEntity.status(500).body("ERROR: " + ex.getMessage());
	}
}