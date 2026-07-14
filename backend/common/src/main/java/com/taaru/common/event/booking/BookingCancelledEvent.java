package com.taaru.common.event.booking;

import com.taaru.common.event.AbstractDomainEvent;

import java.util.UUID;

public class BookingCancelledEvent extends AbstractDomainEvent {

    private final UUID bookingId;
    private final String reason;

    public BookingCancelledEvent(UUID bookingId, String reason) {
        super("booking");
        this.bookingId = bookingId;
        this.reason = reason;
    }

    public UUID getBookingId() { return bookingId; }
    public String getReason() { return reason; }
}
