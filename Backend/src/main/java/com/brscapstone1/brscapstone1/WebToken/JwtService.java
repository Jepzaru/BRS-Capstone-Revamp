package com.brscapstone1.brscapstone1.WebToken;

import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import javax.crypto.SecretKey;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private static final String SECRET = "1D54B7D4D9F00E62855B22F4964AA07E6656E26E6D44DF032F49BDC21E07789FC67E40B538633E9D720B5185FD7FF19A6F3F5084F3299DBBA3F045AF25559357";
    private static final Long VALIDITY = TimeUnit.MINUTES.toMillis(30);

    public String generateToken(UserDetails userDetails) {
		Map<String, Object> claims = new HashMap<>();
		claims.put("roles", userDetails.getAuthorities().stream()
										  .map(GrantedAuthority::getAuthority)
										  .map(role -> role.startsWith("ROLE_") ? role : "ROLE_" + role)
										  .collect(Collectors.toList()));
	
		return Jwts.builder()
			.claim("roles", claims.get("roles"))
			.setSubject(userDetails.getUsername())
			.setIssuedAt(Date.from(Instant.now()))
			.setExpiration(Date.from(Instant.now().plusMillis(VALIDITY)))
			.signWith(generateKey())
			.compact();
	}

    public String extractUsername(String token) {
        return Jwts.parserBuilder().setSigningKey(generateKey()).build()
            .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return Jwts.parserBuilder().setSigningKey(generateKey()).build()
            .parseClaimsJws(token).getBody().getExpiration().before(new Date());
    }

    private SecretKey generateKey() {
        byte[] decodedKey = Base64.getDecoder().decode(SECRET);
        return Keys.hmacShaKeyFor(decodedKey);
    }
}
