/**
 * Paginator, make discord emoji page easy.
 */
class Paginator {
  /**
   * Constructor
   * @param {Object} options Options
   * @param {Object} options.client Discord.js or Eris Client
   * @param {Object} options.msg Message Class
   * @param {string[]} options.contents Contents
   * @param {Object[]} options.embeds Embeds (This will overrides contents)
   * @param {number} options.timeout Reaction timeout
   * @param {string[]} options.reactions Reactions, first element will move page to prev, and second element will move to next.
   */
  constructor ({
    client,
    msg,
    contents = [],
    embeds = [],
    timeout = 30,
    reactions,
    moreReactions = false
  }) {
    this.client = client
    this.msg = msg
    this.contents = contents
    this.embeds = embeds
    this.timeout = timeout
    this.index = 0
    this.isEris = false
    this.reactions = []
    this.moreReactions = moreReactions
    this.UserClass = {}

    if (typeof reactions === 'undefined') {
      if (moreReactions) {
        this.reactions = ['⏪', '⬅️', '➡️', '⏩']
      } else {
        this.reactions = ['⬅️', '➡️']
      }
    }

    if (typeof client.startTime !== 'undefined') {
      this.isEris = true
      this.UserClass = require('eris').User
    } else if (client.readyAt instanceof Date) {
      this.isEris = false
    } else {
      throw new Error('This library is not currently supported.')
    }

    if (this.contents.length === 0 && this.embeds.length === 0) {
      throw new Error('At least contents should provided.')
    }

    if (this.moreReactions && this.reactions.length < 4) {
      throw new Error('More reactions mode needs at least 4 reaction emojis.')
    } else if (!this.moreReactions && this.reactions.length < 2) {
      throw new Error('Normal reactions mode needs at least 2 reaction emojis.')
    }

    this.isEmbed = this.contents.length === 0

    this.emojiChecker = this.emojiChecker.bind(this)
  }

  emojiChecker (reaction, user) {
    if (user.bot) {
      return false
    }

    if (reaction.message.id !== this.msg.id) {
      return false
    }

    if (this.reactions.includes(reaction.emoji.toString())) {
      return true
    }
    return false
  }

  addReactions () {
    this.reactions.forEach(emoji => {
      if (this.isEris) {
        this.msg.addReaction(emoji)
      } else {
        this.msg.react(emoji)
      }
    })
  }

  updateMessage () {
    if (this.isEmbed) {
      this.msg.edit({ embed: this.embeds[this.index] })
    } else {
      this.msg.edit({ content: this.contents[this.index] })
    }
  }

  goPrev () {
    if (this.index !== 0) {
      this.index--
      this.updateMessage()
    }
  }

  goNext () {
    if (
      this.index !== this.isEmbed
        ? this.embeds.length - 1
        : this.contents.length - 1
    ) {
      this.index++
      this.updateMessage()
    }
  }

  goFirst () {
    if (this.index !== 0) {
      this.index = 0
      this.updateMessage()
    }
  }

  goLast () {
    if (
      this.index !== this.isEmbed
        ? this.embeds.length - 1
        : this.contents.length - 1
    ) {
      this.index = this.isEmbed
        ? this.embeds.length - 1
        : this.contents.length - 1
      this.updateMessage()
    }
  }

  async pagination (reactions) {
    const reaction = this.isEris ? reactions : reactions.values().next().value
    if (this.moreReactions) {
      if (reaction.emoji.toString() === this.reactions[0]) {
        this.goFirst()
      } else if (reaction.emoji.toString() === this.reactions[1]) {
        this.goPrev()
      } else if (reaction.emoji.toString() === this.reactions[2]) {
        this.goNext()
      } else if (reaction.emoji.toString() === this.reactions[3]) {
        this.goLast()
      }
    } else {
      if (reaction.emoji.toString() === this.reactions[0]) {
        this.goPrev()
      } else if (reaction.emoji.toString() === this.reactions[1]) {
        this.goNext()
      }
    }

    if (this.isEris) {
      this.msg.removeReaction(reaction.emoji, reaction.userID)
    } else {
      const users = await reaction.users.fetch()
      Array.from(users.keys())
        .filter(snowflake => snowflake !== this.client.user.id)
        .forEach(userID => {
          reaction.users.remove(userID)
        })
    }
  }

  /**
   * Start Function
   */
  async start () {
    this.addReactions()
    if (this.isEris) {
      const getReaction = () => {
        return new Promise((resolve, reject) => {
          const eventFunc = async (msg, emoji, userID) => {
            const userRes = await this.client.requestHandler.request(
              'GET',
              `/users/${userID}`,
              true
            )
            const user = new this.UserClass(userRes, this)
            if (user.bot) {
              return
            }

            if (msg.id !== this.msg.id) {
              return
            }

            if (this.reactions.includes(emoji.name)) {
              clearTimeout(timer)
              this.client.off('messageReactionAdd', eventFunc)
              resolve({ emoji: emoji.name, userID })
            }
          }
          const timer = setTimeout(() => {
            this.client.off('messageReactionAdd', eventFunc)
            resolve({})
          }, this.timeout * 1000)
          this.client.on('messageReactionAdd', eventFunc)
        })
      }

      while (true) {
        const result = await getReaction()
        if (typeof result.emoji !== 'undefined') {
          this.pagination(result)
        } else {
          this.msg.removeReactions()
        }
      }
    } else {
      while (true) {
        const result = await this.msg.awaitReactions(this.emojiChecker, {
          time: this.timeout * 1000,
          max: 1
        })

        if (result.size !== 0) {
          this.pagination(result)
        } else {
          this.msg.reactions.removeAll()
        }
      }
    }
  }
}

module.exports = Paginator
