package com.taaru.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.taaru")
@EntityScan(basePackages = "com.taaru")
@EnableJpaRepositories(basePackages = "com.taaru")
public class TaaruApplication {

    public static void main(String[] args) {
        SpringApplication.run(TaaruApplication.class, args);
    }

}
