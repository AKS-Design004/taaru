package com.taaru.api.integration;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ProviderIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private DataSource dataSource;

    private String accessToken;
    private String userId;
    private final String email = "pro" + UUID.randomUUID() + "@taaru.sn";

    @BeforeEach
    void setUp() throws Exception {
        var registerPayload = """
                {
                    "email": "%s",
                    "password": "Password1",
                    "firstName": "Aminata",
                    "lastName": "Diop",
                    "role": "PROFESSIONAL"
                }
                """.formatted(email);

        var result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerPayload))
                .andExpect(status().isCreated())
                .andReturn();

        var json = result.getResponse().getContentAsString();
        accessToken = JsonPath.read(json, "$.data.accessToken");
        userId = (String) JsonPath.read(json, "$.data.user.id");
    }

    private void activateProvider(UUID providerId) {
        var jdbc = new JdbcTemplate(dataSource);
        jdbc.update("UPDATE providers SET status = 'ACTIVE' WHERE id = ?", providerId);
    }

    @Test
    void shouldCreateProviderProfile() throws Exception {
        var createPayload = """
                {
                    "businessName": "Salon Aminata Beauty",
                    "categorySlug": "beaute",
                    "description": "Salon de coiffure et beauté à Dakar",
                    "city": "Dakar",
                    "district": "Mermoz",
                    "phone": "+221771234567",
                    "whatsapp": "+221771234567"
                }
                """;

        var createResult = mockMvc.perform(post("/api/providers")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.businessName").value("Salon Aminata Beauty"))
                .andReturn();

        var json = createResult.getResponse().getContentAsString();
        var providerId = (String) JsonPath.read(json, "$.data.id");

        activateProvider(UUID.fromString(providerId));

        mockMvc.perform(get("/api/providers/" + providerId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.businessName").value("Salon Aminata Beauty"))
                .andExpect(jsonPath("$.data.city").value("Dakar"));
    }

    @Test
    void shouldListFeaturedProviders() throws Exception {
        mockMvc.perform(get("/api/providers/featured"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    void shouldSearchProviders() throws Exception {
        var createPayload = """
                {
                    "businessName": "Coiffure Dakar Style",
                    "categorySlug": "beaute",
                    "description": "Coiffure professionnelle",
                    "city": "Dakar"
                }
                """;

        mockMvc.perform(post("/api/providers")
                .header("Authorization", "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(createPayload));

        mockMvc.perform(get("/api/providers?city=Dakar"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").isArray());
    }

    @Test
    void shouldRejectUnauthorizedAccess() throws Exception {
        var createPayload = """
                {
                    "businessName": "Test",
                    "categorySlug": "beaute",
                    "city": "Dakar"
                }
                """;

        mockMvc.perform(post("/api/providers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createPayload))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldSendContactMessage() throws Exception {
        var createPayload = """
                {
                    "businessName": "Traiteur Express",
                    "categorySlug": "evenementiel",
                    "description": "Traiteur événementiel",
                    "city": "Dakar"
                }
                """;

        var result = mockMvc.perform(post("/api/providers")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createPayload))
                .andExpect(status().isCreated())
                .andReturn();

        var json = result.getResponse().getContentAsString();
        var providerId = (String) JsonPath.read(json, "$.data.id");

        activateProvider(UUID.fromString(providerId));

        var contactPayload = """
                {
                    "senderName": "Client Test",
                    "senderEmail": "client@test.sn",
                    "message": "Bonjour, je souhaite un devis"
                }
                """;

        mockMvc.perform(post("/api/providers/" + providerId + "/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(contactPayload))
                .andExpect(status().isOk());
    }
}
