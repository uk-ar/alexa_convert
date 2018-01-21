const conversation = require('alexa-conversation');
const app = require('../index.js');

const opts = {
	name: 'HelloAlexa Test',
	appId: "amzn1.ask.skill.1dbf4219-77ea-4a84-903c-a582dddc0ecc",
	app: app,
	//handler: app.customHandlerName
    //handler: app.handler
};

conversation(opts)
  .userSays('LaunchRequest')
  .plainResponse
  .shouldContain('年号変換へようこそ。')
  .shouldContain('例えば')
  .shouldContain('聞いてください。')
  .userSays('SayHelloName',{Date: '1981-XX-XX',ToEra:'',FromEra:'',TwoYear:''})
  .plainResponse
  .shouldContain('昭和56 年')
  .userSays('AMAZON.StopIntent')
  .plainResponse
  .shouldContain('またのご利用をお待ちしてます。')
  .end()

conversation(opts)
  .userSays('SayHelloName',{Date: '2018-XX-XX',ToEra:'',FromEra:'',TwoYear:''})
  .plainResponse
  .shouldContain('平成30 年')
  .end()

conversation(opts)
  .userSays('SayHelloName',{Date: '',ToEra:'',FromEra:'昭和',TwoYear:{value:'56',resolutions:{resolutionsPerAuthority:[{values:[{value:{id:"56"}}]}]}}})
  .plainResponse
  .shouldContain('西暦 1981 年')
  .end()
