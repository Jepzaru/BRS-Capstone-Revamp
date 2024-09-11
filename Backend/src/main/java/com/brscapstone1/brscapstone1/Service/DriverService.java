package com.brscapstone1.brscapstone1.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.brscapstone1.brscapstone1.Entity.DriverEntity;
import com.brscapstone1.brscapstone1.Repository.DriverRepository;

@Service
public class DriverService {
  
    @Autowired
    DriverRepository driverRepo;

    // Scheduled task to update driver statuses daily at midnight
    @Scheduled(cron = "0 0 0 * * ?") 
    public void updateDriverStatuses() {
        LocalDate today = LocalDate.now();
        List<DriverEntity> driversOnLeave = driverRepo.findDriversOnLeave(today);

        for (DriverEntity driver : driversOnLeave) {
            if (driver.getLeaveEndDate() != null && driver.getLeaveEndDate().isBefore(today)) {
                driver.setStatus("Available");
                driver.setLeaveStartDate(null);
                driver.setLeaveEndDate(null);
                driverRepo.save(driver);
            }
        }
    }

    // Method to get all drivers
    public List<DriverEntity> drivers() {
        return driverRepo.findAll();
    }

    // Method to add or update a driver
    public DriverEntity post(DriverEntity post) {
        if (post.getStatus() == null || post.getStatus().isEmpty()) {
            post.setStatus("Available");
        }
        if (post.getLeaveStartDate() == null) {
            post.setLeaveStartDate(null);
        }
        if (post.getLeaveEndDate() == null) {
            post.setLeaveEndDate(null);
        }
        return driverRepo.save(post);
    }

    // Method to update a driver by ID
    public DriverEntity update(int id, DriverEntity newDriver) {
        try {
            DriverEntity driver = driverRepo.findById((long) id)
                .orElseThrow(() -> new NoSuchElementException("Driver with id " + id + " does not exist"));

            driver.setDriverName(newDriver.getDriverName());
            driver.setContactNumber(newDriver.getContactNumber());
            driver.setStatus(newDriver.getStatus());
            driver.setLeaveStartDate(newDriver.getLeaveStartDate());
            driver.setLeaveEndDate(newDriver.getLeaveEndDate());

            return driverRepo.save(driver);
        } catch (NoSuchElementException e) {
            throw e;
        }
    }

    // Method to delete a driver by ID
    public String delete(int id) {
        String msg = "";

        if (driverRepo.findById((long) id).isPresent()) {
            driverRepo.deleteById((long) id);
            msg = "Driver with id " + id + " is successfully deleted.";
        } else {
            msg = "Driver with id " + id + " does not exist.";
        }
        return msg;
    }
}
