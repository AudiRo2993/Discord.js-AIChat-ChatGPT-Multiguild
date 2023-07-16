const collection = new Map();
const { EmbedBuilder, PermissionsBitField, Collection, ChannelType, Client } = require("discord.js");

module.exports = {
  name: "messageCreate",
  /**
   * @param {import("discord.js").Message} message
   * @param {import("../../Structures/bot")} client
   */
  async execute(message, client) {
  if(client.settings.has(message.guild.id)) {
    if(client.settings.get(message.guild.id, "aichat")) {
        const data = client.settings.get(message.guild.id, "aichat")
        const { Configuration, OpenAIApi } = require("openai"); //npm i openai
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        
    //INFO
    const botName = "Razen"
    const developerName = "audiro"
    const mainGuild = "Razen's Empire"

    /**
     * @INFO The following code was made by elitex and is available on github.com: https://github.com/Elitex07/Chat-Gpt-Discord-Bot
     */
        let prompt = [
            {"role": "system", "content": `You are a discord bot named ${botName}, your purpose is to talk as humanly possible, use today's words and provide asisstance and guidance. You were made by ${developerName}.`},
            {"role": "user", "content": `Who are you?`},
            {"role": "assistant", "content": `Hey, i'm ${botName}, your personal AI Chatbot running on GPT 3.5 Turbo, i was made by ${developerName}, a very good programmer.`},
            {"role": "user", "content":`Who is ${developerName}?`},
            {"role": "assistant", "content":`${developerName} Is my developer and my favourite person, since he fixes bugs, develops new features, and aims for a really nice bot! My main server is ${mainGuild}, you should check it out!`},
          ];
        if(data.aichatChannel === message.channel.id && data.enabled) {
            if(message.author.bot) return;
            if(!message.guild) return;
try {
            collection.forEach((value, key) => {
                let l = value[value.length - 1];
            if(!l || !l[0]) collection.delete(key);
                if(Date.now() - l[0] >= 60*1000) collection.delete(key)
            });
    
            if(!message.channel.permissionsFor(client.user.id).has(PermissionsBitField.Flags.SendMessages)) return;
            
    
            message.channel.sendTyping().catch(e => {null}); 
    
            if(!collection.has(message.author.id)){
                collection.set(message.author.id, []);
            }
    
            let userm = collection.get(message.author.id);
            if(!userm || !Array.isArray(userm)) userm = [];
            userm = userm.filter(d => d && d[0]);
            userm = userm.filter(d => 60*1000 - (Date.now() - d[0]) >= 0);
    
            // Intoduce the user
            let prev = [
                {'role':'user', 'content':`Hi! My name is ${message.member.displayName}`},
                {'role':'assistant', 'content': `Nice to meet you ${message.member.displayName}!`}
            ];
            await userm.forEach(async d => { //`${message.member.displayName}: ${d[1]}\n\`;
                let userline = [d[1]]; //Array Element
                let botline = userline.concat([d[2]]);
                prev = prev.concat(botline);
            });
    
            let b = prompt.concat(prev).concat([{"role":"user", "content": message.cleanContent}]);
            //console.log(b)
    
            const configuration = new Configuration({
                apiKey: process.env.OPENAI_API_KEY,
            });
            const openai = new OpenAIApi(configuration);
            var err = false;
            const response = await openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: b,
                temperature: 0.9,
                max_tokens: 1500,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0.6,
            }).catch(async e => {
                console.log(`${e}`.red);
                err = true;
                await message.channel.send({content: `Something went wrong while generating your response. Please google the following error code:`.concat(e)});
            });
    
            if(err || !Array.isArray(response.data.choices)) return;
            
            let reply = response.data.choices[0]?.message?.content;
    
            message.reply({content: reply, allowedMentions: {repliedUser: false}})
            .catch(async e => {
                err = true
                console.log(e)
            });
    
            if(err) return;
            
            userm.push([Date.now(), {"role":"user", "content": message.cleanContent}, {"role":"assistant", "content": reply}]);
            collection.set(message.author.id, userm);
            
            return;
        } catch(e){
            console.log(`[AI-Chat] ${e}`.red);
        }
        }
    }
  }
  },
};
