# Trucking App

## Table of Contents

- [Project Description](#project-description)
- [Technologies Used](#technologies-used)
- [How to install or run the project](#how-to-run-project)
- [How to use the projcet](#how-to-use-product)
- [Contact Information](#contact-information)

## <a id="project-description">Project Description</a>

Trucking App is an application born out of my prior experience in the aggregate logistic industry. Recognizing the challenges posed by fragmented systems and delayed payments, I set out to create an infrastructure that offers a transparent, efficient, and accurate invoicing system for companies in this sector.

To achieve this, I developed a TypeScript React Native client and a Python Flask API with a relational SQL database. The decision to use TypeScript for the front end was driven by its strong typing system, which reduces bugs and enhances code readability. Additionally, I opted for Flask as the API framework, seeking a fresh challenge and a departure from JavaScript. Given the complex data structure and the need for sophisticated queries to generate statistics, a relational database was chosen as the backbone.

To expedite development and focus on speed, I leveraged SQLAlchemy's ORM (Object-Relational Mapping). This allowed me to streamline database operations and optimize the overall development process.

The project is organized into two main folders. The "trucking-app-client" houses the client-side application, built using TypeScript and React Native Expo. Detailed instructions for running the client can be found below. On the other hand, the "trucking-app-server" directory contains the Flask API. Within this folder, you will find the main application code as well as a dedicated "tests" folder. The API is thoroughly tested using pytest, with 110 tests currently in place, ensuring a stable and consistent experience.

Through the Trucking App, my goal is to streamline the invoicing process and eliminate the headaches that have plagued this industry. By providing a unified platform accessible to all stakeholders, including dispatchers, operators, and contractors, we aim to remove bottlenecks and disruptions, leading to faster and more efficient payments.

## <a id="technologies-used">Technologies Used</a>

#### Languages

- Typescript
- Python
- SQL

#### Frameworks

- Flask
- React
- SQL Alchemy

## <a id="how-to-run-project">How to install or run the project</a>

### Prerequisites:

To get started with the project, make sure you have the following:

- Git and GitHub account
- Python installed
- Pip installed
- Npx installed
- Expo installed

### Cloning the repository:

- Open Command Prompt
- `cd` into the folder you want the repository stored in
- Type: `git clone https://github.com/Rshokar/trucking-app`

### Running the project:

#### 1.Running API Test

1. Open Command Prompt
2. Type: `cd trucking-app`
3. Type: `cd trucking-app-flask`
4. Type: `.venv\Scripts\activate`
5. (.venv) should appear on the left side command line line.
6. Type: `pip install -r requirements.txt`
7. packages should be installed
8. Type: `cd tests`
9. Type: `pytest`

#### 2.Running The API

1. Open Command Prompt
2. `cd` into the folder where the code is stored
3. Type: `cd trucking-app-flask`
4. Type: `.venv\Scripts\activate`
5. (.venv) should appear on the left side command line line.
6. Type: `pip install -r requirements.txt`
7. packages should be installed
8. Type: `python -m flask run`

#### 3.Running The Client

1. Open Command Prompt
2. `cd` into the folder where the code is stored
3. Type: `cd trucking-app-client`
4. Type: `npx expo install`
5. Type: `npx expo start`
   <br>

## <a id="how-to-use-product">How to use the product (Features)</a>

### Features

#### API (TO-DO)

#### Client (TO-DO)

## <a id="contact-information">Contact Information</a>

### Ravinder Shokar

- ravindershokar@gmail.com
- https://www.linkedin.com/in/rshokar/
