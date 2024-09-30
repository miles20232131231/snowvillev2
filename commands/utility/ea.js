const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('early')
        .setDescription('Sends the early access embed.')
        .addStringOption(option =>
            option.setName('session-link')
                .setDescription('Link for the session so that EA people can join.')
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

            const embed = new EmbedBuilder()
                .setTitle('Snowville | Early Access')
                .setDescription('> Early Access is now Live! Nitro Boosters, members of the Emergency Services, and Content Creators can join the session by clicking the button below.\n\nPlease keep in mind that sharing the session link with anyone is strictly forbidden and may lead to penalties. We appreciate your cooperation in keeping our community secure and fair for everyone.')
                .setColor(0xa3c0fd)
                .setImage("https://cdn.discordapp.com/attachments/1288947952295084033/1290321661668888646/Snowville-session_banners_1.png?ex=66fc0931&is=66fab7b1&hm=7a22edad4dbce69849f8c6fb68c69b509db3456e184a61299521db71e72d201f&")
                .setFooter({
                    text: 'Snowville',
                    iconURL: 'https://cdn.discordapp.com/icons/1284787684644093992/285256579c32f3cf750c65ac9dee2993.png?size=4096'
                });

            const button = new ButtonBuilder()
                .setLabel('Early Access')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('ea');

            const row = new ActionRowBuilder()
                .addComponents(button);

            const newEmbed = new EmbedBuilder()
                .setTitle("Session Early Access")
                .setDescription(`<@${interaction.user.id}> released early access. The link is provided below\n**Link**\n${sessionLink}\n\nCommand used in <#${interaction.channelId}>.`)
                .setThumbnail("https://cdn.discordapp.com/icons/1284787684644093992/285256579c32f3cf750c65ac9dee2993.png?size=4096")
                .setColor(0xa3c0fd)
                .setFooter({
                    text: 'Snowville',
                    iconURL: 'https://cdn.discordapp.com/icons/1284787684644093992/285256579c32f3cf750c65ac9dee2993.png?size=4096'
                });

            const targetChannel = await interaction.client.channels.fetch('1288846529754300479');
            await targetChannel.send({ embeds: [newEmbed] });

            await interaction.channel.send({ 
                content: '<@&1284792062264213526>, <@&1284823743222386698>', 
                embeds: [embed], 
                components: [row] 
            });

            await interaction.reply({ content: 'Early Access Sent.', ephemeral: true });

            const filter = i => i.customId === 'ea';
            const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.Button });

            collector.on('collect', async i => {
                const logChannel = interaction.guild.channels.cache.get('1288846529754300479');
                if (logChannel) {
                    await logChannel.send(`Interaction collected from ${i.user.tag} at ${new Date().toISOString()}`);
                }

                const allowedRoleIds = [
                    '1284823743222386698', 
                    '1289273142698578041', 
                    '1284792055066923018',
                    '1284792057176522792', 
                    '1284792059269484604', 
                    '1284792046074331136',
                    '1284792062264213526'
                ];

                if (allowedRoleIds.some(roleId => i.member.roles.cache.has(roleId))) {
                    await i.reply({ content: `**Link:** ${sessionLink}`, ephemeral: true });
                } else {
                    await i.reply({ 
                        content: 'You do not have permission to use this button.',   
                        ephemeral: true 
                    });
                }
            });

            collector.on('end', async collected => {
                const logChannel = interaction.guild.channels.cache.get('1288846529754300479');
                if (logChannel) {
                    await logChannel.send(`Collected ${collected.size} interactions.`);
                }
            });

            collector.on('error', async error => {
                const logChannel = interaction.guild.channels.cache.get('1288846529754300479');
                if (logChannel) {
                    await logChannel.send(`Collector encountered an error: ${error}`);
                }
                console.error('Collector encountered an error:', error);
            });

        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};
