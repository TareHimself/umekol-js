process.chdir(__dirname);

const Cluster = require("discord-hybrid-sharding");

const ps = require('./passthrough.js');

const { Client, Intents, CommandInteractionOptionResolver } = require('discord.js');

const sync = ps.sync;

const chokidar = require('chokidar');   

const { Manager } = require("lavacord");

const fs = require('fs');
const { defaultPrefix, defaultPrimaryColor } = sync.require(`${process.cwd()}/config.json`);

// bot Intents
const clientOptions = {
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ],
    shards: Cluster.data.SHARD_LIST,
    shardCount: Cluster.data.TOTAL_SHARDS,

    partials: ['MESSAGE', 'CHANNEL']
}

// Setup settings and configs
const bot = new Client(clientOptions);
Object.assign(ps, { bot: bot });
bot.cluster = new Cluster.Client(bot); //Init the Client & So we can also access broadcastEval...

const utils = sync.require(`./utils`);


bot.on('ready', async () => {
    

    

    utils.log('\x1b[32mBot Ready\x1b[0m');

    setInterval(() => bot.user.setActivity(`${bot.guilds.cache.size} Servers`,{type: 'WATCHING'}), 20000);

    

    // Volcano nodes
    const nodes = [
        { id: "1", host: "localhost", port: 2333, password: process.env.LAVALINK_PASSWORD }
    ];

    // Initilize the Manager with all the data it needs
    const LavaManager = new Manager(nodes, {
        user: bot.user.id,
        shards: bot.options.shardCount,
        send: (packet) => {

            const guild = bot.guilds.cache.get(packet.d.guild_id);
            return guild.shard.send(packet);

        }
    });

    Object.assign(ps, { LavaManager: LavaManager });

    try {
        await LavaManager.connect();
        
        utils.log("\x1b[32mConnected to Music provider\x1b[0m");
    } catch (error) {
        utils.log('\x1b[31mError connecting to music provider\x1b[0m\n',error);
        ps.disabledCategories.push('Music');
    }
    

    bot.ws
        .on("VOICE_SERVER_UPDATE", ps.LavaManager.voiceServerUpdate.bind(ps.LavaManager))
        .on("VOICE_STATE_UPDATE", ps.LavaManager.voiceStateUpdate.bind(ps.LavaManager))
        .on("GUILD_CREATE", async data => {
            for (const state of data.voice_states) await ps.LavaManager.voiceStateUpdate({ ...state, guild_id: data.id });
        });

    LavaManager.on("error", (error, node) => {
        utils.log('\x1b[31mLavalink error\x1b[0m\n',error);
    });


    try {
        // Loads other modules once done
        const guildDataModule = sync.require('./handlers/handle_guild_data');
        await guildDataModule.load();

        const levelingModule = sync.require('./handlers/handle_leveling');
        const eventsModule = sync.require('./handlers/handle_events');
    } catch (error) {
        utils.log('\x1b[31mError loading modules\x1b[0m\n',error);
    }

    await utils.getOsuApiToken();

    await utils.getSpotifyApiToken();

    // Commands loading and reloading
    chokidar.watch('./commands', { persistent: true, usePolling: true }).on('all', (event, path) => {
        utils.handleCommandDirectoryChanges(event,path);
    });

});

bot.login(process.env.CURRENT_BOT_TOKEN);


sync.events.on("error", console.log);


