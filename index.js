require("dotenv").config()
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const morgan = require("morgan")
const cors = require("cors")
const Person = require("./models/person")

morgan.token("content", (req) => {
    if (req.method === "POST") {
        return JSON.stringify(req.body)
    }
})

app.use(cors())
app.use(express.static("build"))
app.use(bodyParser.json())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :content"))
/*
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
]*/

app.get("/info", (req, res) => {
    Person.find({}).then(result => {
        res.type("text/html")
        res.write(`<p>Puhelinluettelossa ${result.length} henkilön tiedot</p>`)
        res.write(`<p>${new Date()}</p>`)
        res.end()
    })
})

app.get("/api/persons", (req, res) => {
    Person.find({}).then(result => {
        res.json(result.toJSON())
    })
})

app.get("/api/persons/:id", (req, res) => {
    Person.findById(req.params.id).then(person => {
        res.json(person.toJSON())
    })
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
    const person = new Person({
        name: body.name,
        number: body.number,
    })
    person.save().then(savedPerson => {
        res.json(savedPerson.toJSON())
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
