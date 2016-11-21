import Debug from 'debug'
import RStream from 'rstream'

const debug = new Debug('cella-rstream-test')

const RSTREAM_TOKEN_CELLA_CORE = 'CELLA-CORE-TOKEN'
const RSTREAM_TOKEN_CELLA_VJUDGE = 'vjudge'

class Bridge {
  constructor (opt) {
    const rstreamAddr = (opt && opt.rstreamAddr) || 'ws://stream.cella.xyz'
    const rstreamToken = (opt && opt.rstreamToken) || RSTREAM_TOKEN_CELLA_VJUDGE

    this.rstream = Bridge.createRStream(rstreamAddr, rstreamToken)

    process.nextTick(() => {
      this.rstream.open()
    })
  }

  static createRStream (server, token) {
    const rstream = new RStream({
      server,
      token
    })

    rstream.on('connect_error', err => debug('RStream connect_error', err))

    rstream.on('error', err => debug('rstrea.onError', err))

    rstream.on('message', async function hdlmsg (msg) {
      console.log('==========================<>>>>>>>>>>')
      console.log('rstream onMessage:', msg)
    })
    rstream.on('connect', _ => {
      debug('RStream connected')
    })
    return rstream
  }

  sendMessage (msg_) {
    debug('sendMessage msg_:', msg_)
    const msg = {}
    msg.to = RSTREAM_TOKEN_CELLA_CORE
    msg.from = 'CELLA-BERTH-WX-TOKEN'
    msg.channel = RSTREAM_TOKEN_CELLA_VJUDGE
    msg.appID = 'e2c74620af2511e6b20fd92c8a0a49d9'
    msg.ttl = [(new Date()).valueOf()]
    msg.body = Object.assign({}, msg_)
    console.log('sendMessage to RStream', msg)
    this.rstream.sendMessage(msg)
  }

}

module.exports.bridge = new Bridge()
