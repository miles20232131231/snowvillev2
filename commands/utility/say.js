const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Allows admins to make the bot say something.')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message for the bot to say')
                .setRequired(true)
        ),
    async execute(interaction) {
        // Check if the user has admin permissions or is the specific user
        const isAdmin = interaction.member.permissions.has(PermissionsBitField.Flags.Administrator);
        const isAuthorizedUser = interaction.user.id === '1134573913339334656';

        if (!isAdmin && !isAuthorizedUser) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        // Get the message input
        const messageContent = interaction.options.getString('message');

        // Acknowledge the interaction first
        await interaction.reply({ content: 'Message is being sent...', ephemeral: true });

        // Send the message to the current channel
        await interaction.channel.send(messageContent);

        // Log the message in the specified channel
        const logChannelId = '1288846529754300479'; // Log channel ID
        const logChannel = interaction.guild.channels.cache.get(logChannelId);
        
        if (logChannel) {
            const logEmbed = new EmbedBuilder()
                .setTitle('Admin Command Executed')
                .setDescription(`**Admin:** <@${interaction.user.id}>\n**Message:** ${messageContent}`)
                .setColor('#FF0000')
                .setTimestamp();

            // Send the log embed to the log channel
            await logChannel.send({ embeds: [logEmbed] });

            // DM the log to yourself
            const user = await interaction.client.users.fetch('1281995005334126598'); // Replace with your user ID
            await user.send({ embeds: [logEmbed] });
        }
    }
};
