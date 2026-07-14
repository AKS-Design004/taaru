package com.taaru.common.port;

import java.util.Map;

public interface INotificationPort {
    void sendEmail(String to, String subject, String templateName, Map<String, Object> variables);
    void sendSms(String to, String message);
    void sendPush(String userId, String title, String body, Map<String, String> data);
}
