package com.ecommerce.service;

import com.ecommerce.dto.request.CartRequest;
import com.ecommerce.dto.response.CartResponse;
import com.ecommerce.entity.Cart;
import com.ecommerce.entity.CartItem;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.exception.AppException;
import com.ecommerce.repository.CartItemRepository;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    // ── Get Cart ──────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public CartResponse getCart(String email) {
        User user = getUser(email);
        Cart cart = cartRepository.findByUser(user)
                .orElse(Cart.builder().user(user).build());
        return toResponse(cart);
    }

    // ── Add to Cart ───────────────────────────────────────────────────────────

    @Transactional
    public CartResponse addToCart(String email, CartRequest req) {
        User user = getUser(email);

        // Lock the product row to prevent concurrent overselling
        Product product = productRepository.findByIdWithLock(req.getProductId())
                .orElseThrow(() -> new AppException("Product not found", HttpStatus.NOT_FOUND));

        if (!product.isActive()) {
            throw new AppException("Product is no longer available", HttpStatus.BAD_REQUEST);
        }

        if (product.getStock() < req.getQuantity()) {
            throw new AppException("Insufficient stock", HttpStatus.BAD_REQUEST);
        }

        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));

        // If product already in cart, update quantity
        CartItem cartItem = cartItemRepository.findByCartAndProduct(cart, product)
                .orElse(CartItem.builder().cart(cart).product(product).quantity(0).build());

        int newQuantity = cartItem.getQuantity() + req.getQuantity();

        if (product.getStock() < newQuantity) {
            throw new AppException("Insufficient stock", HttpStatus.BAD_REQUEST);
        }

        cartItem.setQuantity(newQuantity);
        cartItemRepository.save(cartItem);

        return toResponse(cart);
    }

    // ── Update Cart Item ──────────────────────────────────────────────────────

    @Transactional
    public CartResponse updateCartItem(String email, Long cartItemId, CartRequest req) {
        User user = getUser(email);
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new AppException("Cart not found", HttpStatus.NOT_FOUND));

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new AppException("Cart item not found", HttpStatus.NOT_FOUND));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new AppException("Unauthorized", HttpStatus.FORBIDDEN);
        }

        // Lock product and check stock
        Product product = cartItem.getProduct();
        if (product.getStock() < req.getQuantity()) {
            throw new AppException("Insufficient stock", HttpStatus.BAD_REQUEST);
        }

        cartItem.setQuantity(req.getQuantity());
        cartItemRepository.save(cartItem);

        return toResponse(cart);
    }

    // ── Remove from Cart ──────────────────────────────────────────────────────

    @Transactional
    public CartResponse removeFromCart(String email, Long cartItemId) {
        User user = getUser(email);
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new AppException("Cart not found", HttpStatus.NOT_FOUND));

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new AppException("Cart item not found", HttpStatus.NOT_FOUND));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new AppException("Unauthorized", HttpStatus.FORBIDDEN);
        }

        cart.getItems().remove(cartItem);
        cartItemRepository.delete(cartItem);

        return toResponse(cart);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
    }

    private CartResponse toResponse(Cart cart) {
        List<CartResponse.CartItemResponse> items = cart.getItems().stream()
                .map(item -> CartResponse.CartItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .imageUrl(item.getProduct().getImageUrl())
                        .price(item.getProduct().getPrice())
                        .quantity(item.getQuantity())
                        .subtotal(item.getProduct().getPrice()
                                .multiply(BigDecimal.valueOf(item.getQuantity())))
                        .build())
                .collect(Collectors.toList());

        BigDecimal total = items.stream()
                .map(CartResponse.CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .id(cart.getId())
                .items(items)
                .total(total)
                .build();
    }
}
