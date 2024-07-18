package com.brscapstone1.brscapstone1.Service;

import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.brscapstone1.brscapstone1.Entity.DriverEntity;
import com.brscapstone1.brscapstone1.Repository.DriverRepository;

@Service
public class DriverService {
  
  @Autowired
  DriverRepository driverRepo;

  public List<DriverEntity> drivers(){
    return driverRepo.findAll();
  }

  public DriverEntity post(DriverEntity post){
    if(post.getStatus() == null || post.getStatus().isEmpty()){
      post.setStatus("Available");
    }
    return driverRepo.save(post);
  }

  public DriverEntity update (int id, DriverEntity newDriver){
    DriverEntity driver;

    try{
      driver = driverRepo.findById(id).orElseThrow(() -> new NoSuchElementException("Driver with id " +id+ " does not exist"));
      driver.setDriverName(newDriver.getDriverName());
      driver.setContactNumber(newDriver.getContactNumber());
      driver.setStatus(newDriver.getStatus());
      return driverRepo.save(driver);
    } catch(NoSuchElementException e){
      throw e;
    }
  }

  public String delete(int id){
    String msg = "";

    if(driverRepo.findById(id).isPresent()){
      driverRepo.deleteById(id);
      msg = "Driver with id " +id+ " is successfully deleted.";
    }else{
      msg = "Driver with id " +id+ " does not exist.";
    }
    return msg;
  }
}
