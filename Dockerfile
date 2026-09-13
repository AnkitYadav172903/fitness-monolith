# ---- Build stage ----
FROM eclipse-temurin:25-jdk AS build
WORKDIR /build

COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -q || true

COPY src ./src
RUN ./mvnw package -DskipTests -q

# ---- Runtime stage ----
FROM eclipse-temurin:25-jre
WORKDIR /app

RUN useradd --system --home /app --shell /usr/sbin/nologin app 2>/dev/null || true

COPY --from=build /build/target/*.jar app.jar

EXPOSE 8080

USER app

ENTRYPOINT ["java", "-XX:+UseG1GC", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]