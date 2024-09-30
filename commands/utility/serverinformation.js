const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinformation')
        .setDefaultMemberPermissions(0)
        .setDescription('Displays server information and rules.'),
    
    async execute(interaction) {

        const banner = "https://cdn.discordapp.com/attachments/1288947952295084033/1290247784171180064/Snowville_14.png?ex=66fbc463&is=66fa72e3&hm=8e8f98514edf4e6b0de76ebc9b0ebae2f8b90e7737e29cdab06258665e75a738&"

        // Define the target channel ID
        const targetChannelId = '1288800097563578368';

        // Fetch the channel using the client
        const targetChannel = interaction.client.channels.cache.get(targetChannelId);

        if (!targetChannel) {
            return interaction.reply({ content: 'Channel not found!', ephemeral: true });
        }

        const rulesEmbed = new EmbedBuilder()
            .setTitle('Server Information')
            .setDescription(`
Founded in September 2024, **Snowville™** has developed into a dynamic, inclusive community that brings together roleplay enthusiasts from diverse backgrounds. We take great pride in offering a wide variety of immersive activities and experiences that consistently engage and entertain our members.

At **Snowville™**, our core mission is to cultivate an authentic and enjoyable environment where every participant can immerse themselves in creative storytelling and escape the routine of daily life. We believe that fostering a structured, respectful, and collaborative community is essential to achieving this high level of engagement and immersion.

**Before beginning your journey with us, we kindly request that you take a moment to familiarize yourself with the guidelines provided below. These rules have been carefully designed to ensure a positive, respectful, and enjoyable experience for all.**

We are excited to welcome you to our community and look forward to the memorable adventures that await!
`)
.setThumbnail("https://cdn.discordapp.com/icons/1284787684644093992/285256579c32f3cf750c65ac9dee2993.png?size=4096")
                .setColor('#a3c0fd');

        // Create the select menu
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('server_information')
            .setPlaceholder('Select an option')
            .addOptions([
                {
                    label: 'Server Information',
                    value: 'sf',
                },
                {
                    label: 'Roleplay Information',
                    value: 'rf',
                },
                {
                    label: 'Server Links',
                    value: 'sl',
                },
            ]);

        // Create action row for the select menu
        const row = new ActionRowBuilder().addComponents(selectMenu);

        try {
            // Send the embed and the select menu to the specific channel
            await targetChannel.send({files: [banner], embeds: [rulesEmbed], components: [row] });

            // Acknowledge the command to avoid timeout if not already replied
            if (!interaction.replied) {
                await interaction.reply({ content: 'Rules have been sent.', ephemeral: true });
            }
        } catch (error) {
            console.error('Error sending server information:', error);
            // Acknowledge the interaction in case of an error
            if (!interaction.replied) {
                await interaction.reply({ content: 'An error occurred while sending server information.', ephemeral: true });
            }
        }
    },
};
