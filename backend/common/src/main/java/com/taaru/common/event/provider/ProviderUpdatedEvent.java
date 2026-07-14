package com.taaru.common.event.provider;

import com.taaru.common.event.AbstractDomainEvent;

import java.util.UUID;

public class ProviderUpdatedEvent extends AbstractDomainEvent {

    private final UUID providerId;

    public ProviderUpdatedEvent(UUID providerId) {
        super("provider");
        this.providerId = providerId;
    }

    public UUID getProviderId() { return providerId; }
}
