package com.brscapstone1.brscapstone1.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @PostMapping("/users/upload-profile-pic/{id}")
    public ResponseEntity<?> uploadProfilePic(@PathVariable int id, @RequestPart MultipartFile imageFile) {
        try {
            UserEntity user = userService.uploadProfilePic(id, imageFile);
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/users/profile-pic/{id}")
    public ResponseEntity<byte[]> getUserProfilePic(@PathVariable int id) {
    UserEntity user = userService.findById(id);
    byte[] imageData = user.getImageData();

    if (imageData != null) {
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(user.getImageType()))
                .body(imageData);
    } else {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}

@PutMapping("/users/update-profile-pic/{id}")
public ResponseEntity<?> updateProfilePic(@PathVariable int id, @RequestPart MultipartFile imageFile) {
    try {
        UserEntity user = userService.updateProfilePic(id, imageFile);
        return new ResponseEntity<>(user, HttpStatus.OK);
    } catch (Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}


    @GetMapping("/users/{id}")
    public ResponseEntity<UserEntity> getUser(@PathVariable int id) {
        UserEntity user = userService.findById(id); // Ensure this method exists in UserService
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
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

            UserEntity user = userService.findByEmail(email);
            String department = user.getDepartment(); 
            int userId = user.getId(); 
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("role", role);
            response.put("email", email);
            response.put("department", department);
            response.put("userId", String.valueOf(userId)); 

            return ResponseEntity.ok(response);
        } else {
            throw new UsernameNotFoundException("Invalid credentials");
        }
    }
}
