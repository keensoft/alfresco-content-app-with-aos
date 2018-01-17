# Adding a new feature to Alfresco Content Application (ACA)

## Description

This project was developed during the [Alfresco Hackathon 2018](https://community.alfresco.com/docs/DOC-7234-projects-and-teams-hack-a-thon-at-devcon-2018) during the [Alfresco DevCon 2018](https://devcon.alfresco.com/) on Lisbon.

The project makes use of the [Alfresco Content Application (ACA)](https://github.com/Alfresco/alfresco-content-app) project to create a **ready to test** docker project that runs Alfresco 201707GA along with the the ADF application enhanced with the "Edit On Ms Office" action.

### Starting point

Recently Alfresco released the first draft for [Alfresco Content Application (ACA)](https://github.com/Alfresco/alfresco-content-app), the new UI app based on [Alfresco Development Framework (ADF)](https://community.alfresco.com/community/application-development-framework). As we developed an NG2 component for ADF some months ago [(ng2-alfresco-aos-online)](https://github.com/keensoft/ng2-alfresco-aos-editonline), it's time to experiment how to add new features to Alfresco Content Application by enhancing the app with an "Edit on MS Office" action. Likely a short tutorial on adding features to ACA and a working sample will be produced.

### tasks done

* Update the old [ng2-alfresco-aos-editonline](https://www.npmjs.com/package/ng2-alfresco-aos-editonline) npm module to version 0.1.6 supporting ADF 1.9.0
* Create a new [adf-aos-editonline-action](https://www.npmjs.com/package/adf-aos-editonline-action) npm module starting on version 2.0.0 to support ADF 2.0.0 onwards.
* Create a new docker project based on [alfresco-docker-template](https://github.com/keensoft/alfresco-docker-template) to create the following stack
  * alfresco repo 201707GA
  * share 201707GA
  * nginx (serving alfresco-content-app)
  * solr6
  * postgres 9.4
  * libreoffice 5.2
* Import the **adf-aos-editonline-action** module to the alfresco-content-app application
* Configure the **FileComponent** to use the module and add the "Edit on Ms Office" action

## Requisites

**[Docker](https://docs.docker.com/engine/installation/)**
Version >= 17.12.0-ce, build c97c6d6

**[Docker-Compose](https://docs.docker.com/engine/installation/)**
Version >= 1.18.0, build 8dd22a9

In order to change and rebuild the application, you will need to meet [ADF requisites](https://github.com/Alfresco/alfresco-ng2-components/blob/master/PREREQUISITES.md) 

## Run

1. build alfresco-content-app

```bash
$ cd alfresco-content-app
$ npm run build
```

2. Start the project (it can take some minutes in the first run to start)

```bash
$ cd ..
$ docker-compose up --build
```

3. Install the self signed CA Certificate used to sign the ssl certificate present on `https://acs.example.com` (alfresco repo proxy reverse) service, the CA certificate can be found in the `ssl` folder on the root of the project

Alfresco is served by a proxy reverse with SSL on front to meet [AOS requirements](https://docs.alfresco.com/aos/concepts/aos-prereqs.html)

```bash
$ openssl ssl/CA.pem
```

Follow normal steps to import a trusted CA on your system/browser accessing the application.

4. Configure the /etc/hosts file to map the IP address running the project with the hostnames ```acs.example.com``` and ```app.example.com``` used by this docker project.

```bash
127.0.1.4	app.example.com acs.example.com
```

5. Access ADF 2.0.0 alfresco-content-app with "Edit on Ms Office" action

```bash
 => [http://app.example.com:3000](http://app.example.com:3000)

admin / admin
```
