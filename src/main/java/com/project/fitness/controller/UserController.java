package com.project.fitness.controller;

import com.project.fitness.dto.PasswordUpdateRequest;
import com.project.fitness.dto.ProfileUpdateRequest;
import com.project.fitness.dto.UserResponse;
import com.project.fitness.exceptions.BadRequestException;
import com.project.fitness.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Set;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private static final long MAX_AVATAR_BYTES = 2L * 1024 * 1024;
    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/png", "image/jpeg", "image/webp", "image/gif");

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile(@AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(userService.getProfile(userId));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(userService.updateProfile(userId, request));
    }

    @PutMapping("/password")
    public ResponseEntity<Void> updatePassword(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody PasswordUpdateRequest request) {
        userService.updatePassword(userId, request);
        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserResponse> uploadAvatar(
            @AuthenticationPrincipal String userId,
            @RequestPart("avatar") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new BadRequestException("Avatar file is empty.");
        }
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new BadRequestException("Only JPG, PNG, WEBP or GIF images are allowed.");
        }
        if (file.getSize() > MAX_AVATAR_BYTES) {
            throw new BadRequestException("Avatar must be smaller than 2 MB.");
        }

        String mime = file.getContentType();
        String base64 = Base64.getEncoder().encodeToString(file.getBytes());
        String dataUri = "data:" + mime + ";base64," + base64;

        return ResponseEntity.ok(userService.updateAvatar(userId, dataUri));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAccount(@AuthenticationPrincipal String userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}