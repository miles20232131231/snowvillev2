const { Events, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Define constants
const logChannelId = '1288846529754300479'; // Channel ID for logging
const staffRoleId = '1284792046074331136'; // Staff role ID
const transcriptsPath = path.join(__dirname, 'transcripts');

// Function to create the ticket transcript as an HTML file
function createTranscriptHTML(ticketChannel, closedBy, closedAt, messages) {
    let transcriptHTML = `
        <html>
        <head>
            <title>Ticket Transcript</title>
        </head>
        <body>
            <h2>Ticket Transcript - ${ticketChannel.name}</h2>
            <p><strong>Closed By:</strong> ${closedBy}</p>
            <p><strong>Closed At:</strong> ${closedAt}</p>
            <hr>
            <ul>
    `;

    // Append each message to the transcript
    messages.forEach((msg) => {
        transcriptHTML += `<li><strong>${msg.author.username}</strong>: ${msg.content} - <i>${msg.timestamp}</i></li>`;
    });

    transcriptHTML += `
            </ul>
        </body>
        </html>
    `;

    return transcriptHTML;
}

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;

        let ticketClosed = false; // Flag to check if the ticket is closed
        let openedAt = null; // Variable to store the opened timestamp
        let logFilePath = ''; // File path for message logging

        // Check if the interaction has already been replied to
        const hasReplied = () => {
            return interaction.replied || interaction.deferred;
        };

        // Function to log messages in the specified log channel
        async function logToChannel(content, title) {
            const logChannel = await interaction.guild.channels.fetch(logChannelId);
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle(title)
                    .setDescription(content)
                    .setTimestamp()
                    .setFooter({ text: 'Snowville', iconURL: 'https://cdn.discordapp.com/avatars/1288879358857056266/12be851af580715291f4a492b971bb60.png?size=4096' });

                await logChannel.send({ embeds: [logEmbed] });
            }
        }

        // Handle ticket creation
        if (interaction.customId === 'get_help') {
            const ticketChannel = await interaction.guild.channels.create({
                name: `ticket-${interaction.user.username}`,
                type: 0, // GUILD_TEXT
                permissionOverwrites: [
                    {
                        id: interaction.guild.id, // @everyone
                        deny: ['ViewChannel'],
                    },
                    {
                        id: interaction.user.id,
                        allow: ['ViewChannel'],
                    },
                    {
                        id: staffRoleId,
                        allow: ['ViewChannel'],
                    },
                ],
            });

            openedAt = new Date().toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            });

            // Initialize messageTranscript for the new ticket channel
            let messageTranscript = [];

            // Set log file path for messages
            logFilePath = path.join(__dirname, `ticket_logs_${interaction.user.id}.txt`);

            // Send a notification to staff before the embed
            await ticketChannel.send(`<@${interaction.user.id}>, <@&${staffRoleId}>`);

            // Send the ticket message with buttons
            const ticketEmbed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`Ticket Support`)
                .setDescription(`Hello <@${interaction.user.id}>, this is your support ticket! Our staff team will assist you shortly.`)
                .addFields(
                    { name: 'Opened At', value: openedAt, inline: true },
                    { name: 'Ticket ID', value: `#${ticketChannel.id}`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: 'Snowville', iconURL: 'https://cdn.discordapp.com/avatars/1288879358857056266/12be851af580715291f4a492b971bb60.png?size=4096' });

            await ticketChannel.send({
                embeds: [ticketEmbed],
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('claim_ticket')
                            .setLabel('Claim Ticket')
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId('close_ticket')
                            .setLabel('Close Ticket')
                            .setStyle(ButtonStyle.Danger)
                    ),
                ],
            });

            // Log the ticket opening
            await logToChannel(`Ticket opened by <@${interaction.user.id}> in ${ticketChannel}. \nOpened at: ${openedAt}`, 'Ticket Opened');

            // Reply to the interaction only if it hasn't been replied to yet
            if (!hasReplied()) {
                await interaction.reply({ content: `Ticket created: ${ticketChannel}`, ephemeral: true });
            }
        }

        // Handle claiming the ticket
        if (interaction.customId === 'claim_ticket') {
            if (interaction.member.roles.cache.has(staffRoleId)) {
                if (!hasReplied()) {
                    await interaction.reply({ content: `${interaction.user} will be handling this ticket.`, ephemeral: true });
                }
            } else {
                if (!hasReplied()) {
                    await interaction.reply({ content: 'You do not have permission to use this button.', ephemeral: true });
                }
            }
        }

        // Handle ticket closure
        if (interaction.customId === 'close_ticket') {
            if (!ticketClosed) {
                const confirmRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder().setCustomId('confirm_close').setLabel('Confirm').setStyle(ButtonStyle.Danger),
                        new ButtonBuilder().setCustomId('cancel_close').setLabel('Cancel').setStyle(ButtonStyle.Secondary)
                    );

                if (!hasReplied()) {
                    await interaction.reply({
                        content: 'Are you sure you want to close this ticket? All messages will be collected in the transcript.',
                        components: [confirmRow],
                        ephemeral: true,
                    });
                }
                ticketClosed = true; // Mark ticket as closed
            } else {
                if (!hasReplied()) {
                    await interaction.reply({ content: 'This ticket is already closed.', ephemeral: true });
                }
            }
        }

        // Handle confirmation for closing the ticket
        if (interaction.customId === 'confirm_close') {
            const closedAt = new Date().toLocaleString(); // Current timestamp
            const closedBy = interaction.user.id; // ID of the user who closed the ticket

            // Collect all messages in the channel
            const ticketChannel = interaction.channel; // Get the current channel
            const messages = await ticketChannel.messages.fetch();
            const messageTranscript = messages.map(msg => ({
                author: {
                    username: msg.author.username,
                    avatarURL: msg.author.displayAvatarURL(),
                },
                content: msg.content,
                timestamp: msg.createdAt.toLocaleString(),
            }));

            // Create the transcript as an HTML file
            const transcriptHTML = createTranscriptHTML(ticketChannel, closedBy, closedAt, messageTranscript);
            const fileName = `ticket_${ticketChannel.id}_${Date.now()}.html`;
            fs.writeFileSync(path.join(transcriptsPath, fileName), transcriptHTML);

            // Send the transcript to the user as an embed
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Ticket Support')
                .setDescription(`Hello <@${interaction.user.id}>, we hope our staff team could have helped you. Please find above your ticket transcript and below your ticket information.`)
                .addFields(
                    { name: 'Open Time', value: openedAt, inline: true },
                    { name: 'Close Time', value: closedAt, inline: true },
                    { name: 'Closed by', value: `<@${closedBy}>`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: 'Snowville', iconURL: 'https://cdn.discordapp.com/avatars/1288879358857056266/12be851af580715291f4a492b971bb60.png?size=4096' });

            // Send the embed along with the transcript file
            await interaction.user.send({
                embeds: [embed],
                files: [path.join(transcriptsPath, fileName)],
            });

            // Log the ticket closure
            await logToChannel(`Ticket closed by <@${closedBy}> in ${ticketChannel}. \nClosed at: ${closedAt}`, 'Ticket Closed');

            // Delete the ticket channel
            await ticketChannel.delete();
        }

        // Handle cancellation of ticket closure
        if (interaction.customId === 'cancel_close') {
            if (!hasReplied()) {
                await interaction.reply({ content: 'Ticket closure has been canceled.', ephemeral: true });
            }
        }
    },
};
