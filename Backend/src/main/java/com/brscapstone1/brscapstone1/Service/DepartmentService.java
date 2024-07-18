package com.brscapstone1.brscapstone1.Service;

import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.brscapstone1.brscapstone1.Entity.DepartmentEntity;
import com.brscapstone1.brscapstone1.Repository.DepartmentRepository;

@Service
public class DepartmentService {
  
  @Autowired
  DepartmentRepository departmentRepository;

  public DepartmentEntity post(DepartmentEntity post){
    return departmentRepository.save(post);
  }
  
  public List<DepartmentEntity> departments(){
    return departmentRepository.findAll();
  }

  public String delete(int id){
    String msg = "";

    if(departmentRepository.findById(id).isPresent()){
      departmentRepository.deleteById(id);
      msg = "Department with id " +id+ " is successfully deleted";
    }else{
      msg = "Department with id " +id+ " does not exist.";
    }
    return msg;
  }

  public DepartmentEntity update(int id, DepartmentEntity newDepartment){
      DepartmentEntity department;

      try {
          department = departmentRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Department with id " + id + " does not exist"));
          department.setName(newDepartment.getName());
          return departmentRepository.save(department);
      } catch (NoSuchElementException e) {
          throw e;
      }
  }
}
