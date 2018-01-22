const conversation = require('alexa-conversation');
const app = require('../index.js');

const opts = {
	name: 'HelloAlexa Test',
	appId: "amzn1.ask.skill.1dbf4219-77ea-4a84-903c-a582dddc0ecc",
	app: app,
};

//convert from ad to jp
conversation({...opts,name:"convert from ad to jp"})
  .userSays('LaunchRequest')
  .plainResponse
  .shouldContain('年号変換へようこそ。')
  .shouldContain('今年は西暦')
  .shouldContain('例えば')
  .shouldContain('聞いてください。')
  .userSays('SayHelloName',{Date: '1981-XX-XX',ToEra:'',FromEra:'',TwoYear:''})
  .plainResponse
  .shouldContain('昭和56 年')
  .userSays('AMAZON.StopIntent')
  .plainResponse
  .shouldContain('ありがとうございました。')
  .shouldContain('またのご利用をお待ちしてます。')
  .end()

//convert date from to jp
conversation({...opts,name:"convert date from to jp"})
  .userSays('SayHelloName',{Date: '2018-XX-XX',ToEra:'',FromEra:'',TwoYear:''})
  .plainResponse
  .shouldContain('平成30 年')
  .end()

//convert from jp to ad
conversation({...opts,name:"convert from jp to ad"})
  .userSays('SayHelloName',{Date: '',ToEra:'',FromEra:'昭和',TwoYear:{value:'56',resolutions:{resolutionsPerAuthority:[{values:[{value:{id:"56"}}]}]}}})
  .plainResponse
  .shouldContain('西暦 1981 年')
  .end()

//help
conversation({...opts,name:"help"})
  .userSays('AMAZON.HelpIntent')
  .plainResponse
  .shouldNotContain('年号変換へようこそ。')
  .shouldContain('例えば')
  .shouldContain('聞いてください。')
  .end()

//cancel
conversation({...opts,name:"cancel"})
  .userSays('AMAZON.CancelIntent')
  .plainResponse
  .shouldContain('ありがとうございました。')
  .shouldNotContain('またのご利用をお待ちしてます。')
  .end()

//repeat
conversation({...opts,name:"repeat answer"})
  .userSays('SayHelloName',{Date: '1981-XX-XX',ToEra:'',FromEra:'',TwoYear:''})
  .plainResponse
  .shouldContain('昭和56 年')
  .userSays('AMAZON.RepeatIntent')
  .plainResponse
  .shouldContain('昭和56 年')
  .end()

//repeat
conversation({...opts,name:"repeat help"})
  .userSays('AMAZON.RepeatIntent')
  .plainResponse
  .shouldNotContain('年号変換へようこそ。')
  .shouldContain('例えば')
  .shouldContain('聞いてください。')
  .end()
