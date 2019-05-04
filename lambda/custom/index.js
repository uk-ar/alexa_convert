'use strict';
var Alexa = require("alexa-sdk");
var koyomi = require('koyomi');
var moment = require("moment");
// For detailed tutorial on how to making a Alexa skill,
// please visit us at http://alexa.design/build
// TODO:dev
// https://ygoto3.com/posts/alexa-skill-development-efficiency/

const APP_ID = "amzn1.ask.skill.1dbf4219-77ea-4a84-903c-a582dddc0ecc";

exports.handler = function(event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.appId = APP_ID;
    alexa.execute();
};

const HELP_MESSAGE = "例えば「アレクサ、年号変換で来年は何年？」「アレクサ、年号変換で1981年は？」「アレクサ、年号変換で昭和56年？」のように聞いてください。"

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
        const d = new Date();
        const year = d.toISOString().slice(0,10)
        const year_message = `今日は ${year} 、${koyomi.format(year,'GGN')} 年です。`
        this.response.speak(WELCOME_MESSAGE+year_message+HELP_MESSAGE)
            //.cardRenderer('hello world', 'hello world');
        this.emit(':responseReady');
    },
    'SayHelloName': function () {
        console.log(this.event.request.intent.slots);
        let date = this.event.request.intent.slots.Date.value;
        const toEra = this.event.request.intent.slots.ToEra.value;
        const fromEra = this.event.request.intent.slots.FromEra.value;
      //const twoYear = parseInt(this.event.request.intent.slots.TwoYear.value, 10) || this.event.request.intent.slots.TwoYear.resolutions && this.event.request.intent.slots.TwoYear.resolutions.resolutionsPerAuthority[0].values[0].value.id
      const twoYear = this.event.request.intent.slots.TwoYear.value;//, 10) || this.event.request.intent.slots.TwoYear.resolutions && this.event.request.intent.slots.TwoYear.resolutions.resolutionsPerAuthority[0].values[0].value.id
        //"{AnnoDomini} 年は {EraName} 何年",
        //"1981 年は 昭和 何年",
        console.log(this.event.request.intent.slots.Date,
                    this.event.request.intent.slots.Date.resolutions,
                    fromEra,twoYear);
        var answer = "年号変換できません"
        const EraStart = {
            "明治":1867,
            "大正":1911,
            "昭和":1925,
            "平成":1988,
            "令和":2019
        }
      //
      if(date && date.length == 10 && date.endsWith("-XX-XX")){
        //年号変換で千九百八十一年は何年
        date = date.slice(0,4)
      }

      if(date && date.length == 4){//&& (!toEra || toEra==="和暦")
            //年号変換で今日は何年
            //年号変換で今日は和暦何年
            //年号変換で今日は昭和何年 not support yet
            //年号変換で1981年は何年 not support on simulator?
            //年号変換で1981年は昭和何年 not support?
            //年号変換で千九百八十一年は何年
            //年号変換で千九百八十一年は昭和何年
            console.log(date.slice(0,4))
            const year = date.slice(0,4)
            answer = `西暦 ${date} 年は ${koyomi.format(year,'GGN')} 年です`
      }else if(date && date.length == 10){//&& (!toEra || toEra==="和暦")
            //年号変換で今日は何年
            //年号変換で今日は和暦何年
            //年号変換で今日は昭和何年 not support yet
            //年号変換で1981年は何年 not support on simulator?
            //年号変換で1981年は昭和何年 not support?
            //年号変換で千九百八十一年は何年
            //年号変換で千九百八十一年は昭和何年
            console.log(date.slice(0,10))
            const year = date.slice(0,10)
            answer = `${date} は ${koyomi.format(year,'GGN')} 年です`
      }
      else if(twoYear && fromEra) {
            //年号変換で昭和56年は 何年
            //年号変換で昭和四十七年は何年
            answer = `${fromEra} ${twoYear} 年は 西暦 ${koyomi.format(fromEra+twoYear+"年",'YYYY')} 年です`
      }else if(twoYear && twoYear.length==4) {
        answer = `西暦 ${twoYear} 年は ${koyomi.format(twoYear,'GGN')} 年です`
      }
        //const answer = `${fromEra} ${fromYear} は ${toEra} 10年です`
        this.response.speak(answer)
            .cardRenderer('年号変換', answer);
        this.attributes["answer"] = answer;
        this.emit(':responseReady');
    },
    'SessionEndedRequest' : function() {
        console.log('セッションが以下の理由で中断されました: ' + this.event.request.reason);
    },
    'AMAZON.RepeatIntent' : function() {
        if(this.attributes["answer"]){
            this.response.speak(this.attributes["answer"]);
            this.emit(':responseReady');
        }else{
            this.emit('AMAZON.HelpIntent');
        }
    },
    'AMAZON.StopIntent' : function() {
        this.response.speak('ありがとうございました。またのご利用をお待ちしてます。');
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak(HELP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent' : function() {
        this.response.speak('ありがとうございました。');
        this.emit(':responseReady');
    },
    'Unhandled' : function() {
        const UNHANDLED_MESSAGE = "ごめんなさい。うまくいかないみたいです。"
        this.response.speak(UNHANDLED_MESSAGE+HELP_MESSAGE);
    }
};
