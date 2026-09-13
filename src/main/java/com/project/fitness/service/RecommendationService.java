package com.project.fitness.service;

import com.project.fitness.dto.RecommendationRequest;
import com.project.fitness.exceptions.BadRequestException;
import com.project.fitness.exceptions.ResourceNotFoundException;
import com.project.fitness.model.Activity;
import com.project.fitness.model.Recommendation;
import com.project.fitness.model.User;
import com.project.fitness.repository.ActivityRepository;
import com.project.fitness.repository.RecommendationRepository;
import com.project.fitness.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;
    private final RecommendationRepository recommendationRepository;

    @Transactional
    public Recommendation generateRecommendation(String userId, RecommendationRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Activity activity = activityRepository.findById(request.getActivityId())
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));

        if (!activity.getUser().getId().equals(userId)) {
            throw new BadRequestException("Activity does not belong to this user");
        }

        Recommendation recommendation = Recommendation.builder()
                .user(user)
                .activity(activity)
                .improvements(request.getImprovements())
                .suggestions(request.getSuggestions())
                .safety(request.getSafety())
                .build();

        return recommendationRepository.save(recommendation);
    }

    @Transactional(readOnly = true)
    public List<Recommendation> getUserRecommendation(String userId) {
        return recommendationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public List<Recommendation> getActivityRecommendation(String userId, String activityId) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));
        if (!activity.getUser().getId().equals(userId)) {
            throw new BadRequestException("Activity does not belong to this user");
        }
        return recommendationRepository.findByActivityId(activityId);
    }
}