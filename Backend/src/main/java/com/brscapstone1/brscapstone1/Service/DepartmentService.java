package com.brscapstone1.brscapstone1.Service;

import java.text.MessageFormat;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.brscapstone1.brscapstone1.Constants;
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
      msg = (MessageFormat.format(Constants.ResponseMessages.DEPARTMENT_DELETE_SUCCESS, id));
    }else{
      msg = (MessageFormat.format(Constants.ResponseMessages.DEPARTMENT_DELETE_FAILED, id));
    }
    return msg;
  }

  public DepartmentEntity update(int id, DepartmentEntity newDepartment){
      DepartmentEntity department;

      try {
          department = departmentRepository.findById(id).orElseThrow(() -> new NoSuchElementException(MessageFormat.format(Constants.ExceptionMessage.NO_ELEMENT_DEPARTMENT, id)));
          department.setName(newDepartment.getName());
          return departmentRepository.save(department);
      } catch (NoSuchElementException e) {
          throw e;
      }
  }
}
