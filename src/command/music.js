const { useMasterPlayer, useQueue } = require("discord-player")
const { EmbedBuilder, MessageEmbed } = require("discord.js")

module.exports = {
    name:'music',
    alias: 'm',
    desc:'music player, for more info use \`hare music help\`',
    subcommands: 
        [
            {
                name:'play',
                alias:'p',
                desc:'Play a song'
            },
            {
                name:'pause',
                alias:'g',
                desc:'Pause or resume'
            },
            {
                name:'skip',
                alias:'s',
                desc:'Skip track'
            },
            {
                name:'queue',
                alias:'q',
                desc:'See queue'
            }, 
            {
                name:'remove',
                alias:'r',
                desc:'remove from queue, use \`r <Queue Number>\` to remove'
            },
            {
                name:'disconnect',
                alias:'d',
                desc:'Stop all music'
            },
        ],
    
    async execute(client,msg,args){
        const voiceChannel = msg.member.voice.channel;

        if (args[0] === 'help' || args[0] === 'h'){
            var commandListString = `\`help\` or \`h\` - This command\n`
            this.subcommands.forEach(element => {
                commandListString = commandListString + `\`${element.name}\` or \`${element.alias}\` - ${element.desc}\n`
            });
            const listEmbed = new EmbedBuilder()
                .setTitle(`**Command List Music**`)
                .setDescription(commandListString)
            return msg.channel.send({ embeds: [listEmbed] });
            /* return msg.channel.send('DEV MASIH MALES KASIH DOKUMENTASHIT SAMA HELP\n\n "sabar anjir beresin dlu fiturnya" -F'); */
        }
        // Wait until you are connected to the channel
        if (!voiceChannel) return msg.channel.send('You need to be in a voice channel to execute this command!');
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if (!permissions.has('CONNECT')) return msg.channel.send('You dont have the correct permissions');
        if (!permissions.has('SPEAK')) return msg.channel.send('You dont have the correct permissions');

        const player = useMasterPlayer();
        const queue = player.nodes.create(voiceChannel);
        
        //If the user has used the play command
        if (args[0] === 'play' || args[0] === 'p'){
            let songQuery = ""
            if(args.length < 2) return
            for(i = 1; i < args.length; i++){
                songQuery = songQuery +" "+args[i];
            }
            const result = await player.search(songQuery,{
                requestedBy: msg.author,
                searchEngine:"youtube"
            });
            // console.log(result.tracks[0])
            try {
                await player.play(voiceChannel, result, {
                     nodeOptions: {
                      metadata: {
                       channel: voiceChannel,
                       client: msg.author,
                       requestedBy: msg.author,
                      },
                      selfDeaf: true,
                      volume: 80,
                      leaveOnEmpty: true,
                      leaveOnEmptyCooldown: 300000,
                      leaveOnEnd: true,
                      leaveOnEndCooldown: 300000,
                     }
                    });
                const currentTrack = result.tracks[0]
                const currentEmbed = new EmbedBuilder()
                    .setDescription(`**[${currentTrack.title}](${currentTrack.url})** has been added to the Queue`)
                    .setThumbnail(currentTrack.raw.thumbnail.url)
                return msg.channel.send({ embeds: [currentEmbed] });
            } catch (error) {
                return msg.channel.send("Audio Error, video probably restricted");
            }
        }
        
        //If the user has used the disconnect command
        else if(args[0] === 'disconnect' || args[0] === 'd'){
            const queue = useQueue(msg.guild.id);
            if (!queue) return;
            // Deletes all the songs from the queue and exits the channel
            queue.delete();
            return msg.channel.send("Jazz music stopped");
        }

        //If the user has used the skip command
        else if(args[0] === 'skip' || args[0] === 's'){
            const queue = useQueue(msg.guild.id);
            if (queue.tracks.toArray().length <= 0) return msg.channel.send("There are no songs in the queue");
            queue.node.skip()
            return msg.channel.send("Track skipped haiya");
        }

        //If the user has used the pause/resume command
        else if(args[0] === 'pause' || args[0] === 'g'){
            const queue = useQueue(msg.guild.id);
            if (!queue.currentTrack) return msg.channel.send("No music being played");
            queue.node.setPaused(!queue.node.isPaused());//isPaused() returns true if that player is already paused
            return msg.channel.send(queue.node.isPaused() ? `Paused`: `Resumed`);
        }

        //If the user has used the remove from queue command
        else if(args[0] === 'remove' || args[0] === 'r'){
            const trackNumber = args[1];
            if (!trackNumber.match(/^\d{1,}$/)||trackNumber <= 0) return
            const queue = useQueue(msg.guild.id);
            const tracks = queue.tracks.toArray()
            if(tracks.length < trackNumber) return
            const title = tracks[trackNumber-1].title; //Converts the queue into a array of tracks
            queue.removeTrack(trackNumber-1); //Remember queue index starts from 0, not 1
            return msg.channel.send(`**${title}** Removed from queue`);
        }

        //If the user has used the queue command
        else if(args[0] === 'queue' || args[0] === 'q'){
            const queue = useQueue(msg.guild.id);
            const tracks = queue.tracks.toArray(); //Converts the queue into a array of tracks
            const currentTrack = queue.currentTrack; //Gets the current track being played
            if (!tracks && !currentTrack)
            {
                await msg.channel.send("There are no songs in the queue");
                return;
            }
            const queueString = tracks.slice(0, 10).map((song, i) => {
                return `${i+1}) \`[${song.duration}]\` ${song.title} - <@${song.requestedBy.id}>`
            }).join("\n")
            const queueEmbed = new EmbedBuilder()
                .setDescription(`**Currently Playing**\n` + 
                        (currentTrack ? `\`[${currentTrack.duration}]\` ${currentTrack.title} - <@${currentTrack.requestedBy.id}>` : "None") +
                        `\n\n**Queue**\n${queueString}`
                    )
                    .setThumbnail(currentTrack.raw.thumbnail.url)
            return msg.channel.send({ embeds: [queueEmbed] });
        }
        else return msg.channel.send("Use `hare (music||m) (help||h)` to access commands available");
    }
}