package com.marketreply.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

/**
 * Enables scanning of Spring Data MongoDB repositories.
 * Connection details (URI, database name) come from application.properties
 * via spring.data.mongodb.uri, which should point at your MongoDB Atlas cluster.
 */
@Configuration
@EnableMongoRepositories(basePackages = "com.marketreply.repository")
public class MongoConfig {
}
