const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Sends the setup embed.'),
    
    async execute(interaction) {
        try {
            // Check if the user has the required role
            const allowedRoleId = '1284792046074331136';
            if (!interaction.member.roles.cache.has(allowedRoleId)) {
                return await interaction.reply({
                    content: 'You do not have the required role to use this command.',
                    ephemeral: true
                });
            }

            // Defer the reply to allow for a longer processing time
            await interaction.deferReply({ ephemeral: true });
            
            const user = interaction.user;
            const channel = interaction.channel;

            const embed = new EmbedBuilder()
                .setTitle('Snowville | Session Setup')
                .setDescription(`> <@${user.id}> is setting up the session. Please wait for the host to release early access for early access members. This might take __**5-10 minutes**__ to setup.`)
                .setColor(0xa3c0fd)
                .setImage("https://media.discordapp.net/attachments/1288947952295084033/1290321661232549909/Snowville-session_banners_2.png?ex=66fc0931&is=66fab7b1&hm=d8758f6bcfb17b25f46fbf41fd0f1d312efcac41be2f79d6eab7ce7599114ee6&=&format=webp&quality=lossless&width=1440&height=317")
                .setFooter({
                    text: 'Snowville',
                    iconURL: 'https://cdn.discordapp.com/icons/1284787684644093992/285256579c32f3cf750c65ac9dee2993.png?size=4096'
                });

            await interaction.channel.send({ embeds: [embed] });

            const newEmbed = new EmbedBuilder()
                .setTitle("Session Setup")
                .setDescription(`<@${interaction.user.id}> is setting up the roleplay session. Command used in <#${channel.id}>.`)
                .setThumbnail("https://cdn.discordapp.com/icons/1284787684644093992/285256579c32f3cf750c65ac9dee2993.png?size=4096")
                .setColor(0xa3c0fd)
                .setFooter({
                    text: 'Snowville',
                    iconURL: 'https://cdn.discordapp.com/icons/1284787684644093992/285256579c32f3cf750c65ac9dee2993.png?size=4096'
                });
                

            const targetChannel = await interaction.client.channels.fetch('1288846529754300479');
            await targetChannel.send({ embeds: [newEmbed] });

            await interaction.editReply({ content: 'Session has been successfully initiated.', ephemeral: true });
        } catch (error) {
            console.error('Error starting session:', error);
            // If there was an error, ensure that we reply only once
            if (!interaction.replied) {
                await interaction.reply({ content: 'There was an error initiating the session.', ephemeral: true });
            }
        }
    },
};
