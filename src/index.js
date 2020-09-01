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

client.on('message', async (msg) => {

  if(msg.author.bot){
      return;
  }

  const message = msg.content.toLowerCase();

  if (message === "!!help"){
    
    const helpMessage = 
    "\n\n**Setup:**\n" +
    "***Make Two Roles. One for the group of people to share it and one for the actual brain cell. Make both taggable***"
    "`!!setgrouprole [@role]`: set the role that the bot will use for brainless folk\n" +
    "`!!setcellrole [@role]`: set the role that the bot will use for who has the brain cell\n\n" +

    "**General:**\n" +
    "`!!pass`: Pass the brain cell to someone else randomly\n" +
    "`!!pass [@role]`: pass the braincell to someone specific\n\n";

    msg.reply(helpMessage);
  }

  if (message.includes("!!setgrouprole <@")){

    // check the roll exists
    const groupRole = message.split(" ");
    const roleTag = groupRole[1].slice(3, -1);

    const roleChoice = await msg.channel.guild.roles.fetch(roleTag);
    if(!roleChoice){
      msg.reply("You're a few braincells short of a role there.\n Remember, the role needs to be pingable in the roles options.");
    }

    const addGroupRole = `UPDATE servers SET braincell_group_id = ${roleTag} WHERE guild_id = ${msg.guild.id} RETURNING*`;
    const updateTimeStamp = `UPDATE servers SET last_moved = NOW()`;

    const updatedResults = await pool.query(addGroupRole);

    if(updatedResults.rows[0].braincell_singular_id){

      const Role = msg.guild.roles.cache.find(role => role.id == updatedResults.rows[0].braincell_group_id);

      // console.log(Role);
      
      const Members = msg.guild.members.cache.filter(member => member.roles.cache.find(role => role == Role)).map(member => member.user.tag);
      const Members_Id = msg.guild.members.cache.filter(member => member.roles.cache.find(role => role == Role)).map(member => member.user.id);

      // console.log(Members);

      const chosenArr = Math.floor(Math.random() * Members.length);

      // console.log("Chosen Key:");
      // console.log(chosenArr);

      const brainPeeps = msg.guild.members.cache.filter(member => member.roles.cache.find(role => role == updatedResults.rows[0].braincell_singular_id)).map(member => member.user.id);

      if(brainPeeps.length !== 0){
        brainPeeps.map(async (peep) => {
          console.log("Peeps:");
          console.log(peep);
          const guildMember = await msg.guild.members.cache.get(peep);
          await guildMember.roles.remove(updatedResults.rows[0].braincell_singular_id);
        })

      }

      // console.log(brainPeeps);

      const giveRole = await msg.guild.members.cache.get(Members_Id[chosenArr]);
      console.log(giveRole);

      await giveRole.roles.add(updatedResults.rows[0].braincell_singular_id); 

      const embed = new Discord.MessageEmbed({
        "title": `You're all set up! The brain cell has been passed to ${Members[chosenArr]} !`,
        "description": `Keep it safe for the next few minutes`,
        "color": "f05bd7"
      }); 

      await pool.query(updateTimeStamp);

      return msg.channel.send(`<@&${updatedResults.rows[0].braincell_group_id}>`, {embed});

      // msg.reply(```diff\n+You're all set! Braincell given to ${chosen}```)
      // return;
    }

    msg.reply("```diff\n+ Empty brainlet group has been set! Homes now available!```")

  }

  if (message.includes("!!setcellrole <@")){
  
    // check the roll exists
    const userRole = message.split(" ");
    const roleTag = userRole[1].slice(3, -1);

    // console.log(roleTag);

    const roleChoice = await msg.channel.guild.roles.fetch(roleTag);
    if(!roleChoice){
      msg.reply("You're a few braincells short of a role there.\n Remember, the role needs to be pingable in the roles options.");
    }

    // console.log(msg.guild.id);

    const addUserRole = `UPDATE servers SET braincell_singular_id = ${roleTag} WHERE guild_id = ${msg.guild.id} RETURNING*`;
    const updateTimeStamp = `UPDATE servers SET last_moved = NOW()`;

    // const addGroupRole = `UPDATE servers SET braincell_group_id = ${roleTag}`;

    const updatedResults = await pool.query(addUserRole).catch((e) => {console.log(e)});
    // console.log()

    if(updatedResults.rows[0].braincell_group_id){

      const Role = msg.guild.roles.cache.find(role => role.id == updatedResults.rows[0].braincell_group_id);

      // console.log(Role);
      
      const Members = msg.guild.members.cache.filter(member => member.roles.cache.find(role => role == Role)).map(member => member.user.tag);
      const Members_Id = msg.guild.members.cache.filter(member => member.roles.cache.find(role => role == Role)).map(member => member.user.id);

      // console.log(Members);

      const chosenArr = Math.floor(Math.random() * Members.length);

      const brainPeeps = msg.guild.members.cache.filter(member => member.roles.cache.find(role => role == updatedResults.rows[0].braincell_singular_id)).map(member => member.user.id);

      if(brainPeeps.length !== 0){
        brainPeeps.map(async (peep) => {
          const guildMember = await msg.guild.members.cache.get(peep);
          await guildMember.roles.remove(updatedResults.rows[0].braincell_singular_id);
        })
      }

      const giveRole = await msg.guild.members.cache.get(Members_Id[chosenArr]);

      await giveRole.roles.add(updatedResults.rows[0].braincell_singular_id); 

      const embed = new Discord.MessageEmbed({
        "title": `You're all set up! The brain cell has been passed to ${Members[chosenArr]} !`,
        "description": `Keep it safe for the next few minutes`,
        "color": "f05bd7"
      }); 

      await pool.query(updateTimeStamp);

      return msg.channel.send(`<@&${updatedResults.rows[0].braincell_group_id}>`, {embed});

    }

    msg.reply("```diff\n+ Brain Cell Role has been set! Ready to go hunting! Just set the group role and we'll be good to go!```")

  }

  if (message === "!!who"){ 

    const pullRow = `SELECT * FROM servers WHERE guild_id = ${msg.guild.id}`;

    const checkRow = await pool.query(pullRow);

    const brainPeep = msg.guild.members.cache.filter(member => member.roles.cache.find(role => role == checkRow.rows[0].braincell_singular_id)).map(member => member.user.tag);
  
    if(brainPeep.length === 0){

      const embed = new Discord.MessageEmbed({
        "title": `:brain: The Brain Cell has gone for walkies. !`,
        "description": `Keep it safe for the next 15 minutes`,
        "color": "ff0000"
      }); 
  
      return msg.channel.send(`<@${Members_Id[chosenArr]}>`, {embed});
    }

    const embed = new Discord.MessageEmbed({
      "title": `:brain: ${brainPeep} currently has it!`,
      "description": `Ask them to pass it along!`,
      "color": "f05bd7"
    }); 
    return msg.channel.send({embed});

  }

  if (message === "!!pass"){

    // console.log(msg.guild.id);
    const pullRow = `SELECT * FROM servers WHERE guild_id = ${msg.guild.id}`;

    const checkRow = await pool.query(pullRow);

    // console.log(checkRow.rows[0])
    // console.log(Date.now());

    const memberFind = await msg.guild.members.fetch(msg.author.id);

    if(!memberFind.roles.cache.has(checkRow.rows[0].braincell_group_id) ){

      const embed = new Discord.MessageEmbed({
        "title": `You're not able to join. Maybe your heads a little too full?`,
        "description": `Ask a mod for the role to play!`,
        "color": "ff0000"
      }); 

      return msg.channel.send(`<@${msg.author.id}>`, {embed});

      //await pool.query(updateTimeStamp);
    }

    if(!memberFind.roles.cache.has(checkRow.rows[0].braincell_singular_id)){

      const embed = new Discord.MessageEmbed({
        "title": `:brain: You don't have the brains to do that. Sorry!`,
        "description": `Someone else has the token brain cell!`,
        "color": "ff0000"
      }); 

      return msg.channel.send(`<@${msg.author.id}>`, {embed});

      //await pool.query(updateTimeStamp);      
    }

      const fifteenMinutes = 1000 * 60 * 1; 
      const fifteenMinutesAgo = Date.now() - fifteenMinutes;

      const getLastMoveTime = new Date(checkRow.rows[0].last_moved); // some mock date
      const lastMoveTime = getLastMoveTime.getTime(); 


      if(lastMoveTime < fifteenMinutesAgo){
        
        const updateTimeStamp = `UPDATE servers SET last_moved = NOW()`;

        const Role = msg.guild.roles.cache.find(role => role.id == checkRow.rows[0].braincell_group_id);
        
        const Members = msg.guild.members.cache.filter(member => member.roles.cache.find(role => role == Role)).map(member => member.user.tag);
        const Members_Id = msg.guild.members.cache.filter(member => member.roles.cache.find(role => role == Role)).map(member => member.user.id);
  
        // console.log(Members);
  
        const chosenArr = Math.floor(Math.random() * Members.length);

        console.log(Members.length)
        console.log(chosenArr);
  
        const brainPeeps = msg.guild.members.cache.filter(member => member.roles.cache.find(role => role == checkRow.rows[0].braincell_singular_id)).map(member => member.user.id);
  
        if(brainPeeps.length !== 0){
          brainPeeps.map(async (peep) => {
            const guildMember = await msg.guild.members.cache.get(peep);
            await guildMember.roles.remove(checkRow.rows[0].braincell_singular_id);
          })
        }
  
        // console.log(brainPeeps);
        // console.log(chosenArr);
  
        const giveRole = await msg.guild.members.cache.get(Members_Id[chosenArr]);
  
        await giveRole.roles.add(checkRow.rows[0].braincell_singular_id); 
  
        const embed = new Discord.MessageEmbed({
          "title": `:brain: The brain cell has been passed to ${Members[chosenArr]} !`,
          "description": `Keep it safe for the next 15 minutes`,
          "color": "f05bd7"
        }); 
  
        await pool.query(updateTimeStamp);
  
        return msg.channel.send(`<@${Members_Id[chosenArr]}>`, {embed});

      }else{
        const timeLeft = Math.floor((fifteenMinutesAgo - lastMoveTime) / 60);
        const embed = new Discord.MessageEmbed({
          "title": `Hey! I'm still pretty comfy here in this empty space!?`,
          "description": `Can't pass for at least ${timeLeft}`,
          "color": "ff0000"
        }); 
  
        msg.channel.send(`<@&${msg.author.id}>`, {embed});
      }
  }

  if (message.includes("!!pass <@")){
    //TBC
  }

  if (message === "!!lobotomy"){

    if(!msg.member.hasPermission("ADMINISTRATOR")){
      const embed = new Discord.MessageEmbed({
        "title": `:brain: Sorry! You don't have permission to shake the token braincell out`,
        "description": `Try asking a server admin!`,
        "color": "ff0000"
      }); 

      return msg.channel.send(`<@${msg.author.id}>`, {embed});         
    }
      const pullRow = `SELECT * FROM servers WHERE guild_id = ${msg.guild.id}`;

      const checkRow = await pool.query(pullRow);

      const updateTimeStamp = `UPDATE servers SET last_moved = NOW()`;

      const Role = msg.guild.roles.cache.find(role => role.id == checkRow.rows[0].braincell_group_id);
      
      const Members = msg.guild.members.cache.filter(member => member.roles.cache.find(role => role == Role)).map(member => member.user.tag);
      const Members_Id = msg.guild.members.cache.filter(member => member.roles.cache.find(role => role == Role)).map(member => member.user.id);

      // console.log(Members);

      const chosenArr = Math.floor(Math.random() * Members.length);

      const brainPeeps = msg.guild.members.cache.filter(member => member.roles.cache.find(role => role == checkRow.rows[0].braincell_singular_id)).map(member => member.user.id);

      if(brainPeeps.length !== 0){
        brainPeeps.map(async (peep) => {
          const guildMember = await msg.guild.members.cache.get(peep);
          await guildMember.roles.remove(checkRow.rows[0].braincell_singular_id);
        })
      }

      // console.log(brainPeeps);
      // console.log(chosenArr);

      const giveRole = await msg.guild.members.cache.get(Members_Id[chosenArr]);

      await giveRole.roles.add(checkRow.rows[0].braincell_singular_id); 

      const embed = new Discord.MessageEmbed({
        "title": `:brain: :zap: The servers been SHOOK and the braincell has been passed to ${Members[chosenArr]} !`,
        "description": `Keep it safe for the next 15 minutes`,
        "color": "f05bd7"
      }); 

      await pool.query(updateTimeStamp);

      return msg.channel.send(`<@&${checkRow.rows[0].braincell_group_id}>`, {embed});      
    
  }

});

client.login(process.env.DISCORD_TOKEN);