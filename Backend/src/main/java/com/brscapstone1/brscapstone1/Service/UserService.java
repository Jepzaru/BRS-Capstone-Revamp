package com.brscapstone1.brscapstone1.Service;

import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.brscapstone1.brscapstone1.Constants;
import com.brscapstone1.brscapstone1.Entity.UserEntity;
import com.brscapstone1.brscapstone1.Repository.UserRepository;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    public UserEntity post(UserEntity user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public List<UserEntity> read() {
        return userRepository.findAll();
    }

	public UserEntity findById(int id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException(Constants.ExceptionMessage.USER_NOT_FOUND));
    }

    public UserEntity update(int id, UserEntity newUser) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException(Constants.ExceptionMessage.USER_NOT_FOUND));

        user.setEmail(newUser.getEmail());

        if (newUser.getPassword() != null && !newUser.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(newUser.getPassword()));
        }

        user.setDepartment(newUser.getDepartment());
        user.setRole(newUser.getRole());
        return userRepository.save(user);
    }

    public String delete(int id) {
        if (userRepository.findById(id).isPresent()) {
            userRepository.deleteById(id);
            return Constants.ResponseMessages.USER_DELETE_SUCCESS;
        } else {
            return Constants.ExceptionMessage.USER_NOT_FOUND;
        }
    }

    public String changePassword(int id, String oldPassword, String newPassword) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException(Constants.ExceptionMessage.USER_NOT_FOUND));

        if (passwordEncoder.matches(oldPassword, user.getPassword())) {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return Constants.ResponseMessages.CHANGE_PASS_SUCCESS;
        } else {
            throw new IllegalArgumentException(Constants.ResponseMessages.OLD_PASS_INCORRECT);
        }
    }    

    public UserEntity findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(Constants.ExceptionMessage.USERNAME_NOT_FOUND + email));
    }

    public UserEntity uploadProfilePic(int id, MultipartFile imageFile) throws IOException {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException(Constants.ExceptionMessage.USER_NOT_FOUND));

        user.setImageName(imageFile.getOriginalFilename());
        user.setImageType(imageFile.getContentType());
        user.setImageData(imageFile.getBytes());

        return userRepository.save(user);
    }

	public UserEntity updateProfilePic(int id, MultipartFile imageFile) throws IOException {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException(Constants.ExceptionMessage.USER_NOT_FOUND));

        user.setImageName(imageFile.getOriginalFilename());
        user.setImageType(imageFile.getContentType());
        user.setImageData(imageFile.getBytes());

        return userRepository.save(user);
    }
}
