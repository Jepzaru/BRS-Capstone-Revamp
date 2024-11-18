package com.brscapstone1.brscapstone1.Service;

import java.text.MessageFormat;
import java.util.NoSuchElementException;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.brscapstone1.brscapstone1.Constants;
import com.brscapstone1.brscapstone1.DTO.EmailDetailsDTO;
import com.brscapstone1.brscapstone1.Entity.UserEntity;
import com.brscapstone1.brscapstone1.Repository.UserRepository;

@Service
public class SendMailService {

    private static final Logger LOGGER = LoggerFactory.getLogger(SendMailService.class);
    private final JavaMailSender javaMailSender;
    private static final ConcurrentHashMap<String, String> verificationCodes = new ConcurrentHashMap<>();

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Value(Constants.DataAnnotations.SPRING_EMAIL)
    private String sender;

    @Autowired
    public SendMailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendSimpleMail(EmailDetailsDTO details) {
        try {            
            String code = String.format("%06d", (int) (Math.random() * 1000000));
            verificationCodes.put(details.getRecipient(), code);

            String recipientEmail = details.getRecipient();
            String firstName = recipientEmail.split("\\.")[0];

            String emailBody = MessageFormat.format(Constants.EmailConstants.PASSWORD_CHANGE_REQUEST_TEMPLATE, firstName, code);

            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom(sender);
            mailMessage.setTo(details.getRecipient());
            mailMessage.setSubject(Constants.EmailConstants.EMAIL_SUBJECT);
            mailMessage.setText(emailBody);

            javaMailSender.send(mailMessage);
            LOGGER.info(Constants.EmailConstants.EMAIL_SUCCESS, details.getRecipient());
        } catch (Exception ex) {
            LOGGER.error(Constants.EmailConstants.EMAIL_FAILED_LOGGER, ex.getMessage());
            throw new RuntimeException(Constants.EmailConstants.EMAIL_FAILED + ex.getMessage());
        }
    }

    public boolean verifyCode(String email, String code) {
        String storedCode = verificationCodes.get(email);
        return storedCode != null && storedCode.equals(code);
    }

    public String changePasswordByEmailWithoutOldPassword(String email, String newPassword) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException(MessageFormat.format(Constants.ExceptionMessage.EMAIL_NOT_FONUD, email)));
    
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return Constants.ResponseMessages.CHANGE_PASS_SUCCESS;
    }
}
