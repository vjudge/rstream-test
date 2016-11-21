'use strict'

const chai = require('chai')
const CellaClient = require('../')

const expect = chai.expect
const mockRStream = {}

mockRStream.emit = (evt, args) => { evt,	args }
mockRStream.on = (evt, cb) => { }
mockRStream.open = () => { }

describe('CellaClient', () => {
  it('should throw Error without token', () => {
    expect(_ => { new CellaClient() }).to.throw('Token can not be null')
  })

  it('should handle .ctor options', () => {
    let client = new CellaClient('xxxx')
    expect(client.token).to.equal('xxxx')
    expect(client.rstreamAddr).to.equal('ws://stream.cella.xyz')
		expect(client.rstream).to.not.be.null

    client = new CellaClient({ token: 'xxxx', server: 'yyyy' })
    expect(client.token).to.equal('xxxx')
    expect(client.rstreamAddr).to.equal('yyyy')
		expect(client.rstream).to.not.be.null
  })

  it('should handle error when !connect', done => {
    const client = new CellaClient({ token: 'xxxx', server: 'ws://not.exist.example.com' })
    client.once('connect_error', err => {
      expect(err).to.be.a('error')
      done()
    })
  })

	it('should emit error event when rstream received malformed message', done => {
		const client = new CellaClient({ token: 'xxxx', rstream: Object.assign({}, mockRStream) })
		const msgObj = { a: 12345 }
		client.on('error', obj => {
			expect(obj).to.be.not.null
			done()
		})
		client.handleRawMsg(msgObj)
	})

	it('should emit rawMessage event when rstream received message', done => {
		const client = new CellaClient({ token: 'xxxx', rstream: Object.assign({}, mockRStream) })
		const msgObj = {
			id: 11,
			body: {
				MsgType: 'type',
				FromUserName: 'wx111',
				CreateTime: 111111,
			},
			to: 'xxxx',
		}
		client.on('error', obj => {
			expect(obj).to.be.null
			done()
		})
		client.on('rawMessage', msg => {
			expect(msg).to.eql(msgObj)
			done()
		})
		client.handleRawMsg(msgObj)
	})

	it('should emit message event when rstream received message', done => {
		const client = new CellaClient({ token: 'xxxx', rstream: Object.assign({}, mockRStream) })
		const msgObj = {
			id: 11,
			body: {
				MsgType: 'text',
				FromUserName: 'wx111',
				CreateTime: 111111,
			},
			to: 'xxxx',
		}
		client.on('error', obj => {
			expect(obj).to.be.null
			done()
		})
		client.on('message', msg => {
			expect(msg).to.deep.equal({
				platform: 'wechat',
				id: 11,
				type: 'text',
				userId: 'wx111',
				to: 'xxxx',
				createTime: 111111,
				userProfile: {},
				body: msgObj.body,
			})
			done()
		})
		client.handleRawMsg(msgObj)
	})

	it('should respond open rstream', done => {
		const client = new CellaClient({ token: 'xxxx', rstream: Object.assign({
			close: () => {
				done()
			}
		}, mockRStream) })
		client.close()
	})
})
