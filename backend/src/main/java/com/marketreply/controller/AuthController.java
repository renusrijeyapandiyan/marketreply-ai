package com.marketreply.controller;

import com.marketreply.dto.AuthResponseDTO;
import com.marketreply.dto.LoginRequest;
import com.marketreply.dto.RegisterRequest;
import com.marketreply.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/** Registration, login, and "who am I" endpoints. */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    /** Returns the current user based on the JWT already validated by JwtAuthFilter. */
    @GetMapping("/me")
    public ResponseEntity<AuthResponseDTO> me(HttpServletRequest request) {
        String userId = (String) request.getAttribute("authUserId");
        return ResponseEntity.ok(authService.getCurrentUser(userId));
    }
}
