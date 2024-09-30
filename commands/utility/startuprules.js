const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('session-rules')
        .setDefaultMemberPermissions(0)
        .setDescription('Displays the session rules and options.'),
    async execute(interaction) {
        try {
            await interaction.deferReply(); // Acknowledge the interaction immediately

            const banner = "https://cdn.discordapp.com/attachments/1288947952295084033/1290247055297740891/Snowville_13.png?ex=66fbc3b5&is=66fa7235&hm=d37daea3107ce63c8fe2b494bd9195e378a956a44cb0952f9c708c57a89730c6&";
            const targetChannelId = '1288817758506717255';
            const targetChannel = interaction.client.channels.cache.get(targetChannelId);

            if (!targetChannel) {
                return await interaction.followUp({ content: 'Channel not found!', ephemeral: true });
            }

            const rulesEmbed = new EmbedBuilder()
                .setTitle('Roleplay Startup')
                .setDescription(`In this channel, you will interact with Roleplay Sessions hosted by the Snowville Staff Team. Once a session is ready to start, you will receive a notification with an @everyone ping. Please refrain from requesting Roleplay Sessions, as doing so may lead to a temporary mute. Before participating in any Roleplay Session, ensure that you have thoroughly reviewed our information, all vehicles are properly registered, and any outstanding tickets are paid off. Compliance with these guidelines is essential for maintaining a smooth and enjoyable experience for everyone.`)
                .setThumbnail("https://cdn.discordapp.com/icons/1284787684644093992/285256579c32f3cf750c65ac9dee2993.png?size=4096")
                .setColor('#a3c0fd');

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('session_options')
                .setPlaceholder('Select an option')
                .addOptions([
                    {
                        label: 'Session Information',
                        description: 'View Session Information',
                        value: 'session_info'
                    },
                    {
                        label: 'Reinvites Ping',
                        description: 'Toggle Reinvites Ping role',
                        value: 'reinvites_ping'
                    },
                    {
                        label: 'Session Ping',
                        description: 'Toggle Session Ping role',
                        value: 'session_ping'
                    }
                ]);

            const row = new ActionRowBuilder().addComponents(selectMenu);

            // Send the embed and the select menu to the specific channel
            await targetChannel.send({ files: [banner], embeds: [rulesEmbed], components: [row] });

            // Reply to the interaction
            await interaction.followUp({ content: 'Session rules sent to the channel.', ephemeral: true });
        } catch (error) {
            console.error('Error executing session-rules command:', error);
            // Respond to the interaction with an error message
            if (!interaction.replied) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    },
};
