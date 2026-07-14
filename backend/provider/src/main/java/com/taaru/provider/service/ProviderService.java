package com.taaru.provider.service;

import com.taaru.auth.domain.repository.UserRepository;
import com.taaru.common.exception.BusinessException;
import com.taaru.common.exception.ResourceNotFoundException;
import com.taaru.provider.domain.dto.*;
import com.taaru.provider.domain.entity.Provider;
import com.taaru.provider.domain.entity.ProviderPhoto;
import com.taaru.provider.domain.entity.ProviderStatus;
import com.taaru.provider.domain.repository.CategoryRepository;
import com.taaru.provider.domain.repository.ProviderPhotoRepository;
import com.taaru.provider.domain.repository.ProviderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProviderService {

    private final ProviderRepository providerRepository;
    private final ProviderPhotoRepository photoRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public List<ProviderSummaryResponse> getFeaturedProviders() {
        return providerRepository.findFeatured(PageRequest.of(0, 6))
                .stream()
                .map(ProviderSummaryResponse::from)
                .toList();
    }

    public Page<ProviderSummaryResponse> searchProviders(String query, String city, String categorySlug, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Provider> providers;

        if (categorySlug != null && !categorySlug.isBlank()) {
            var category = categoryRepository.findBySlug(categorySlug).orElse(null);
            providers = category != null
                    ? providerRepository.findByCategoryId(category.getId(), pageable)
                    : Page.empty(pageable);
        } else if (city != null && !city.isBlank()) {
            providers = providerRepository.findByCity(city, pageable);
        } else if (query != null && !query.isBlank()) {
            providers = providerRepository.search(query, pageable);
        } else {
            providers = providerRepository.findByCategoryId(null, pageable);
        }

        return providers.map(ProviderSummaryResponse::from);
    }

    public ProviderDetailResponse getProviderDetail(UUID id) {
        var provider = providerRepository.findByIdAndStatus(id, ProviderStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("Prestataire", id));
        provider.incrementVisit();
        providerRepository.save(provider);
        return ProviderDetailResponse.from(provider);
    }

    public ProviderDetailResponse getProviderByUserId(UUID userId) {
        var provider = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profil prestataire", userId));
        return ProviderDetailResponse.from(provider);
    }

    @Transactional
    public ProviderDetailResponse createProvider(UUID userId, ProviderRequest request) {
        if (providerRepository.findByUserId(userId).isPresent()) {
            throw new BusinessException("PROFILE_EXISTS", "Vous avez déjà un profil prestataire");
        }

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", userId));

        var category = categoryRepository.findBySlug(request.categorySlug())
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie", request.categorySlug()));

        var provider = Provider.builder()
                .user(user)
                .businessName(request.businessName())
                .category(category)
                .subcategory(request.subcategory())
                .description(request.description())
                .city(request.city())
                .district(request.district())
                .address(request.address())
                .phone(request.phone())
                .whatsapp(request.whatsapp())
                .website(request.website())
                .socialLinks(request.socialLinks())
                .pricing(request.pricing())
                .latitude(request.latitude())
                .longitude(request.longitude())
                .logoUrl(request.logoUrl())
                .build();

        provider = providerRepository.save(provider);
        return ProviderDetailResponse.from(provider);
    }

    @Transactional
    public ProviderDetailResponse updateProvider(UUID userId, ProviderRequest request) {
        var provider = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profil prestataire", userId));

        var category = categoryRepository.findBySlug(request.categorySlug())
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie", request.categorySlug()));

        var newProvider = Provider.builder()
                .id(provider.getId())
                .user(provider.getUser())
                .businessName(request.businessName())
                .category(category)
                .subcategory(request.subcategory())
                .description(request.description())
                .city(request.city())
                .district(request.district())
                .address(request.address())
                .phone(request.phone())
                .whatsapp(request.whatsapp())
                .website(request.website())
                .socialLinks(request.socialLinks())
                .pricing(request.pricing())
                .latitude(request.latitude())
                .longitude(request.longitude())
                .logoUrl(request.logoUrl())
                .status(provider.getStatus())
                .featured(provider.isFeatured())
                .visitCount(provider.getVisitCount())
                .rating(provider.getRating())
                .reviewCount(provider.getReviewCount())
                .createdAt(provider.getCreatedAt())
                .build();

        newProvider = providerRepository.save(newProvider);
        return ProviderDetailResponse.from(newProvider);
    }

    @Transactional
    public void addPhoto(UUID userId, String photoUrl) {
        var provider = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profil prestataire", userId));

        var order = provider.getPhotos() != null ? provider.getPhotos().size() : 0;
        var photo = ProviderPhoto.builder()
                .provider(provider)
                .url(photoUrl)
                .displayOrder(order)
                .build();
        photoRepository.save(photo);
    }

    @Transactional
    public ProviderDetailResponse updateStatus(UUID providerId, ProviderStatus status) {
        var provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Prestataire", providerId));
        switch (status) {
            case ACTIVE -> provider.publish();
            case SUSPENDED -> provider.suspend();
            default -> throw new BusinessException("INVALID_STATUS", "Statut non autorisé : " + status);
        }
        provider = providerRepository.save(provider);
        return ProviderDetailResponse.from(provider);
    }

    @Transactional
    public void deletePhoto(UUID userId, UUID photoId) {
        var provider = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profil prestataire", userId));
        var photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new ResourceNotFoundException("Photo", photoId));

        if (!photo.getProvider().getId().equals(provider.getId())) {
            throw new BusinessException("FORBIDDEN", "Cette photo ne vous appartient pas");
        }
        photoRepository.delete(photo);
    }
}
