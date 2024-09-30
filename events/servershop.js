const { Events, EmbedBuilder } = require('discord.js');
const fs = require('fs');

const transcriptDir = './transcripts';
if (!fs.existsSync(transcriptDir)) {
    fs.mkdirSync(transcriptDir, { recursive: true });
}

const cooldowns = new Map();

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        try {
            // Cooldown logic
            if (cooldowns.has(interaction.user.id)) {
                const cooldownTime = 5000; // 5 seconds
                const expirationTime = cooldowns.get(interaction.user.id) + cooldownTime;

                if (Date.now() < expirationTime) {
                    const timeLeft = (expirationTime - Date.now()) / 1000;
                    return await interaction.reply({ content: `Please wait ${timeLeft.toFixed(1)} more seconds before using this option again.`, ephemeral: true });
                }
            }

            // Set the cooldown
            cooldowns.set(interaction.user.id, Date.now());

            if (interaction.isStringSelectMenu()) {
                await interaction.deferUpdate(); // Acknowledge the interaction immediately

                let embedResponse;

                switch (interaction.values[0]) {
                    case 'robux_perks':
                        embedResponse = new EmbedBuilder()
                            .setTitle('Robux Perks')
                            .setDescription(`**Greenville**
                            Trailer License: 200 robux
                            Banned Vehicle Exempt: 300 robux
                            Ultra Banned Vehicle Exempt: 500 robux
                            Early Access: 200 robux
                            Image Permission: 100 robux`)
                            .setColor(0xa3c0fd);
                        break;

                    case 'nitro_perks':
                        embedResponse = new EmbedBuilder()
                            .setTitle('Nitro Perks')
                            .setDescription(`**1-3 boosting perks**
                            <@&1284792066466906206> 
                            <@&1284823743222386698>
                            10k eco per week.

                            **4+ boosting perks**
                            <@&1284792068543090749>
                            20k eco per week.`)
                            .setColor(0xa3c0fd);
                        break;
                }

                if (embedResponse) {
                    await interaction.followUp({
                        embeds: [embedResponse],
                        ephemeral: true
                    });
                }
            }
        } catch (error) {
            console.error(`Error handling interaction: ${error}`);
            if (!interaction.replied && !interaction.deferred) {
                try {
                    await interaction.reply({ content: 'An error occurred while handling your request.', ephemeral: true });
                } catch (replyError) {
                    console.error(`Failed to send error reply: ${replyError}`);
                }
            }
        }
    },
};
