package com.brscapstone1.brscapstone1.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.brscapstone1.brscapstone1.Constants;
import com.brscapstone1.brscapstone1.Entity.FileEntity;
import com.brscapstone1.brscapstone1.Service.FileService;

@RestController
@CrossOrigin
@RequestMapping(Constants.ApiRoutes.FILE_BASE)
public class FileController {

    @Autowired
    private FileService fileService;

    @PostMapping(Constants.ApiRoutes.FILE_POST)
    public FileEntity uploadFile(@RequestParam(Constants.Annotation.FILE) MultipartFile file) {
        return fileService.storeFile(file);
    }

    @GetMapping(Constants.ApiRoutes.FILE_GET)
    public List<FileEntity> files(){
        return fileService.files();
    }
}