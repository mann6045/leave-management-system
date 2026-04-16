package com.company.lms.service.impl;

import com.company.lms.entity.Notification;
import com.company.lms.repository.NotificationRepository;
import com.company.lms.service.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

	@Autowired
	private NotificationRepository notificationRepository;

	@Override
	public void createNotification(Long userId, String message) {

		Notification n = new Notification();

		n.setUserId(userId);
		n.setMessage(message);
		n.setCreatedAt(LocalDateTime.now());
		n.setRead(false);

		notificationRepository.save(n);
	}

	@Override
	public List<Notification> getUserNotifications(Long userId) {

		return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
	}

	@Override
	public long getUnreadCount(Long userId) {
		return notificationRepository.countByUserIdAndIsReadFalse(userId);
	}

	@Override
	public void markAsRead(Long notificationId) {
		Notification n = notificationRepository.findById(notificationId).orElseThrow();
		n.setRead(true);
		notificationRepository.save(n);
	}

	@Override
	public void clearAllNotifications(Long userId) {
		List<Notification> list = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
		notificationRepository.deleteAll(list);
	}

	@Override
	public void deleteNotification(Long notificationId) {
		notificationRepository.deleteById(notificationId);
	}

	@Override
	public void markAllAsRead(Long userId) {
		List<Notification> list = notificationRepository.findByUserId(userId);
		list.forEach(n -> n.setRead(true));
		notificationRepository.saveAll(list);
	}

	@Override
	public void deleteAll(Long userId) {
		notificationRepository.deleteByUserId(userId);
	}
}