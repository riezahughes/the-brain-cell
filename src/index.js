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

client.on("guildCreate", guild => {
  // on joining guild, send out a message regarding setup. add new row once setup complete.
});

client.on("guildDelete", guild => {
  // on leaving guild, delete the guild row.
});

client.on('message', msg => {

  if(msg.bot){
      return;
  }

  msg.reply("Poggers");

});

client.login(process.env.DISCORD_TOKEN);