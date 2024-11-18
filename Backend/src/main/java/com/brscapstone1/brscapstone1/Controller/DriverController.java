package com.brscapstone1.brscapstone1.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.brscapstone1.brscapstone1.Constants;
import com.brscapstone1.brscapstone1.Entity.DriverEntity;
import com.brscapstone1.brscapstone1.Service.DriverService;

@RestController
@CrossOrigin
@RequestMapping(Constants.ApiRoutes.DRIVER_BASE)
public class DriverController {
  
  @Autowired
  DriverService driverService;

  @GetMapping(Constants.ApiRoutes.GET_ALL)
  public List<DriverEntity> drivers(){
    return driverService.drivers();
  }

  @PostMapping(Constants.ApiRoutes.POST)
  public DriverEntity post(@RequestBody DriverEntity post){
    return driverService.post(post);
  }

  @PutMapping(Constants.ApiRoutes.UPDATE)
  public DriverEntity update (@PathVariable int id, @RequestBody DriverEntity newDriver){
    return driverService.update(id, newDriver);
  }
  
  @DeleteMapping(Constants.ApiRoutes.DELETE)
  public String delete(@PathVariable int id){
    return driverService.delete(id);
  }
  @PostMapping(Constants.ApiRoutes.DRIVER_UPDATE_STATUS)
  public void updateDriverStatuses() {
      driverService.updateDriverStatuses();
  }
}
