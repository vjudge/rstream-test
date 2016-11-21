import Debug from 'debug'
import RStream from 'rstream'

import { getTuLingResult } from './tuling'

const debug = new Debug('cella-core')

const RSTREAM_INTEGRATION_TOKEN = 'f2d307d0abdc11e6a76b3d4dd38f7162'
const RSTREAM_CELLA_CORE = 'CELLA-CORE-TOKEN'
const MESSAGE_TYPE = new Set(['text'])

const RSTREAM_ADDR = process.env.RSTREAM_ADDR || 'ws://stream.cella.xyz'
const RSTREAM_TOKEN = process.env.RSTREAM_TOKEN || RSTREAM_INTEGRATION_TOKEN

const rstream = new RStream({
  server: RSTREAM_ADDR,
  token: RSTREAM_TOKEN
})

process.nextTick(() => {
  rstream.open()
})

const handleMessage = async function hdlmsg (msg) {
  debug('before handleMessage msg:', JSON.stringify(msg))
  msg.to = msg.from
  msg.from = RSTREAM_INTEGRATION_TOKEN
  msg.appID = RSTREAM_INTEGRATION_TOKEN
  if (msg.body && MESSAGE_TYPE.has(msg.body.MsgType)) {
    let obj = {
      userid: msg.body.FromUserName,
      info: msg.body.Content
    }
    let tlResult = await getTuLingResult(obj)
    msg.body.Content = tlResult.text
  }
  debug('after handleMessage msg:', JSON.stringify(msg))
  return rstream.sendMessage(msg)
}

rstream.on('connect_error', err => debug('RStream connect_error', err))

rstream.on('error', err => debug('rstrea.onError', err))

rstream.on('message', handleMessage)

rstream.on('connect', _ => {
  debug('RStream connected')
})
