export const LESSONS = [
  {id:1, unit:"Основи", title:"Привітання", icon:"👋", xp:20, questions:[
    {type:"choice", q:"Як англійською «Привіт»?", options:["Hello","Goodbye","Thanks","Please"], answer:"Hello"},
    {type:"choice", q:"Як сказати «Дякую»?", options:["Sorry","Thanks","Hello","Morning"], answer:"Thanks"},
    {type:"translate", q:"Переклади: «Добрий ранок»", options:["Good night","Good morning","Good evening","See you"], answer:"Good morning"},
    {type:"choice", q:"Що означає «Goodbye»?", options:["Будь ласка","Дякую","До побачення","Вибачте"], answer:"До побачення"}
  ]},
  {id:2, unit:"Основи", title:"Знайомство", icon:"🧑", xp:25, questions:[
    {type:"choice", q:"«My name is Alex» означає:", options:["Мене звати Алекс","Я люблю Алекса","Я з Алексом","Це мій друг"], answer:"Мене звати Алекс"},
    {type:"translate", q:"Переклади: «Як тебе звати?»", options:["How are you?","What is your name?","Where are you?","Who are you?"], answer:"What is your name?"},
    {type:"choice", q:"«Nice to meet you» — це:", options:["Радий познайомитися","До завтра","Мені шкода","Будь ласка"], answer:"Радий познайомитися"},
    {type:"choice", q:"Вибери правильне: «I ___ Ukrainian.»", options:["am","is","are","be"], answer:"am"}
  ]},
  {id:3, unit:"Основи", title:"Числа", icon:"🔢", xp:25, questions:[
    {type:"choice", q:"Як буде 5?", options:["Four","Five","Fifteen","Fifty"], answer:"Five"},
    {type:"choice", q:"Як буде 10?", options:["Two","Ten","Twenty","Twelve"], answer:"Ten"},
    {type:"translate", q:"Переклади: «Мені 25 років»", options:["I have 25","I am 25 years old","I am 25 years","I do 25"], answer:"I am 25 years old"},
    {type:"choice", q:"«Twenty» — це:", options:["12","20","30","2"], answer:"20"}
  ]},
  {id:4, unit:"Речення", title:"To be", icon:"🧩", xp:30, questions:[
    {type:"choice", q:"She ___ happy.", options:["am","is","are","be"], answer:"is"},
    {type:"choice", q:"They ___ students.", options:["am","is","are","be"], answer:"are"},
    {type:"choice", q:"I ___ ready.", options:["am","is","are","be"], answer:"am"},
    {type:"choice", q:"We ___ at home.", options:["am","is","are","be"], answer:"are"}
  ]},
  {id:5, unit:"Речення", title:"Present Simple", icon:"⚡", xp:35, questions:[
    {type:"choice", q:"I ___ coffee every morning.", options:["drink","drinks","drinking","drank"], answer:"drink"},
    {type:"choice", q:"He ___ English.", options:["study","studies","studying","studied"], answer:"studies"},
    {type:"choice", q:"They ___ football.", options:["play","plays","playing","played"], answer:"play"},
    {type:"choice", q:"She ___ to work every day.", options:["go","goes","going","gone"], answer:"goes"}
  ]},
  {id:6, unit:"Розмова", title:"У магазині", icon:"🛒", xp:35, questions:[
    {type:"translate", q:"Переклади: «Скільки це коштує?»", options:["How much is it?","How many is it?","What cost it?","How is cost?"], answer:"How much is it?"},
    {type:"choice", q:"«I would like some water» — це:", options:["Я хочу води","Я випив воду","Де вода?","Вода закінчилась"], answer:"Я хочу води"},
    {type:"choice", q:"Як ввічливо попросити щось?", options:["Give me!","Please","Go away","No"], answer:"Please"},
    {type:"choice", q:"«Can I help you?» означає:", options:["Можеш мені допомогти?","Я можу купити?","Вам допомогти?","Де ти?"], answer:"Вам допомогти?"}
  ]},
  {id:7, unit:"Розмова", title:"У кафе", icon:"☕", xp:40, questions:[
    {type:"choice", q:"«I'd like a coffee, please.»", options:["Я хотів би каву, будь ласка","Я не люблю каву","Де моя кава?","Кава готова"], answer:"Я хотів би каву, будь ласка"},
    {type:"choice", q:"«The bill, please» — це:", options:["Меню, будь ласка","Рахунок, будь ласка","Воду, будь ласка","Допомогу, будь ласка"], answer:"Рахунок, будь ласка"},
    {type:"choice", q:"«Delicious» означає:", options:["Дорогий","Смачний","Гарячий","Холодний"], answer:"Смачний"},
    {type:"choice", q:"«Could I have some water?» — це:", options:["Чи можна мені води?","Я не хочу води","Де вода?","Вода холодна"], answer:"Чи можна мені води?"}
  ]},
  {id:8, unit:"Час", title:"Past Simple", icon:"⏰", xp:45, questions:[
    {type:"choice", q:"Yesterday I ___ to the store.", options:["go","went","goes","going"], answer:"went"},
    {type:"choice", q:"She ___ a movie last night.", options:["watch","watched","watches","watching"], answer:"watched"},
    {type:"choice", q:"We ___ dinner at 8.", options:["have","had","has","having"], answer:"had"},
    {type:"choice", q:"«Yesterday» означає:", options:["Завтра","Сьогодні","Вчора","Зараз"], answer:"Вчора"}
  ]}
];

export const DEFAULT_STATE = {
  xp:0, hearts:5, streak:0, lastDay:null, completed:[],
  gems:50, level:1, dailyGoal:20, premium:false, mistakes:0
};
