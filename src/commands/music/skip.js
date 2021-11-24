
const ps = require(`${process.cwd()}/passthrough`);

module.exports = {
    name: 'skip',
    category: 'Music',
    description: 'skips the current song',
    ContextMenu: {},
    options: [],
    async execute(ctx) {
        
            if (!ctx.guild || !ctx.member.voice.channel) return ctx.reply("You need to be in a voice channel to use this command");

            const Queue = ps.queues.get(ctx.member.guild.id);

            if (Queue == undefined) return ctx.reply("Theres no Queue");

            Queue.skipSong(ctx);
        

    }
}