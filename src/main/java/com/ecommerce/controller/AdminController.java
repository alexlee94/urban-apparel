package com.ecommerce.controller;

import com.ecommerce.dto.response.AuthResponses.MessageResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @GetMapping("/dashboard")
    public ResponseEntity<MessageResponse> dashboard() {
        return ResponseEntity.ok(MessageResponse.builder()
                .message("Welcome to the admin dashboard")
                .build());
    }
}
