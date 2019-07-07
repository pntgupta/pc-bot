module.exports = {
  ping: {
    alias: ['p'],
    execute() {
      return {
        text: 'Pong',
        attachments: [
          {
            text: 'I am working fine.',
            color: 'good'
          }
        ]
      };
    }
  },
  help: {
    alias: ['h', 'hlp'],
    execute() {
      return {
        text: `
          Usage: ![Command] to run a command.\n*Commands available*:\n${Object.entries(
            module.exports
          )
            .filter(([key]) => key !== 'notFound')
            .map(([key, { alias }]) => `${key}(${alias.join(', ')})`)
            .join(', ')}`
      };
    }
  },
  notFound: {
    execute() {
      return {
        text: 'I wish that was a command.',
        attachments: [
          {
            text: 'Use !help to see what else I can do.',
            color: 'warning'
          }
        ]
      };
    }
  }
};
