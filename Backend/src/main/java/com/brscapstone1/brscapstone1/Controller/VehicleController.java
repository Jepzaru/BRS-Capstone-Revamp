package com.brscapstone1.brscapstone1.Controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.brscapstone1.brscapstone1.Entity.VehicleEntity;
import com.brscapstone1.brscapstone1.Service.VehicleService;

@RestController
@CrossOrigin
@RequestMapping("/opc/vehicle")
public class VehicleController {

    @Autowired
    VehicleService vehicleService;

    @PostMapping("/post")
    public VehicleEntity post(@RequestBody VehicleEntity vehicle) {
        return vehicleService.post(vehicle);
    }

    @GetMapping("/getAll")
    public List<VehicleEntity> vehicles() {
        return vehicleService.vehicles();
    }

    @PutMapping("/update/{id}")
    public VehicleEntity update(@PathVariable int id, @RequestBody VehicleEntity newVehicle) {
        return vehicleService.update(id, newVehicle);
    }

    @DeleteMapping("/delete/{id}")
    public String delete(@PathVariable int id) {
        return vehicleService.delete(id);
    }
}
