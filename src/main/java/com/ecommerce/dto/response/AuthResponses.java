package com.ecommerce.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

public class AuthResponses {

    @Data @Builder
    public static class AuthResponse {
        private String accessToken;
        private String refreshToken;
        private String tokenType;
        private long expiresIn;
        private UserInfo user;
    }

    @Data @Builder
    public static class UserInfo {
        private Long id;
        private String email;
        private String firstName;
        private String lastName;
        private List<String> roles;
    }

    @Data @Builder
    public static class MessageResponse {
        private String message;
    }
}
