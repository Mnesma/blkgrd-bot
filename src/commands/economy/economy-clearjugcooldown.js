const { EmbedBuilder } = require('discord.js')
const {
  messageTypeColors,
  responseCodes,
  messages
} = require('../../constants');
const ids = require('../../ids.json');
const RPGController = require('../../controllers/rpg-controller');

module.exports = {
  subCommandData: (subcommand) => (
    subcommand
      .setName('clear-jug-cooldown')
      .setDescription('Clears the jug cooldown for all users or a specific user.')
      .addUserOption(option => (
        option
          .setName('target')
          .setDescription('The user whose cooldown you want to clear.')
      ))
  ),

  async execute(interaction) {
    const { options, guild, member } = interaction;
    const targetUserId = options.getUser('target')?.id;
    let target;
    
    if (targetUserId) {
      target = await guild.members.fetch(targetUserId);
    }

    if (!ids.superUsers.includes(member.id)) {
      await interaction.editReply(messages.incorrectPermissions());
      return;
    }

    try {
      const { responseCode } = RPGController.clearJugCooldown(targetUserId);

      switch (responseCode) {
        case responseCodes.success: {
          if (targetUserId) {
            await interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setTitle(`${target.displayName}'s jug cooldown has been cleared.`)
                  .setColor(messageTypeColors.success)
              ]
            });
          } else {
            await interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setTitle(`All jug cooldowns have been cleared.`)
                  .setColor(messageTypeColors.success)
              ]
            });
          }
          break;
        }
        case responseCodes.userDoesNotExist: {
          await interaction.editReply(
            messages.invalidTarget('User\'s ability to jug is not on cooldown.')
          );
          break;
        }
        default: {
          interaction.editReply(messages.unknownError());
        }
      }
    } catch (error) {
      console.log(error, 'jugClearcooldown.execute() -> RPGController.clearJugCooldown()');
      interaction.editReply(messages.unknownError());
    }
  }
}