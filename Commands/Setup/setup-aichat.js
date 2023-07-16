const { SlashCommandBuilder, ChatInputCommandInteraction, Client, ActionRowBuilder, SelectMenuBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup-aichat")
        .setDescription("Setup the AI Chat.")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addStringOption(option =>
			option
				.setName('channel')
				.setDescription('The channel where will the aichat be')),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
         const channel = interaction.options.getChannel("channel")

         client.settings.ensure(interaction.guild.id, {
            aichatChannel: channel.id,
            enabled: true
         }, "aichat")

         await interaction.reply({ content: `Successfuly set the AIChat channel in ${channel}`})
    }
}