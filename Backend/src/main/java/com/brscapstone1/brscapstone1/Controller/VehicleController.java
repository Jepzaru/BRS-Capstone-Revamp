package com.brscapstone1.brscapstone1.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.brscapstone1.brscapstone1.Constants;
import com.brscapstone1.brscapstone1.Entity.VehicleEntity;
import com.brscapstone1.brscapstone1.Entity.VehicleMaintenanceDetailsEntity;
import com.brscapstone1.brscapstone1.Service.VehicleService;

@RestController
@CrossOrigin
public class VehicleController {

    @Autowired
    VehicleService vehicleService;

    @PostMapping(Constants.ApiRoutes.POST_VEHICLE)
    public VehicleEntity post(@RequestBody VehicleEntity vehicle) {
        return vehicleService.post(vehicle);
    }

    @GetMapping(Constants.ApiRoutes.GET_ALL_VEHICLE)
    public List<VehicleEntity> vehicles() {
        return vehicleService.vehicles();
    }

    @PutMapping(Constants.ApiRoutes.UPDATE_VEHICLE)
    public VehicleEntity update(@PathVariable int id, @RequestBody VehicleEntity newVehicle) {
        return vehicleService.update(id, newVehicle);
    }

    @DeleteMapping(Constants.ApiRoutes.DELETE_VEHICLE)
    public String delete(@PathVariable int id) {
        return vehicleService.delete(id);
    }

     @GetMapping(Constants.ApiRoutes.VEHICLE_MAINTENANCE_DETAILS)
    public List<VehicleMaintenanceDetailsEntity> getAllMaintenanceDetails() {
        return vehicleService.getAllMaintenanceDetails();
    }

    @PutMapping(Constants.ApiRoutes.VEHICLE_MAINTENANCE_STATUS)
    public VehicleMaintenanceDetailsEntity updateMaintenanceStatus(@PathVariable int id, @RequestParam Boolean isCompleted) {
        return vehicleService.updateMaintenanceStatus(id, isCompleted);
    }
}
