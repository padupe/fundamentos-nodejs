const express = require('express')
const { v4: uuidv4 } = require('uuid')

const app = express()
app.use(express.json())
const customers = []

app.get('/account', (request, response) => {
    const { cpf, name } = request.body
    const id = uuidv4()

    customers.push({
        cpf,
        name,
        id,
        statemente: []
    })

    return response.status(201).send()
})

app.listen(2601)