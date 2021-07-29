// Import contracts
const Token = artifacts.require('Token')
const Exchange = artifacts.require('Exchange')

// Util
const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'

const ether = (n) => {
    return new web3.utils.BN(
        web3.utils.toWei(n.toString(), 'ether')
    )
}

const wait = (seconds) => {
    const milliseconds = seconds * 1000
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

// Same as ether
const tokens = (n) => ether(n)

module.exports = async function (callback) {
    try {
        // Fetch accounts from wallet - these are unlocked
        const accounts = await web3.eth.getAccounts()

        // Fetch the deployed token
        const token = await Token.deployed()
        console.log('Token fetched', token.address)

        // Fetch the deployed exchange
        const exchange = await Exchange.deployed()
        console.log('Exchange fetched', exchange.address)

        // Give tokens to accounts[1]
        const sender = accounts[0]
        const reciever = accounts[1]
        let amount = web3.utils.toWei('10000', 'ether') // 10,000 tokens

        await token.transfer(reciever, amount, { from: sender })
        console.log(`Transferred ${amount} tokens from ${sender} to ${reciever}`)

        // Setup exchange users
        user1 = accounts[0]
        user2 = accounts[1]

        // user1 deposits Ether
        amount = 1
        await exchange.depositEther({ from: user1, value: ether(amount) })
        console.log(`Deposited ${amount} Ether from ${user1}`)

        // user2 approves Tokens
        amount = 10000
        await token.approve(exchange.address, tokens(amount), { from: user2 })
        console.log(`Approved ${amount} tokens from ${user2}`)

        // user2 deposits Tokens
        await exchange.depositToken(token.address, tokens(amount), { from: user2 })
        console.log(`Deposited ${amount} tokens from ${user2}`)

        //////////////////////////////////////////////////
        // CREATE A CANCELED ORDER  

        // user1 makes order to get tokens
        let result
        let orderId
        result = await exchange.makeOrder(token.address, tokens(100), ETHER_ADDRESS, ether(0.1), { from: user1 })
        console.log(`Made order from ${user1}`)

        // user1 cancels the order
        orderId = result.logs[0].args.id
        await exchange.cancelOrder(orderId, { from: user1 })
        console.log(`Cancelled order from ${user1}`)

        //////////////////////////////////////////////////
        // CREATE FILLED ORDERS

        // user1 makes an order
        result = await exchange.makeOrder(token.address, tokens(100), ETHER_ADDRESS, ether(0.1), { from: user1 })
        console.log(`Made order from ${user1}`)

        // user2 fills the order
        orderId = result.logs[0].args.id
        await exchange.fillOrder(orderId, { from: user2 })
        console.log(`Filled order from ${user1}`)

        await wait(1)

        // user1 makes another order
        result = await exchange.makeOrder(token.address, tokens(50), ETHER_ADDRESS, ether(0.01), { from: user1 })
        console.log(`Made order from ${user1}`)

        // user2 fills the order
        orderId = result.logs[0].args.id
        await exchange.fillOrder(orderId, { from: user2 })
        console.log(`Filled order from ${user1}`)

        await wait(1)

        // user1 makes final order
        result = await exchange.makeOrder(token.address, tokens(200), ETHER_ADDRESS, ether(0.15), { from: user1 })
        console.log(`Made order from ${user1}`)

        // user2 fills the order
        orderId = result.logs[0].args.id
        await exchange.fillOrder(orderId, { from: user2 })
        console.log(`Filled order from ${user1}`)

        await wait(1)

        //////////////////////////////////////////////////
        // CREATE OPEN ORDERS

        // user1 makes 10 orders
        for (let i = 1; i <= 10; i++) {
            result = await exchange.makeOrder(token.address, tokens(10 * i), ETHER_ADDRESS, ether(0.01), { from: user1 })
            console.log(`Made order from ${user1}`)

            await wait(1)
        }

        // user2 makes 10 orders
        for (let i = 1; i <= 10; i++) {
            result = await exchange.makeOrder(ETHER_ADDRESS, ether(0.01), token.address, tokens(10 * i), { from: user2 })
            console.log(`Made order from ${user2}`)

            await wait(1)
        }

    } catch (error) {
        console.log(error)
    }

    callback()
}