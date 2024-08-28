package com.brscapstone1.brscapstone1.Controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.brscapstone1.brscapstone1.Entity.VehicleEntity;
import com.brscapstone1.brscapstone1.Service.VehicleService;

@RestController
@CrossOrigin
public class VehicleController {

    @Autowired
    VehicleService vehicleService;

    @PostMapping("/opc/vehicle/post")
    public VehicleEntity post(@RequestBody VehicleEntity vehicle) {
        return vehicleService.post(vehicle);
    }

    @GetMapping("/vehicle/getAll")
    public List<VehicleEntity> vehicles() {
        return vehicleService.vehicles();
    }

    @PutMapping("/opc/vehicle/update/{id}")
    public VehicleEntity update(@PathVariable int id, @RequestBody VehicleEntity newVehicle) {
        return vehicleService.update(id, newVehicle);
    }

    @DeleteMapping("/opc/vehicle/delete/{id}")
    public String delete(@PathVariable int id) {
        return vehicleService.delete(id);
    }
}
