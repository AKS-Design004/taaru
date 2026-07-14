package com.taaru.common.port;

import java.util.UUID;

public interface IProviderExistencePort {
    boolean existsByProviderId(UUID providerId);
    boolean isActive(UUID providerId);
}
