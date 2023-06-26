// Array Destructuring
const arr = [1, 2, 3]

const [varA,, varC] = arr;

console.log(varA)

console.log(varC)

// Object Destructuring

client.query() ---> {
    rows: [
        {
            data: "my data"
        },
        {
            data: "other data"
        }
    ]
}

const { rows: [firstElement] }