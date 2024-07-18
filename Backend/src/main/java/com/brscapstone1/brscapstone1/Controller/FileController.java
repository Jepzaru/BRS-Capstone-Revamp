package com.brscapstone1.brscapstone1.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.brscapstone1.brscapstone1.Entity.FileEntity;
import com.brscapstone1.brscapstone1.Service.FileService;

@RestController
@CrossOrigin
@RequestMapping("/file")
public class FileController {

    @Autowired
    private FileService fileService;

    @PostMapping("/add")
    public FileEntity uploadFile(@RequestParam("file") MultipartFile file) {
        return fileService.storeFile(file);
    }

    @GetMapping("/all-files")
    public List<FileEntity> files(){
        return fileService.files();
    }
}


