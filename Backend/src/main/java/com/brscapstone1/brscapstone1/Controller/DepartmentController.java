package com.brscapstone1.brscapstone1.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.brscapstone1.brscapstone1.Entity.DepartmentEntity;
import com.brscapstone1.brscapstone1.Service.DepartmentService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@CrossOrigin
@RequestMapping("/department")
public class DepartmentController {
  
  @Autowired
  DepartmentService departmentService;

  @PostMapping("/post")
  public DepartmentEntity post(@RequestBody DepartmentEntity post){
    return departmentService.post(post);
  }

  @GetMapping("/getAll")
  public List<DepartmentEntity> departments(){
    return departmentService.departments();
  }

  @DeleteMapping("/delete/{id}")
  public String delete(@PathVariable int id){
    return departmentService.delete(id);
  }
  
  @PutMapping("/update/{id}")
  public DepartmentEntity update(@PathVariable int id, @RequestBody DepartmentEntity newDepartment){
    return departmentService.update(id, newDepartment);
  }
}
