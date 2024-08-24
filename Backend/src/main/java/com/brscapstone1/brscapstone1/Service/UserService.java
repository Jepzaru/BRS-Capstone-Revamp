package com.brscapstone1.brscapstone1.Service;

import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.brscapstone1.brscapstone1.Entity.UserEntity;
import com.brscapstone1.brscapstone1.Repository.UserRepository;


@Service
public class UserService {
	
	@Autowired
	UserRepository userRepository;
	@Autowired
	PasswordEncoder passwordEncoder;
	
	//ADD USER
	public UserEntity post(UserEntity user){
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		return userRepository.save(user);
	}
	
	//READ USER
	public List<UserEntity> read(){
		return userRepository.findAll();
	}
	
	//UPDATE USER
	public UserEntity update(int id, UserEntity newUser) {
		UserEntity user;
		
		try {
			user = userRepository.findById(id).orElseThrow(() -> new NoSuchElementException("User with id " +id+ " does not exists."));
			user.setEmail(newUser.getEmail());
			user.setPassword(passwordEncoder.encode(user.getPassword()));
			user.setRole(newUser.getRole());
			return userRepository.save(user);
		}catch(NoSuchElementException e) {
			throw e;
		}
	}
	
	//DELETE USER
	public String delete(int id) {
		String message = "";
		
		if(userRepository.findById(id).isPresent()) {
			userRepository.deleteById(id);
			message = "User with id " +id+ " successfully deleted.";
		}else {
			message = "User with id " +id+ " does not exists.";
		}
		return message;
	}
}
