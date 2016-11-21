'use strict'

const chai = require('chai')
const CellaClient = require('../')
const NotImplementedError = require('../src/errors')

const expect = chai.expect

const mockRStream = {}

describe('Test SendMessage', () => {
	const client = new CellaClient({ token: 'xxxx', rstream: mockRStream })

	it('test text message', () => {
		client.rstream = Object.assign({
			sendMessage: (obj) => {
				expect(obj).to.eql({
					body: {
						touser: 'wx_user_id',
						msgtype: 'text',
						text: {
							content: 'this_is_content',
						},
					},
					to: 'cella-wx-touch-svc-token',
				})
			},
		}, mockRStream)

		client.sendTextMessage('wx_user_id', 'this_is_content')
	})

	it('test image message', () => {
		client.rstream = Object.assign({
			sendMessage: (obj) => {
				expect(obj).to.eql({
					body: {
						touser: 'wx_user_id',
						msgtype: 'image',
						image: {
							media_id: 'media_id',
						},
					},
					to: 'cella-wx-touch-svc-token',
				})
			},
		}, mockRStream)

		client.sendImageMessage('wx_user_id', 'media_id')
	})

	it('test voice message', () => {
		client.rstream = Object.assign({
			sendMessage: (obj) => {
				expect(obj).to.eql({
					body: {
						touser: 'wx_user_id',
						msgtype: 'voice',
						voice: {
							media_id: 'media_id',
						},
					},
					to: 'cella-wx-touch-svc-token',
				})
			},
		}, mockRStream)

		client.sendVoiceMessage('wx_user_id', 'media_id')
	})

	it('test single article message', () => {
		const _art = {
			title: 'title',
			description: 'description',
			url: 'url',
			picurl: 'picurl',
		}

		client.rstream = Object.assign({
			sendMessage: (obj) => {
				expect(obj).to.eql({
					body: {
						touser: 'wx_user_id',
						msgtype: 'news',
						news: {
							articles: [_art],
						},
					},
					to: 'cella-wx-touch-svc-token',
				})
			},
		}, mockRStream)

		client.sendArticleMessage('wx_user_id', _art)
	})

	it('test multiple articles message', () => {
		const _art = {
			title: 'title_1',
			description: 'description_1',
			url: 'url_1',
			picurl: 'picurl_1',
		}

		const _art2 = {
			title: 'title_2',
			description: 'description_2',
			url: 'url_2',
			picurl: 'picurl_2',
		}

		const arr = [_art, _art2]

		client.rstream = Object.assign({
			sendMessage: (obj) => {
				expect(obj).to.eql({
					body: {
						touser: 'wx_user_id',
						msgtype: 'news',
						news: {
							articles: arr,
						},
					},
					to: 'cella-wx-touch-svc-token',
				})
			},
		}, mockRStream)

		client.sendArticleMessage('wx_user_id', arr)
	})

	it('end video message should always throw NotImplementedError', () => {
		expect(() => client.sendVideoMessage('wx_user_id', 'media_id')).to.throw(NotImplementedError)
	})
})
