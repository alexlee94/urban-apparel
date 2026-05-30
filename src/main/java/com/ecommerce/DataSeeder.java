package com.ecommerce;

import com.ecommerce.entity.Role;
import com.ecommerce.entity.User;
import com.ecommerce.repository.RoleRepository;
import com.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedRoles();
        seedAdminUser();
    }

    private void seedRoles() {
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role(Role.RoleName.ROLE_USER));
            roleRepository.save(new Role(Role.RoleName.ROLE_ADMIN));
            log.info("Roles seeded successfully");
        }
    }

    private void seedAdminUser() {
        if (!userRepository.existsByEmail("admin@gmail.com")) {
            Role adminRole = roleRepository.findByName(Role.RoleName.ROLE_ADMIN)
                    .orElseThrow();

            User admin = User.builder()
                    .email("admin@gmail.com")
                    .password(passwordEncoder.encode("admin123"))
                    .firstName("Admin")
                    .lastName("User")
                    .build();
            admin.setRoles(Set.of(adminRole));

            userRepository.save(admin);
            log.info("Admin user seeded successfully");
        }
    }
}
