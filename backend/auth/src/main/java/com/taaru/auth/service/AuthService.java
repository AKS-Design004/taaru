package com.taaru.auth.service;

import com.taaru.auth.domain.dto.*;
import com.taaru.auth.domain.entity.RefreshToken;
import com.taaru.auth.domain.entity.Role;
import com.taaru.auth.domain.entity.User;
import com.taaru.auth.domain.repository.RefreshTokenRepository;
import com.taaru.auth.domain.repository.UserRepository;
import com.taaru.auth.service.jwt.JwtService;
import com.taaru.common.exception.BusinessException;
import com.taaru.common.exception.DuplicateEmailException;
import com.taaru.common.exception.InvalidCredentialsException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateEmailException();
        }

        var role = request.role() != null ? request.role() : Role.CLIENT;

        var user = User.builder()
                .email(request.email().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.password()))
                .firstName(request.firstName().trim())
                .lastName(request.lastName().trim())
                .role(role)
                .build();

        user = userRepository.save(user);

        return generateAuthResponse(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        var user = userRepository.findByEmail(request.email().toLowerCase().trim())
                .orElseThrow(InvalidCredentialsException::new);

        if (!user.isEnabled()) {
            throw new BusinessException("ACCOUNT_DISABLED", "Ce compte est désactivé");
        }

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }

        refreshTokenRepository.deleteByUserId(user.getId());
        return generateAuthResponse(user);
    }

    @Transactional
    public AuthResponse refresh(String refreshTokenValue) {
        var storedToken = refreshTokenRepository.findByToken(refreshTokenValue)
                .orElseThrow(() -> new BusinessException("INVALID_REFRESH_TOKEN", "Token de rafraîchissement invalide"));

        if (storedToken.isRevoked() || storedToken.isExpired()) {
            throw new BusinessException("INVALID_REFRESH_TOKEN", "Token de rafraîchissement expiré ou révoqué");
        }

        storedToken.revoke();
        refreshTokenRepository.save(storedToken);

        var user = storedToken.getUser();
        return generateAuthResponse(user);
    }

    @Transactional
    public void logout(UUID userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }

    private AuthResponse generateAuthResponse(User user) {
        var accessToken = jwtService.generateAccessToken(
                user.getId(), user.getEmail(), user.getRole().name());
        var refreshTokenValue = jwtService.generateRefreshToken(user.getId());

        var refreshToken = RefreshToken.builder()
                .user(user)
                .token(refreshTokenValue)
                .expiresAt(LocalDateTime.now()
                        .plusSeconds(jwtService.getRefreshTokenExpirationMs() / 1000))
                .build();
        refreshTokenRepository.save(refreshToken);

        var userProfile = UserProfileResponse.from(user);

        return AuthResponse.of(accessToken, refreshTokenValue,
                jwtService.getRefreshTokenExpirationMs(), userProfile);
    }
}
