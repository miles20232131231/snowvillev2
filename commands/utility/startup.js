const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('startup')
        .setDescription('Initiates a roleplay session.')
        .addIntegerOption(option =>
            option.setName('reactions')
                .setDescription('Amount of reactions for the session to occur')
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
            const reactions = interaction.options.getInteger('reactions');
            const user = interaction.user;

            await interaction.reply({ content: `Command used successfully.`, ephemeral: true });

            const embed = new EmbedBuilder()
                .setTitle('Snowville | Session Startup')
                .setDescription(`
                    > <@${user.id}> has initiated a snowville session, before the session commence you must follow the server information provided at <#1288800097563578368>.
                    
                    > To register your vehicle you can head to <#1288822169425678428> and exute /register.
                    
                    > In order for the session to commence the message needs **${reactions}**+`)
                    .setImage("https://media.discordapp.net/attachments/1288947952295084033/1290321662163685417/Snowville-session_banners.png?ex=66fc0931&is=66fab7b1&hm=14c596b9f251926bac33fb025c3def550e3f15533bbe5ef0c2c9aec425314f22&=&format=webp&quality=lossless&width=1440&height=317")
                    .setColor(0xa3c0fd)
                    .setFooter({
                        text: 'Snowville',
                        iconURL: 'https://cdn.discordapp.com/icons/1284787684644093992/285256579c32f3cf750c65ac9dee2993.png?size=4096'
                    });

            const message = await interaction.channel.send({
                content: '@everyone',
                embeds: [embed],
            });

            await message.react('✅');

            const newEmbed = new EmbedBuilder()
            .setTitle("Session Startup")
            .setDescription(`<@${interaction.user.id}> has initiated a roleplay session. The reactions have been set to ${reactions}.
                
                The command has been used in <#${interaction.channelId}>.`)
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
            await interaction.reply({ content: 'There was an error initiating the session.', ephemeral: true });
        }
    },
};
