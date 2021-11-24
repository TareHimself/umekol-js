const { MessageEmbed } = require('discord.js');
const ps = require(`${process.cwd()}/passthrough`);

module.exports = {
    name: 'help',
    category: 'Main',
    description: 'shows help',
    ContextMenu: {},
    options: [
        {
            name: 'command',
            description: "The specific command to get help on",
            type: 3,
            required: false
        }
    ],
    async execute(ctx) {
        
            const fields = new Array();

            let prefix = '?';

            const helpEmbed = new MessageEmbed();
            helpEmbed.setColor(ps.bot.primaryColor);
            helpEmbed.setTitle('Help For Commands\n');
            helpEmbed.setURL('https://www.oyintare.dev/');

            ps.bot.commands.forEach(function (value, key) {
                let syntax = "";
                syntax += `${prefix}${value.name} `;

                value.options.forEach(function (option, index) {
                    syntax += ` <${option.name}> `;
                });

                syntax = `\`${syntax}\``;

                helpEmbed.addField(key, `${value.description} \n Syntax: ${syntax} \n`, false);
            })

            helpEmbed.setTimestamp()

            await ctx.reply({ embeds: [helpEmbed] });
        

    }
}