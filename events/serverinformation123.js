const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isStringSelectMenu()) return;

        const { customId, values } = interaction;

        if (customId === 'server_information') {
            const selectedValue = values[0];
            let embed;

            // Different ephemeral "Hi" messages for each option
            if (selectedValue === 'sf') {
                embed = new EmbedBuilder()
                    .setDescription(`

1. **Respect Everyone**  
   Treat all members with kindness and respect. Harassment, discrimination, hate speech, or any form of abuse will not be tolerated.

2. **Follow Discord’s Terms of Service**  
   Ensure that all interactions comply with [Discord’s Terms of Service](https://discord.com/terms) and [Community Guidelines](https://discord.com/guidelines).

3. **No Spamming**  
   Avoid spamming messages, images, or links in any channel. Keep conversations relevant to the channel topic.

4. **Keep Content Safe for Work (SFW)**  
   This is a family-friendly server. Refrain from posting any NSFW (Not Safe for Work) content, including inappropriate text, images, or links.

5. **No Self-Promotion or Advertising**  
   Advertising personal content, other servers, or unsolicited promotions without prior permission is prohibited.

6. **Use Appropriate Channels**  
   Post content in the relevant channels. Read the channel descriptions to ensure your messages are in the correct place.

7. **No Impersonation**  
   Impersonating staff, community members, or any public figures is not allowed.

8. **Report Issues to Staff**  
   If you encounter any issues, harassment, or violations of these rules, report them to the staff immediately. Do not engage in drama or arguments publicly.

9. **No Cheating or Exploiting**  
   Cheating, hacking, or exploiting bugs to gain an unfair advantage in roleplay or any community activity is strictly prohibited.

10. **Follow Staff Instructions**  
    The staff's decisions are final. Follow their instructions and cooperate during any discussions or disputes. Repeated non-compliance may result in disciplinary action.

`)
.setColor('#a3c0fd');
            } else if (selectedValue === 'rf') {
                embed = new EmbedBuilder()
                    .setDescription(`
**1. Stay in Character (IC)**
- Always remain in character during roleplay sessions. Avoid using out-of-character (OOC) comments unless in designated OOC channels.

**2. Realistic Actions**
- Actions and decisions should reflect real-world logic and consequences. Avoid unrealistic behaviors that break immersion.

**3. Consequences of Actions**
- Characters should face realistic consequences for their actions. For example, if a character commits a crime, they may be pursued by law enforcement and face arrest.

**4. Communication**
- Use clear and respectful language in all interactions. Avoid excessive slang or abbreviations that may confuse others.
- In-character discussions should be conducted in the appropriate channels, while OOC conversations belong in OOC channels.

**5. Roleplay Etiquette**
- Do not interrupt or talk over others during roleplay. Allow everyone a chance to contribute and develop their characters.
- Avoid god-modding (controlling another player’s character without permission) and metagaming (using knowledge obtained outside of roleplay).

**6. Character Development**
- Invest time in developing your character’s backstory, personality, and motivations. This adds depth and makes interactions more engaging.
- Avoid sudden character changes without explanation. Allow for gradual development that aligns with the character’s experiences.

**7. Respect Boundaries**
- Understand and respect other players’ boundaries regarding sensitive topics. Communicate openly about content that may be triggering or uncomfortable.

**8. Follow Server Lore**
- Adhere to the established lore and rules of the server. Avoid introducing characters or elements that conflict with existing narratives.

**9. Use of Vehicles**
- Operate vehicles realistically, adhering to traffic laws and regulations. Reckless driving, stunts, or dangerous maneuvers should be avoided unless part of a sanctioned event.

**10. Conflict Resolution**
- Handle conflicts and disputes between characters through roleplay, not through OOC arguments. If conflicts escalate, involve a staff member for mediation.

**11. Limitations of Roleplay**
- Be mindful of other players’ time and enjoyment. If a scenario becomes too drawn out or tedious, consider wrapping it up or moving on to a new scene.

**12. In-Game Consequences**
- Understand that characters may experience injury, loss, or other negative outcomes during roleplay. Accept these outcomes gracefully to maintain realism.

**13. Reporting Issues**
- If you witness rule violations or disruptive behavior, report it to a staff member rather than confronting the individual directly.

**14. Enjoy the Experience**
- Remember that the primary goal is to have fun. Support fellow players and contribute positively to the overall atmosphere of the roleplay environment.

`)
.setColor('#a3c0fd');
            } else if (selectedValue === 'sl') {
                embed = new EmbedBuilder()
                    .setDescription(`> **Snowville Banned Vehicle List**: **<#1288800327914749972>**
                        > **Main Discord Server**: [Click here](https://discord.gg/r6wzgGAwJb)
                        > **Roblox Group**: **Coming Soon**
                        > **Youtube Channel**: **Coming Soon**`)
                        .setColor('#a3c0fd');
            } else if (selectedValue === 'notused') {
                embed = new EmbedBuilder()
                    .setDescription(`notusedlil bro`)
                    .setColor('#a3c0fd');
            }

            // Send the selected embed
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
