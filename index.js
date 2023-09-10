console.clear()
require('dotenv').config()
const { Telegraf } = require('telegraf')
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth  } = require('whatsapp-web.js');

//definição dos bots
const bot_surda = new Telegraf(process.env.TELEGRAM_SURDA)
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', async () => {
    console.log('Client is ready!');
});

bot_surda.on('text', async (ctx)=>{
  // The format of the message is x-y-z
  //x is the string to verify if the pereson who send the message has t
  // authorization
  //is the number of the patient
  //is the link to payment 
  const msg = ctx.message.text
  const msgInfo = msg.split("-")
  console.log(msgInfo)
  if(msgInfo.length !=3){
    console.log("msg not valid")
    return
  }

  if(msgInfo[0] != process.env.CODE_VAL_MSG){
    console.log("code not valid")
    return
  }

  const chatId = `55${msgInfo[1]}@c.us` 
  console.log(chatId)
  const textToSend = `Ola, aqui é da clinica eficazmente para confirmar sua consulta acesse o link:\n${msgInfo[2]}`
  const test = await client.sendMessage(chatId, textToSend);
  console.log(test)
})

client.initialize();
bot_surda.launch()