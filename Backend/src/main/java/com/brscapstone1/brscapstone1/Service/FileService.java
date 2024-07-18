package com.brscapstone1.brscapstone1.Service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.brscapstone1.brscapstone1.Entity.FileEntity;
import com.brscapstone1.brscapstone1.Repository.FileRepository;

@Service
public class FileService {
    
    @Autowired
    private FileRepository fileRepository;

    public FileEntity storeFile(MultipartFile file) {      
      FileEntity fileEntity = new FileEntity();
      fileEntity.setFileName(file.getOriginalFilename());
      fileEntity.setFileType(file.getContentType());
      fileEntity.setFileSize(file.getSize());
      
      return fileRepository.save(fileEntity);
    }

    public List<FileEntity> files(){
      return fileRepository.findAll();
    }
}

