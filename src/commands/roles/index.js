const { SlashCommandBuilder } = require('@discordjs/builders');
const { messages } = require('../../constants');
const rolesCreate = require('./roles-create');
const rolesUpdate = require('./roles-update');
const rolesDelete = require('./roles-delete');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roles')
    .setDescription('Create/modify role selectors')
    .addSubcommand(rolesCreate.subCommandData)
    .addSubcommand(rolesUpdate.subCommandData)
    .addSubcommand(rolesDelete.subCommandData),

  async execute(interaction) {
    // await interaction.deferReply()
    const subCommand = interaction.options.getSubcommand()

    switch (subCommand) {
      case 'create': {
        await rolesCreate.execute(interaction);
        break;
      }
      case 'update': {
        await rolesUpdate.execute(interaction);
        break;
      }
      case 'delete': {
        await rolesDelete.execute(interaction);
        break;
      }
      default: {
        await interaction.editReply(messages.unknownError());
      }
    }
  },
};