package com.taaru.common.event.review;

import com.taaru.common.event.AbstractDomainEvent;

import java.util.UUID;

public class ReviewCreatedEvent extends AbstractDomainEvent {

    private final UUID reviewId;
    private final UUID providerId;
    private final UUID clientId;
    private final int rating;

    public ReviewCreatedEvent(UUID reviewId, UUID providerId, UUID clientId, int rating) {
        super("review");
        this.reviewId = reviewId;
        this.providerId = providerId;
        this.clientId = clientId;
        this.rating = rating;
    }

    public UUID getReviewId() { return reviewId; }
    public UUID getProviderId() { return providerId; }
    public UUID getClientId() { return clientId; }
    public int getRating() { return rating; }
}
