const Discord = require('discord.js');
const { Player } = require("discord-player")
const client = new Discord.Client({
    intents:[
        Discord.IntentsBitField.Flags.Guilds,
        Discord.IntentsBitField.Flags.GuildMembers,
        Discord.IntentsBitField.Flags.GuildMessages,
        Discord.IntentsBitField.Flags.MessageContent,
        Discord.IntentsBitField.Flags.GuildVoiceStates,
    ]
})

client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

const prefix = "!hare"

const fs = require('fs');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./command/').filter(file => file.endsWith('.js'))
for(const file of commandFiles){
    const command = require(`./command/${file}`)
    client.commands.set(command.name,command);
}

client.once('ready',(c) => {
    console.log("standby")
})

client.on("messageCreate", async (msg) => {
    if(!msg.content.startsWith(prefix) || msg.author.bot) return

    const args = msg.content.slice(prefix.length+1).split(/ +/);
    const command = client.commands.get(args[0])
    if (args[0] === "help" || args[0] === "h"){
        var commandListString = `\`help\` or \`h\` - This command\n`
        client.commands.forEach(element => {
            commandListString = commandListString + `\`${element.name}\` - ${element.desc}\n`
        });
        const listEmbed = new Discord.EmbedBuilder()
                .setTitle(`**Command List**`)
                .setDescription(commandListString)
            return msg.channel.send({ embeds: [listEmbed] });
        /* return msg.channel.send('DEV MASIH MALES KASIH DOKUMENTASHIT SAMA HELP\n\n "sabar anjir beresin dlu fiturnya" -F'); */
    }
    args.shift().toLowerCase();
    if (command) command.execute(client,msg,args)
    /* if (msg.author.username === "FlameTower") {
      msg.reply("i schleep");
    } */
  })

client.login(
    "MTA5MTk1OTg0Nzc4NTg3NzUwNA.G4_RjG.ubLWBqFYCuU2o2Nt8mo99Q5kxUMzw0K1kVu24U"
);
