const express = require('express')
const { v4: uuidv4 } = require('uuid')

const app = express()
app.use(express.json())
const customers = []

// Middleware
function verifyIfExistsAccountCPF(request, response, next) {
    const { cpf } = request.headers;

    const customer = customers.find((customerfind => customerfind.cpf === cpf));

    if(!customer) {
        return response.status(400).json({ error: 'Customer not found!' });
    }

    request.customer = customer;

    return next();
}

app.post('/account', (request, response) => {
    const { cpf, name } = request.body;

    const customerFind = customers.some((customerfind) => customerfind.cpf === cpf);

    if (customerFind) {
        return response.status(400).json({ error: 'Customer already exists!'})
    };

    customers.push({
        cpf,
        name,
        id: uuidv4,
        statement: []
    });

    return response.status(201).send()
});

// app.use(verifyIfExistsAccountCPF);

app.get('/statement', verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;    

    return response.json(customer.statement)

});

app.listen(2601)