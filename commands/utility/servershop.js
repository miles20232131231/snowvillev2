const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('servershop')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('Gives server shop.'),
    async execute(interaction) {

        const image = "https://cdn.discordapp.com/attachments/1288947952295084033/1290334800774823946/Snowville-session_banners_6.png?ex=66fc156d&is=66fac3ed&hm=c680b58c25804e0810c13c6eb8755a322a0c16798c5af590cde9288e41722a26&";
        const embed1 = new EmbedBuilder()
            .setTitle('Server Store')
            .setDescription(`Discover unparalleled perks at special rates and gain access to subscriber-only benefits that enhance your roleplay journey.

            With a selection of over 10 unique offerings, our shop caters to all your needs. Whether you're looking to buy in-game currency, invest in properties, or unlock Banned Vehicles (BVE), we provide everything necessary to enrich your gameplay. Transform your experience and unlock new adventures today!`)
            .setThumbnail("https://cdn.discordapp.com/avatars/1288879358857056266/12be851af580715291f4a492b971bb60.png?size=4096")
            .setColor('#a3c0fd');

        // Create a select menu
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('shop_select')
            .setPlaceholder('Select a perk...')
            .addOptions([
                {
                    label: 'Robux Perks',
                    value: 'robux_perks',
                },
                {
                    label: 'Nitro Perks',
                    value: 'nitro_perks',
                },
            ]);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        // Reply to the interaction
        await interaction.reply({ content: 'Command Sent to <#1290336285109653524>.', ephemeral: true });

        // Get the target channel
        const targetChannel = interaction.client.channels.cache.get('1290336285109653524');

        // Check if the target channel exists
        if (!targetChannel) {
            console.error('Target channel not found.');
            return;
        }

        // Send the embeds and select menu to the target channel
        try {
            await targetChannel.send({ embeds: [embed1], components: [row], files: [image] });
        } catch (error) {
            console.error('Error sending embed messages:', error);
        }
    },
};
