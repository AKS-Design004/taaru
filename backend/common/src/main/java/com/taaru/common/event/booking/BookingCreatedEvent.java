package com.taaru.common.event.booking;

import com.taaru.common.event.AbstractDomainEvent;

import java.math.BigDecimal;
import java.util.UUID;

public class BookingCreatedEvent extends AbstractDomainEvent {

    private final UUID bookingId;
    private final UUID providerId;
    private final UUID clientId;
    private final BigDecimal amount;

    public BookingCreatedEvent(UUID bookingId, UUID providerId, UUID clientId, BigDecimal amount) {
        super("booking");
        this.bookingId = bookingId;
        this.providerId = providerId;
        this.clientId = clientId;
        this.amount = amount;
    }

    public UUID getBookingId() { return bookingId; }
    public UUID getProviderId() { return providerId; }
    public UUID getClientId() { return clientId; }
    public BigDecimal getAmount() { return amount; }
}
