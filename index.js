const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const morgan = require("morgan")
const cors = require("cors")

morgan.token("content", (req) => {
    if (req.method === "POST") {
        return JSON.stringify(req.body)
    }
})

app.use(cors())
app.use(express.static("build"))
app.use(bodyParser.json())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :content"))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "045-1236543"
    },
    {
        id: 2,
        name: "Arto Järvinen",
        number: "041-21423123"
    },
    {
        id: 3,
        name: "Lea Kutvonen",
        number: "040-4323234"
    },
    {
        id: 4,
        name: "Martti Tienari",
        number: "09-784232"
    }    
]

const generateId = () => {
    return Math.floor(Math.random() * 100)
}

app.get("/", (req, res) => {
    res.send("<h1>This is the root directory</h1>")
})

app.get("/info", (req, res) => {
    res.type("text/html")
    res.write(`<p>Puhelinluettelossa ${persons.length} henkilön tiedot</p>`)
    res.write(`<p>${new Date()}</p>`)
    res.end()
})

app.get("/api/persons", (req, res) => {
    res.json(persons)
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(note => note.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.post("/api/persons", (req, res) => {
    const body = req.body
    if (!body.name || 
        !body.number || 
        persons.some(person => person.name === body.name)) {
            let message
            if (!body.name && !body.number) {
                message = "name and number were missing"
            } else if (!body.name) {
                message = "name was missing"
            } else if (persons.some(person => person.name === body.name)) {
                message = "name must be unique"
            } else {
                message = "number was missing"
            }
            return res.status(400).json({
                error: message
            })    
    }
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
