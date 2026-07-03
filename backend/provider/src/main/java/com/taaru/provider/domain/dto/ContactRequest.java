package com.taaru.provider.domain.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactRequest(
        @NotBlank @Size(max = 100) String senderName,
        @NotBlank @Email @Size(max = 255) String senderEmail,
        @NotBlank @Size(max = 5000) String message
) {}
