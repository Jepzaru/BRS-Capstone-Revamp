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
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
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
    
    //CREATE
    @PostMapping("/api/add")
    public UserEntity post(@RequestBody UserEntity user) {
        return userService.post(user);
    }
    
    //READ
    @GetMapping("/read")
    public List<UserEntity> read() {
        return userService.read();
    }
    
    //UPDATE
    @PutMapping("/api/update/{id}")
    public UserEntity update(@PathVariable int id, @RequestBody UserEntity newUser) {
    	return userService.update(id, newUser);
    }
    
    //DELETE
    @DeleteMapping("/api/delete/{id}")
    public String delete(@PathVariable int id) {
    	return userService.delete(id);
    }
    
    //AUTHENTICATE
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

            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("role", role);
            response.put("email", email);
            return ResponseEntity.ok(response);
        } else {
            throw new UsernameNotFoundException("Invalid credentials");
        }
    }
}
