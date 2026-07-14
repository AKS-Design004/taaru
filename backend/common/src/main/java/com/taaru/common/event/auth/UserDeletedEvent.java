package com.taaru.common.event.auth;

import com.taaru.common.event.AbstractDomainEvent;

import java.util.UUID;

public class UserDeletedEvent extends AbstractDomainEvent {

    private final UUID userId;

    public UserDeletedEvent(UUID userId) {
        super("auth");
        this.userId = userId;
    }

    public UUID getUserId() { return userId; }
}
