// .env setup
require('dotenv').config();
const TOKEN = process.env.TELEGRAM_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const options = {
    polling: true
};

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(TOKEN, options);

/**
 * This example demonstrates using polling.
 * It also demonstrates how you would process and send messages.
 * https://github.com/yagop/node-telegram-bot-api/blob/master/examples/polling.js
 */

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
});

// Matches /photo
bot.onText(/\/photo/, function onPhotoText(msg) {
    // From file path
    const photo = `${__dirname}/files/computer.gif`;
    bot.sendPhoto(msg.chat.id, photo, {
        caption: "I'm a computer!"
    });
});

// Matches /audio
bot.onText(/\/audio/, function onAudioText(msg) {
    // From HTTP request
    // const url = 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg';
    // const audio = request(url);
    const audio = 'files/example.ogg';
    bot.sendAudio(msg.chat.id, audio);
});

// Matches /love
bot.onText(/\/love/, function onLoveText(msg) {
    const opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
            keyboard: [
                ['Yes, you are the bot of my life ❤'],
                ['No, sorry there is another one...'],
                ['Nope.']
            ]
        })
    };
    bot.sendMessage(msg.chat.id, 'Do you love me?', opts);
});

/*
// Matches /echo [whatever]
bot.onText(/\/echo (.+)/, function onEchoText(msg, match) {
    const resp = match[1];
    bot.sendMessage(msg.chat.id, resp);
});
*/

// Matches /editable
bot.onText(/\/editable/, function onEditableText(msg) {
    const opts = {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Edit Text',
                        // we shall check for this value when we listen
                        // for "callback_query"
                        callback_data: 'edit'
                    }
                ]
            ]
        }
    };
    bot.sendMessage(msg.from.id, 'Original Text', opts);
});

// Handle callback queries
// https://core.telegram.org/bots/api#callbackquery
bot.on('callback_query', function onCallbackQuery(callbackQuery) {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    const opts = {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
    };
    let text;

    if (action === 'edit') {
        text = 'Edited Text';
    }

    bot.editMessageText(text, opts);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, 'I am received your message. Processing...');
});