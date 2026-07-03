package com.taaru.provider.service;

import com.taaru.auth.domain.entity.Role;
import com.taaru.auth.domain.entity.User;
import com.taaru.auth.domain.repository.UserRepository;
import com.taaru.common.exception.BusinessException;
import com.taaru.common.exception.ResourceNotFoundException;
import com.taaru.provider.domain.dto.ProviderRequest;
import com.taaru.provider.domain.entity.Category;
import com.taaru.provider.domain.entity.Provider;
import com.taaru.provider.domain.entity.ProviderPhoto;
import com.taaru.provider.domain.entity.ProviderStatus;
import com.taaru.provider.domain.repository.CategoryRepository;
import com.taaru.provider.domain.repository.ProviderPhotoRepository;
import com.taaru.provider.domain.repository.ProviderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProviderServiceTest {

    @Mock private ProviderRepository providerRepository;
    @Mock private ProviderPhotoRepository photoRepository;
    @Mock private CategoryRepository categoryRepository;
    @Mock private UserRepository userRepository;

    private ProviderService providerService;
    private Category category;
    private User testUser;
    private Provider testProvider;
    private final UUID userId = UUID.randomUUID();
    private final UUID providerId = UUID.randomUUID();
    private final UUID categoryId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        providerService = new ProviderService(providerRepository, photoRepository, categoryRepository, userRepository);

        category = Category.builder()
                .id(categoryId)
                .name("Beauté")
                .slug("beaute")
                .displayOrder(3)
                .build();

        testUser = User.builder()
                .id(userId)
                .email("pro@taaru.sn")
                .firstName("Aminata")
                .lastName("Diop")
                .role(Role.PROFESSIONAL)
                .enabled(true)
                .build();

        testProvider = Provider.builder()
                .id(providerId)
                .user(testUser)
                .businessName("Salon Aminata")
                .category(category)
                .city("Dakar")
                .district("Mermoz")
                .phone("+221771234567")
                .whatsapp("+221771234567")
                .status(ProviderStatus.ACTIVE)
                .featured(true)
                .rating(BigDecimal.valueOf(4.5))
                .reviewCount(12)
                .photos(List.of(
                        ProviderPhoto.builder()
                                .id(UUID.randomUUID())
                                .url("https://r2.taaru.sn/photo1.jpg")
                                .displayOrder(0)
                                .build()
                ))
                .build();
    }

    @Test
    void getFeaturedProviders_ShouldReturnList() {
        when(providerRepository.findFeatured(any(PageRequest.class)))
                .thenReturn(List.of(testProvider));

        var result = providerService.getFeaturedProviders();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).businessName()).isEqualTo("Salon Aminata");
        assertThat(result.get(0).featured()).isTrue();
    }

    @Test
    void getProviderDetail_ShouldReturnDetailAndIncrementVisit() {
        when(providerRepository.findByIdAndStatus(providerId, ProviderStatus.ACTIVE))
                .thenReturn(Optional.of(testProvider));
        when(providerRepository.save(any(Provider.class))).thenReturn(testProvider);

        var detail = providerService.getProviderDetail(providerId);

        assertThat(detail.businessName()).isEqualTo("Salon Aminata");
        assertThat(detail.city()).isEqualTo("Dakar");
        assertThat(detail.photoUrls()).hasSize(1);

        verify(providerRepository).save(any(Provider.class));
    }

    @Test
    void getProviderDetail_ShouldThrow_WhenNotFound() {
        when(providerRepository.findByIdAndStatus(providerId, ProviderStatus.ACTIVE))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> providerService.getProviderDetail(providerId))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void createProvider_ShouldSucceed() {
        var request = new ProviderRequest(
                "Nouveau Salon", "beaute", null, "Description",
                "Dakar", "Sacré-Cœur", "123 rue", "+221781234567",
                "+221781234567", null, null, null,
                null, null, null
        );

        when(providerRepository.findByUserId(userId)).thenReturn(Optional.empty());
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(categoryRepository.findBySlug("beaute")).thenReturn(Optional.of(category));
        when(providerRepository.save(any(Provider.class))).thenAnswer(inv -> inv.getArgument(0));

        var result = providerService.createProvider(userId, request);

        assertThat(result.businessName()).isEqualTo("Nouveau Salon");
        assertThat(result.city()).isEqualTo("Dakar");
        verify(providerRepository).save(any(Provider.class));
    }

    @Test
    void createProvider_ShouldThrow_WhenProfileExists() {
        var request = new ProviderRequest(
                "Double Salon", "beaute", null, "Description",
                "Dakar", null, null, null, null, null, null, null, null, null, null
        );

        when(providerRepository.findByUserId(userId)).thenReturn(Optional.of(testProvider));

        assertThatThrownBy(() -> providerService.createProvider(userId, request))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Vous avez déjà un profil prestataire");

        verify(providerRepository, never()).save(any());
    }

    @Test
    void createProvider_ShouldThrow_WhenCategoryNotFound() {
        var request = new ProviderRequest(
                "Nouveau Salon", "invalide", null, "Description",
                "Dakar", null, null, null, null, null, null, null, null, null, null
        );

        when(providerRepository.findByUserId(userId)).thenReturn(Optional.empty());
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(categoryRepository.findBySlug("invalide")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> providerService.createProvider(userId, request))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void searchProviders_ShouldReturnPagedResults() {
        var pageable = PageRequest.of(0, 12);
        var page = new PageImpl<>(List.of(testProvider), pageable, 1);

        when(providerRepository.search("Salon", pageable)).thenReturn(page);

        var result = providerService.searchProviders("Salon", null, null, 0, 12);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).businessName()).isEqualTo("Salon Aminata");
    }

    @Test
    void addPhoto_ShouldAddToList() {
        when(providerRepository.findByUserId(userId)).thenReturn(Optional.of(testProvider));
        when(photoRepository.save(any(ProviderPhoto.class))).thenAnswer(inv -> inv.getArgument(0));

        providerService.addPhoto(userId, "https://r2.taaru.sn/photo2.jpg");

        verify(photoRepository).save(any(ProviderPhoto.class));
    }

    @Test
    void deletePhoto_ShouldThrow_WhenNotOwner() {
        var otherPhotoId = UUID.randomUUID();
        var otherProvider = Provider.builder()
                .id(UUID.randomUUID())
                .user(testUser)
                .businessName("Autre Salon")
                .build();
        var otherPhoto = ProviderPhoto.builder()
                .id(otherPhotoId)
                .provider(otherProvider)
                .url("https://r2.taaru.sn/other.jpg")
                .build();

        when(providerRepository.findByUserId(userId)).thenReturn(Optional.of(testProvider));
        when(photoRepository.findById(otherPhotoId)).thenReturn(Optional.of(otherPhoto));

        assertThatThrownBy(() -> providerService.deletePhoto(userId, otherPhotoId))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Cette photo ne vous appartient pas");
    }
}
