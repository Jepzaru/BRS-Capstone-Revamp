package com.brscapstone1.brscapstone1.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class UserEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	private String email;
	private String password;
	private String department;
	private String role;
	private String imageFormat;
	private byte[] profilePic;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getRole() {
		return role;
	}
	public String getDepartment(){
		return department;
	}
	public void setDepartment(String department){
		this.department = department;
	}
	public void setRole(String role) {
		this.role = role;
	}	

	public String getImageFormat(){
		return imageFormat;
	}

	public void setImageFormat(String imageFormat){
		this.imageFormat = imageFormat;
	}

	public byte[] getProfilePic() {

		return profilePic;
	}

	public void setProfilePic(byte[] profilePic){
		this.profilePic = profilePic;
	}

	public UserEntity(String email, String password, String department, String role) {
		super();
		this.email = email;
		this.password = password;
		this.department = department;
		this.role = role;
	}
	public UserEntity() {
		super();
	}
}
