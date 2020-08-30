require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client();

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

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

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  await pool.query("SELECT * FROM servers", (err, res) => {
    client.user.setActivity(` with ${res.rowCount} other cells`);
  });
});

client.on("guildCreate", async (guild) => {
  const addGuild = `INSERT INTO servers (guild_id) VALUES (${guild.id})`;
  const channel = guild.channels.cache.find(
    (channel) =>
      channel.type === "text" &&
      channel.permissionsFor(guild.me).has("SEND_MESSAGES")
  );
  channel.send(
    "```The Token Braincell has arrived!```\n**Setup:**\n\n`!!setgrouprole [@role]` - set which role will be allowed to use the braincell. \n`!!setcellrole [@role]` - set which role to display for the cell."
  );
  await pool.query(addGuild);
  await pool.query("SELECT * FROM servers", (err, res) => {
    client.user.setActivity(` with ${res.rowCount} other cells`);
  });
});

client.on("guildDelete", async (guild) => {
  const removeGuild = `DELETE FROM servers WHERE guild_id = ${guild.id}`;
  await pool.query(removeGuild);
  await pool.query("SELECT * FROM servers", (err, res) => {
    client.user.setActivity(` with ${res.rowCount} other cells`);
  });
});

client.on("message", async (msg) => {
  // console.log(msg.content);
  if (msg.author.bot) {
    return;
  }

  const message = msg.content.toLowerCase();

  const hasParams = (message) =>{
    return message.includes("<@")
  }

  const help = () => {
    const helpMessage =
      "\n\n**Setup:**\n" +
      "`!!setgrouprole [@role]`: set the role that the bot will use for brainless folk\n" +
      "`!!setcellrole [@role]`: set the role that the bot will use for who has the brain cell\n\n" +
      "**General:**\n" +
      "`!!pass`: Pass the brain cell to someone else randomly\n" +
      "`!!pass [@role]`: pass the braincell to someone specific\n\n";

    msg.reply(helpMessage);
  };

  const setgrouprole = (message) => {
    const groupRole = message.split(" ");
    const roleTag = groupRole[1].slice(3, -1);

    const roleChoice = await msg.channel.guild.roles.fetch(roleTag);
    if (!roleChoice) {
      msg.reply(
        "You're a few braincells short of a role there.\n Remember, the role needs to be pingable in the roles options."
      );
    }

    const addGroupRole = `UPDATE servers SET braincell_group_id = ${roleTag}`;
    // const addGroupRole = `UPDATE servers SET braincell_group_id = ${roleTag}`;

    const test = await pool.query(addGroupRole);
    console.log(test);

    msg.reply(
      "```diff\n+ Empty brainlet group has been set! Homes now available!```"
    );
  }

  const setcellrole = (message) => {
    if(!hasParams(message)){
      return 
    }
    // check the roll exists
    // if it doesn't, then respond in kind "Here, pall. fuck off."
    // if it does. store against the guild id.
    // check if both brainlets and cell are set. If they are, let them know who's got the starting cell.
  }

  const who = () => {
    // respond who has the role right now.
  }

  const pass = (message) => {
    if(!hasParams(message)){
    // check timestamp to make sure they are within the time limit.
    // if not, return "NOPE. IM COMFY. Maybe in another xx:xx"
    // pick a random cunt to send it to
    // remove the role from the previous person if there was one
    // add role to the new person
    // set timestamp

      return 
    }

        // check timestamp to make sure they are within the time limit.
    // if not, return "NOPE. IM COMFY. Maybe in another xx:xx"
    // pass it to them specifically.
    // set timestamp
  }

  const messageMap = {
    "!!help": help,
    "!!setgrouprole": setgrouprole,
    "!!setcellrole": setcellrole,
    "!!who": who,
    "!!pass": pass
  };

  const commands = message.split(/\s+/)
  if(commands.length > 0){
    const topLevelCommand = commands[0]
    messageMap[topLevelCommand](message)
  }
  // setup commands

  // general commands

  // stupid things

  // msg.reply("Poggers");
});

client.login(process.env.DISCORD_TOKEN);
