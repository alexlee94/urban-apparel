package com.ecommerce.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class AuthRequests {

    @Data
    public static class RegisterRequest {
        @Email @NotBlank
        private String email;

        @NotBlank @Size(min = 8, max = 72)
        private String password;

        @NotBlank @Size(max = 100)
        private String firstName;

        @NotBlank @Size(max = 100)
        private String lastName;
    }

    @Data
    public static class LoginRequest {
        @Email @NotBlank
        private String email;

        @NotBlank
        private String password;
    }

    @Data
    public static class RefreshRequest {
        @NotBlank
        private String refreshToken;
    }
}
