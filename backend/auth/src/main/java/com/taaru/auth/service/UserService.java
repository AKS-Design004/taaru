package com.taaru.auth.service;

import com.taaru.auth.domain.dto.*;
import com.taaru.auth.domain.entity.User;
import com.taaru.auth.domain.repository.UserRepository;
import com.taaru.common.exception.BusinessException;
import com.taaru.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserProfileResponse getProfile(UUID userId) {
        var user = findUserById(userId);
        return UserProfileResponse.from(user);
    }

    @Transactional
    public UserProfileResponse updateProfile(UUID userId, UserProfileUpdateRequest request) {
        var user = findUserById(userId);

        if (request.firstName() != null) {
            user.updateProfile(
                    request.firstName(),
                    request.lastName() != null ? request.lastName() : user.getLastName(),
                    request.phone()
            );
        }

        user = userRepository.save(user);
        return UserProfileResponse.from(user);
    }

    @Transactional
    public void changePassword(UUID userId, ChangePasswordRequest request) {
        var user = findUserById(userId);

        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new BusinessException("INVALID_PASSWORD", "Mot de passe actuel incorrect");
        }

        user.changePassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void deleteAccount(UUID userId) {
        var user = findUserById(userId);
        user.deactivate();
        userRepository.save(user);
    }

    private User findUserById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", userId));
    }
}
