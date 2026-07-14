package com.taaru.common.event.auth;

import com.taaru.common.event.AbstractDomainEvent;

import java.util.UUID;

public class UserRegisteredEvent extends AbstractDomainEvent {

    private final UUID userId;
    private final String email;
    private final String firstName;
    private final String lastName;
    private final String role;

    public UserRegisteredEvent(UUID userId, String email, String firstName, String lastName, String role) {
        super("auth");
        this.userId = userId;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }

    public UUID getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getRole() { return role; }
}
