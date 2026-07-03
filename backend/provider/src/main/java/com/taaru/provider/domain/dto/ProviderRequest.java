package com.taaru.provider.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ProviderRequest(
        @NotBlank @Size(max = 255) String businessName,
        @NotBlank String categorySlug,
        @Size(max = 100) String subcategory,
        @Size(max = 5000) String description,
        @NotBlank @Size(max = 100) String city,
        @Size(max = 100) String district,
        @Size(max = 255) String address,
        @Size(max = 20) String phone,
        @Size(max = 20) String whatsapp,
        @Size(max = 255) String website,
        String socialLinks,
        String pricing,
        BigDecimal latitude,
        BigDecimal longitude,
        @Size(max = 500) String logoUrl
) {}
