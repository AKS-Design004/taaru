package com.taaru.provider.domain.dto;

import com.taaru.provider.domain.entity.Provider;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Builder
public record ProviderDetailResponse(
        UUID id,
        String businessName,
        String category,
        String subcategory,
        String description,
        String city,
        String district,
        String address,
        String phone,
        String whatsapp,
        String website,
        String socialLinks,
        String pricing,
        BigDecimal latitude,
        BigDecimal longitude,
        String logoUrl,
        BigDecimal rating,
        int reviewCount,
        List<String> photoUrls,
        LocalDateTime createdAt
) {
    public static ProviderDetailResponse from(Provider provider) {
        var photoUrls = provider.getPhotos() != null
                ? provider.getPhotos().stream().map(p -> p.getUrl()).toList()
                : List.<String>of();
        return ProviderDetailResponse.builder()
                .id(provider.getId())
                .businessName(provider.getBusinessName())
                .category(provider.getCategory().getName())
                .subcategory(provider.getSubcategory())
                .description(provider.getDescription())
                .city(provider.getCity())
                .district(provider.getDistrict())
                .address(provider.getAddress())
                .phone(provider.getPhone())
                .whatsapp(provider.getWhatsapp())
                .website(provider.getWebsite())
                .socialLinks(provider.getSocialLinks())
                .pricing(provider.getPricing())
                .latitude(provider.getLatitude())
                .longitude(provider.getLongitude())
                .logoUrl(provider.getLogoUrl())
                .rating(provider.getRating())
                .reviewCount(provider.getReviewCount())
                .photoUrls(photoUrls)
                .createdAt(provider.getCreatedAt())
                .build();
    }
}
