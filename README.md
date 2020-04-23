# ezpaginator

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)
[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

Make discord emoji page easy

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## Install

```
npm install ez-paginator # Use yarn if you prefer to use yarn
```

## Usage

Example:

```js
// Assume that you're using discord.js
// Eris example and this same example are in example folder
const { Client } = require('discord.js');
const EZPaginator = require('../index');

const client = new Client();

client.on('message', async (msg) => {
  if (msg.content.startsWith('> test')) {
    const message = await msg.channel.send('Test');
    const paginator = new EZPaginator({
      client,
      msg: message,
      contents: ['Test', 'Another!']
    });

    paginator.start();
  }
});

client.login('Your Token');
```

## API

### `Paginator(options)`

Paginator, make discord emoji page easy.

### Constructor

#### new Paginator(options)

Constructor

#### Parameters:

| Name    | Type     | Description |
| ------- | -------- | ----------- |
| options | `Object` | Options     |

#### Properties:

| Name          | Type             | Description                                                                                                                                                                                                                                                     |
| ------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| client        | `Object`         | Discord.js or Eris Client                                                                                                                                                                                                                                       |
| msg           | `Object`         | Message Class                                                                                                                                                                                                                                                   |
| contents      | `Array.<string>` | Contents                                                                                                                                                                                                                                                        |
| embeds        | `Array.<Object>` | Embeds (This will overrides contents)                                                                                                                                                                                                                           |
| timeout       | `number`         | Reaction timeout                                                                                                                                                                                                                                                |
| reactions     | `Array.<string>` | Reactions, first element will move page to prev, and second element will move to next. (If more reactions mode is enabled, first element will move page to first, second and third is same as normal reactions mode, and fourth element will move page to end.) |
| moreReactions | `boolean`        | Enables more reactions mode                                                                                                                                                                                                                                     |

### Methods

#### `(async)` start()

Start Function

## Maintainers

[@Helloyunho](https://github.com/Helloyunho)

## Contributing

PRs accepted.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

MIT © 2020 Helloyunho
