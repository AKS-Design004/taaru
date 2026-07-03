package com.taaru.auth.service;

import com.taaru.auth.domain.dto.ChangePasswordRequest;
import com.taaru.auth.domain.dto.UserProfileUpdateRequest;
import com.taaru.auth.domain.entity.Role;
import com.taaru.auth.domain.entity.User;
import com.taaru.auth.domain.repository.UserRepository;
import com.taaru.common.exception.BusinessException;
import com.taaru.common.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock private UserRepository userRepository;

    private PasswordEncoder passwordEncoder;
    private UserService userService;
    private User testUser;
    private final UUID userId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        userService = new UserService(userRepository, passwordEncoder);

        testUser = User.builder()
                .id(userId)
                .email("test@taaru.sn")
                .passwordHash(passwordEncoder.encode("Password1"))
                .firstName("Jean")
                .lastName("Dupont")
                .phone("+221771234567")
                .role(Role.CLIENT)
                .enabled(true)
                .build();
    }

    @Test
    void getProfile_ShouldReturnProfile() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        var profile = userService.getProfile(userId);

        assertThat(profile.email()).isEqualTo("test@taaru.sn");
        assertThat(profile.firstName()).isEqualTo("Jean");
        assertThat(profile.lastName()).isEqualTo("Dupont");
    }

    @Test
    void getProfile_ShouldThrow_WhenUserNotFound() {
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getProfile(userId))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void updateProfile_ShouldUpdateFields() {
        var request = new UserProfileUpdateRequest("Marie", "Diop", "+221781234567");

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        var profile = userService.updateProfile(userId, request);

        assertThat(profile.firstName()).isEqualTo("Marie");
        assertThat(profile.lastName()).isEqualTo("Diop");
        assertThat(profile.phone()).isEqualTo("+221781234567");
    }

    @Test
    void changePassword_ShouldSucceed() {
        var request = new ChangePasswordRequest("Password1", "NewPassword1");

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        userService.changePassword(userId, request);

        verify(userRepository).save(any(User.class));
    }

    @Test
    void changePassword_ShouldThrow_WhenCurrentPasswordWrong() {
        var request = new ChangePasswordRequest("WrongPassword", "NewPassword1");

        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        assertThatThrownBy(() -> userService.changePassword(userId, request))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Mot de passe actuel incorrect");
    }

    @Test
    void deleteAccount_ShouldDeactivateUser() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        userService.deleteAccount(userId);

        assertThat(testUser.isEnabled()).isFalse();
        verify(userRepository).save(testUser);
    }
}
