const { Queue } = require(`${process.cwd()}/handlers/handle_music_queue`);

module.exports = {
    name: 'loop',
    category: 'Music',
    description: 'sets the loop state of the Queue',
    ContextMenu: {},
    options: [
        {
            name: 'newLoopState',
            description: '\'on\' to loop and \'off\' to not loop',
            type: 3,
            required: false
        }
    ],
    async execute(bot, ctx) {
        
            if (!ctx.guild || !ctx.member.voice.channel) return ctx.reply("You need to be in a voice channel to use this command");

            const Queue = bot.Queues.get(ctx.member.guild.id);

            if (Queue == undefined) return ctx.reply("Theres no Queue");

            Queue.setLooping(ctx);
        

    }
}