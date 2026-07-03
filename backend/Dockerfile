FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY common/pom.xml common/
COPY auth/pom.xml auth/
COPY provider/pom.xml provider/
COPY api/pom.xml api/
RUN mvn dependency:go-offline -B
COPY . .
RUN mvn package -pl api -am -DskipTests -B

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN addgroup -S taaru && adduser -S taaru -G taaru
COPY --from=build /app/api/target/api-*.jar app.jar
USER taaru
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
