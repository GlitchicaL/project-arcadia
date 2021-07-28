import { ETHER_ADDRESS, ether, tokens, EVM_REVERT } from './helpers';

const { result } = require('lodash');

const Token = artifacts.require("./Token");
const Exchange = artifacts.require("./Exchange");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Exchange', ([deployer, feeAccount, user1, user2]) => {
    let token
    let exchange
    const feePercent = 10

    beforeEach(async () => {
        token = await Token.new() // Deploy token
        token.transfer(user1, tokens(100), { from: deployer }) // Transfer 100 tokens to user1

        exchange = await Exchange.new(feeAccount, feePercent) // Deploy exchange
    })

    describe('deployment', () => {

        it('tracks the fee account', async () => {
            const result = await exchange.feeAccount()
            result.should.equal(feeAccount)
        })

        it('tracks the fee percent', async () => {
            const result = await exchange.feePercent()
            result.toString().should.equal(feePercent.toString())
        })

    })

    describe('fallback', () => {
        it('reverts when Ether is sent', async () => {
            await exchange.sendTransaction({ value: 1, from: user1 }).should.be.rejectedWith(EVM_REVERT)
        })
    })

    describe('depositing Ether', async () => {
        let result
        let amount

        beforeEach(async () => {
            amount = ether(1)
            result = await exchange.depositEther({ from: user1, value: amount })
        })

        it('tracks ether deposit', async () => {
            const balance = await exchange.tokens(ETHER_ADDRESS, user1)
            balance.toString().should.equal(amount.toString())
        })

        it('emits a deposit event', async () => {
            const log = result.logs[0]
            log.event.should.eq('Deposit')

            const event = log.args

            event.token.should.equal(ETHER_ADDRESS, 'token address is correct')
            event.user.should.equal(user1, 'user address is correct')
            event.amount.toString().should.equal(amount.toString(), 'amount is correct')
            event.balance.toString().should.equal(amount.toString(), 'balance is correct')
        })
    })

    describe('withdrawing Ether', async () => {
        let result
        let amount = ether(1)

        beforeEach(async () => {
            // Deposit Ether first
            await exchange.depositEther({ from: user1, value: amount })
        })

        describe('success', async () => {
            beforeEach(async () => {
                // Withdraw Ether
                result = await exchange.withdrawEther(amount, { from: user1 })
            })

            it('withdraws Ether funds', async () => {
                const balance = await exchange.tokens(ETHER_ADDRESS, user1)
                balance.toString().should.equal('0')
            })

            it('emits a "Withdraw" event', async () => {
                const log = result.logs[0]
                log.event.should.eq('Withdraw')

                const event = log.args

                event.token.should.equal(ETHER_ADDRESS)
                event.user.should.equal(user1)
                event.amount.toString().should.equal(amount.toString())
                event.balance.toString().should.equal('0')
            })
        })

        describe('failure', async () => {
            it('rejects withdraws for insufficient balances', async () => {
                await exchange.withdrawEther(ether(100), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
            })
        })
    })

    describe('depositing tokens', () => {
        let result
        let amount = tokens(10)

        describe('success', () => {
            beforeEach(async () => {
                await token.approve(exchange.address, amount, { from: user1 })
                result = await exchange.depositToken(token.address, amount, { from: user1 })
            })

            it('tracks the token deposit', async () => {
                // Check exchange token balance
                let balance
                balance = await token.balanceOf(exchange.address)
                balance.toString().should.equal(amount.toString())
                // Check tokens on exchange
                balance = await exchange.tokens(token.address, user1)
                balance.toString().should.equal(amount.toString())
            })

            it('emits a deposit event', async () => {
                const log = result.logs[0]
                log.event.should.eq('Deposit')

                const event = log.args

                event.token.should.equal(token.address, 'token address is correct')
                event.user.should.equal(user1, 'user address is correct')
                event.amount.toString().should.equal(amount.toString(), 'amount is correct')
                event.balance.toString().should.equal(amount.toString(), 'balance is correct')
            })
        })

        describe('failure', () => {
            it('rejects Ether deposits', async () => {
                await exchange.depositToken(ETHER_ADDRESS, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
            })

            it('fails when no tokens are approved', async () => {
                // Don't approve any tokens before depositing
                await exchange.depositToken(token.address, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
            })
        })

    })

    describe('withdrawing tokens', async () => {
        let amount
        let result

        describe('success', async () => {
            beforeEach(async () => {
                amount = tokens(10)

                // Deposit tokens before withdrawing
                await token.approve(exchange.address, amount, { from: user1 })
                await exchange.depositToken(token.address, amount, { from: user1 })

                // Now withdraw tokens
                result = await exchange.withdrawToken(token.address, amount, { from: user1 })
            })

            it('withdraws token funds', async () => {
                const balance = await exchange.tokens(token.address, user1)
                balance.toString().should.equal('0')
            })

            it('emits a "Withdraw" event', async () => {
                const log = result.logs[0]
                log.event.should.eq('Withdraw')

                const event = log.args

                event.token.should.equal(token.address)
                event.user.should.equal(user1)
                event.amount.toString().should.equal(amount.toString())
                event.balance.toString().should.equal('0')
            })
        })

        describe('failure', async () => {
            it('rejects Ether withdraws', async () => {
                await exchange.withdrawToken(ETHER_ADDRESS, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
            })

            it('fails for insufficient balances', async () => {
                await exchange.withdrawToken(token.address, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
            })
        })
    })

    describe('checking balances', async () => {
        beforeEach(async () => {
            await exchange.depositEther({ from: user1, value: ether(1) })
        })

        it('returns user balance', async () => {
            const result = await exchange.balanceOf(ETHER_ADDRESS, user1)
            result.toString().should.equal(ether(1).toString())
        })
    })

    describe('making orders', async () => {
        let result

        beforeEach(async () => {
            result = await exchange.makeOrder(token.address, tokens(1), ETHER_ADDRESS, ether(1), { from: user1 })
        })

        it('tracks the newly created order', async () => {
            const orderCount = await exchange.orderCount()
            orderCount.toString().should.equal('1')

            const order = await exchange.orders('1')
            order.id.toString().should.equal('1', 'id is correct')
            order.user.should.equal(user1, 'user is correct')
            order.tokenGet.should.equal(token.address, 'tokenGet is corect')
            order.amountGet.toString().should.equal(tokens(1).toString(), 'amountGet is correct')
            order.tokenGive.should.equal(ETHER_ADDRESS, 'tokenGive is correct')
            order.amountGive.toString().should.equal(ether(1).toString(), 'amountGive is correct')
            order.timestamp.toString().length.should.be.at.least(1, 'timestamp is present')
        })

        it('emits an "Order" event', async () => {
            const log = result.logs[0]
            log.event.should.eq('Order')
            const event = log.args

            event.id.toString().should.equal('1', 'id is correct')
            event.user.should.equal(user1, 'user is correct')
            event.tokenGet.should.equal(token.address, 'tokenGet is corect')
            event.amountGet.toString().should.equal(tokens(1).toString(), 'amountGet is correct')
            event.tokenGive.should.equal(ETHER_ADDRESS, 'tokenGive is correct')
            event.amountGive.toString().should.equal(ether(1).toString(), 'amountGive is correct')
            event.timestamp.toString().length.should.be.at.least(1, 'timestamp is present')
        })
    })

    describe('order actions', async () => {
        beforeEach(async () => {
            // Deposit Ether
            await exchange.depositEther({ from: user1, value: ether(1) })

            // Make an order
            await exchange.makeOrder(token.address, tokens(1), ETHER_ADDRESS, ether(1), { from: user1 })
        })

        describe('cancelling orders', async () => {
            let result

            describe('success', async () => {
                beforeEach(async () => {
                    result = await exchange.cancelOrder('1', { from: user1 })
                })

                it('updates canceled orders', async () => {
                    const orderCancelled = await exchange.orderCancelled(1)
                    orderCancelled.should.equal(true)
                })

                it('emits an "Cancel" event', async () => {
                    const log = result.logs[0]
                    log.event.should.eq('Cancel')
                    const event = log.args

                    event.id.toString().should.equal('1', 'id is correct')
                    event.user.should.equal(user1, 'user is correct')
                    event.tokenGet.should.equal(token.address, 'tokenGet is corect')
                    event.amountGet.toString().should.equal(tokens(1).toString(), 'amountGet is correct')
                    event.tokenGive.should.equal(ETHER_ADDRESS, 'tokenGive is correct')
                    event.amountGive.toString().should.equal(ether(1).toString(), 'amountGive is correct')
                    event.timestamp.toString().length.should.be.at.least(1, 'timestamp is present')
                })
            })

            describe('failure', async () => {
                it('rejects invalid order ids', async () => {
                    const invalidOrderId = 99999
                    await exchange.cancelOrder(invalidOrderId, { from: user1 }).should.be.rejectedWith(EVM_REVERT)
                })

                it('rejects unauthorized cancelations', async () => {
                    await exchange.cancelOrder('1', { from: user2 }).should.be.rejectedWith(EVM_REVERT)
                })
            })
        })
    })

})