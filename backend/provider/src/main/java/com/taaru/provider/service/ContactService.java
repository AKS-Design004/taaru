package com.taaru.provider.service;

import com.taaru.common.exception.ResourceNotFoundException;
import com.taaru.provider.domain.dto.ContactRequest;
import com.taaru.provider.domain.entity.ContactMessage;
import com.taaru.provider.domain.entity.ProviderStatus;
import com.taaru.provider.domain.repository.ContactMessageRepository;
import com.taaru.provider.domain.repository.ProviderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ProviderRepository providerRepository;
    private final ContactMessageRepository contactMessageRepository;

    @Transactional
    public void sendMessage(UUID providerId, ContactRequest request) {
        var provider = providerRepository.findByIdAndStatus(providerId, ProviderStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("Prestataire", providerId));

        var message = ContactMessage.builder()
                .provider(provider)
                .senderName(request.senderName())
                .senderEmail(request.senderEmail())
                .message(request.message())
                .build();

        contactMessageRepository.save(message);
    }
}
