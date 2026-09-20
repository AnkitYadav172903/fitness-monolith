# Multi-stage Dockerfile for building and running the Spring Boot app
# NOTE: pom.xml sets <java.version>25 — if the Temurin 25 images are unavailable, change base images to a supported JDK.

# Build stage: uses Maven with a JDK 25 base
FROM maven:3.9.6-eclipse-temurin-25 AS build
WORKDIR /app

# Copy only what is needed for dependency resolution first for caching
COPY pom.xml mvnw ./
COPY .mvn .mvn
COPY src ./src


# Package application (skip tests for faster build; adjust if you want tests)
RUN mvn -B -DskipTests package

# Runtime stage: use a JRE image matching Java 25
FROM eclipse-temurin:25-jre AS runtime
WORKDIR /app

# Copy jar produced by the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose common Spring Boot port
EXPOSE 8080

ENV JAVA_OPTS=""

# Run the application (allows passing JVM options via JAVA_OPTS)
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]
