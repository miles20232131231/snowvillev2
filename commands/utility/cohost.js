const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cohost')
        .setDescription('Set the user as cohosting the session'),
    async execute(interaction) {
        const allowedRoleId = '1284792046074331136'; // Role ID of the allowed user
        const logChannelId = '1288846529754300479'; // Channel ID for logging
        
        // Check if the interaction user has the allowed role
        if (!interaction.member.roles.cache.has(allowedRoleId)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        // Get the username for the message
        const user = interaction.user.username;

        // Send the cohosting message in the same channel
        const cohostMessage = `<@${interaction.user.id}> is cohosting the session.`;
        await interaction.reply({ content: cohostMessage });

        // Create an embed for logging the command
        const embed = new EmbedBuilder()
            .setColor(0xa3c0fd) // Set the color of the embed
            .setTitle('Cohosting Session Logged')
            .setDescription(cohostMessage)
            .setThumbnail("https://cdn.discordapp.com/icons/1284787684644093992/285256579c32f3cf750c65ac9dee2993.png?size=4096") // Set thumbnail
            .setTimestamp()
            .setFooter({
                text: 'Snowville',
                iconURL: 'https://cdn.discordapp.com/icons/1284787684644093992/285256579c32f3cf750c65ac9dee2993.png?size=4096'
            });

        // Log the embed in the specified channel
        const logChannel = await interaction.guild.channels.fetch(logChannelId);
        if (logChannel) {
            logChannel.send({ embeds: [embed] });
        } else {
            console.error('Log channel not found.');
        }
    },
};
