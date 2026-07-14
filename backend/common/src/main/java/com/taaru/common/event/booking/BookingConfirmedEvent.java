package com.taaru.common.event.booking;

import com.taaru.common.event.AbstractDomainEvent;

import java.util.UUID;

public class BookingConfirmedEvent extends AbstractDomainEvent {

    private final UUID bookingId;

    public BookingConfirmedEvent(UUID bookingId) {
        super("booking");
        this.bookingId = bookingId;
    }

    public UUID getBookingId() { return bookingId; }
}
