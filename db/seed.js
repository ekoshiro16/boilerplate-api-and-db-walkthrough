// S1: 
const client = require("./index");

// S2: 
    // S2-a: 
async function createTables() {
    try {
        await client.query(`
            CREATE TABLE books(
                "bookId" SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                author VARCHAR(255) DEFAULT 'unknown',
                description TEXT DEFAULT 'no description'
            );

            CREATE TABLE users(
                "userId" SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            );
        `)

        // Note: If you want to make multiple tables, you can do it all in the same function as long as you use await client.query
    } catch (error) {
        console.log(error); 
    }
}


// Step S2-b: 
async function destroyTables() {
    try {
        await client.query(`
            DROP TABLE IF EXISTS books; 
            DROP TABLE IF EXISTS users; 
        `)

        // You can also drop multiple tables in the same function
    } catch (error) {
        console.log(error); 
    }
}

// const newBook = {
//     title: "Green Eggs and Ham",
//     author: "Dr. Seuss",
//     description: "Fun kids book"
// }

// createNewBook(newBook)

// S3: 
async function createNewBook(newBookObj) {
    try {
        const { rows } = await client.query(`
            INSERT INTO books(title, author, description)
            VALUES ($1, $2, $3)
            RETURNING *;
        `, [newBookObj.title, newBookObj.author, newBookObj.description]);

        return rows[0];
    } catch (error) {
        console.log(error);
    }
}

// S4:
async function fetchAllBooks() {
    try {
        const { rows } = await client.query(`
            SELECT * FROM books; 
        `);

        return rows; 
    } catch (error) {
        console.log(error);
    }
}

// S5: 
async function fetchBookById(idValue) {
    try {
        // const { rows } = await client.query(`
        //     SELECT * FROM books
        //     WHERE "bookId" = $1;
        // `, [idValue])

        const { rows } = await client.query(`
            SELECT * FROM books
            WHERE "bookId" = ${idValue};
        `)

        return rows[0];
    } catch (error) {
        console.log(error); 
    }
}
// EXACT SAME AS THE FUNCTION BELOW, EXCEPT WITHOUT OBJ DESTRUCTURING IN THE PARAMETER:
// async function updateBookById(bookId, updatedBookObjData) {
//     try {
//         const { rows } = await client.query(`
//             UPDATE books
//             SET title = $1, author = $2, description = $3
//             WHERE "bookId" = $4
//             RETURNING *;
//         `, [updatedBookObjData.title, updatedBookObjData.author, updatedBookObjData.description, bookId])
//     } catch (error) {
//         console.log(error); 
//     }
// }

async function updateBookById(bookId, {title, author, description}) {
    try {
        const { rows } = await client.query(`
            UPDATE books
            SET title = $1, author = $2, description = $3
            WHERE "bookId" = $4
            RETURNING *;
        `, [title, author, description, bookId])

        if (rows.length) {
            return rows[0];
        }
    } catch (error) {
        console.log(error); 
    }
}

async function deleteBookById(bookId) {
    try {
        // const { rows } = await client.query(`
        //     DELETE FROM books
        //     WHERE "bookId" = ${bookId};
        // `)

        const { rows } = await client.query(`
            DELETE FROM books
            WHERE "bookId" = $1
            RETURNING *;
        `, [bookId])

        if (rows.length) {
            return rows[0]
        } else {
            return "Failed to delete book"
        }

        // const { rows: [theDeletedBook] } = await client.query(`
        //     DELETE FROM books
        //     WHERE "bookId" = $1
        //     RETURNING *;
        // `, [bookId])
        // if (rows.length) {
        //     return theDeletedBook
        // }

    } catch (error) {
        console.log(error); 
    }
}

// async function fetchBookByTitle(titleValue) {

// }

// async function fetchBookByAuthor(authorVal) {

// }

// JWT-DB-2:
async function createNewUser(userObj) {
    try {
        const { rows } = await client.query(`
            INSERT INTO users(username, password)
            VALUES ($1, $2)
            RETURNING username; 
        `, [userObj.username, userObj.password])

        if (rows.length) {
            return rows[0];
        }
    } catch (error) {
        console.log(error); 
    }
};

async function fetchUserByUsername(username) {
    try {
        const { rows } = await client.query(`
            SELECT * FROM users
            WHERE username = $1;
        `, [username])

        // const { rows } = await client.query(`
        //     SELECT * FROM users
        //     WHERE username = ${username};
        // `)

        if (rows.length) {
            return rows[0]; 
        }
    } catch (error) {
        console.log(error); 
    }
}


// Step S-Final Step: 
async function buildDatabase() {
    try {
        // Note: Make sure that you connect to your DB client first. 
        client.connect();

        await destroyTables(); 
        await createTables(); 

        // Part of S3: 
        const firstNewBook = await createNewBook({
            title: "Green Eggs and Ham",
            author: "Dr. Seuss",
            description: "Fun kids book"
        });
        // console.log(firstNewBook)

        const secondNewBook = await createNewBook({
            title: "Jurassic Park",
            author: "unknown",
            description: "Just some quirkly little dinos"
        })
        // console.log(secondNewBook)

        const thirdNewBook = await createNewBook({
            title: "Fairy Tale B",
            author: "Stephen King",
            description: "A horror story"
        })
        // console.log(thirdNewBook)

        // Part of S4: 
        const allBooks = await fetchAllBooks(); 
        // console.log(allBooks)

        // Part of S5: 
        const findSpecificBook = await fetchBookById(1);
        console.log(findSpecificBook)

        // Once you've finished all your functions, close the DB client connection. 
        client.end(); 
    } catch (error) {
        console.log(error); 
    }
}

// Final-final step: 
// buildDatabase(); 

module.exports = {
    fetchAllBooks,
    fetchBookById,
    createNewBook,
    deleteBookById,
    updateBookById,
    createNewUser,
    fetchUserByUsername
}


