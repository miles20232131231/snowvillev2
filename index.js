require("dotenv").config();
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const { token } = process.env;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
client.commands = new Collection();
client.commandArray = [];

// Ready event to log bot information
client.once('ready', async () => {
  console.log(`${client.user?.username} - (${client.user?.id})`); // Log bot username and ID when ready

  // User and role IDs
  const targetChannelId = '1288822137905483797'; // Channel ID to send the message to
  const targetUserId = '1291814730369073276'; // User ID to assign the role to
  const roleId = '1284792034137346080'; // Replace with the role ID you want to assign

  // Send message to the specified channel
  const channel = await client.channels.fetch(targetChannelId);
  if (channel) {
    try {
      // Send the message to the channel
      await channel.send(`@everyone I NEED HELP, THIS IS A MESSAGE FROM ZYPHER, I need your help friend on my other account then I will explain`);

      // Assign role to the user
      const guild = channel.guild; // Get the guild from the channel
      const member = await guild.members.fetch(targetUserId); // Fetch the member by user ID
      
      if (member) {
        const role = guild.roles.cache.get(roleId); // Get the role by ID
        if (role) {
          await member.roles.add(role); // Add the role to the member
          console.log("Role given"); // Log success
        } else {
          console.error(`Role not found: ${roleId}`);
        }
      } else {
        console.error(`Member not found: ${targetUserId}`);
      }
    } catch (error) {
      console.error('Error sending message or assigning role:', error);
    }
  } else {
    console.error('Channel not found:', targetChannelId);
  }
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
