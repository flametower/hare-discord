module.exports = {
    name:'sauce',
    alias:'s',
    desc:'ask the lamb sauce, use `sauce </^\d{1,}$/>`',
    async execute(client,msg,args){
        const code = args[0];
        /* if(/^\d{1,}$/.test(code)) msg.channel.send('https://nhentai.net/g/'+args[0]+'/') */
        if (args.length === 0) msg.channel.send('Where is the LAMB SAUCE?')
        else if(code.match(/^\d{1,}$/)) msg.channel.send('https://nhentai.net/g/'+args[0]+'/')
        else msg.channel.send('use `hare (sauce||s) </^\d{1,}$/>`')
    }
}