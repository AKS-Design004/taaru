package com.taaru.common.port;

import java.util.Optional;
import java.util.UUID;

public interface IUserProfilePort {
    Optional<String> findEmailByUserId(UUID userId);
    boolean existsByUserId(UUID userId);
    String getFullName(UUID userId);
}
