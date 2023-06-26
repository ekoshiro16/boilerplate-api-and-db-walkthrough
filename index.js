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
const { fetchAllBooks, fetchBookById, createNewBook, deleteBookById, updateBookById } = require("./db/seed");



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
async function postNewBook(req, res, next) {
    try {
        console.log(req.body)
        const newBookImReading = await createNewBook(req.body)

        res.send(newBookImReading)
    } catch (error) {
        console.log(error);
    }
};
app.post("/books", postNewBook)

// Penultimate Step: 
const client = require("./db/index")
client.connect();

// Final Step: 
app.listen(3000, () => {
    console.log("We are now connected to port 3000.")
})