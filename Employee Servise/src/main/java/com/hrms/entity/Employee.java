/*
 * package com.hrms.entity;
 * 
 * import jakarta.persistence.*;
 * 
 * @Entity
 * 
 * @Table(name = "employees") public class Employee {
 * 
 * @Id
 * 
 * @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
 * 
 * private String empCode;
 * 
 * 
 * private String name; private String email; private String department; private
 * String designation; private Double salary;
 * 
 * @Column(name = "annual_package") private Double annualPackage;
 * 
 * public Employee() {}
 * 
 * public Employee(String empCode, String name, String email, String department,
 * String designation, Double salary,Double annualPackage) { this.empCode =
 * empCode; this.name = name; this.email = email; this.department = department;
 * this.designation = designation; this.salary = salary; this.annualPackage =
 * annualPackage; }
 * 
 * // Getters and Setters public Long getId() { return id; } public void
 * setId(Long id) { this.id = id; }
 * 
 * public String getEmpCode() { return empCode; } public void setEmpCode(String
 * empCode) { this.empCode = empCode; }
 * 
 * public String getName() { return name; } public void setName(String name) {
 * this.name = name; }
 * 
 * public String getEmail() { return email; } public void setEmail(String email)
 * { this.email = email; }
 * 
 * public String getDepartment() { return department; } public void
 * setDepartment(String department) { this.department = department; }
 * 
 * public String getDesignation() { return designation; } public void
 * setDesignation(String designation) { this.designation = designation; }
 * 
 * public Double getSalary() { return salary; } public void setSalary(Double
 * salary) { this.salary = salary; }
 * 
 * public Double getanualpackage() { return salary; } public void
 * setanualpackage(Double anualpackage) { this.annualPackage = anualpackage; } }
 
 */





package com.hrms.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String empCode;
    private String name;
    private String email;
    private String department;
    private String designation;

    private Double salary;

    @Column(name = "annual_package")
    private Double annualPackage;

    public Employee() {}

    public Employee(String empCode, String name, String email,
                    String department, String designation,
                    Double salary) {
        this.empCode = empCode;
        this.name = name;
        this.email = email;
        this.department = department;
        this.designation = designation;
        this.salary = salary;
    }
    
    @PrePersist
    @PreUpdate
    public void calculateAnnualPackage() {
        System.out.println("Salary: " + this.salary);

        if (this.salary != null) {
            this.annualPackage = this.salary * 12;
            System.out.println("Annual: " + this.annualPackage);
        }
    }

//    //  Automatic Calculation Before Save & Update
//    @PrePersist
//    @PreUpdate
//    public void calculateAnnualPackage() {
//        if (this.salary != null) {
//            this.annualPackage = this.salary * 12;
//        }
//    }

    // Getters & Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmpCode() { return empCode; }
    public void setEmpCode(String empCode) { this.empCode = empCode; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public Double getSalary() { return salary; }
    public void setSalary(Double salary) { this.salary = salary; }

    public Double getAnnualPackage() { return annualPackage; }
    public void setAnnualPackage(Double annualPackage) { this.annualPackage = annualPackage; }
}