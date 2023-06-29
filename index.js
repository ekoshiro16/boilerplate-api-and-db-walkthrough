// JWT-EX-2-Pre-setup (Setup your dotenv config) 
require("dotenv").config(); 
// JWT-EX-2-Pre-setup-setup: (Setting up your jsonwebtoken library)
const jwt = require("jsonwebtoken");

// Step E1: 
const express = require("express");

// Step E2: 
const app = express(); 

// Two ways of writing middleware functions: 
// Option A:
function myFirstMiddleware(req, res, next) {
   console.log("We have received a request")
   console.log("Now we will respond")
   next(); 
}
app.use(myFirstMiddleware)

// Option B: 
// app.use((req, res, next) => {
//     console.log("We have received a request")
//     console.log("Now we will respond")
//     next(); 
// })

// Primer: This middleware converts all incoming request data to JSON format. 
// E3-a: 
app.use(express.json());

// async function checkIfTokenExists(req, res, next) {
//     try {
//         console.log(req.headers)

//         if (req.headers.Authorization.length) {
//             console.log("This user is legit. Let them through");
//         } else {
//             console.log("Go away McLovin");
//         }
//     } catch (error) {
//         console.log(error); 
//     }
// }
// app.use(checkIfTokenExists)

// Step 4: 
    // Remember: All actual API route handlers take in at least 2 arguments:
        // 1) the route path
        // 2) the callback function to be run when that path has been hit

// Part of Step 4 (imports)
const { 
    fetchAllBooks, 
    fetchBookById, 
    createNewBook, 
    deleteBookById, 
    updateBookById, 
    // JWT-EX-1: 
    createNewUser,
    fetchUserByUsername
} = require("./db/seed");

// E4:
// Delete a single book by id
async function deleteASingleBook(req, res) {
    try {
        console.log(req.params.id)
        const theDeletedData = await deleteBookById(Number(req.params.id))

        res.send(theDeletedData)
    } catch (error) {
        console.log(error); 
    }
}
app.delete("/books/:id", deleteASingleBook)

// Updating a single book by id
async function updateABook(req, res) {
    try {
        let theBookId = Number(req.params.id);
        let theActualUpdatedData = req.body;

        const newUpdatedBook = await updateBookById(theBookId, theActualUpdatedData)

        res.send(newUpdatedBook);
    } catch (error) {
        console.log(error); 
    }
}
app.put("/books/:id", updateABook)

// Get all books route handler code
async function getAllBooks(req, res, next) {
    try {
        const theActualBookData = await fetchAllBooks(); 

        if (theActualBookData.length) {
            res.send(theActualBookData)
        } else {
            res.send("No books available...")
        }
    } catch (error) {
        console.log(error); 
    }
}
app.get("/books", getAllBooks)

// E4:
// Get single book route handler code
async function getBookById(req, res, next) {
    try {
        console.log(req.params.id)

        const mySpecificBook = await fetchBookById(Number(req.params.id))

        res.send(mySpecificBook)
    } catch (error) {
        console.log(error); 
    }
}
app.get("/books/:id", getBookById)

// E4: 
// POST a new book

// JWT-EX-3: (Setting up your other route handlers to utilize the token header)
async function postNewBook(req, res) {
    try {
        // 3-i: Access the JWT header
        const myAuthToken = req.headers.authorization.slice(7);
        console.log("my actual token", myAuthToken)
        // 3-ii: Next, we have to use the jsonwebtoken library, and specifically, a method called .verify. This method decrypts a JWT using a valid secret stored in your .env file. 
            // Skeleton Syntax:
                // jwt.verify(JWT, SECRET)
            // Note: This method returns an object. It verifies whether the token is legit, and if so, that object will have a boolean truthiness of true. 
        const isThisTokenLegit = jwt.verify(myAuthToken, process.env.JWT_SECRET)
        console.log("This is my decrypted token:")
        console.log(isThisTokenLegit)
        // 3-iii: We will also have to fetch our user from the database using this info we're about to decrypt. 
        if (isThisTokenLegit) {
            // 3-iv: Check if the user exists in the database using the decrypted token's info
            const userFromDb = await fetchUserByUsername(isThisTokenLegit.username)

            // 3-v: If the user DOES exist, then go ahead and make a new book
            if (userFromDb) {
                const newBookImReading = await createNewBook(req.body)

                res.send(newBookImReading)
            } else {
                // If the user DOESN'T exist, then send back an appropriate error message. 
                res.send({error: true, message: "User does not exist in database. Please register for a new account or try again."})
            }
        } else {
            res.send({error: true, message: "Failed to decrypt token"})
        }
        // console.log(req.body)
       
    } catch (error) {
        console.log(error);
    }
};
app.post("/books", postNewBook)


// JWT-EX-2: 
async function registerNewUser(req, res) {
    try {
        // 2-i: First, we pull the new user data from the body of the request. 
        const newUserData = req.body
        const mySecret = process.env.JWT_SECRET; 
        console.log(req.body)

        // 2-ii: Next, we want to take our user data from the req.body and encrypt it using the jsonwebtoken library.
            // On the jsonwebtoken library, there is a method called .sign. This method allows you to take a secret and some sensitive data and turn it into a JWT. 
            // Skeleton Syntax for jwt.sign() method: (There are 2 arguments this method needs)
                // jwt.sign(sensitiveData, yourENVSecret)
                // Note: There is an optional 3rd argument which will be a config object. One of the things you can do inside of a config object is setup an expiry date. 
        const newJWTToken = await jwt.sign(req.body, process.env.JWT_SECRET, {
            expiresIn: "1w"
        })

        // 2-iii: We now need to check if the token was actually created. If it WAS created, then...
        if (newJWTToken) {
            // 2-iv: Next, use your DB function to create a new user in the database
            const newUserForDb = await createNewUser(req.body);

            // 2-v: Then we ask ourselves: Was the user successfully created? If so...
            if (newUserForDb) {
                res.send({userData: newUserForDb, token: newJWTToken}).status(200)
            } else {
                // And if the new user was NOT successfully created...
                res.send({error: true, message: "Failed to create user"}).status(403)
            }
        } else {
            // And lastly, if the token wasn't created successfully in the first place...
            res.send({error: true, message: "Failed to create valid auth token"})
        }
    } catch (error) {
        console.log(error); 
    }
}

app.post("/api/users/register", registerNewUser)

// Penultimate Step: 
const client = require("./db/index")
client.connect();

// Final Step: 
app.listen(3000, () => {
    console.log("We are now connected to port 3000.")
})