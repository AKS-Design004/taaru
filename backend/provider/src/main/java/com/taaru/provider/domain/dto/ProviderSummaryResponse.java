package com.taaru.provider.domain.dto;

import com.taaru.provider.domain.entity.Provider;
import com.taaru.provider.domain.entity.ProviderPhoto;
import lombok.Builder;

import java.math.BigDecimal;
import java.util.UUID;

@Builder
public record ProviderSummaryResponse(
        UUID id,
        String businessName,
        String category,
        String city,
        String district,
        BigDecimal rating,
        int reviewCount,
        String logoUrl,
        String firstPhotoUrl,
        boolean featured
) {
    public static ProviderSummaryResponse from(Provider provider) {
        var firstPhoto = provider.getPhotos() != null && !provider.getPhotos().isEmpty()
                ? provider.getPhotos().get(0).getUrl()
                : null;
        return ProviderSummaryResponse.builder()
                .id(provider.getId())
                .businessName(provider.getBusinessName())
                .category(provider.getCategory().getName())
                .city(provider.getCity())
                .district(provider.getDistrict())
                .rating(provider.getRating())
                .reviewCount(provider.getReviewCount())
                .logoUrl(provider.getLogoUrl())
                .firstPhotoUrl(firstPhoto)
                .featured(provider.isFeatured())
                .build();
    }
}
