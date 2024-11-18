package com.brscapstone1.brscapstone1.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.brscapstone1.brscapstone1.Constants;
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

    @PostMapping(Constants.ApiRoutes.POST_USER)
    public UserEntity post(@RequestBody UserEntity user) {
        return userService.post(user);
    }

    @GetMapping(Constants.ApiRoutes.GET_USER)
    public List<UserEntity> read() {
        return userService.read();
    }

    @PutMapping(Constants.ApiRoutes.UPDATE_USER)
    public UserEntity update(@PathVariable int id, @RequestBody UserEntity newUser) {
        return userService.update(id, newUser);
    }

    @DeleteMapping(Constants.ApiRoutes.DELETE_USER)
    public String delete(@PathVariable int id) {
        return userService.delete(id);
    }

    @PutMapping(Constants.ApiRoutes.CHANGE_PASS_USER)
    public ResponseEntity<String> changePassword(@PathVariable int id, @RequestBody Map<String, String> passwords) {
        String oldPassword = passwords.get(Constants.ResponseKeys.OLD_PASSWORD);
        String newPassword = passwords.get(Constants.ResponseKeys.NEW_PASSWORD);
        String message = userService.changePassword(id, oldPassword, newPassword);
        return ResponseEntity.ok(message);
    }

    @PostMapping(Constants.ApiRoutes.UPLOAD_PROFILE_USER)
    public ResponseEntity<?> uploadProfilePic(@PathVariable int id, @RequestPart MultipartFile imageFile) {
        try {
            UserEntity user = userService.uploadProfilePic(id, imageFile);
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(Constants.ApiRoutes.GET_PROFILE_USER)
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

    @PutMapping(Constants.ApiRoutes.UPDATE_PROFILE_USER)
    public ResponseEntity<?> updateProfilePic(@PathVariable int id, @RequestPart MultipartFile imageFile) {
        try {
            UserEntity user = userService.updateProfilePic(id, imageFile);
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(Constants.ApiRoutes.GET_BY_ID_USER)
    public ResponseEntity<UserEntity> getUser(@PathVariable int id) {
        UserEntity user = userService.findById(id);
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping(Constants.ApiRoutes.AUTHENTICATE)
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
            response.put(Constants.ResponseKeys.TOKEN, token);
            response.put(Constants.ResponseKeys.ROLE, role);
            response.put(Constants.ResponseKeys.EMAIL, email);
            response.put(Constants.ResponseKeys.DEPARTMENT, department);
            response.put(Constants.ResponseKeys.USER_ID, String.valueOf(userId)); 

            return ResponseEntity.ok(response);
        } else {
            throw new UsernameNotFoundException(Constants.ResponseMessages.INVALID_CREDENTIALS);
        }
    }
}
