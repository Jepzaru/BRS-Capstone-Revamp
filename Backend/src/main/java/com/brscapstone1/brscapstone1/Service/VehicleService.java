package com.brscapstone1.brscapstone1.Service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.brscapstone1.brscapstone1.Entity.VehicleEntity;
import com.brscapstone1.brscapstone1.Repository.VehicleRepository;

@Service
public class VehicleService {

  @Autowired
  VehicleRepository vehicleRepository;

  public VehicleEntity post(VehicleEntity post){
    if(post.getStatus() == null || post.getStatus().isEmpty()){
      post.setStatus("Available");
    }
    return vehicleRepository.save(post);
  }

  public List<VehicleEntity> vehicles(){
    return vehicleRepository.findAll();
  }

  public VehicleEntity update(int id, VehicleEntity newVehicle) {
    try {
        VehicleEntity vehicle = vehicleRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehicle with id " + id + " does not exist"));

        vehicle.setVehicleType(newVehicle.getVehicleType());
        vehicle.setPlateNumber(newVehicle.getPlateNumber());
        vehicle.setCapacity(newVehicle.getCapacity());

        if(newVehicle.getStatus() == null){
          vehicle.setStatus("Available");
        }else{
          vehicle.setStatus(newVehicle.getStatus());
        }

        return vehicleRepository.save(vehicle);
    } catch (ResponseStatusException e) {
        throw e; 
    } catch (Exception e) {
        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error updating vehicle", e);
    }
  }

  public String delete(int id){
    String msg = "";

    if(vehicleRepository.findById(id).isPresent()){
      vehicleRepository.deleteById(id);
      msg = "Vehicle with id " +id+ " successfully deleted.";
    }else{
      msg = "Vehicle with id " +id+ " does not exist.";
    }
    return msg;
  }
}
