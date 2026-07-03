package com.taaru.auth.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
        @NotBlank String currentPassword,
        @NotBlank @Size(min = 8, max = 128)
        @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d).+$",
                 message = "Le mot de passe doit contenir au moins une majuscule et un chiffre")
        String newPassword
) {}
