const { MessageEmbed } = require('discord.js');

const { sync, perGuildSettings, bot } = require(`${process.cwd()}/passthrough.js`);

const axios = require("axios");

const { version, defaultPrimaryColor } = sync.require(`${process.cwd()}/config.json`);

const utils = sync.require(`${process.cwd()}/utils`);



module.exports = {
    name: 'movie',
    category: 'Fun',
    description: 'Gets basic information about a tv series',
    ContextMenu: {},
    syntax : '{prefix}{name} <series name>',
    options: [
        {
            name : "series",
            description : "the series to search for",
            type : 3,
            required : true
          }
    ],
    async execute(ctx) {


        const searchTerm = ctx.pureContent;

        const params = new URLSearchParams();
        params.append("query", ctx.pureContent);

        let response = undefined;

        const Embed = new MessageEmbed();
        Embed.setColor((ctx.member !== null) ? perGuildSettings.get(ctx.member.guild.id).color : defaultPrimaryColor);

        try {

            const request = {
                headers: {
                    'Authorization': `Bearer ${process.env.TMDB_API_KEY}`
                },
                params: params
            };
            response = (await axios.get(`${process.env.TMDB_API}/search/tv`,request)).data;


            const seriesData = response.results[0];

            Embed.setURL(process.env.WEBSITE);

            Embed.setTitle(seriesData.name);

            Embed.setDescription(seriesData.overview);

            Embed.setImage(`https://image.tmdb.org/t/p/original${seriesData.poster_path}`);


            Embed.addField("Rating", `${seriesData.vote_average}/10`);

            Embed.addField("First Air Date", seriesData.first_air_date || "Unknown");

           utils.reply(ctx, { embeds: [Embed] });

        } catch (error) {
            Embed.setFooter({ text : "Series Not Found" });

           utils.reply(ctx, { embeds: [Embed] });
            utils.log(`\x1b[31mError Searching for Series\x1b[0m\n`,error);
        }

    }
}