require('dotenv').config()

const Discord = require('discord.js');
const client = new Discord.Client();

const { Pool } = require('pg')


const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432, 
})

// let command;
// let guild;
// let brainyBoi;
// let roleId = process.env.ROLE_ID;
// let totalUsers;

// on join, check for guild_id
// if --- it was in here previously, remove from db.
// message user, let them know how the bot works. With two different roles. 
// ask for role tags for who's the group of people involved and what is the braincells
// store data into db once selected.
// Ask user if they want someone in particular or if a random choice
// initialise DONE

// on pass, 
// if - not the braincell, return message.
// if - last pass was longer than an hour
  // if - pass with no tag, then get row, use tag remove from previous user/add to new user. Reply who has the braincell. update timestamp
  // if - pass with tag, remove from current brainlett and pass to anotehr. reply who has it now. update timestamp
  // if - who, let them know who's been tagged with it.
// else - tell them they can't pass for another xx minutes : xx seconds


client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  await pool.query('SELECT * FROM servers', (err, res) => {
    client.user.setActivity(` with ${res.rowCount} other cells`);  
  })
});

client.on("guildCreate", async (guild) => {

  const addGuild = `INSERT INTO servers (guild_id) VALUES (${guild.id})`;
  const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
  channel.send("```The Token Braincell has arrived!```\n**Setup:**\n\n`!!setgrouprole [@role]` - set which role will be allowed to use the braincell. \n`!!setcellrole [@role]` - set which role to display for the cell.")
  await pool.query(addGuild)
  await pool.query('SELECT * FROM servers', (err, res) => {
    client.user.setActivity(` with ${res.rowCount} other cells`);  
  })

});

client.on("guildDelete", async (guild) => {
  const removeGuild = `DELETE FROM servers WHERE guild_id = ${guild.id}`;
  await pool.query(removeGuild)
  await pool.query('SELECT * FROM servers', (err, res) => {
    client.user.setActivity(` with ${res.rowCount} other cells`);  
  })
});

client.on('message', msg => {

  if(msg.author.bot){
      return;
  }

  // msg.reply("Poggers");

});

client.login(process.env.DISCORD_TOKEN);