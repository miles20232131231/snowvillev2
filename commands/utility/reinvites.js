const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reinvites')
        .setDescription('Releases reinvites for everyone to join')
        .addStringOption(option =>
            option.setName('session-link')
                .setDescription('Link for the session so that civilians may join.')
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
            const userID = interaction.user.id;

            const embed = new EmbedBuilder()
                .setTitle('Snowville | Reinvites')
                .setDescription(`Reinvites is now active, read the detailed information from the session release embed before joining the session. Please know that leaking the session would result in a server ban.\n\n**Host**: <@${userID}>`)
                .setColor(0xa3c0fd)
                .setImage("https://media.discordapp.net/attachments/1288947952295084033/1290321659919597568/Snowville-session_banners_5.png?ex=66fc0930&is=66fab7b0&hm=0cb34e7230fa9c738c3913d7c40e4ac4761b6a25246acc535df9eac173c4608e&=&format=webp&quality=lossless&width=1440&height=317")
                .setFooter({
                    text: 'Snowville',
                    iconURL: 'https://cdn.discordapp.com/icons/1284787684644093992/285256579c32f3cf750c65ac9dee2993.png?size=4096'
                });


            const button = new ButtonBuilder()
                .setLabel('Reinvites Link')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('rl');

            const row = new ActionRowBuilder()
                .addComponents(button);

            const newEmbed = new EmbedBuilder()
                .setTitle("Session Reinvites")
                .setDescription(`<@${interaction.user.id}> has released reinvites.\n\nSession Link: ${sessionLink}\nCommand used in <#${interaction.channel.id}>`)
                .setThumbnail("https://cdn.discordapp.com/icons/1284787684644093992/285256579c32f3cf750c65ac9dee2993.png?size=4096")
                .setColor(0xa3c0fd)
                .setFooter({
                    text: 'Snowville',
                    iconURL: 'https://cdn.discordapp.com/icons/1284787684644093992/285256579c32f3cf750c65ac9dee2993.png?size=4096'
                });

            const logChannel = await interaction.client.channels.fetch('1288846529754300479');
            await logChannel.send({ embeds: [newEmbed] });

            await interaction.channel.send({ content: '@here, <@&1288952278731980870>', embeds: [embed], components: [row] });

            await interaction.reply({ content: 'You have successfully released the session.', ephemeral: true });

            const filter = i => i.customId === 'rl';
            const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 999999 });

            collector.on('collect', async i => {
                try {
                    await i.deferUpdate();
                    
                    // Immediately respond to the interaction
                    await i.followUp({ content: `**Link:** ${sessionLink}`, ephemeral: true });

                    const logEmbed = new EmbedBuilder()
                        .setTitle(`Reinvites Link Button`)
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
