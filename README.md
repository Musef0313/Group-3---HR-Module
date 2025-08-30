Employee Service - Ready to run (Spring Boot, H2)

How to run:
1. Ensure Java 17+ and Maven installed.
2. From the project root run:
   mvn spring-boot:run
   or build: mvn clean package && java -jar target/employee-service-0.0.1-SNAPSHOT.jar
3. API base: http://localhost:8080/api/employees
4. H2 Console: http://localhost:8080/h2-console (JDBC URL: jdbc:h2:mem:hrdb, user: sa, no password)

Included endpoints:
- POST /api/employees       -> create employee
- GET  /api/employees       -> list employees
- GET  /api/employees/{id}  -> get employee by id
- PUT  /api/employees/{id}  -> update
- DELETE /api/employees/{id} -> delete

Notes:
- Uses in-memory H2 DB with sample data (data.sql).
- Replace H2 config in application.properties to use MySQL in production.