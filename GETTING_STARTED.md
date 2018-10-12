### Setting up the environment

1. Install Node.js from https://nodejs.org  
    - npm is our package manager
        - npm comes bundled with Node.js
        - To install a package, run:  
        `npm install --save <package_name> `
    - To make sure the installation was successful, run  
    `node --version && npm --version`  
    
2. Install Firebase CLI Tool:  
`npm install -g firebase-tools`
    - Deploy website with firebase (make sure to be in project directory):  
    `firebase deploy --only hosting`
    - Deploy API's / Functions with firebase (make sure to be in project directory):  
    `firebase deploy --only functions`  
3. Code editor is your choice but make sure to add an exception in relevant `.gitignore` so your editor choices don't affect others.
4. Install dependencies - website and functions have different dependencies, install them with the following commands (make sure to be in the project directory)  
```shell
$ cd website
$ npm install
$ cd ../functions
$ npm install
```
5. Get to work!

----

### Other Details
#### Functions:  
`functions` folder contains the API / Functions source code. All functions must go in `functions/index.js`. Documentation for how the functions should be written can be found at [Firebase Cloud Functions](https://firebase.google.com/docs/functions/).
#### Firestore:
To understand the data structure how to interact with the database read the documentation for [Firebase Cloud Firestore](https://firebase.google.com/docs/firestore/quickstart). Firestore uses a system of _collections_ and _documents_ - read more in the provided documentation.
#### Authentication:
Authentication is handled by Firebase also, for this project we are using the [Password Auth](https://firebase.google.com/docs/auth/web/password-auth) provided by Firebase. See the [documentation](https://firebase.google.com/docs/auth/web/password-auth) for usage - creating and signing in users can be handled on front-end with ReactJS + Firebase. Proper customization is needed to make this PWA compliant.