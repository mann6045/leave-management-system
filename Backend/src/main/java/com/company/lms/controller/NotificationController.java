package com.company.lms.controller;

import com.company.lms.entity.Notification;
import com.company.lms.entity.User;
import com.company.lms.repository.UserRepository;
import com.company.lms.service.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

	@Autowired
	private NotificationService notificationService;

	@Autowired
	private UserRepository userRepository;

	// ================= GET MY NOTIFICATIONS =================
	@GetMapping("/my")
	public List<Notification> getMyNotifications(Authentication authentication) {

		User user = userRepository.findByEmail(authentication.getName()).orElseThrow();

		return notificationService.getUserNotifications(user.getId());
	}

	@GetMapping("/count")
	public long getUnreadCount(Authentication authentication) {

		User user = userRepository.findByEmail(authentication.getName()).orElseThrow();

		return notificationService.getUnreadCount(user.getId());
	}

	// ================= CLEAR ALL =================
	@DeleteMapping("/clear")
	public void clearAll(Authentication authentication) {

		User user = userRepository.findByEmail(authentication.getName()).orElseThrow();

		notificationService.clearAllNotifications(user.getId());
	}

	// ================= DELETE ONE =================
	@DeleteMapping("/{id}")
	public void deleteOne(@PathVariable Long id) {
		notificationService.deleteNotification(id);
	}

	@PutMapping("/read-all")
	public void markAllRead(Authentication auth) {
		User user = userRepository.findByEmail(auth.getName()).orElseThrow();
		notificationService.markAllAsRead(user.getId());
	}

}