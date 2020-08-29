// bot joins server, messages person who added it
// person sets up roles


require('dotenv').config()

const Discord = require('discord.js');
const client = new Discord.Client();

let command;
let guild;
let brainyBoi;
let roleId = process.env.ROLE_ID;
let totalUsers;

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


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {

  if(msg.bot){
      return;
  }

  command = msg.content.toLowerCase();

  if(command === "!!pass"){
    if(chosen_users.includes(msg.author.id)){
        guild = msg.guild.members.fetch().then(fetchedMembers => {
            console.log(fetchedMembers)

            // brainyBoi = fetchedMembers.filter(member => member.guild._roles.includes(process.env.ROLE_ID) === true);
               brainyBoi = msg.guild.roles.get(process.env.ROLE_ID).members.map(m=>m.user.tag);
            // brainyBoi = guild.roles.get(roleId).members;
            // brainyBoi = brainyBoi[0];
               console.log(brainyBoi);
        });

        //message.channel.send(memberCount + " members have this role!");        
    }else{
        msg.reply("The brain cell has determined that was a lie.")
    }    
  }


});

client.login(process.env.DISCORD_TOKEN);