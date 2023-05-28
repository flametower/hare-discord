module.exports = {
    name:'call',
    desc:'ping the bot',
    async execute(client,msg,args){
        msg.channel.send('System online. Drinking energy drink rn')
    }
}