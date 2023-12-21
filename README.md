# Opensummaries
Project created by Daniele Biagio De Luca, Alessandro di Stefano, Leonardo Pulzone

## Overview
Opensummaries is an evolving initiative born from the "Progetto TecnologieWeb" of the web technologies course at the University of Naples, designed to facilitate the sharing of educational resources, specifically lecture and university notes. Currently, it focuses on the computer science courses at the Parhenope University of Naples, but it has been architecturally conceived for scalability. This foresight allows for potential expansion to include a broader range of courses and subjects. The project is currently in its beta phase, addressing challenges related to timing and delivery. Its adaptable framework also positions it as a prototype for other universities interested in establishing a similar system for exchanging academic notes.

## Features (Beta)
### Login System: 
Implemented using the login APIs of the University of Naples, ensuring access is exclusive to students of Parthenope University.
### Upload Functionality: 
Allows users to upload their own notes.
### Download Capability:
Enables users to download files shared by other students.
### Document Authentication: 
Each uploaded document is signed to authenticate the lecture notes or summaries.

## Used technologies
Front-end development has been made with HTML, CSS (for the web pages), and Javascript all this with Bootstrap libraries. 
Mongodb has been used to store pieces of data such as the name of the uploaded summary, its author and the file name.
NodeJS has been used for the back-end development, with auxiliary frameworks and middlewares:
	- Express: for server creation and setting;
	- Express-session: for session persistance;
	- Express-fileupload: for file uploading;
	- Pdf-lib: some methods have been used to sign digitally the documents;
	- node-notifier;
	- mongodb: for mongodb connection and data extraction;

 #### UniparthenopeApp/v1/login API: 
 For secure user authentication, our project leverages the "UniparthenopeApp/v1/login" API. This proprietary, closed-source API developed by the university is integral for managing user access and ensuring data security.

## Getting Started
### Prerequisites
#### Node.js (v18 or above):
Necessary for running the back-end. Install via snap or Node.js official website.
#### Express-session: 
For session persistence.
#### Express-fileupload: 
For handling file uploads.
#### Pdf-lib: 
For PDF manipulation and digital signatures.
#### node-notifier: 
For desktop notifications.
#### Mongodb package: 
For MongoDB connections.


### Installation(for linux users)
1. Clone the repo
   ```sh
   git clone https://github.com/Danieleb01/Opensummaries.git
2. Navigate to the cloned directory: 
   ```sh
	cd Opensummaries
3. Install Node.js(We advise those with less technical experience to install NodeJS via Snap. As of December 21, 2023, Snap consistently offers the most up-to-date versions of NodeJS. Its ease of use in switching between versions is a significant advantage in cases of incompatibility, a feature that distinguishes it from other package managers like apt. However, it's worth noting that NodeJS can also be installed from its official website for those who prefer that method.)

   ```sh
   sudo snap install node --classic --channel=18
(if don't work download the 21 version)

   	sudo snap install node --classic --channel=21
4. Install all required NPM packages:
```sh
npm install express
npm install express-session
npm install express-fileupload
npm install pdf-lib
npm install node-notifier
npm install mongodb
```
Each command should be run in the terminal within your project's root directory. This will ensure that each package is correctly installed in your project's node_modules folder and listed as a dependency in your package.json file.

## Run 
#### Start the server by running index.js:
```sh
node index.js
```
#### open your favorite browser and paste this url, Enjoy!:

```sh
localhost:3000/login
