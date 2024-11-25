package com.brscapstone1.brscapstone1.Service;

import java.text.MessageFormat;
import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.brscapstone1.brscapstone1.Constants;
import com.brscapstone1.brscapstone1.Entity.VehicleEntity;
import com.brscapstone1.brscapstone1.Entity.VehicleMaintenanceDetailsEntity;
import com.brscapstone1.brscapstone1.Repository.VehicleRepository;
import com.brscapstone1.brscapstone1.Repository.VehicleMaintenanceDetailsRepository;

@Service
public class VehicleService {

  @Autowired
  VehicleRepository vehicleRepository;

  @Autowired
  VehicleMaintenanceDetailsRepository maintenanceDetailsRepository;

  public VehicleEntity post(VehicleEntity post){
    if(post.getStatus() == null || post.getStatus().isEmpty()){
      post.setStatus(Constants.Annotation.AVAILABLE);
    }
    return vehicleRepository.save(post);
  }

  public List<VehicleEntity> vehicles(){
    return vehicleRepository.findAll();
  }

  public VehicleEntity update(int id, VehicleEntity newVehicle) {
    try {
        VehicleEntity vehicle = vehicleRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, MessageFormat.format(Constants.ExceptionMessage.VEHICLE_ID_NOT_FOUND, id)));

        vehicle.setVehicleType(newVehicle.getVehicleType());
        vehicle.setPlateNumber(newVehicle.getPlateNumber());
        vehicle.setCapacity(newVehicle.getCapacity());

        if (newVehicle.getStatus() == null) {
            vehicle.setStatus(Constants.Annotation.AVAILABLE);
            vehicle.setMaintenanceStartDate(LocalDate.of(0001, 1, 1));
            vehicle.setMaintenanceEndDate(LocalDate.of(0001, 1, 1));
        } else {
            vehicle.setStatus(newVehicle.getStatus());

            if (Constants.Annotation.MAINTENANCE.equals(newVehicle.getStatus())) {
                vehicle.setMaintenanceStartDate(newVehicle.getMaintenanceStartDate());
                vehicle.setMaintenanceEndDate(newVehicle.getMaintenanceEndDate());
                vehicle.setMaintenanceDetails(newVehicle.getMaintenanceDetails());
                
                VehicleMaintenanceDetailsEntity maintenanceDetails = new VehicleMaintenanceDetailsEntity(
                    vehicle, 
                    vehicle.getVehicleType(), 
                    newVehicle.getMaintenanceDetails(),
                    Constants.Annotation.PENDING, 
                    vehicle.getMaintenanceStartDate(),
                    vehicle.getMaintenanceEndDate(),
                    false 
                );
                maintenanceDetailsRepository.save(maintenanceDetails); 
            } else {
                vehicle.setMaintenanceStartDate(null);
                vehicle.setMaintenanceEndDate(null);
            }
        }

        return vehicleRepository.save(vehicle);
    } catch (ResponseStatusException e) {
        throw e;
    } catch (Exception e) {
        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, Constants.ExceptionMessage.VEHICLE_ERROR_UPDATE, e);
    }
  }

  public List<VehicleMaintenanceDetailsEntity> getAllMaintenanceDetails() {
    return maintenanceDetailsRepository.findAll();
  }

  public VehicleMaintenanceDetailsEntity updateMaintenanceStatus(int id, Boolean isCompleted) {
    VehicleMaintenanceDetailsEntity maintenanceDetails = maintenanceDetailsRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, MessageFormat.format(Constants.ExceptionMessage.MAINTENANCE_NOT_FOUND, id)));

    maintenanceDetails.setIsCompleted(isCompleted);
    if (isCompleted) {
        maintenanceDetails.setStatus(Constants.Annotation.COMPLETED);

        VehicleEntity vehicle = maintenanceDetails.getVehicle();
        if (vehicle != null) {
            vehicle.setStatus(Constants.Annotation.AVAILABLE);
            vehicleRepository.save(vehicle); 
        }
    } else {
        maintenanceDetails.setStatus(Constants.Annotation.PENDING);
    }
    return maintenanceDetailsRepository.save(maintenanceDetails);
  }

  public String delete(int id){
    String msg = "";

    if(vehicleRepository.findById(id).isPresent()){
        VehicleEntity vehicle = vehicleRepository.findById(id).get();
        List<VehicleMaintenanceDetailsEntity> maintenanceDetails = maintenanceDetailsRepository.findByVehicle(vehicle);

        for (VehicleMaintenanceDetailsEntity maintenanceDetail : maintenanceDetails) {
            maintenanceDetailsRepository.delete(maintenanceDetail);
        }
        vehicleRepository.deleteById(id);
        msg = MessageFormat.format(Constants.ResponseMessages.VEHICLE_DELETE_SUCCESS, id);
    } else {
        msg = Constants.ExceptionMessage.VEHICLE_ID_NOT_FOUND;
    }
    return msg;
  }
}
