# How to set up your API server to create JSON Web Tokens to send to your clients?

## Steps Below:

### Setup Steps:
1. We have to install some new dependency libraries. Those are:
    - jsonwebtoken
    - dotenv
        - This library will allow us to store the encryption secret that will allow us to decrypt encrypted tokens. 
        - Specifically, we will be storing this encryption secret in a file called .env
            - .env file stands for an "environment file". 
            - An .env file is often used for storing sensitive data that you don't want released to the general public. 
            - Note: Most developers will store the .env file in the .gitignore file
            - Note 2: Make sure you create your .gitignore file in the root of your repo. 
2. Next, we want to store a secret "text" that will serve as a decryption cipher for our JWTs. 
    - Please see .env file

### Let's go set up some DB functions that will allow us to create new users.
Legend: These steps will be prefaced with JWT-DB prefix. 
1. Make sure your db has a users table. 
    - See db/seed.js file for the "createNewTables" and "dropTables" functions
2. Make sure you have some functions that allow you do different things (i.e. CRUD operations) to your users table. 
    - See db/seed.js 
    - I personally recommend for the bare minimum to get going is you should have 2 functions for this JWT stuff: 
        - createNewUser
        - fetchUserByUsername

### We also have to setup our Express server to handle routes to register / login our users. 
Legend: These steps will be prefixed with JWT-EX prefix. 
Pre-setup: We need to invoke the dotenv library as a function. 
    - Note: In order to console.log and see stuff inside of your .env file, you have to preface your console logs with process.env
Pre-setup-setup: We also have to import the jsonwebtoken library for us to encrypt our sensitive data and create our actual tokens. 
1. We need to import the DB functions that we created in the previous section to our root/index.js file. 
2. Now, we want to make some route handlers for our users to register / login. 
    - The Register and Login route handlers are virtually identical.
3. We also want to make sure that our other route handlers that are restricted operations (i.e. PUT, POST, DELETE reqs, etc.) are actually using a valid token in order to run. 
