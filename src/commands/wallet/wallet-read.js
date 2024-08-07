const { EmbedBuilder } = require('discord.js')
const { messageTypeColors, responseCodes, messages } = require('../../constants');
const EconomyController = require('../../controllers/economy-controller');

module.exports = {
  subCommandData: (subcommand) => (
    subcommand
      .setName('read')
      .setDescription('Prints out the contents of the target user\'s wallet or the author if no target is specified.')
      .addUserOption(option => (
        option
          .setName('target')
          .setDescription('The user whose wallet to read or the author if omitted.')
      ))
  ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const { user, options } = interaction;
    const target = options.getUser('target') || user;

    try {
      const { responseCode, value: wallet } = await EconomyController.getWallet(target.id);

      switch (responseCode) {
        case responseCodes.success: {
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle('Wallet')
                .setColor(messageTypeColors.success)
                .setFields([
                  { name: 'Wallet', value: `${EconomyController.currencyEmoji} ${wallet.value}`, inline: true },
                  { name: 'Bank', value: `${EconomyController.currencyEmoji} ${wallet.bank}`, inline: true },
                  { name: ' ', value: ' ' },
                  { name: ' ', value: ' ' },
                  { name: 'Total', value:`${EconomyController.currencyEmoji} ${wallet.value + wallet.bank}` }
                ])
            ]
          });
          break;
        }
        case responseCodes.doesntExist: {
          const walletOwnedByAuthor = target.id === user.id;
          const pronoun = walletOwnedByAuthor ? 'You' : 'They';

          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle('Doesn\'t Exist')
                .setColor(messageTypeColors.failure)
                .setDescription(`${pronoun} do not have a Bilaim wallet.`)
            ]
          });
          break;
        }
        default: {
          interaction.editReply(messages.unknownError());
        }
      }
    } catch (error) {
      console.log(error, 'walletRead.execute() -> EconomyController.getWallet()');
      interaction.editReply(messages.unknownError());
    }

  }
}