module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isStringSelectMenu()) return;

        const { customId, values, member } = interaction;

        if (customId === 'session_options') {
            const selectedValue = values[0];

            if (selectedValue === 'session_info') {
                // Redirect to Session Information channel
                await interaction.reply({ content: 'View Session Information: https://discord.com/channels/1284787684644093992/1288800097563578368', ephemeral: true });
            } else if (selectedValue === 'reinvites_ping') {
                const roleId = '1288952278731980870';
                if (member.roles.cache.has(roleId)) {
                    await member.roles.remove(roleId);
                    await interaction.reply({ content: '<@&1288952278731980870> has been removed.', ephemeral: true });
                } else {
                    await member.roles.add(roleId);
                    await interaction.reply({ content: '<@&1288952278731980870> has been added.', ephemeral: true });
                }
            } else if (selectedValue === 'session_ping') {
                const roleId = '1284796401049669643';
                if (member.roles.cache.has(roleId)) {
                    await member.roles.remove(roleId);
                    await interaction.reply({ content: '<@&1284796401049669643> has been removed.', ephemeral: true });
                } else {
                    await member.roles.add(roleId);
                    await interaction.reply({ content: '<@&1284796401049669643> has been removed.', ephemeral: true });
                }
            }
        }
    }
};
