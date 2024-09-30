const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isStringSelectMenu()) return;

        const { customId, values } = interaction;

        if (customId === 'staff_options') {
            const selectedValue = values[0];
            let embed;

            // Create embeds based on the selected value
            if (selectedValue === 'staffwork') {
                embed = new EmbedBuilder()
                    .setDescription(`

**1. Leaking Staff Channels & Information**  
Sharing any internal information from staff channels or leaking confidential discussions is strictly prohibited. Doing so will lead to immediate removal from the staff team and a permanent blacklist. This includes screenshots, conversations, or any related content.

**2. Upholding Professionalism**  
Staff members are held to higher standards. Whether on Snowville servers or elsewhere, you represent the community. Any inappropriate or unprofessional behavior, both in-game and on Discord, reflects poorly on the server and will not be tolerated.

**3. In-Game Behavior & Discord Etiquette**  
Professional conduct is mandatory at all times. You are expected to behave in a mature and responsible manner. Inappropriate behavior, trolling, or any actions that tarnish the reputation of the server or staff will result in consequences, up to termination.

**4. Activity & Availability**  
Staff members are required to maintain an active presence both on Discord and in-game. Extended inactivity without notifying higher-ups could result in removal from the team. Regular participation in sessions and staff meetings is essential to your role.

**5. Session Requirements**  
Staff members hosting sessions must be in the designated **Staff RTO** channel during the event. While driving a staff vehicle is not mandatory, being available to help moderate is critical. Proper management of sessions is a key part of maintaining server order.

**6. Special Roleplays**  
Special roleplays cannot be initiated without direct approval from a Staff Manager. Unauthorized special roleplays will result in a staff strike. Always ensure you are cleared before organizing these events.

**7. Side-Chatting & Session Channels**  
Staff should avoid unnecessary chatter in important channels like the **Startup** or **Session** channels. If you wish to co-host a session, you can announce your participation in the **Early Access** channel, but keep conversations relevant and professional.

**8. Enforcement of Server Rules**  
Being a staff member does not exempt you from following server rules. In fact, infractions by staff members will be treated more severely, often resulting in a staff strike rather than a typical user warning. Upholding server rules should always be a priority.

**9. Confidentiality of Reports**  
Staff members must maintain confidentiality regarding any reports, investigations, or incidents that they handle. Discussing disciplinary actions or server-related matters outside of appropriate channels can result in punishment.

**10. Conflict Resolution**  
Staff members are expected to de-escalate situations in a calm and collected manner. Should conflicts arise, direct them to higher-ups or handle them with professionalism and respect. Creating drama or engaging in arguments will not be tolerated.

**11. Respect for Hierarchy**  
Always follow the chain of command. If you encounter any issues or need assistance, report them to your supervisors or Staff Managers. Skipping steps or ignoring directives from higher-ups can lead to disciplinary actions.

**12. Abuse of Power**  
Misusing staff permissions or commands is a serious offense. This includes kicking, muting, or banning players without reason, or using staff tools for personal gain. Abuse of any kind will result in immediate termination.

**13. Participation in Staff Meetings**  
Regular attendance at staff meetings is crucial. Missing multiple meetings without valid reasons could lead to warnings or removal. These meetings are key for updates, event planning, and ensuring the team remains aligned.

**14. Reporting Misconduct**  
Should you witness any misconduct or inappropriate behavior, whether from staff or regular members, it is your duty to report it immediately. Failing to do so may result in you being held accountable.

`)
                    .setColor('#a3c0fd');
            } else if (selectedValue === 'sc') {
                embed = new EmbedBuilder()
                    .setDescription(`
**Startp**: Starts up the roleplay session.
**Cohost**: Tell people you are cohosting the session.
**Setup**: Tells people you are setting up the session.  
**EA**: Releases early access.  
**Release**: Releases the session for everyone.  
**Reinvites**: Reinvites everyone back to the session.  
**Over**: Ends the session.`)
                    .setColor('#a3c0fd');
            } else if (selectedValue === 'mod') {
                embed = new EmbedBuilder()
                    .setDescription(`
**Strikes**: To strike a member, you must execute the command /infraction. You just need to provide the reason and user. The bot will give them the roles needed. Note that this is logged at <#1288846529754300479>, so abusing it would not help.

**Warning**: To give someone a warning, you must use the /warn command built into <@1290258304752160811>.

**Kicking and Banning**: The kicks will be handled by the <@1288879358857056266> by using the /infraction command (only when they get their 3rd strike, then the bot kicks them from the server).

The bans must be done via a moderation request at <#1290239748929097738>.`)
                    .setColor('#a3c0fd');
            } else if (selectedValue === 'coc') {
                embed = new EmbedBuilder()
                    .setDescription(`
<@&1284792035232059392>  
<@&1286590737122594879>  
<@&1284792037236936806>  
<@&1284792038231113758>  
<@&1284792039296204904>  
<@&1284792040324075591>  
<@&1284830410085498972>  
<@&1284830410769170604>  
<@&1288900381648224357>  
<@&1284830409271672984>  
<@&1284830406708953141>  
<@&1284830062197084160>  
<@&1284792041087172630>  
<@&1284792043297706037>  
<@&1284792042337075274>  
<@&1284792043931172906>`)
                    .setColor('#a3c0fd');
            }

            // Ensure embed is defined before sending the reply
            if (embed) {
                await interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
                await interaction.reply({ content: 'Invalid selection.', ephemeral: true });
            }
        }
    },
};
