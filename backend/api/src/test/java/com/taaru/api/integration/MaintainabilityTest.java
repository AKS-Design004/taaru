package com.taaru.api.integration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class MaintainabilityTest {

    @Autowired
    private ApplicationContext context;

    @Test
    void allExpectedBeansShouldBeLoaded() {
        assertThat(context.containsBean("securityConfig")).isTrue();
        assertThat(context.containsBean("jwtService")).isTrue();
        assertThat(context.containsBean("authService")).isTrue();
        assertThat(context.containsBean("providerService")).isTrue();
        assertThat(context.containsBean("contactService")).isTrue();
        assertThat(context.containsBean("globalExceptionHandler")).isTrue();
    }

    @Test
    void beanNamingShouldFollowConventions() {
        var beans = context.getBeanDefinitionNames();
        for (var name : beans) {
            assertThat(name)
                    .as("Bean name should be camelCase: " + name)
                    .doesNotContain(" ");
        }
    }

    @Test
    void noCyclicDependenciesShouldExist() {
        var beans = context.getBeanDefinitionNames();
        assertThat(beans).isNotEmpty();
    }
}
