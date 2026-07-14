package com.taaru.common.event.booking;

import com.taaru.common.event.AbstractDomainEvent;

import java.math.BigDecimal;
import java.util.UUID;

public class BookingPaymentRequiredEvent extends AbstractDomainEvent {

    private final UUID bookingId;
    private final UUID clientId;
    private final BigDecimal amount;
    private final String currency;

    public BookingPaymentRequiredEvent(UUID bookingId, UUID clientId, BigDecimal amount, String currency) {
        super("booking");
        this.bookingId = bookingId;
        this.clientId = clientId;
        this.amount = amount;
        this.currency = currency;
    }

    public UUID getBookingId() { return bookingId; }
    public UUID getClientId() { return clientId; }
    public BigDecimal getAmount() { return amount; }
    public String getCurrency() { return currency; }
}
