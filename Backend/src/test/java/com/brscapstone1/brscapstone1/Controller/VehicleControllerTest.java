package com.brscapstone1.brscapstone1.Controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@WebMvcTest(VehicleController.class)
public class VehicleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testPostVehicle() throws Exception {
        String vehicleJson = "{ \"name\": \"Test Vehicle\", \"status\": \"Available\" }";

        mockMvc.perform(MockMvcRequestBuilders.post("/opc/vehicle/post")
                .contentType(MediaType.APPLICATION_JSON)
                .content(vehicleJson))
               .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    public void testGetAllVehicles() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/opc/vehicle/getAll"))
               .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    public void testUpdateVehicle() throws Exception {
        String vehicleJson = "{ \"name\": \"Updated Vehicle\", \"status\": \"Unavailable\" }";

        mockMvc.perform(MockMvcRequestBuilders.put("/opc/vehicle/update/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(vehicleJson))
               .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    public void testDeleteVehicle() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/opc/vehicle/delete/1"))
               .andExpect(MockMvcResultMatchers.status().isOk());
    }
}

