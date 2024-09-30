const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('over')
        .setDescription('Purges messages from today between specified start and end times, excluding the first 2 messages.')
        .addStringOption(option =>
            option.setName('start-time')
                .setDescription('Start time in HH:MM format')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('end-time')
                .setDescription('End time in HH:MM format')
                .setRequired(true)),
    async execute(interaction) {
        const allowedRoleId = '1284792046074331136';

        // Check if the user has the required role
        if (!interaction.member.roles.cache.has(allowedRoleId)) {
            return await interaction.reply({
                content: 'You do not have the required role to use this command.',
                ephemeral: true
            });
        }

        const startTime = interaction.options.getString('start-time');
        const endTime = interaction.options.getString('end-time');

        const now = new Date();
        const start = new Date(now);
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        start.setHours(startHours, startMinutes, 0, 0);

        const end = new Date(now);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        end.setHours(endHours, endMinutes, 0, 0);

        if (start > end) {
            end.setDate(end.getDate() + 1); // Adjust end time if it's past midnight
        }

        await interaction.reply({ content: 'Processing your request...', ephemeral: true });

        try {
            const messages = await interaction.channel.messages.fetch({ limit: 100 });
            const sortedMessages = messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

            const messagesToDelete = sortedMessages.filter((msg, index) => {
                const msgDate = new Date(msg.createdTimestamp);
                return index >= 2 && msgDate >= start && msgDate <= end;
            });

            for (const msg of messagesToDelete.values()) {
                try {
                    await msg.delete();
                } catch (deleteError) {
                    // Log or handle individual message deletion errors if needed
                }
            }

            const embed = new EmbedBuilder()
                .setTitle('Snowville | Session Concluded')
                .setDescription(`> Thank you for joining the Snoville session. We are looking forward to see you again!

                **__Session Details:__**
                > Host: **<@${interaction.user.id}>**
                > Start Time: **${startTime}**
                > End Time: **${endTime}**
                
                **Note**: There is a 20 minutes cooldown before a session starts.`)
                .setColor(0xa3c0fd)
                .setImage("https://media.discordapp.net/attachments/1288947952295084033/1290321660301283410/Snowville-session_banners_4.png?ex=66fc0930&is=66fab7b0&hm=a69826af2333b137fe0e3f66e7d131d1db5c5f535f5aa0df5de591fe624494ed&=&format=webp&quality=lossless&width=1440&height=317")
                .setFooter({
                    text: 'Snowville',
                    iconURL: 'https://cdn.discordapp.com/icons/1284787684644093992/285256579c32f3cf750c65ac9dee2993.png?size=4096'
                });

            await interaction.channel.send({ embeds: [embed] });

            const sessionEndEmbed = new EmbedBuilder()
                .setTitle('Session Ended')
                .setDescription(`<@${interaction.user.id}> has ended their session.
                    Command used in <#${interaction.channelId}>.
                    
                    **Session Information**
                    Start:${startTime}
                    End:${endTime}`)
                    .setThumbnail("https://cdn.discordapp.com/icons/1284787684644093992/285256579c32f3cf750c65ac9dee2993.png?size=4096")
                    .setColor(0xa3c0fd)
                    .setFooter({
                        text: 'Snowville',
                        iconURL: 'https://cdn.discordapp.com/icons/1284787684644093992/285256579c32f3cf750c65ac9dee2993.png?size=4096'
                    });
    

            const logChannel = interaction.client.channels.cache.get('1288846529754300479');
            if (logChannel) {
                await logChannel.send({ embeds: [sessionEndEmbed] });
            }

            await interaction.editReply({ content: 'Command processed successfully.', ephemeral: true });
        } catch (error) {
            if (!interaction.replied) {
                await interaction.reply({ content: 'Failed to process the command. Please try again later.', ephemeral: true });
            } else {
                await interaction.followUp({ content: 'Failed to process the command. Please try again later.', ephemeral: true });
            }
        }
    },
};
