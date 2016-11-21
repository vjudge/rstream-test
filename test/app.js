require('babel-core/register')

import { getTuLingResult } from './../src/tuling'
console.log('getTuLingResult', getTuLingResult)

getTuLingResult({
  userid: 'vjudge',
  info: '讲个笑话吧'
})
  .then(res => console.log('getTuLingResult rst:', res))
  .catch(err => console.error('getTuLingResult err', err))
