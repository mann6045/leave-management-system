package com.company.lms.controller;

import com.company.lms.entity.User;
import com.company.lms.repository.UserRepository;

import java.io.File;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

	@Autowired
	private UserRepository userRepository;

	// ================= GET PROFILE =================
	@GetMapping
	public User getProfile(Authentication authentication) {

		return userRepository.findByEmail(authentication.getName()).orElseThrow();
	}

	// ================= UPDATE PROFILE =================
	@PutMapping
	public User updateProfile(@RequestBody User updatedUser, Authentication authentication) {

		User user = userRepository.findByEmail(authentication.getName()).orElseThrow();

		user.setName(updatedUser.getName());
		user.setDepartment(updatedUser.getDepartment());
		user.setContactNumber(updatedUser.getContactNumber());
		user.setAddress(updatedUser.getAddress());

		return userRepository.save(user);
	}

	@PostMapping("/upload")
	public User uploadProfileImage(@RequestParam("file") MultipartFile file, Authentication authentication)
			throws IOException {

		User user = userRepository.findByEmail(authentication.getName()).orElseThrow();

		// ✅ Absolute path (IMPORTANT)
		String uploadDir = System.getProperty("user.dir") + "/uploads/";

		File dir = new File(uploadDir);
		if (!dir.exists()) {
			dir.mkdirs(); // create folder if not exists
		}

		String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

		File destination = new File(uploadDir + fileName);

		file.transferTo(destination); // ✅ NOW WILL WORK

		user.setProfileImage(fileName);
		return userRepository.save(user);
	}
}