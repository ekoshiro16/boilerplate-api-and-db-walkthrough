# Building a Database and API server

## Database Steps:

### Database Setup Steps:
Pre-Step: Don't forget to use the psql terminal to create your db. 
1. npm init -y
2. npm install pg
3. I need to create a .gitignore file to prevent unnecessary things from getting uploaded to Github
4. Create some file infrastructure
    - a. Need a db folder
    - b. Inside the db folder, let's create an index.js file. 
        - Explanation: This index.js file is where we will be writing the code to interact with our postgresql database
    - c. We will also want a seed.js file. 
        - Explanation: A seed.js file will run code to build a database and all of its content on an external hosting website. 

### Building our initial database connection
Legend: All these steps will be prefaced with a DB in the file itself. 
1. We have to import the pg dependency into the index.js file. 
2. Next, we have to establish a direct line / connection to the specific database we created. 
    - Skeleton Syntax: postgres://localhost:5432/yourDbName
3. We need to export our client connection so we can use that client connection in whatever file we want. 

### Building a seed.js file 
Legend: All these steps will be prefaced with a S in the seed.js file itself. 
1. We have to first import our client connection
2. We will now start writing some functions to flesh out our database itself.   
    - a. First, it's good to build an async function that builds our database tables (i.e. a createTables type of function)
        - Tip: A SERIAL data type is an integer that increments by 1 for each new data entry. 
    - b. If we ever want to reset our database to its default, OR the hosting server crashes, then we want a function that can clear out the old database so that we can then rebuild it. 
        - I.e. usually called a dropTables or destroyTables type of function
3. Next, it's good to have a function that will let you create new data. 
4. We will also be writing a function that will allow us to fetch all of the books data. 
5. We also want a function that can fetch a specific book by its id value (or title, or whatever we want)
Final Step: Write one "main" function that will execute all of your db building functions in the correct order. 
    - In general, the formatting for this type of main function will look like this:
        - 1. Clear out all the table first
        - 2. Build the tables next
Final final step: Don't forget to invoke your main function!

## API Server Steps: 

### General Express API Server setup steps
1. Create some more project infrastructure for the API portion
    - a. Installing express
    - b. Create a folder called api and we will also create some files inside of it:
        - api/index.js
        - index.js 
2. In your package.json, you want to add a new script (in general I like to call it "dev"), and we will set the value of it to using nodemon to run our root index.js file. 

### Setting up our root index.js file
Context: Our root index.js file is where we will predominantly write all the main setup code for our Express API server. 
Legend: All steps will be labeled with an E (Express)
1. Import the express library. 
2. We have a new Express server instance. 
3. Setup all of the essential middleware need: 
    - a. You must set up your express.json middleware
4. Now let's start writing some route handlers. 
    - Remember that many of these route handlers will be using DB functions that you've already written in the above steps and you'll be using those functions directly inside of your route handler's callback functions. 
Final Step: We have to make sure our API Express server is directly connected and "listening" to a sertain port 


#### Glossary
- Middleware: These are functions that are being run AFTER the request has been sent, but BEFORE the request has been responded to. 
- app.use in express: This is a generic verb method that will work for ALL verb methods (i.e. GET, POST, PUT, DELETEE)