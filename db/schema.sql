DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;
-- Create tables
CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  title VARCHAR(60),
  department VARCHAR(60),
    salary INT NOT NULL
);

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    deparment_name TEXT NOT NULL,
    FOREIGN KEY (department_id)
    REFERENCES employee(id)
    ON DELETE SET NULL
);

CREATE TABLE Roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    job title TEXT NOT NULL,
    department TEXT NOT NULL,
    salary INT NOT NULL,
    FOREIGN KEY (role_id)
    REFERENCES employees(id)
    ON DELETE SET NULL
);