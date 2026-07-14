package com.taaru.common.event.payment;

import com.taaru.common.event.AbstractDomainEvent;

import java.math.BigDecimal;
import java.util.UUID;

public class PaymentFailedEvent extends AbstractDomainEvent {

    private final UUID paymentId;
    private final UUID bookingId;
    private final String reason;

    public PaymentFailedEvent(UUID paymentId, UUID bookingId, String reason) {
        super("payment");
        this.paymentId = paymentId;
        this.bookingId = bookingId;
        this.reason = reason;
    }

    public UUID getPaymentId() { return paymentId; }
    public UUID getBookingId() { return bookingId; }
    public String getReason() { return reason; }
}
