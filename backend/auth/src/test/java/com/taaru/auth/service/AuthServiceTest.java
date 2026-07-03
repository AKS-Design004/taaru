package com.taaru.auth.service;

import com.taaru.auth.domain.dto.AuthResponse;
import com.taaru.auth.domain.dto.LoginRequest;
import com.taaru.auth.domain.dto.RegisterRequest;
import com.taaru.auth.domain.entity.RefreshToken;
import com.taaru.auth.domain.entity.Role;
import com.taaru.auth.domain.entity.User;
import com.taaru.auth.domain.repository.RefreshTokenRepository;
import com.taaru.auth.domain.repository.UserRepository;
import com.taaru.auth.service.jwt.JwtService;
import com.taaru.common.exception.BusinessException;
import com.taaru.common.exception.DuplicateEmailException;
import com.taaru.common.exception.InvalidCredentialsException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private RefreshTokenRepository refreshTokenRepository;
    @Mock private JwtService jwtService;

    private PasswordEncoder passwordEncoder;
    private AuthService authService;

    private User testUser;
    private final UUID userId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        authService = new AuthService(userRepository, refreshTokenRepository, jwtService, passwordEncoder);

        testUser = User.builder()
                .id(userId)
                .email("test@taaru.sn")
                .passwordHash(passwordEncoder.encode("Password1"))
                .firstName("Jean")
                .lastName("Dupont")
                .role(Role.CLIENT)
                .enabled(true)
                .emailVerified(false)
                .build();
    }

    @Test
    void register_ShouldSucceed() {
        var request = new RegisterRequest("new@taaru.sn", "Password1", "Marie", "Diop", Role.CLIENT);

        when(userRepository.existsByEmail("new@taaru.sn")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));
        when(jwtService.generateAccessToken(any(), any(), any())).thenReturn("access-token");
        when(jwtService.generateRefreshToken(any())).thenReturn("refresh-token");
        when(jwtService.getRefreshTokenExpirationMs()).thenReturn(604800000L);

        var response = authService.register(request);

        assertThat(response).isNotNull();
        assertThat(response.accessToken()).isEqualTo("access-token");
        assertThat(response.user().email()).isEqualTo("new@taaru.sn");
        assertThat(response.user().role()).isEqualTo(Role.CLIENT);

        verify(userRepository).existsByEmail("new@taaru.sn");
        verify(userRepository).save(any(User.class));
        verify(refreshTokenRepository).save(any(RefreshToken.class));
    }

    @Test
    void register_ShouldThrow_WhenEmailExists() {
        var request = new RegisterRequest("test@taaru.sn", "Password1", "Jean", "Dupont", Role.CLIENT);

        when(userRepository.existsByEmail("test@taaru.sn")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(DuplicateEmailException.class)
                .hasMessage("Cet email est déjà utilisé");

        verify(userRepository, never()).save(any());
    }

    @Test
    void login_ShouldSucceed() {
        var request = new LoginRequest("test@taaru.sn", "Password1");

        when(userRepository.findByEmail("test@taaru.sn")).thenReturn(Optional.of(testUser));
        when(jwtService.generateAccessToken(any(), any(), any())).thenReturn("access-token");
        when(jwtService.generateRefreshToken(any())).thenReturn("refresh-token");
        when(jwtService.getRefreshTokenExpirationMs()).thenReturn(604800000L);

        var response = authService.login(request);

        assertThat(response).isNotNull();
        assertThat(response.accessToken()).isEqualTo("access-token");
        assertThat(response.user().email()).isEqualTo("test@taaru.sn");
    }

    @Test
    void login_ShouldThrow_WhenWrongPassword() {
        var request = new LoginRequest("test@taaru.sn", "WrongPassword1");

        when(userRepository.findByEmail("test@taaru.sn")).thenReturn(Optional.of(testUser));

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    void login_ShouldThrow_WhenAccountDisabled() {
        var disabledUser = User.builder()
                .id(UUID.randomUUID())
                .email("disabled@taaru.sn")
                .passwordHash(passwordEncoder.encode("Password1"))
                .firstName("John")
                .lastName("Doe")
                .enabled(false)
                .build();
        var request = new LoginRequest("disabled@taaru.sn", "Password1");

        when(userRepository.findByEmail("disabled@taaru.sn")).thenReturn(Optional.of(disabledUser));

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Ce compte est désactivé");
    }

    @Test
    void login_ShouldThrow_WhenEmailNotFound() {
        var request = new LoginRequest("unknown@taaru.sn", "Password1");

        when(userRepository.findByEmail("unknown@taaru.sn")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    void refresh_ShouldSucceed() {
        var refreshTokenValue = "valid-refresh-token";
        var storedToken = RefreshToken.builder()
                .id(UUID.randomUUID())
                .user(testUser)
                .token(refreshTokenValue)
                .expiresAt(LocalDateTime.now().plusDays(7))
                .revoked(false)
                .build();

        when(refreshTokenRepository.findByToken(refreshTokenValue)).thenReturn(Optional.of(storedToken));
        when(jwtService.generateAccessToken(any(), any(), any())).thenReturn("new-access-token");
        when(jwtService.generateRefreshToken(any())).thenReturn("new-refresh-token");
        when(jwtService.getRefreshTokenExpirationMs()).thenReturn(604800000L);

        var response = authService.refresh(refreshTokenValue);

        assertThat(response.accessToken()).isEqualTo("new-access-token");
        assertThat(storedToken.isRevoked()).isTrue();
        verify(refreshTokenRepository).save(storedToken);
    }

    @Test
    void refresh_ShouldThrow_WhenTokenExpired() {
        var expiredToken = RefreshToken.builder()
                .id(UUID.randomUUID())
                .user(testUser)
                .token("expired-token")
                .expiresAt(LocalDateTime.now().minusDays(1))
                .revoked(false)
                .build();

        when(refreshTokenRepository.findByToken("expired-token")).thenReturn(Optional.of(expiredToken));

        assertThatThrownBy(() -> authService.refresh("expired-token"))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Token de rafraîchissement expiré ou révoqué");
    }

    @Test
    void refresh_ShouldThrow_WhenTokenRevoked() {
        var revokedToken = RefreshToken.builder()
                .id(UUID.randomUUID())
                .user(testUser)
                .token("revoked-token")
                .expiresAt(LocalDateTime.now().plusDays(7))
                .revoked(true)
                .build();

        when(refreshTokenRepository.findByToken("revoked-token")).thenReturn(Optional.of(revokedToken));

        assertThatThrownBy(() -> authService.refresh("revoked-token"))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void refresh_ShouldThrow_WhenTokenNotFound() {
        when(refreshTokenRepository.findByToken("unknown-token")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.refresh("unknown-token"))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Token de rafraîchissement invalide");
    }

    @Test
    void logout_ShouldDeleteTokens() {
        authService.logout(userId);

        verify(refreshTokenRepository).deleteByUserId(userId);
    }
}
