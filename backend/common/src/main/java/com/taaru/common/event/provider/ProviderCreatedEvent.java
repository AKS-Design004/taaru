package com.taaru.common.event.provider;

import com.taaru.common.event.AbstractDomainEvent;

import java.util.UUID;

public class ProviderCreatedEvent extends AbstractDomainEvent {

    private final UUID providerId;
    private final UUID userId;
    private final String businessName;
    private final String categorySlug;
    private final String city;

    public ProviderCreatedEvent(UUID providerId, UUID userId, String businessName, String categorySlug, String city) {
        super("provider");
        this.providerId = providerId;
        this.userId = userId;
        this.businessName = businessName;
        this.categorySlug = categorySlug;
        this.city = city;
    }

    public UUID getProviderId() { return providerId; }
    public UUID getUserId() { return userId; }
    public String getBusinessName() { return businessName; }
    public String getCategorySlug() { return categorySlug; }
    public String getCity() { return city; }
}
