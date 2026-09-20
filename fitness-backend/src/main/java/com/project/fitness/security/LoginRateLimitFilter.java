package com.project.fitness.security;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Order(1)
public class LoginRateLimitFilter implements Filter {

    private static final String LOGIN_PATH = "/api/auth/login";
    private static final int MAX_TRACKED_IPS = 10_000;

    private record Window(long startMillis, int count) {}

    private final ConcurrentHashMap<String, Window> attempts = new ConcurrentHashMap<>();

    private final int maxAttempts;
    private final long windowMillis;

    public LoginRateLimitFilter(
            @Value("${app.rate-limit.login.max-attempts:10}") int maxAttempts,
            @Value("${app.rate-limit.login.window-seconds:900}") long windowSeconds) {
        this.maxAttempts = maxAttempts;
        this.windowMillis = Math.max(windowSeconds, 1) * 1000;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        if (!"POST".equalsIgnoreCase(req.getMethod()) || !LOGIN_PATH.equals(req.getRequestURI())) {
            chain.doFilter(request, response);
            return;
        }

        String clientIp = resolveClientIp(req);
        long now = System.currentTimeMillis();

        if (attempts.size() >= MAX_TRACKED_IPS) {
            attempts.entrySet().removeIf(entry -> now - entry.getValue().startMillis >= windowMillis);
            if (attempts.size() >= MAX_TRACKED_IPS) {
                attempts.clear();
            }
        }

        attempts.compute(clientIp, (key, existing) -> {
            if (existing == null || now - existing.startMillis >= windowMillis) {
                return new Window(now, 1);
            }
            return new Window(existing.startMillis, existing.count + 1);
        });

        Window window = attempts.get(clientIp);
        if (window.count > maxAttempts) {
            res.setStatus(429);
            res.setContentType("application/json");
            res.getWriter().write(
                    "{\"message\":\"Too many login attempts. Please try again later.\"}");
            return;
        }

        chain.doFilter(request, response);
    }

    private String resolveClientIp(HttpServletRequest req) {
        String forwarded = req.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return req.getRemoteAddr();
    }
}