package com.taaru.api.integration;

import com.taaru.auth.domain.dto.AuthResponse;
import com.taaru.auth.domain.dto.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AuthIntegrationTest extends AbstractIntegrationTest {

    @Test
    void shouldRegisterAndLogin() throws Exception {
        var registerPayload = """
                {
                    "email": "marie@taaru.sn",
                    "password": "Password1",
                    "firstName": "Marie",
                    "lastName": "Diop",
                    "role": "CLIENT"
                }
                """;

        // Inscription
        var registerResult = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").isNotEmpty())
                .andReturn();

        var authResponse = objectMapper.readValue(
                registerResult.getResponse().getContentAsString(),
                com.taaru.common.dto.ApiResponse.class);

        // Connexion
        var loginPayload = """
                {
                    "email": "marie@taaru.sn",
                    "password": "Password1"
                }
                """;

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.data.user.email").value("marie@taaru.sn"));
    }

    @Test
    void shouldFailLoginWithWrongPassword() throws Exception {
        // Register first
        var registerPayload = """
                {
                    "email": "ibra@taaru.sn",
                    "password": "Password1",
                    "firstName": "Ibra",
                    "lastName": "Fall",
                    "role": "CLIENT"
                }
                """;

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerPayload));

        // Try wrong password
        var loginPayload = """
                {
                    "email": "ibra@taaru.sn",
                    "password": "WrongPassword1"
                }
                """;

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginPayload))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void shouldRefreshToken() throws Exception {
        // Register
        var registerPayload = """
                {
                    "email": "fatou@taaru.sn",
                    "password": "Password1",
                    "firstName": "Fatou",
                    "lastName": "Sy",
                    "role": "CLIENT"
                }
                """;

        var registerResult = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerPayload))
                .andReturn();

        var json = registerResult.getResponse().getContentAsString();
        var refreshToken = objectMapper.readTree(json)
                .get("data").get("refreshToken").asText();

        // Refresh
        var refreshPayload = """
                {
                    "refreshToken": "%s"
                }
                """.formatted(refreshToken);

        mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(refreshPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.data.refreshToken").isNotEmpty());
    }

    @Test
    void shouldRejectDuplicateEmail() throws Exception {
        var payload = """
                {
                    "email": "doublon@taaru.sn",
                    "password": "Password1",
                    "firstName": "Test",
                    "lastName": "User",
                    "role": "CLIENT"
                }
                """;

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Cet email est déjà utilisé"));
    }
}
