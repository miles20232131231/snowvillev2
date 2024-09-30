const { SlashCommandBuilder, EmbedBuilder, Colors, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('infraction')
        .setDescription('Log an infraction for a member and assign appropriate roles')
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
        .addUserOption(option =>
            option.setName('member')
                .setDescription('The member to apply the infraction to')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('The infraction level (1, 2, or 3)')
                .setRequired(true)
                .addChoices(
                    { name: '1', value: 1 },
                    { name: '2', value: 2 },
                    { name: '3', value: 3 }
                ))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the infraction')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('proof')
                .setDescription('Proof of the infraction (e.g. link to screenshot)')
                .setRequired(true)),

    async execute(interaction) {
        try {
            const allowedRoleId = '1284792046074331136'; // Replace with allowed role ID
            if (!interaction.member.roles.cache.has(allowedRoleId)) {
                return await interaction.reply({
                    content: 'You do not have the required role to use this command.',
                    ephemeral: true
                });
            }

            const targetMember = interaction.options.getMember('member');
            const userId = interaction.user.id;
            const infractionLevel = interaction.options.getInteger('level');
            const reason = interaction.options.getString('reason');
            const proof = interaction.options.getString('proof') || 'No proof provided';

            const infractionRole1 = '1284792073937096754';
            const infractionRole2 = '1284792075123953705';

            if (infractionLevel === 3) {
                // Prepare the DM Embed
                const dmEmbed = new EmbedBuilder()
                    .setTitle('Infraction Notice')
                    .setDescription('You have been kicked from the server for exceeding the maximum infractions.')
                    .addFields(
                        { name: 'Level', value: `${infractionLevel}`, inline: true },
                        { name: 'Reason', value: reason, inline: true },
                        { name: 'Proof', value: proof }
                    )
                    .setColor(Colors.Red);

                try {
                    await targetMember.send({ embeds: [dmEmbed] });
                } catch (error) {
                    console.error(`Failed to send DM to ${targetMember.user.tag}: ${error}`);
                }

                // Wait a moment before kicking
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay

                await targetMember.kick('Exceeded maximum infractions');
                await interaction.reply({
                    content: `${targetMember.displayName} has been kicked for exceeding the maximum infractions.`,
                    ephemeral: true
                });
            } else {
                let assignedRole;

                if (infractionLevel === 1) {
                    assignedRole = interaction.guild.roles.cache.get(infractionRole1);
                } else if (infractionLevel === 2) {
                    assignedRole = interaction.guild.roles.cache.get(infractionRole2);
                }

                if (assignedRole) {
                    await targetMember.roles.add(assignedRole);
                    await interaction.reply({
                        content: `Assigned infraction level ${infractionLevel} to ${targetMember.displayName}`,
                        ephemeral: true
                    });
                } else {
                    return await interaction.reply({
                        content: `Role for infraction level ${infractionLevel} not found.`,
                        ephemeral: true
                    });
                }
            }

            // Log the infraction to the specified channel
            const logChannel = interaction.guild.channels.cache.get('1288846529754300479'); // Channel ID for logging
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setTitle('Infraction Logged')
                    .setDescription(`Infraction for member: ${targetMember.displayName}
                        Command used by <@${userId}>`)
                    .addFields(
                        { name: 'Level', value: `${infractionLevel}`, inline: true },
                        { name: 'Reason', value: reason, inline: true },
                        { name: 'Proof', value: proof }
                    )
                    .setColor(Colors.Red)
                    .setTimestamp();

                await logChannel.send({ embeds: [logEmbed] });
            } else {
                console.error('Log channel not found');
            }

            await interaction.editReply({
                content: `Infraction successfully logged for ${targetMember.displayName}.`,
                ephemeral: true
            });
        } catch (error) {
            console.error('Error logging infraction:', error);
            await interaction.reply({ content: 'There was an error logging the infraction.', ephemeral: true });
        }
    },
};
