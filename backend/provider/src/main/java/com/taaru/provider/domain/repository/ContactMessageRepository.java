package com.taaru.provider.domain.repository;

import com.taaru.provider.domain.entity.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, UUID> {
    List<ContactMessage> findByProviderIdOrderByCreatedAtDesc(UUID providerId);
}
