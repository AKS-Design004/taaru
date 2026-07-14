package com.taaru.common.event.provider;

import com.taaru.common.event.AbstractDomainEvent;

import java.util.UUID;

public class ProviderStatusChangedEvent extends AbstractDomainEvent {

    private final UUID providerId;
    private final String oldStatus;
    private final String newStatus;

    public ProviderStatusChangedEvent(UUID providerId, String oldStatus, String newStatus) {
        super("provider");
        this.providerId = providerId;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
    }

    public UUID getProviderId() { return providerId; }
    public String getOldStatus() { return oldStatus; }
    public String getNewStatus() { return newStatus; }
}
