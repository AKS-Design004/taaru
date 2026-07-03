package com.taaru.api.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import javax.sql.DataSource;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public abstract class AbstractIntegrationTest {

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected ObjectMapper objectMapper;

    @Autowired
    private DataSource dataSource;

    @BeforeEach
    void seedCategories() {
        var jdbc = new JdbcTemplate(dataSource);
        try {
            var count = jdbc.queryForObject("SELECT COUNT(*) FROM categories", Integer.class);
            if (count == 0) {
                jdbc.execute("INSERT INTO categories (id, name, slug, description, display_order) VALUES " +
                        "('a0000000-0000-0000-0000-000000000001', 'Mode', 'mode', 'Stylistes, cr\u00e9ateurs, marques et boutiques de mode', 1), " +
                        "('a0000000-0000-0000-0000-000000000002', 'Couture', 'couture', 'Couturiers, ateliers de confection, broderie et retouches', 2), " +
                        "('a0000000-0000-0000-0000-000000000003', 'Beaut\u00e9', 'beaute', 'Salons de coiffure, instituts de beaut\u00e9, maquilleurs et onglerie', 3), " +
                        "('a0000000-0000-0000-0000-000000000004', '\u00c9v\u00e9nementiel', 'evenementiel', 'Wedding planners, d\u00e9corateurs, photographes', 4)");
            }
        } catch (Exception ignored) {
        }
    }
}
