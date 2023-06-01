const allCommands = require('../constants/commandHandlers');

module.exports = {
	async execute(interaction) {    
    const { commandName } = interaction
    const command = allCommands.get(commandName);

    if (!command) {
      return;
    }
  
    try {
      await command.execute(interaction);
    } catch (error) {
      console.log(error, 'command->execute');
    }
  }
}