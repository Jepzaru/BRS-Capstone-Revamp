package com.brscapstone1.brscapstone1.Configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.brscapstone1.brscapstone1.Service.MyUserDetailsService;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Autowired
	private  MyUserDetailsService myUserDetailsService;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
	    return httpSecurity
	        .csrf(AbstractHttpConfigurer::disable)
	        .authorizeHttpRequests(registry -> {
	            registry.requestMatchers("/", "/read", "/api/add", "/api/update/{id}", "/authenticate").permitAll();
	            registry.requestMatchers("/user/**").hasRole("USER");
	            registry.requestMatchers("/admin/**").hasRole("ADMIN");
	            registry.requestMatchers("/opc/**").hasRole("OPC");
	            registry.anyRequest().authenticated();
	        })
	        .exceptionHandling(exceptions -> exceptions
	            .accessDeniedHandler((request, response, accessDeniedException) -> {
	                // Log the access denied exception
	                System.out.println("Access denied: " + accessDeniedException.getMessage());
	                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied");
	            })
	        )
	        .build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
		provider.setUserDetailsService(myUserDetailsService);
		provider.setPasswordEncoder(passwordEncoder());
		return provider;
	}
	
	@Bean
	public AuthenticationManager authenticationManager() {
		return new ProviderManager(authenticationProvider());
	}
}
