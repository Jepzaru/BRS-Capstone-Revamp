package com.brscapstone1.brscapstone1.Config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.beans.factory.annotation.Autowired;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
public class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testAccessToPublicEndpoint() throws Exception {
        mockMvc.perform(get("/authenticate"))
               .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "USER")
    public void testAccessToProtectedEndpointWithRoleUser() throws Exception {
        mockMvc.perform(get("/user/someProtectedResource"))
               .andExpect(status().isOk());
    }

    @Test
    public void testAccessToProtectedEndpointWithoutRoleUser() throws Exception {
        mockMvc.perform(get("/user/someProtectedResource"))
               .andExpect(status().isForbidden());
    }
}
