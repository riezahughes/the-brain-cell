require('dotenv').config()

const Discord = require('discord.js');
const client = new Discord.Client();

let command;
let guild;
let brainyBoi;
let roleId = process.env.ROLE_ID;
let totalUsers;


let chosen_users=[
    "48281847985078272",
    "104670340541595648",
    "121632246653386762",
    "152194558774476801",
    "105153919688122368",
    "110455196026421248",
    "116599450339639305",
    "177502257061953536",
    "177502257061953536",
    "226082256920379392"
]

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