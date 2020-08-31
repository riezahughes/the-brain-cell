# Discord Brain Cell

Just pass it along to people of your choosing

### Installation:

Make a copy of `.env.example`.  Rename it to just `.env`.

`DISCORD_TOKEN` - Your Discord Bot Token generated from the developer discord panel.

`POSTGRES_USER` - The name of the user you want for your database

`POSTGRES_PASSWORD` - The password you want to use for the user.

`POSTGRES_DB` - The name of the database you want to create

`POSTGRES_HOST` - Where the host for postgres is. If you are using anything but docker toolbox this should just be `localhost`

run `docker-compose up -d` in the main directory to spin up postgres with your details.

run `npm install` to install all neccessary packages

run `DATABASE_URL=postgres://[user]:[pass]@[host]:5432/[db] npm run migrate up`, replacing brackets with your details.

After that, it's just a simple `node ./src/index.js`. I could have added it to the package.json for npm start, but eh. Later.

### Setup:

- Invite the bot to your server
- Create two generic roles. One for people who want to play, (EG: Brainless Peeps) and one for the Brain Cell Itself (Token Brain Cell). Each of these should have the taggable toggle on
- Adjust them in the roles settings so that the bot is above both of these roles. (it won't have permissions to add and remove if it doesn't)
- type `!!setgrouprole [tag role for group]`
- type `!!setcellrole [tag role for cell]`

All done. A lot of extra steps, but it's worth it once its set up. People can just add roles to others who want to join in. 

### If you have the braincell: 

`!!pass` - pass to the next random person

`!!pass [username]` - pass it to someone specifically. (WIP)

### Everyone can:

`!!who` - Find out who currently has it. (WIP)

### Server Admins Can: 

`!!lobotomy` - pick another random person instead.

### Future things if i'm in the mood:

- Dockerise the bastard properly
- Set Timers Correctly (Currently not set up)