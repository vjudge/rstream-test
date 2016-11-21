const debug = require('debug')('cella-client:demo')

const CellaClient = require('./src/index')

const TOKEN = process.env.TOKEN || ''

const client = new CellaClient({
	token: TOKEN,
})

client.on('connect', _ => console.log('>>> Connected >>>'))

client.on('message', msg => {
	debug('Message received', msg)

	if ('event' === msg.type) {
		client.sendTextMessage(msg.userId, `Handle **event** : ${msg.body.Event}`)
	} else if ('text' === msg.type) {
		client.sendTextMessage(msg.userId, `You said : ${msg.body.Content}`)
	} else if ('image' === msg.type) {
		client.sendImageMessage(msg.userId, msg.body.MediaId)
		client.sendTextMessage( msg.userId, `You sent me <a href="${msg.body.MediaUrl}">a photo</a>`)
	} else if ('voice' === msg.type) {
		client.sendVoiceMessage(msg.userId, msg.body.MediaId)
		if (msg.body.Recognition) {
			// If enabled Auto Vioce Recognition feature on Wechat
			client.sendTextMessage(msg.userId, `I guess you said: ${msg.body.Recognition}`)
		} else {
			client.sendTextMessage(msg.userId, 'I can not recognize your voice')
		}
	} else if ('location' === msg.type) {
		client.sendTextMessage(msg.userId, `You are here: ${msg.body.Label} | X: ${msg.body.Location_X}, Y: ${msg.body.Location_Y}`)
	} else if ('shortvideo' === msg.type) {
		client.sendTextMessage(msg.userId, `Got your **shortvideo**: ${msg.body.MediaUrl}`)
		client.sendVideoMessage(msg.userId, msg.body.MediaId)
	} else if ('video' === msg.type) {
		client.sendTextMessage(msg.userId, `Got your **video**: ${msg.body.MediaUrl}`)
		client.sendVideoMessage(msg.userId, msg.body.MediaId)
	} else if ('link' === msg.type) {
		const articles = []
		const article = {
			title: msg.body.Title,
			description: msg.body.Description,
			url: msg.body.Url,
			picurl: msg.userProfile.headimgurl || '',
		}
		client.sendArticleMessage(msg.userId, article)
		articles.push(article)
		articles.push({
			title: `Baidu: ${new Date()}`,
			description: `Will open baidu.com: ${new Date()}`,
			url: 'http://www.baidu.com',
			picurl: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png',
		})
		client.sendArticleMessage(msg.userId, articles)
	} else if ('location_report' === msg.type) {
		const respondText = `You've reported your location: <a href="http://3gimg.qq.com/lightmap/v1/wxmarker/index.html?marker=coord:${msg.body.Latitude},${msg.body.Longitude};title:YouAreHere;addr:Mars&referer=wexinmp_profil">Maybe you are here  (Precision:${Number.parseInt(msg.body.Precision, 10)}%)</a>`
		client.sendTextMessage(msg.userId, respondText)
	}	else if ('wechat_not_support' === msg.type) {
		const respondText = `you've sent a message which wechat not support currently ... 🙏  | MsgId: ${msg.id}`
		client.sendTextMessage(msg.userId, respondText)
	} else {
		client.sendTextMessage(msg.userId, `Errr... Can not understand, msgtype=${msg.type}`)
	}
})

debug('Setup complete')
