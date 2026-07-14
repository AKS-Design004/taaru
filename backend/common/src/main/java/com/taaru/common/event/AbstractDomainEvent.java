package com.taaru.common.event;

import java.time.Instant;
import java.util.UUID;

public abstract class AbstractDomainEvent implements DomainEvent {

    private final UUID eventId;
    private final Instant occurredAt;
    private final String source;

    protected AbstractDomainEvent(String source) {
        this.eventId = UUID.randomUUID();
        this.occurredAt = Instant.now();
        this.source = source;
    }

    @Override
    public UUID eventId() { return eventId; }

    @Override
    public Instant occurredAt() { return occurredAt; }

    @Override
    public String source() { return source; }
}
