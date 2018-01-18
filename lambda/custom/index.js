'use strict';
var Alexa = require("alexa-sdk");
var koyomi = require('koyomi');
var moment = require("moment");
// For detailed tutorial on how to making a Alexa skill,
// please visit us at http://alexa.design/build
// TODO:dev
// https://ygoto3.com/posts/alexa-skill-development-efficiency/

exports.handler = function(event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const HELP_MESSAGE = "例えば「年号変換で今日は何年？」「年号変換で1981年は何年？」「年号変換で昭和56年は何年？」と言う風に聞いてください。"

var handlers = {
    'LaunchRequest': function () {
        this.emit('SayHello');
    },
    'MyNameIsIntent': function () {
        this.emit('SayHelloName');
    },
    'SayHello': function () {
        //起動のみの場合は使い方
        const WELCOME_MESSAGE = "年号変換へようこそ。"
        this.response.speak(WELCOME_MESSAGE+HELP_MESSAGE)
            //.cardRenderer('hello world', 'hello world');
        this.emit(':responseReady');
    },
    'SayHelloName': function () {
        console.log(this.event.request.intent.slots);
        const date = this.event.request.intent.slots.Date.value;
        const toEra = this.event.request.intent.slots.ToEra.value;
        const fromEra = this.event.request.intent.slots.FromEra.value;
        const fourYear = this.event.request.intent.slots.FourYear.value;
        const twoYear = this.event.request.intent.slots.TwoYear.resolutions && this.event.request.intent.slots.TwoYear.resolutions.resolutionsPerAuthority[0].values[0].value.id
        this.event.request.intent.slots.TwoYear.value;
        const fromYear = fourYear || twoYear
        //"{AnnoDomini} 年は {EraName} 何年",
        //"1981 年は 昭和 何年",
        console.log(this.event.request.intent.slots.Date,
                    this.event.request.intent.slots.Date.resolutions);
        var answer = "年号変換できません"
        if(date){//&& (!toEra || toEra==="和暦")
            //年号変換で今日は何年
            //年号変換で今日は和暦何年
            //年号変換で今日は昭和何年 not support yet
            console.log(moment(date.slice(0,4)).format("YYYY"))
            answer = `${date} は ${koyomi.format(date.slice(0,4),'GGN')} 年です`
        } else if(fourYear) {
            //年号変換で1981 年は 何年
            //年号変換で1981 年は 昭和 何年
            answer = `西暦 ${fourYear} は ${koyomi.format(fourYear,'GGN')} 年です`
        } else if(twoYear && fromEra) {
            //昭和 56年は 何年
            answer = `${fromEra} ${twoYear} は 西暦 ${koyomi.format(fromEra+twoYear+"年",'YYYY')} 年です`
        }
        //const answer = `${fromEra} ${fromYear} は ${toEra} 10年です`
        this.response.speak(answer)
            .cardRenderer('年号変換', answer);
        this.emit(':responseReady');
    },
    'SessionEndedRequest' : function() {
        console.log('セッションが以下の理由で中断されました: ' + this.event.request.reason);
    },
    'AMAZON.StopIntent' : function() {
        this.response.speak('ありがとうございました');
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak(HELP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent' : function() {
        this.response.speak('ありがとうございました');
        this.emit(':responseReady');
    },
    'Unhandled' : function() {
        const UNHANDLED_MESSAGE = "ごめんなさい。うまくいかないみたいです。"
        this.response.speak(UNHANDLED_MESSAGE+HELP_MESSAGE);
    }
};
