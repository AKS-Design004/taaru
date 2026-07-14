package com.taaru.api.web;

import com.taaru.common.dto.ApiResponse;
import com.taaru.provider.domain.dto.*;
import com.taaru.provider.service.ContactService;
import com.taaru.provider.service.ProviderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/providers")
@RequiredArgsConstructor
public class ProviderController {

    private final ProviderService providerService;
    private final ContactService contactService;

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<ProviderSummaryResponse>>> getFeatured() {
        return ResponseEntity.ok(ApiResponse.ok(providerService.getFeaturedProviders()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProviderSummaryResponse>>> search(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        var safeSize = Math.max(size, 1);
        var result = providerService.searchProviders(query, city, category, page, safeSize);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProviderDetailResponse>> getDetail(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(providerService.getProviderDetail(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CLIENT','PROFESSIONAL')")
    public ResponseEntity<ApiResponse<ProviderDetailResponse>> create(
            Principal principal,
            @Valid @RequestBody ProviderRequest request) {
        var userId = UUID.fromString(principal.getName());
        var result = providerService.createProvider(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Profil prestataire créé", result));
    }

    @PutMapping("/me")
    @PreAuthorize("hasAnyRole('PROFESSIONAL','ADMIN')")
    public ResponseEntity<ApiResponse<ProviderDetailResponse>> update(
            Principal principal,
            @Valid @RequestBody ProviderRequest request) {
        var userId = UUID.fromString(principal.getName());
        var result = providerService.updateProvider(userId, request);
        return ResponseEntity.ok(ApiResponse.ok("Profil mis à jour", result));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('PROFESSIONAL','ADMIN')")
    public ResponseEntity<ApiResponse<ProviderDetailResponse>> getMyProfile(Principal principal) {
        var userId = UUID.fromString(principal.getName());
        return ResponseEntity.ok(ApiResponse.ok(providerService.getProviderByUserId(userId)));
    }

    @PostMapping("/{id}/photos")
    @PreAuthorize("hasAnyRole('PROFESSIONAL','ADMIN')")
    public ResponseEntity<ApiResponse<Void>> addPhoto(
            Principal principal,
            @PathVariable UUID id,
            @RequestBody String photoUrl) {
        var userId = UUID.fromString(principal.getName());
        providerService.addPhoto(userId, photoUrl);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Photo ajoutée", null));
    }

    @DeleteMapping("/{id}/photos/{photoId}")
    @PreAuthorize("hasAnyRole('PROFESSIONAL','ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deletePhoto(
            Principal principal,
            @PathVariable UUID photoId) {
        var userId = UUID.fromString(principal.getName());
        providerService.deletePhoto(userId, photoId);
        return ResponseEntity.ok(ApiResponse.ok("Photo supprimée", null));
    }

    @PostMapping("/{id}/contact")
    public ResponseEntity<ApiResponse<Void>> contact(
            @PathVariable UUID id,
            @Valid @RequestBody ContactRequest request) {
        contactService.sendMessage(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Message envoyé", null));
    }
}
