package com.marketreply.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Exposes interactive API docs at /swagger-ui.html once the app is running.
 */
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI marketReplyOpenAPI() {
        return new OpenAPI().info(new Info()
                .title("MarketReply AI API")
                .description("REST API for AI-assisted marketplace buyer message replies")
                .version("1.0.0")
                .contact(new Contact().name("MarketReply AI")));
    }
}
