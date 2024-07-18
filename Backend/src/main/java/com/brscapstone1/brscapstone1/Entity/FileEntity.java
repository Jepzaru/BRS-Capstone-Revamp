package com.brscapstone1.brscapstone1.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class FileEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String fileName;
  private String fileType;
  private long fileSize;
  
  public Long getId() {
    return id;
  }
  public void setId(Long id) {
    this.id = id;
  }
  public String getFileName() {
    return fileName;
  }
  public void setFileName(String fileName) {
    this.fileName = fileName;
  }
  public String getFileType() {
    return fileType;
  }
  public void setFileType(String fileType) {
    this.fileType = fileType;
  }
  public long getFileSize() {
    return fileSize;
  }
  public void setFileSize(long fileSize) {
    this.fileSize = fileSize;
  }
  public FileEntity(String fileName, String fileType, long fileSize) {
    this.fileName = fileName;
    this.fileType = fileType;
    this.fileSize = fileSize;
  }
  public FileEntity() {
    super();
  }
}
