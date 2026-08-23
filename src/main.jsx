import React, {useEffect, useMemo, useState} from "react";
import {createRoot} from "react-dom/client";
import {
  BookOpen, Flame, Heart, Trophy, User, Home, Store, Settings,
  ChevronRight, Check, X, Volume2, Lock, Star, Zap, RotateCcw,
  Target, Crown, Sparkles, ArrowLeft, Brain, MessageCircle
} from "lucide-react";
import "./styles.css";

const LESSONS = [
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

const defaultState = {
  xp:0, hearts:5, streak:0, lastDay:null, completed:[],
  gems:50, level:1, dailyGoal:20, premium:false, mistakes:0
};

function loadState(){
  try { return {...defaultState, ...JSON.parse(localStorage.getItem("english-ai-state") || "{}")}; }
  catch { return defaultState; }
}
function saveState(s){ localStorage.setItem("english-ai-state", JSON.stringify(s)); }

function App(){
  const [state,setState]=useState(loadState);
  const [screen,setScreen]=useState("home");
  const [lesson,setLesson]=useState(null);
  const [questionIndex,setQuestionIndex]=useState(0);
  const [selected,setSelected]=useState(null);
  const [answered,setAnswered]=useState(false);
  const [score,setScore]=useState(0);
  const [toast,setToast]=useState("");

  useEffect(()=>saveState(state),[state]);

  const today = new Date().toDateString();
  useEffect(()=>{
    if(state.lastDay !== today){
      const yesterday = new Date(Date.now()-86400000).toDateString();
      if(state.lastDay===yesterday) setState(s=>({...s,streak:s.streak+1,lastDay:today}));
      else setState(s=>({...s,streak:state.lastDay?1:0,lastDay:today}));
    }
  },[]);

  const notify=(t)=>{setToast(t);setTimeout(()=>setToast(""),1800)};
  const startLesson=(l)=>{
    if(!state.completed.includes(l.id) && state.hearts<=0){notify("Немає сердечок ❤️");return;}
    setLesson(l); setQuestionIndex(0); setSelected(null); setAnswered(false); setScore(0); setScreen("lesson");
  };
  const choose=(option)=>{
    if(answered)return;
    setSelected(option); setAnswered(true);
    const q=lesson.questions[questionIndex];
    if(option===q.answer){setScore(v=>v+1); notify("Правильно! +XP ⭐");}
    else {setState(s=>({...s,hearts:Math.max(0,s.hearts-1),mistakes:s.mistakes+1})); notify("Не зовсім. Наступного разу вийде!");}
  };
  const nextQuestion=()=>{
    if(questionIndex < lesson.questions.length-1){setQuestionIndex(i=>i+1);setSelected(null);setAnswered(false);}
    else {
      const perfect=score===lesson.questions.length;
      const gained=lesson.xp+(perfect?10:0);
      setState(s=>({
        ...s,
        xp:s.xp+gained,
        gems:s.gems+(perfect?10:5),
        completed:s.completed.includes(lesson.id)?s.completed:[...s.completed,lesson.id],
        hearts:Math.min(5,s.hearts+(perfect?1:0)),
        level:Math.floor((s.xp+gained)/100)+1
      }));
      setScreen("result");
    }
  };
  const reset=()=>{setState(defaultState);localStorage.removeItem("english-ai-state");notify("Прогрес скинуто");};

  if(screen==="lesson") return <Lesson lesson={lesson} index={questionIndex} selected={selected} answered={answered} score={score} choose={choose} next={nextQuestion} exit={()=>setScreen("home")}/>;
  if(screen==="result") return <Result lesson={lesson} score={score} state={state} home={()=>setScreen("home")} again={()=>startLesson(lesson)}/>;

  return <div className="app">
    <Header state={state} premium={()=>notify("PRO буде доступний у наступній версії")}/>
    <main>
      {screen==="home" && <HomeScreen state={state} lessons={LESSONS} startLesson={startLesson} setScreen={setScreen}/>}
      {screen==="courses" && <Courses lessons={LESSONS} state={state} startLesson={startLesson}/>}
      {screen==="shop" && <Shop state={state} setState={setState} notify={notify}/>}
      {screen==="profile" && <Profile state={state} reset={reset}/>}
      {screen==="ai" && <AIPractice notify={notify}/>}
    </main>
    {toast && <div className="toast">{toast}</div>}
    <nav className="bottom">
      <button className={screen==="home"?"active":""} onClick={()=>setScreen("home")}><Home/><span>Головна</span></button>
      <button className={screen==="courses"?"active":""} onClick={()=>setScreen("courses")}><BookOpen/><span>Курс</span></button>
      <button className={screen==="ai"?"active":""} onClick={()=>setScreen("ai")}><Brain/><span>AI</span></button>
      <button className={screen==="shop"?"active":""} onClick={()=>setScreen("shop")}><Store/><span>Магазин</span></button>
      <button className={screen==="profile"?"active":""} onClick={()=>setScreen("profile")}><User/><span>Профіль</span></button>
    </nav>
  </div>;
}

function Header({state,premium}){
  return <header>
    <div className="brand"><div className="logo">E</div><strong>English AI</strong></div>
    <div className="stats">
      <span>🔥 {state.streak}</span><span>💎 {state.gems}</span><span>❤️ {state.hearts}</span>
      <button className="pro" onClick={premium}><Crown size={15}/> PRO</button>
    </div>
  </header>
}

function HomeScreen({state,lessons,startLesson,setScreen}){
  const progress=Math.min(100,Math.round((state.completed.length/lessons.length)*100));
  return <div className="page">
    <section className="hero">
      <div><p className="eyebrow">ТВОЄ НАВЧАННЯ</p><h1>Вивчай англійську<br/>щодня 🚀</h1><p>Короткі уроки, практика та AI-розмови.</p></div>
      <div className="hero-icon">🦉</div>
    </section>
    <div className="goal card">
      <div className="goal-top"><b>Денна ціль</b><span>{Math.min(state.xp%100,state.dailyGoal)} / {state.dailyGoal} XP</span></div>
      <div className="progress"><i style={{width:`${Math.min(100,(state.xp%100)/state.dailyGoal*100)}%`}}/></div>
    </div>
    <div className="section-title"><h2>Твій курс</h2><button onClick={()=>setScreen("courses")}>Усі уроки <ChevronRight size={17}/></button></div>
    <div className="path">
      {lessons.slice(0,6).map((l,i)=>{
        const done=state.completed.includes(l.id), locked=i>0 && !state.completed.includes(lessons[i-1].id);
        return <button key={l.id} disabled={locked} className={`lesson-card ${done?"done":""} ${locked?"locked":""}`} onClick={()=>startLesson(l)}>
          <div className="lesson-icon">{locked?<Lock size={23}/>:done?<Check size={25}/>:l.icon}</div>
          <div><small>{l.unit}</small><h3>{l.title}</h3><span>{l.xp} XP · {l.questions.length} вправи</span></div>
          <ChevronRight/>
        </button>
      })}
    </div>
    <button className="ai-banner" onClick={()=>setScreen("ai")}><div className="ai-face">🤖</div><div><b>Поговори з AI</b><p>Практикуй англійську без страху помилок</p></div><ChevronRight/></button>
  </div>
}

function Courses({lessons,state,startLesson}){
  return <div className="page"><div className="titlebar"><div><p className="eyebrow">КУРС</p><h1>Англійська A1 → B2</h1></div><div className="level">LVL {state.level}</div></div>
    <div className="course-progress card"><b>Прогрес</b><div className="progress"><i style={{width:`${state.completed.length/lessons.length*100}%`}}/></div><span>{state.completed.length} з {lessons.length} уроків</span></div>
    <div className="path">{lessons.map((l,i)=>{const done=state.completed.includes(l.id),locked=i>0&&!state.completed.includes(lessons[i-1].id);return <button key={l.id} disabled={locked} className={`lesson-card ${done?"done":""} ${locked?"locked":""}`} onClick={()=>startLesson(l)}><div className="lesson-icon">{locked?<Lock/>:done?<Check/>:l.icon}</div><div><small>УРОК {i+1} · {l.unit}</small><h3>{l.title}</h3><span>{l.questions.length} вправи · {l.xp} XP</span></div><ChevronRight/></button>})}</div>
  </div>
}

function Lesson({lesson,index,selected,answered,score,choose,next,exit}){
  const q=lesson.questions[index], pct=((index)/lesson.questions.length)*100;

  // Speak the answer in its actual language. The previous code looked only for
  // Ukrainian-specific letters (ї, і, є, ґ), so words such as "Мене звати Алекс"
  // were incorrectly detected as English. It also assumed the voice list was ready.
  const speak=()=>{
    if(!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;

    const text=String(q.answer).trim();
    if(!text) return;

    // Any Cyrillic letter means Ukrainian in this course; otherwise use English.
    const isUkrainian=/[\u0400-\u04FF]/.test(text);
    const lang=isUkrainian?"uk-UA":"en-US";
    const synth=window.speechSynthesis;

    const speakWithVoices=()=>{
      synth.cancel();
      const utterance=new SpeechSynthesisUtterance(text);
      utterance.lang=lang;
      utterance.rate=isUkrainian?0.9:0.9;
      utterance.pitch=1;

      const voices=synth.getVoices();
      const exact=voices.find(v=>v.lang && v.lang.toLowerCase()===lang.toLowerCase());
      const regional=voices.find(v=>v.lang && v.lang.toLowerCase().startsWith(isUkrainian?"uk":"en"));
      const voice=exact || regional;
      if(voice) utterance.voice=voice;

      // Some Chromium installations return no voices on the first call.
      // Setting lang is still valid and lets the browser choose its default.
      synth.speak(utterance);
    };

    const voices=synth.getVoices();
    if(voices.length){
      speakWithVoices();
    }else{
      // Wait for Chromium/Windows to populate the voice list, then speak.
      let done=false;
      const onVoicesChanged=()=>{
        if(done)return;
        done=true;
        synth.removeEventListener("voiceschanged",onVoicesChanged);
        speakWithVoices();
      };
      synth.addEventListener("voiceschanged",onVoicesChanged);
      setTimeout(()=>{
        if(done)return;
        done=true;
        synth.removeEventListener("voiceschanged",onVoicesChanged);
        speakWithVoices();
      },500);
    }
  };

  return <div className="lesson-screen">
    <div className="lesson-top"><button onClick={exit}><X/></button><div className="progress"><i style={{width:`${pct}%`}}/></div><span>❤️</span></div>
    <div className="question">
      <div className="q-meta">УРОК · {index+1}/{lesson.questions.length}</div>
      <h1>{q.q}</h1>
      <button className="speak" onClick={speak}><Volume2/> Прослухати відповідь</button>
      <div className="answers">{q.options.map(o=><button key={o} disabled={answered} className={`${answered&&o===q.answer?"correct":""} ${answered&&selected===o&&o!==q.answer?"wrong":""}`} onClick={()=>choose(o)}>{o}{answered&&o===q.answer?<Check/>:answered&&selected===o?<X/>:null}</button>)}</div>
    </div>
    {answered&&<div className={`feedback ${selected===q.answer?"good":"bad"}`}><b>{selected===q.answer?"Чудово! 🎉":"Майже!"}</b><span>{selected===q.answer?"Правильна відповідь.":"Правильна відповідь: "+q.answer}</span></div>}
    <button className="continue" disabled={!answered} onClick={next}>{index===lesson.questions.length-1?"Завершити урок":"Продовжити"} <ChevronRight/></button>
  </div>
}

function Result({lesson,score,state,home,again}){
  const total=lesson.questions.length, perfect=score===total;
  return <div className="result"><div className="confetti">🎉</div><p className="eyebrow">УРОК ЗАВЕРШЕНО</p><h1>{perfect?"Ідеально!":"Молодець!"}</h1><p>Ти завершив урок «{lesson.title}».</p><div className="result-grid"><div><Star/><b>+{lesson.xp+(perfect?10:0)}</b><span>XP</span></div><div><Check/><b>{score}/{total}</b><span>Правильних</span></div><div><Flame/><b>{state.streak}</b><span>Серія</span></div></div><button className="continue" onClick={home}>Продовжити <ChevronRight/></button><button className="secondary" onClick={again}><RotateCcw/> Повторити урок</button></div>
}

function Shop({state,setState,notify}){
  const buy=(cost,kind)=>{
    if(state.gems<cost){notify("Недостатньо 💎");return}
    setState(s=>({...s,gems:s.gems-cost,...kind==="heart"?{hearts:Math.min(5,s.hearts+1)}:{}}));notify("Покупку виконано!");
  };
  return <div className="page"><p className="eyebrow">МАГАЗИН</p><h1>Магазин 💎</h1><p className="muted">Твої кристали: <b>{state.gems}</b></p>
    <div className="shop-grid">
      <div className="shop-card"><div className="big">❤️</div><h3>Сердечко</h3><p>+1 життя</p><button onClick={()=>buy(20,"heart")}>20 💎</button></div>
      <div className="shop-card"><div className="big">🔥</div><h3>Заморозка серії</h3><p>Захист серії на 1 день</p><button onClick={()=>buy(30,"freeze")}>30 💎</button></div>
      <div className="shop-card premium-card"><Crown className="crown"/><h3>English AI PRO</h3><p>AI-розмови, усі уроки, статистика</p><button onClick={()=>notify("PRO-підписку підключимо на наступному етапі")}>Оформити PRO</button></div>
    </div>
  </div>
}

function Profile({state,reset}){
  return <div className="page"><div className="profile-head"><div className="avatar">🧑‍💻</div><div><p className="eyebrow">ПРОФІЛЬ</p><h1>Мій прогрес</h1><span>Рівень {state.level}</span></div></div>
    <div className="stats-grid"><div><b>{state.xp}</b><span>XP</span></div><div><b>{state.streak}</b><span>днів серії</span></div><div><b>{state.completed.length}</b><span>уроків</span></div><div><b>{state.mistakes}</b><span>помилок</span></div></div>
    <div className="card achievements"><h2>Досягнення 🏆</h2><div className="badges"><span>🔥 3 дні</span><span>⭐ 100 XP</span><span>📚 5 уроків</span></div></div>
    <button className="danger" onClick={reset}>Скинути прогрес</button>
  </div>
}

function AIPractice({notify}){
  const [messages,setMessages]=useState([{role:"ai",text:"Hi! 👋 I’m your English AI tutor. Tell me about your day in English."}]);
  const [input,setInput]=useState("");
  const send=()=>{
    if(!input.trim())return;
    const text=input.trim();
    setMessages(m=>[...m,{role:"user",text},{role:"ai",text:smartReply(text)}]);setInput("");
  };
  return <div className="page ai-page"><div className="ai-header"><div className="ai-face">🤖</div><div><p className="eyebrow">AI TUTOR</p><h1>English Chat</h1><span>Практикуйся без страху</span></div></div>
    <div className="chat">{messages.map((m,i)=><div key={i} className={`bubble ${m.role}`}>{m.text}</div>)}</div>
    <div className="chat-input"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Напиши англійською..." /><button onClick={send}>➤</button></div>
    <div className="quick"><button onClick={()=>setInput("My name is Alex.")}>Introduce me</button><button onClick={()=>setInput("I want to practice speaking.")}>Practice</button><button onClick={()=>setInput("What should I learn today?")}>Help me</button></div>
  </div>
}
function smartReply(t){
  const x=t.toLowerCase();
  if(x.includes("name")) return "Nice to meet you! 😊 Try: “My name is Alex. I live in Ukraine.”";
  if(x.includes("practice")) return "Great! Let's practice. What did you do today?";
  if(x.includes("learn")) return "Today learn 5 useful phrases: How are you? / I'm fine. / What do you do? / I work from home. / See you tomorrow!";
  return "Good job! 👍 A more natural version may be: “"+t.replace(/\.$/,"")+".” Keep going!";
}

createRoot(document.getElementById("root")).render(<App/>);