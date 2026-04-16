package com.company.lms.service;

import com.company.lms.entity.Notification;
import java.util.List;

public interface NotificationService {

	void createNotification(Long userId, String message);

	List<Notification> getUserNotifications(Long userId);

	// ✅ NEW → unread count
	long getUnreadCount(Long userId);

	// ✅ NEW → mark as read
	void markAsRead(Long notificationId);

	// ✅ NEW
	void clearAllNotifications(Long userId);

	// ✅ NEW
	void deleteNotification(Long notificationId);

	void markAllAsRead(Long userId);

	void deleteAll(Long userId);

}