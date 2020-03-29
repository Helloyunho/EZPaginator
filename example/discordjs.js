const { Client } = require('discord.js')
const EZPaginator = require('../index')

const client = new Client()

client.on('message', async msg => {
  if (msg.content.startsWith('> test')) {
    const message = await msg.channel.send('Test')
    const paginator = new EZPaginator({
      client,
      msg: message,
      contents: ['Test', 'Another!']
    })

    paginator.start()
  }
})

client.login('Your Token')
