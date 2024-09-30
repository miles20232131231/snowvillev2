const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, Events } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-support')
        .setDescription('Notify users about support and provide a button to get help.')
        .setDefaultMemberPermissions(0), // Only allow admins to use this command

    async execute(interaction) {
        // Create the embed message
        const embed = new EmbedBuilder()
            .setTitle('Server Support')
            .setColor('#a3c0fd')
            .setDescription(`Welcome to server support. This is where you can get help from our staff team. Please note a few things before you open a ticket
                
                **__Notes__**
                Opening a troll ticket would result in a server mute and strike.
                Please wait for staff to come and help you, it can take up yo 24 hours.`)
            .setThumbnail("https://cdn.discordapp.com/avatars/1288879358857056266/12be851af580715291f4a492b971bb60.png?size=4096")
            .setFooter({ text: 'Snowville', iconURL: 'https://cdn.discordapp.com/avatars/1288879358857056266/12be851af580715291f4a492b971bb60.png?size=4096' }); // Replace with your icon URL

        // Create a button to get help
        const button = new ButtonBuilder()
            .setCustomId('get_help') // Set custom ID for later use
            .setLabel('Server Support')
            .setStyle(ButtonStyle.Primary);

            const button2 = new ButtonBuilder()
            .setCustomId('member_report') // Set custom ID for later use
            .setLabel('Member Report')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(button);

        // Send the embed and button to the specified channel
        const reportChannel = interaction.client.channels.cache.get('1288822184139296778'); // Replace with your channel ID
        await reportChannel.send({ embeds: [embed], components: [row] });

        // Acknowledge the interaction
        await interaction.reply({ content: 'The support message has been sent to the channel.', ephemeral: true });
    },
};
