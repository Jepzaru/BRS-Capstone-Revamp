package com.brscapstone1.brscapstone1.Service;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.brscapstone1.brscapstone1.Entity.UserEntity;
import com.brscapstone1.brscapstone1.Repository.UserRepository;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<UserEntity> user = userRepository.findByEmail(email);

        if (user.isPresent()) {
            String role = user.get().getRole();
            if (!role.startsWith("ROLE_")) {
                role = "ROLE_" + role;
            }
            return User.builder()
                    .username(user.get().getEmail())
                    .password(user.get().getPassword())
                    .roles(role.replace("ROLE_", ""))
                    .build();
        }
        else {
            throw new UsernameNotFoundException(email);
        }
    }
}
