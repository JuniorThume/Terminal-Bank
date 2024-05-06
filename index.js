
// externos
import chalk from 'chalk';
import inquirer from 'inquirer';

// internos
import fs from 'fs';
import { exit } from 'process';

function operation() {
    console.clear();
    inquirer.prompt({
        type: 'list',
        name: 'action',
        message: "O que você deseja fazer",
        choices: [
            'Abrir uma conta',
            'Consultar saldo',
            'Depositar',
            'Sacar',
            'Sair'
        ]
    })
    .then((answer) => {
        const option = answer['action']
        switch(option) {
            case 'Abrir uma conta':
                buildAccount();
                break;

            case 'Consultar saldo':
                getAccountBalance();
                break;

            case 'Depositar':
                deposit();
                break;

            case 'Sacar':
                withDraw();
                break;
            
            case 'Sair':
                console.log(chalk.bgBlue.black('Obrigado por usar o Accounts'))
                process.exit();
                
        }
        
    })
    .catch((err) => {
        console.log("There was an error");
    })
}

function buildAccount() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Como voce deseja chamar a sua conta'
        },
    ])
    .then((answers) => {
        const accountName = answers['accountName'];

        console.info(accountName)

        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black('Esta conta ja existe, escolha outro nome'));
            buildAccount();
            return
        }

        fs.writeFileSync(
            `accounts/${accountName}.json`,
            '{"balance": 0}',
            function(err) {
                console.log(err);
        })
        console.log(chalk.green('Parabéns, a sua conta foi criada.'));
        operation();


    })
    .catch(err => console.log(err))
}


// add an amount to user account
function deposit() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: "Qual o nome da sua conta?",
        }
    ])
    .then(answer => {
        const accountName = answer['accountName']
        if(!accountExists(accountName)){
            return deposit();
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja depositar?'
            }
        ])
        .then(answer => {
            const amount  = answer['amount'];



            addAmount(accountName, amount)

        })
        .catch(err => console.log(err))
        
    })
    .catch(err => console.log(err))
}

function accountExists(accountName) {
    if(fs.existsSync(`accounts/${answer}.json}`)) {
        console.log(chalk.bgRed.black('Esta conta nao existe, escolha outro nome!'));
    }
}

function addAmount(accountName, amount) {

    const accountData = getAccount(accountName)
    if(!amount) {
        console.log(chalk.bgRed.black("Ocorreu um erro, tente novamente mais tarde!"))
        return deposit()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(`accounts/${accountName}.json}`, JSON.stringify(accountData), function (err) { console.log(err) })

    console.log(chalk.green(`Foi depositado o valor de R$ ${amount} na conta {${accountName}}}`))

}

function getAccount(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf-8',
        flag: 'r'
    })

    return JSON.parse(accountJSON)
}

function getAccountBalance() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'QUal eh o nome da sua conta?'
        }
    ])
    .then(answer => {
        const accountName = answer['accountName'];

        if(!accountExists(accountName)) {
            console.log(chalk.bgRed.black(''))
            return getAccountBalance();
        } else {
            const accountData = getAccount(accountName);
            console.log(chalk.bgBlue.black(`O saldo da conta {${accountName}} eh de R$ ${accountData.balance}`))
        }

        operation();
    })
    .catch(err => console.log(err))
}

function withDraw() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'De qual conta voce deseja realizar o saque?'
        }
    ])
    .then(answer => {
        const accountName = answer['accountName'];

        if(!accountExists(accountName)) {
            console.log("Conta inexistente, tente novamente!");
            withDraw();
        }

        inquirer
    })
    .catch(err => console.log(err))
}

// start program 

operation();