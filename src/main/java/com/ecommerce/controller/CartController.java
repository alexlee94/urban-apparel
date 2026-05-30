package com.ecommerce.controller;

import com.ecommerce.dto.request.CartRequest;
import com.ecommerce.dto.response.CartResponse;
import com.ecommerce.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponse> getCart(Authentication authentication) {
        return ResponseEntity.ok(cartService.getCart(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<CartResponse> addToCart(
            Authentication authentication,
            @Valid @RequestBody CartRequest req) {
        return ResponseEntity.ok(cartService.addToCart(authentication.getName(), req));
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<CartResponse> updateCartItem(
            Authentication authentication,
            @PathVariable Long cartItemId,
            @Valid @RequestBody CartRequest req) {
        return ResponseEntity.ok(cartService.updateCartItem(authentication.getName(), cartItemId, req));
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<CartResponse> removeFromCart(
            Authentication authentication,
            @PathVariable Long cartItemId) {
        return ResponseEntity.ok(cartService.removeFromCart(authentication.getName(), cartItemId));
    }
}
