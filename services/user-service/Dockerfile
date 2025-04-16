# Sử dụng base image với JDK 21
FROM eclipse-temurin:21-jdk AS build

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy file cấu hình và mã nguồn
COPY pom.xml .
COPY src ./src

# Build ứng dụng bằng Maven
RUN ./mvnw clean package -DskipTests

# Tạo image chạy ứng dụng
FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app
COPY --from=build /app/target/user-service-0.0.1-SNAPSHOT.jar user-service.jar

# Chạy ứng dụng
ENTRYPOINT ["java", "-jar", "/app/user-service.jar"]