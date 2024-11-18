package com.brscapstone1.brscapstone1.Controller;

import java.util.Map;
import java.util.NoSuchElementException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.brscapstone1.brscapstone1.Constants;
import com.brscapstone1.brscapstone1.DTO.EmailDetailsDTO;
import com.brscapstone1.brscapstone1.Service.SendMailService;

@RestController
@CrossOrigin
@RequestMapping(Constants.ApiRoutes.EMAIL_BASE)
public class EmailController {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmailController.class);

    private final SendMailService emailService;

    @Autowired
    public EmailController(SendMailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping(Constants.ApiRoutes.EMAIL_POST)
    public ResponseEntity<String> sendMail(@RequestBody EmailDetailsDTO details) {
        try {
            emailService.sendSimpleMail(details);
            return ResponseEntity.status(HttpStatus.OK).body(Constants.ResponseMessages.EMAIL_SUCCESS);
        } catch (Exception e) {
            LOGGER.error(Constants.ResponseMessages.EMAIL_FAILED, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ResponseMessages.EMAIL_BODY_FAILED + e.getMessage());
        }
    }

    @PostMapping(Constants.ApiRoutes.EMAIL_VERIFY)
    public ResponseEntity<String> verifyCode(@RequestParam(Constants.Annotation.EMAIL) String email, @RequestParam(Constants.Annotation.CODE) String code) {
        try {
            boolean isCodeValid = emailService.verifyCode(email, code);
            if (isCodeValid) {
                return ResponseEntity.status(HttpStatus.OK).body(Constants.ResponseMessages.VERIFY_SUCCESS);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Constants.ResponseMessages.VERIFY_FAILED);
            }
        } catch (Exception e) {
            LOGGER.error(Constants.ResponseMessages.VERIFY_BODY_FAILED, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ResponseMessages.VERIFY_ERROR + e.getMessage());
        }
    }

    @PutMapping(Constants.ApiRoutes.CHANGE_PASS_USER_BY_EMAIL)
    public ResponseEntity<String> changePasswordByEmail(@RequestBody Map<String, String> passwords) {
        String email = passwords.get(Constants.ResponseKeys.EMAIL);
        String newPassword = passwords.get(Constants.ResponseKeys.NEW_PASSWORD);
        
        try {
            String message = emailService.changePasswordByEmailWithoutOldPassword(email, newPassword);
            return ResponseEntity.ok(message);
        } catch (IllegalArgumentException | NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }    
}
