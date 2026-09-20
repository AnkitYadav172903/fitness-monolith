package com.project.fitness.controller;

import com.project.fitness.dto.PasswordUpdateRequest;
import com.project.fitness.dto.ProfileUpdateRequest;
import com.project.fitness.dto.UserResponse;
import com.project.fitness.exceptions.BadRequestException;
import com.project.fitness.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private static final long MAX_AVATAR_BYTES = 2L * 1024 * 1024;
    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/png", "image/jpeg", "image/webp", "image/gif");
    private static final Map<String, String> EXTENSION_BY_TYPE = Map.of(
            "image/png", "png",
            "image/jpeg", "jpg",
            "image/webp", "webp",
            "image/gif", "gif");

    private final UserService userService;

    @Value("${avatar.storage.dir}")
    private Path avatarStorageDir;

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
        String contentType = file.getContentType();
        if (file.isEmpty()) {
            throw new BadRequestException("Avatar file is empty.");
        }
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new BadRequestException("Only JPG, PNG, WEBP or GIF images are allowed.");
        }
        if (file.getSize() > MAX_AVATAR_BYTES) {
            throw new BadRequestException("Avatar must be smaller than 2 MB.");
        }

        Files.createDirectories(avatarStorageDir);
        deleteAvatarFiles(userId);
        Path target = avatarStorageDir.resolve(userId + "." + EXTENSION_BY_TYPE.get(contentType));
        file.transferTo(target);

        String avatarUrl = "/avatars/" + target.getFileName();
        return ResponseEntity.ok(userService.updateAvatar(userId, avatarUrl));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAccount(@AuthenticationPrincipal String userId) throws IOException {
        userService.deleteUser(userId);
        deleteAvatarFiles(userId);
        return ResponseEntity.noContent().build();
    }

    private void deleteAvatarFiles(String userId) throws IOException {
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(avatarStorageDir, userId + ".*")) {
            for (Path path : stream) {
                Files.deleteIfExists(path);
            }
        }
    }
}