package com.brscapstone1.brscapstone1.Controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import com.brscapstone1.brscapstone1.Entity.AuthLoginEntity;
import com.brscapstone1.brscapstone1.Entity.PasswordUpdateRequest;
import com.brscapstone1.brscapstone1.Service.AuthLoginService;

@RestController
@CrossOrigin
@RequestMapping("/auth_login")
public class AuthLoginController {

  @Autowired
  AuthLoginService authService;
  PasswordUpdateRequest passwordUpdateRequest;

  @PostMapping("/post")
  public AuthLoginEntity post(@RequestBody AuthLoginEntity post) {
    return authService.post(post);
  }

  @GetMapping("/logins")
  public List<AuthLoginEntity> logins() {
    return authService.logins();
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody AuthLoginEntity loginRequest) {
      String email = loginRequest.getEmail();
      String password = loginRequest.getPassword();
      
      // Call your backend service method to authenticate the user
      AuthLoginEntity user = authService.login(email, password);
      
      if (user != null) {
          return ResponseEntity.ok(user);
      } else {
          // If authentication fails, return an unauthorized status
          return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"message\": \"Invalid email or password.\"}");
      }
  }
  

  @PostMapping("/add-user")
  public AuthLoginEntity addUser(@RequestBody AuthLoginEntity user) {
    if(user.getDepartment() == null || user.getDepartment().isEmpty()){
      user.setDepartment("No department");
    }
    return authService.addUser(user);
  }

  @GetMapping("/users")
  public List<AuthLoginEntity> getUsers() {
    return authService.getUsers();
  }

  @PutMapping("/update-password")
  public ResponseEntity<?> updatePassword(@RequestBody PasswordUpdateRequest passwordUpdateRequest) {
    AuthLoginEntity user = authService.updatePassword(
      passwordUpdateRequest.getEmail(), 
      passwordUpdateRequest.getCurrentPassword(), 
      passwordUpdateRequest.getNewPassword()
    );
    if (user != null) {
      return ResponseEntity.ok("{\"message\": \"Password updated successfully.\"}");
    } else {
      return ResponseEntity.status(401).body("{\"message\": \"Invalid current password.\"}");
    }
  }
  @GetMapping("/current-user")
  public ResponseEntity<?> getCurrentUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null && authentication.isAuthenticated()) {
      String userEmail = authentication.getName();
      return ResponseEntity.ok("Current user email: " + userEmail);
    } else {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No user logged in.");
    }
  }
}
