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

const prefix = "hare"

const fs = require('fs');
const commandDirectory = __dirname+'/command/';
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync(commandDirectory).filter(file => file.endsWith('.js'))
for(const file of commandFiles){
    const command = require(commandDirectory+file)
    client.commands.set(command.name,command);
}

client.once('ready',(c) => {
    console.log("standby")
})

client.on("messageCreate", async (msg) => {
    if(!msg.content.startsWith(prefix) || msg.author.bot) return

    const args = msg.content.slice(prefix.length+1).split(/ +/);
    const command = client.commands.get(args[0]) || client.commands.find(cmd => cmd.alias === args[0]);
    if (args[0] === "help" || args[0] === "h"){
        var commandListString = `\`help\` or \`h\` - This command\n`
        client.commands.forEach(element => {
            if (element.name === "call") {
                commandListString = commandListString + `\`${element.name}\`- ${element.desc}\n`
            } else {
                commandListString = commandListString + `\`${element.name}\` or \`${element.alias}\` - ${element.desc}\n`
            }
        });
        const listEmbed = new Discord.EmbedBuilder()
                .setTitle(`**Command List**`)
                .setDescription(commandListString)
            return msg.channel.send({ embeds: [listEmbed] });
    }
    args.shift().toLowerCase();
    if (command) command.execute(client,msg,args)
    else return msg.channel.send("Use `hare help` to access commands available");
    /* if (msg.author.username === "FlameTower") {
      msg.reply("i schleep");
    } */
  })

client.login(
    process.env.LOGIN_TOKEN
);
