const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('staffinformation')
        .setDefaultMemberPermissions(0)
        .setDescription('Displays server information and rules.'),
    
    async execute(interaction) {
        // Defer reply to avoid interaction timeout
        await interaction.deferReply({ ephemeral: true });

        const banner = "https://cdn.discordapp.com/attachments/1288947952295084033/1290266844971667478/Snowville_15.png?ex=66fbd623&is=66fa84a3&hm=b3496305de371e16f58d9c1c54632d65d032afd06a8bf64693383d47ac239621&";
        const targetChannelId = '1288826346075590708';
        const targetChannel = interaction.client.channels.cache.get(targetChannelId);

        if (!targetChannel) {
            return interaction.editReply({ content: 'Channel not found!', ephemeral: true });
        }

        const rulesEmbed = new EmbedBuilder()
            .setDescription("Welcome to the Snowville Staff Team. As a member of our staff, you are expected to uphold professionalism, follow all protocols, and maintain the integrity of our community. Please read the following rules carefully, as violations will result in disciplinary action, including strikes, suspension, or termination.")
            .setThumbnail("https://cdn.discordapp.com/icons/1284787684644093992/285256579c32f3cf750c65ac9dee2993.png?size=4096")
            .setColor('#a3c0fd');

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('staff_options')
            .setPlaceholder('Select an option')
            .addOptions([
                { label: 'Staff Information', value: 'staffwork' },
                { label: 'Chain of command', value: 'coc' },
                { label: 'Session Commands', value: 'sc' },
                { label: 'Moderation', value: 'mod' }
            ]);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        try {
            // Send the embed and menu to the target channel
            await targetChannel.send({ files: [banner], embeds: [rulesEmbed], components: [row] });
            await interaction.editReply({ content: 'Rules have been sent.', ephemeral: true });
        } catch (error) {
            console.error('Error sending server information:', error);
            await interaction.editReply({ content: 'An error occurred while sending server information.', ephemeral: true });
        }
    },
};
