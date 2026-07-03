package com.taaru.provider.domain.repository;

import com.taaru.provider.domain.entity.Provider;
import com.taaru.provider.domain.entity.ProviderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProviderRepository extends JpaRepository<Provider, UUID> {
    Optional<Provider> findByUserId(UUID userId);
    Optional<Provider> findByIdAndStatus(UUID id, ProviderStatus status);

    @Query("SELECT p FROM Provider p WHERE p.status = 'ACTIVE' AND p.featured = true")
    List<Provider> findFeatured(Pageable pageable);

    @Query("SELECT p FROM Provider p WHERE p.status = 'ACTIVE' AND p.category.id = :categoryId")
    Page<Provider> findByCategoryId(@Param("categoryId") UUID categoryId, Pageable pageable);

    @Query("SELECT p FROM Provider p WHERE p.status = 'ACTIVE' AND " +
           "(:query IS NULL OR LOWER(p.businessName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.city) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Provider> search(@Param("query") String query, Pageable pageable);

    @Query("SELECT p FROM Provider p WHERE p.status = 'ACTIVE' AND " +
           "(:city IS NULL OR LOWER(p.city) = LOWER(:city))")
    Page<Provider> findByCity(@Param("city") String city, Pageable pageable);

    long countByStatus(ProviderStatus status);
}
