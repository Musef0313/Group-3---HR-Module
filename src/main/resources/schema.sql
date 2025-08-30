CREATE TABLE IF NOT EXISTS employees (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  emp_code VARCHAR(50),
  name VARCHAR(100),
  email VARCHAR(100),
  department VARCHAR(100),
  designation VARCHAR(100),
  salary DOUBLE
);
