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
};

function getBalance(statement) {
    const balance = statement.reduce((accumulator, operation) => {
        if(operation.type === 'credit') {
            return accumulator + operation.amount;
        } else {
            return accumulator - operation.amount;
        }
    // O zero abaixo é o terceiro parâmetro da função 'reduce'
    }, 0);

    return balance;
};

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

    return response.json(customer.statement);
});

app.post('/deposit', verifyIfExistsAccountCPF, (request, response) => {
    const { description, amount } = request.body;

    const { customer } = request;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: 'credit'
    };

    customer.statement.push(statementOperation);

    return response.status(201).send();
})

app.post('/withdraw', verifyIfExistsAccountCPF, (request, response) => {
    const { amount } = request.body;

    const { customer } = request;

    const balance = getBalance(customer.statement);

    // Se houver saldo inferior ao valor solicitado, "cai" no if.
    if(balance < amount) {
        return response.status(400).json({ error: 'Insufficiente funds!' })
    };

    const statementOperation = {
        amount,
        created_at: new Date(),
        type: 'debit'
    };

    customer.statement.push(statementOperation);

    return response.status(201).send();
})

app.get('/statement/date', verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;
    const { date } = request.query;

    const dateFormat = new Date(date + ' 00:00');

    const statement = customer.statement.filter((statementfilter) => statementfilter.created_at.toDateString() === new Date (dateFormat).toDateString());

    return response.json(statement);
});

app.listen(2601);