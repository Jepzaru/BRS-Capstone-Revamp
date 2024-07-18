package com.brscapstone1.brscapstone1.Service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.brscapstone1.brscapstone1.Entity.AuthLoginEntity;
import com.brscapstone1.brscapstone1.Repository.AuthLoginRepository;

@Service
public class AuthLoginService {

  @Autowired
  AuthLoginRepository authRepo;

  public AuthLoginEntity post(AuthLoginEntity post) {
    return authRepo.save(post);
  }

  public List<AuthLoginEntity> logins(){
    return authRepo.findAll();
  }

  public AuthLoginEntity addUser(AuthLoginEntity user) {
    return authRepo.save(user);
  }

  public AuthLoginEntity login(String email, String password) {
    return authRepo.findByEmailAndPassword(email, password);
  }

  public List<AuthLoginEntity> getUsers(){
    return authRepo.findAll();
  }

  public AuthLoginEntity updatePassword(String email, String currentPassword, String newPassword) {
    AuthLoginEntity user = authRepo.findByEmailAndPassword(email, currentPassword);
    if (user != null) {
      user.setPassword(newPassword);
      return authRepo.save(user);
    } else {
      return null;
    }
  }
}
