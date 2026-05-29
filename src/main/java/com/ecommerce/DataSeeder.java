package com.ecommerce;

import com.ecommerce.entity.Role;
import com.ecommerce.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role(Role.RoleName.ROLE_USER));
            roleRepository.save(new Role(Role.RoleName.ROLE_ADMIN));
            log.info("Roles seeded successfully");
        }
    }
}
