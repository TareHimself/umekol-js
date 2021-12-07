const { MessageEmbed } = require('discord.js');

const { sync, perGuildData, bot } = require(`${process.cwd()}/passthrough.js`);
const { reply } = sync.require(`${process.cwd()}/utils.js`);
const {version, defaultPrimaryColor} = sync.require(`${process.cwd()}/config.json`);

const osu = require('node-os-utils');

module.exports = {
    name: 'status',
    category: 'Main',
    description: 'get the bot status',
    ContextMenu: {},
    options: [],
    async execute(ctx) {
        
            const Embed = new MessageEmbed();
            Embed.setColor((ctx.member !== null) ? perGuildData.get(ctx.member.guild.id).pColor : defaultPrimaryColor);
            Embed.setTitle('Status');
            Embed.setURL('https://www.oyintare.dev/');

            let memory = await osu.mem.free();

            let cpu = await osu.cpu.usage();

            function pad(s) {
                return (s < 10 ? '0' : '') + s;
            }

            const seconds = bot.uptime;

            const secondsUp = parseInt(Math.floor(seconds % 60));

            const minutsUp = parseInt(Math.floor(seconds % (60 * 60) / 60));

            const hoursUp = parseInt(Math.floor(seconds / (60 * 60)));

            Embed.addField(`Version`, `${version}`, false);
            Embed.addField(`Language`, `Node JS`, false);
            Embed.addField(`UP Time`, ` ${pad(hoursUp)}Hrs ${pad(minutsUp)}Min ${pad(secondsUp)}Secs`, false);
            Embed.addField(`Guilds Count `, ` ${bot.guilds.cache.size}`, false);
            Embed.addField(`CPU Usage`, `${parseInt(cpu)}%`, false);
            Embed.addField(`Ram In Use`, `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, false);

            reply(ctx,{ embeds: [Embed] });

    }
}