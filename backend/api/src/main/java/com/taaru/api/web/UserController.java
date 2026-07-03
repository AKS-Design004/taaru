package com.taaru.api.web;

import com.taaru.auth.domain.dto.*;
import com.taaru.auth.service.UserService;
import com.taaru.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(Principal principal) {
        var userId = UUID.fromString(principal.getName());
        var profile = userService.getProfile(userId);
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            Principal principal,
            @Valid @RequestBody UserProfileUpdateRequest request) {
        var userId = UUID.fromString(principal.getName());
        var profile = userService.updateProfile(userId, request);
        return ResponseEntity.ok(ApiResponse.ok("Profil mis à jour", profile));
    }

    @PutMapping("/me/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            Principal principal,
            @Valid @RequestBody ChangePasswordRequest request) {
        var userId = UUID.fromString(principal.getName());
        userService.changePassword(userId, request);
        return ResponseEntity.ok(ApiResponse.ok("Mot de passe modifié", null));
    }

    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(Principal principal) {
        var userId = UUID.fromString(principal.getName());
        userService.deleteAccount(userId);
        return ResponseEntity.ok(ApiResponse.ok("Compte supprimé", null));
    }
}
