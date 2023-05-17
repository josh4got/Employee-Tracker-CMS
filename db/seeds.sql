-- Insert department
INSERT INTO departments (department_name) 
VALUES ('Accounting');

-- Insert role
INSERT INTO roles (job_title, department_id, salary) 
VALUES ('Vice President', 1, 80000.00);

-- Insert employee
INSERT INTO employees (first_name, last_name, title, department, salary, manager_id) 
VALUES ('John', 'Doe', 'Vice President', 'Accounting', 80000.00, NULL);
