FROM maven:3.9-eclipse-temurin-21

WORKDIR /app

# Copy the entire repo
COPY . .

# Build the backend
WORKDIR /app/backend
RUN mvn clean package -DskipTests

# Expose port (Spring Boot default)
EXPOSE 8080

# Run the JAR
CMD ["java", "-jar", "target/backend-0.0.1-SNAPSHOT.jar"]
