package com.project.fitness.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.List;

@Component
public class JwtUtils {

    private static final Logger log = LoggerFactory.getLogger(JwtUtils.class);

    private final String jwtSecret;
    private final int jwtExpirationMs;

    public JwtUtils(@Value("${jwt.secret}") String jwtSecret,
                    @Value("${jwt.expiration-ms:172800000}") int jwtExpirationMs) {
        this.jwtSecret = jwtSecret;
        this.jwtExpirationMs = jwtExpirationMs;
        validateSecret(jwtSecret);
    }

    private void validateSecret(String secret) {
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException(
                    "JWT_SECRET environment variable is required. Generate one with: openssl rand -base64 64");
        }
        byte[] keyBytes;
        try {
            keyBytes = Decoders.BASE64.decode(secret);
        } catch (Exception e) {
            throw new IllegalStateException(
                    "JWT_SECRET must be a valid base64-encoded string. Generate one with: openssl rand -base64 64", e);
        }
        if (keyBytes.length * 8 < 256) {
            throw new IllegalStateException(
                    "JWT_SECRET is too weak: it must decode to at least 256 bits (32 bytes). "
                            + "Generate one with: openssl rand -base64 64");
        }
    }

    public String getJwtFromHeader(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer "))
            return bearerToken.substring(7);

        return null;
    }

    public String generateToken(String userId, String role) {
        return Jwts.builder()
                .subject(userId)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key())
                .compact();
    }

    public boolean validateJwtToken(String jwtToken) {
        try {
            Jwts.parser().verifyWith((javax.crypto.SecretKey) key()).build()
                    .parseSignedClaims(jwtToken);
            return true;
        } catch (Exception e) {
            log.debug("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }

    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public Claims getAllClaims(String jwt) {
        return Jwts.parser().verifyWith((javax.crypto.SecretKey) key())
                .build().parseSignedClaims(jwt).getPayload();
    }

    public String getUserIdFromJwtToken(String jwt) {
        return getAllClaims(jwt).getSubject();
    }

    public List<String> getRolesFromJwtToken(String jwt) {
        String role = getAllClaims(jwt).get("role", String.class);
        return role == null ? List.of() : List.of(role);
    }
}