package com.taaru.provider.domain.repository;

import com.taaru.provider.domain.entity.ProviderPhoto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProviderPhotoRepository extends JpaRepository<ProviderPhoto, UUID> {
    List<ProviderPhoto> findByProviderIdOrderByDisplayOrder(UUID providerId);
    void deleteByProviderId(UUID providerId);
}
