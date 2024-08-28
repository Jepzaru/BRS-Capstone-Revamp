package com.brscapstone1.brscapstone1.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import com.brscapstone1.brscapstone1.Entity.UserEntity;
import com.brscapstone1.brscapstone1.Service.MyUserDetailsService;
import com.brscapstone1.brscapstone1.Service.UserService;
import com.brscapstone1.brscapstone1.WebToken.JwtService;
import com.brscapstone1.brscapstone1.WebToken.LoginForm;

@RestController
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private MyUserDetailsService myUserDetailsService;
    
    @PostMapping("/admin/users/add")
    public UserEntity post(@RequestBody UserEntity user) {
        return userService.post(user);
    }
    
    @GetMapping("/admin/users/read")
    public List<UserEntity> read() {
        return userService.read();
    }
    
    @PutMapping("/admin/users/update/{id}")
    public UserEntity update(@PathVariable int id, @RequestBody UserEntity newUser) {
        return userService.update(id, newUser);
    }
    
    @DeleteMapping("/admin/users/delete/{id}")
    public String delete(@PathVariable int id) {
        return userService.delete(id);
    }
    
    @PutMapping("/users/change-password/{id}")
    public ResponseEntity<String> changePassword(@PathVariable int id, @RequestBody Map<String, String> passwords) {
        String oldPassword = passwords.get("oldPassword");
        String newPassword = passwords.get("newPassword");
        String message = userService.changePassword(id, oldPassword, newPassword);
        return ResponseEntity.ok(message);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<Map<String, String>> authenticateAndGetToken(@RequestBody LoginForm loginForm) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginForm.email(), loginForm.password())
        );

        if (authentication.isAuthenticated()) {
            UserDetails userDetails = myUserDetailsService.loadUserByUsername(loginForm.email());
            String token = jwtService.generateToken(userDetails);
            String role = userDetails.getAuthorities().iterator().next().getAuthority();
            String email = userDetails.getUsername();

            // Fetch the user from the database to get the userId
            UserEntity user = userService.findByEmail(email);
            int userId = user.getId(); // assuming `getId()` returns the userId

            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("role", role);
            response.put("email", email);
            response.put("userId", String.valueOf(userId)); // Include userId in the response

            return ResponseEntity.ok(response);
        } else {
            throw new UsernameNotFoundException("Invalid credentials");
        }
    }

}
