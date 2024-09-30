const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, ComponentType, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('release')
        .setDescription('Releases the session for everyone to join.')
        .addStringOption(option =>
            option.setName('session-link')
                .setDescription('Link for the session so that civilians may join.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('peacetime-status')
                .setDescription('Current peacetime status.')
                .addChoices(
                    { name: 'Peacetime On', value: 'On' },
                    { name: 'Peacetime Normal', value: 'Normal' },
                    { name: 'Peacetime Off', value: 'Off' }
                )
                .setRequired(true))
        .addStringOption(option =>
            option.setName('frp-speed')
                .setDescription('FRP speeds.')
                .addChoices(
                    { name: '60', value: '60' },
                    { name: '70', value: '70' },
                    { name: '80 (should not be used frequently)', value: '80' }
                )
                .setRequired(true)),

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

            const sessionLink = interaction.options.getString('session-link');
            const peacetimeStatus = interaction.options.getString('peacetime-status');
            const frpSpeed = interaction.options.getString('frp-speed');
            const userID = interaction.user.id;

            const embed = new EmbedBuilder()
                .setTitle('Snowville | Session Release')
                .setDescription(`The session is now open. Detailed information regarding the session is provided below. To join, please click the button below to receive the session link.
                    
                    **__Session Information__**
                    Host: <@${userID}>
                    FRP Speed: ${frpSpeed}
                    Peacetime Status: ${peacetimeStatus}
                    
                    Note: Leaking the session would result in a server ban.`)
                    .setColor(0xa3c0fd)
                    .setImage("https://media.discordapp.net/attachments/1288947952295084033/1290321660834222131/Snowville-session_banners_3.png?ex=66fc0930&is=66fab7b0&hm=e74633e32606e6ebfbad38e8dcd3ffd573eb3f3c0aaedbc025b2f35bb966c75f&=&format=webp&quality=lossless&width=1440&height=317")
                    .setFooter({
                        text: 'Snowville',
                        iconURL: 'https://cdn.discordapp.com/icons/1284787684644093992/285256579c32f3cf750c65ac9dee2993.png?size=4096'
                    });

            const button = new ButtonBuilder()
                .setLabel('Session Link')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('ls');

            const row = new ActionRowBuilder()
                .addComponents(button);

            const newEmbed = new EmbedBuilder()
                .setTitle("Session Release")
                .setDescription(`<@${interaction.user.id}> has released their session. The information below is the session information.\n**FRP:** ${frpSpeed}\n**Peacetime:** ${peacetimeStatus}\n**Link**: ${sessionLink}\n\nCommand used in <#${interaction.channelId}>.`)
                .setThumbnail("https://cdn.discordapp.com/icons/1284787684644093992/285256579c32f3cf750c65ac9dee2993.png?size=4096")
                .setColor(0xa3c0fd)
                .setFooter({
                    text: 'Snowville',
                    iconURL: 'https://cdn.discordapp.com/icons/1284787684644093992/285256579c32f3cf750c65ac9dee2993.png?size=4096'
                });

            const logChannel = await interaction.client.channels.fetch('1288846529754300479');
            await logChannel.send({ embeds: [newEmbed] });

            await interaction.channel.send({ content: '@here, <@&1284796401049669643>', embeds: [embed], components: [row] });

            await interaction.reply({ content: 'You have successfully released the session.', ephemeral: true });

            const filter = i => i.customId === 'ls';
            const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 9999999 });

            collector.on('collect', async i => {
                try {
                    await i.deferUpdate();

                    await i.followUp({ content: `**Link:** ${sessionLink}`, ephemeral: true });

                    const logEmbed = new EmbedBuilder()
                        .setTitle(`Session Link Button`)
                        .setDescription(`Button clicked by <@${i.user.id}>.\n`)
                        .setThumbnail("https://cdn.discordapp.com/icons/1284787684644093992/285256579c32f3cf750c65ac9dee2993.png?size=4096")
                        .setColor(0xa3c0fd)
                        .setFooter({
                            text: 'Snowville',
                            iconURL: 'https://cdn.discordapp.com/icons/1284787684644093992/285256579c32f3cf750c65ac9dee2993.png?size=4096'
                        });

                    await logChannel.send({ embeds: [logEmbed] });
                } catch (error) {
                    console.error('Error responding to interaction:', error);
                }
            });

            collector.on('end', collected => {
                console.log(`Collected ${collected.size} interactions.`);
            });
        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
        }
    },
};
