package com.taaru.common.event.payment;

import com.taaru.common.event.AbstractDomainEvent;

import java.math.BigDecimal;
import java.util.UUID;

public class PaymentCompletedEvent extends AbstractDomainEvent {

    private final UUID paymentId;
    private final UUID bookingId;
    private final String method;
    private final BigDecimal amount;
    private final String transactionReference;

    public PaymentCompletedEvent(UUID paymentId, UUID bookingId, String method, BigDecimal amount, String transactionReference) {
        super("payment");
        this.paymentId = paymentId;
        this.bookingId = bookingId;
        this.method = method;
        this.amount = amount;
        this.transactionReference = transactionReference;
    }

    public UUID getPaymentId() { return paymentId; }
    public UUID getBookingId() { return bookingId; }
    public String getMethod() { return method; }
    public BigDecimal getAmount() { return amount; }
    public String getTransactionReference() { return transactionReference; }
}
