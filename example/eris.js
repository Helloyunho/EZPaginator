const { Client } = require('eris')
const EZPaginator = require('../index')

const client = new Client('Your Token')

client.on('messageCreate', async msg => {
  if (msg.content.startsWith('> test')) {
    const message = await msg.channel.createMessage('Test!')
    const paginator = new EZPaginator({
      client,
      msg: message,
      contents: ['Test!', 'Another!', 'And another!', 'Good!'],
      moreReactions: true
    })

    paginator.start()
  }
})

client.connect()
