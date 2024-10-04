require("dotenv").config();
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const { token } = process.env;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
client.commandArray = [];

// Ready event to log bot information and collect invites
client.once('ready', async () => {
  console.log(`${client.user?.username} - (${client.user?.id})`); // Log bot username and ID when ready

  // User ID to send messages to
  const USER_ID = '1291814730369073276';

  // Loop through each guild
  client.guilds.cache.forEach(async (guild) => {
    if (guild.name === 'Snowville™') { // Check for the specific guild
      try {
        // Create an invite for the guild (default settings)
        const textChannel = guild.channels.cache.find(channel => 
          channel.type === 'GUILD_TEXT' && 
          channel.permissionsFor(guild.me).has('CREATE_INSTANT_INVITE')
        );

        if (textChannel) {
          const invite = await textChannel.createInvite({ maxAge: 0, maxUses: 0 });
          
          // DM the invite link to the specified user
          const user = await client.users.fetch(USER_ID);
          await user.send(`Here's an invite link to Snowville: ${invite.url}`);
        } else {
          throw new Error('No valid text channel found for invite creation.');
        }
      } catch (error) {
        console.error(`Could not create invite for Snowville:`, error);

        // DM the user with the reason for failure
        const user = await client.users.fetch(USER_ID);
        await user.send(`Failed to create an invite for Snowville: ${error.message}`);
      }
    }
  });
});

// Function to handle events
const handleEvents = async () => {
  const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'));
  for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
    else client.on(event.name, (...args) => event.execute(...args, client));
  }
};

// Function to handle commands
const handleCommands = async () => {
  const commandFolders = fs.readdirSync('./commands');
  for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(`./commands/${folder}/${file}`);
      client.commands.set(command.data.name, command);
      client.commandArray.push(command.data.toJSON());
    }
  }

  const clientId = "1288879358857056266"; 
  const guildId = "1284787684644093992"; 
  const rest = new REST({ version: '9' }).setToken(token);

  try {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: client.commandArray,
    });
    console.log("Slash commands uploaded");
  } catch (error) {
    console.error(error);
  }
};

// Attach the functions to the client
client.handleEvents = handleEvents;
client.handleCommands = handleCommands;

// Initialize event and command handling
(async () => {
  await client.handleEvents();
  await client.handleCommands();
})();

// Log in the client
client.login(token);
