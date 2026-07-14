package com.taaru.common.event;

@FunctionalInterface
public interface DomainEventPublisher {
    void publish(DomainEvent event);
}
