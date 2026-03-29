package com.example.student.auth;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository repository;

    @PostConstruct
    public void initAdmin() {
        if (repository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword("admin123"); // In real production, hash this
            admin.setRole("ADMIN");
            repository.save(admin);
        }
    }

    public Optional<User> login(String username, String password) {
        return repository.findByUsername(username)
                .filter(user -> user.getPassword().equals(password));
    }

    public User register(User user) {
        if (repository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        return repository.save(user);
    }
}
