import 'dotenv/config';
import { Telegraf, Markup } from 'telegraf';
import axios from 'axios';

const token = process.env.BOT_TOKEN;
if (token === undefined) {
  throw new Error('BOT_TOKEN must be provided!');
}

const bot = new Telegraf(token);

bot.use(Telegraf.log());

bot.start(async (ctx) => {
  const description =
    'Привет! Это электронное расписание занятий, которое будет удобным и доступным для студентов и преподавателей колледжа. Вот доступные мне команды:';

  return await ctx.reply(
    description,
    Markup.keyboard([
      ['Вывести все группы', '1'],
      ['2', '3'],
      ['4', '5', '6']
    ])
      .oneTime()
      .resize()
  );
});

bot.hears('Вывести все группы', async (ctx) => {
  try {
    const response = await axios.get('http://212.193.62.200:3007/api/group');

    const limitedResponse = JSON.stringify(response.data, null, 2).slice(0, 4000);

    ctx.replyWithHTML(`<code>${limitedResponse}</code>`);
  } catch (error) {
    console.error('Error fetching data from API:', error);
    ctx.replyWithMarkdown(`*Error fetching data from API:*\n\`${error.message}\``);
  }
});

bot.launch();

bot.on('text', (ctx) => {
  const userMessage = ctx.message.text;
  ctx.reply(`Извините, неизвестная команда: ${userMessage}`);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
