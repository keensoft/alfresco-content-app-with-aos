# Summary
This project ilustrates how the ADF based alfresco-content-app application can be extended with new functionalities. In this case will be added the function to edit Microsfot Office documents using AOS (Alfresco Office Services).

# Requisites
To run this project there is the need to have

**[Docker](https://docs.docker.com/engine/installation/)**
Version >= 17.12.0-ce, build c97c6d6

**[Docker-Compose](https://docs.docker.com/engine/installation/)**
Version >= 1.18.0, build 8dd22a9

**NodeJs & NPM**
Check the versions ADF need to run in their [page of requisites](https://github.com/Alfresco/alfresco-ng2-components/blob/master/PREREQUISITES.md)

# Deployment
The project is divided in two parts. The alfresco-content-app where is the code of the application with the new module installed, [ng2-alfresco-aos-editonline](https://www.npmjs.com/package/ng2-alfresco-aos-editonline). The second part is a docker-container where it can be tested the application.

1) Go to alfresco-content-app
cd  alfresco-content-app

2) Build the application using npm
npm run build

3) Go back to the main directory
cd ..

4) Start docker-compoose (it can take some minutes in the first run to start)
docker-compose up --build

5) Install the certificated inside the folder ssl

6) Configure hosts to an ip address correspond ```acs.example.com``` and ```app.example.com```

7) Access to [https://acs.example.com](https://acs.example.com) and accept the exception

8) Access to [http://app.example.com:3000](https://acs.example.com) to use the alfresco-content-app