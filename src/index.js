const express = require('express')
const { v4: uuidv4 } = require('uuid')

const app = express()
app.use(express.json())
const customers = []

/**
 * CPF - String
 * NAME - String
 * ID - uuid
 * STATEMENT (Extrato): [] Array
 */

app.post('/account', (request, response) => {
    const { cpf, name } = request.body

    const customerFind = customers.some((customerfind) => customerfind.cpf === cpf)

    if (customerFind) {
        return response.status(400).json({ error: 'Customer already exists!'})
    }

    customers.push({
        cpf,
        name,
        id: uuidv4,
        statemente: []
    })

    return response.status(201).send()
})

app.listen(2601)