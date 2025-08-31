# PANTOhealth Backend Developer Technical Assessment
This project is a solution to the **PANTOhealth** technical assessment. 
It is composed of two NestJS applications:
- **panto-health-backend**: The main backend application that serves as a RabbitMQ consumer, processes x-ray data, stores it in MongoDB, and exposes a RESTFULL API.
- **panto-health-producer**: A simple producer application that simulates an IoT device sending x-ray data to the RabbitMQ queue.

## Part 1: RabbitMQ Consumer and Module
- _panto-health-backend_ is a NestJS application configured as a hybrid application, listening for both HTTP requests (for the API) and microservice events (from RabbitMQ).
- The _XRayModule_ contains the _XRayService_ which is decorated as a MessagePattern consumer, listening on the x-ray-data queue.
- It uses @nestjs/microservices and @nestjs/mongoose for integration.

## Part 2: Data Processing and Collections
- A Mongoose schema (xray.schema.ts) is defined to model the x-ray data with fields like deviceId, time, dataLength, and dataVolume.
- The XRayService implements the processing logic to parse the incoming data and save it to the signals collection in the MongoDB database.

## Part 3: API Development
- The XRayController exposes a RESTFULL API for CRUD operations on the signals collection.
- It includes a GET /signals/filter endpoint that allows filtering by deviceId and a time range.

## Part 4: Producer Application
- A separate NestJS application, panto-health-producer, is created to simulate the IoT device.
- It contains a simple ProducerService that injects a ClientProxy to connect to RabbitMQ and sends the provided sample data to the x-ray-data queue.

# Project Setup
## Prerequisites
- Docker: Version 20.10 or later.
- Docker Compose: Version 1.29 or later.

## Setup and Running
### Clone the repository:
- `git clone git@github.com:hefazi/PANTOhealth.git
`
- `cd PANTOhealth
`
- Each service uses a **.env.docker** file for environment-specific variables. Sample files, such as .**_env.docker.example_**, are often provided. You must copy the example files to **.env.docker** and then configure them with your specific settings.
For example, for the backend service: `cp ./panto-health-backend/.env.docker.example ./panto-health-backend/.env.docker`
- The **MongoDB** and **RabbitMQ** services also use environment variables, which can be configured directly in the _docker-compose.yml_ file or by creating a **.env** file in the root directory.

### Run the services:
- Start all the services in detached mode (in the background) with the following command:
  `docker compose up -d`
 This command will build the necessary Docker images, create the network and volumes, and start all the containers.
- http://localhost:8000/backend/api/docs
- http://localhost:8000/producer/api/docs

## Services
The system is composed of the following services:

#### backend-service
The primary backend service.
- **Port**: Exposes port 9001.
- **Health Check**: A curl command checks the _/api/health_ endpoint on port **9001**. The health check retries 3 times over a long interval of 1 hour, indicating a system that is not expected to be checked frequently for status.

#### producer-service
A service responsible for producing messages, likely for RabbitMQ.
- Port: Exposes port 9002.
- Health Check: Similar to the backend service, it checks its /api/health endpoint but with only 1 retry.

#### kong
An API gateway that manages and routes traffic to the microservices.
- Ports: Exposes multiple ports for various functions: 8000 (HTTP), 8443 (HTTPS), 8001 (Admin API), 8002 (gRPC), and 8444 (gRPCs).
- Health Check: A built-in Kong health check command is used to ensure the gateway is operational.

#### rabbitmq
A message broker used for communication between services.
- Ports: Exposes 5672 (AMQP) and 15672 (Management UI).
- Default Credentials: The default user is admin and the password is master123 unless overridden by environment variables.
- Management UI: You can access the RabbitMQ Management UI by navigating to http://localhost:15672 in your browser.
- Data Persistence: Uses a Docker volume named rabbit_data to persist message data.

#### mongodb
The database for the system.
- Ports: Exposes 27017 (database) and 28017 (admin/monitoring).
- Default Credentials: The default user is admin and the password is master123 unless overridden by environment variables.
- Health Check: A mongosh command performs a database ping to verify its availability.
- Data Persistence: Uses a Docker volume named mongo_data to persist database files.

The producer will send the data, and the backend consumer will process and save it to the MongoDB database. You can then use tools like Postman to test the backend API endpoints.