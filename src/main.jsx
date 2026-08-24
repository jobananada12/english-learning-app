import React, {useEffect, useState} from "react";
import {createRoot} from "react-dom/client";
import {BookOpen, Home, Store, User, ChevronRight, Check, X, Volume2, Lock, Star, Flame, RotateCcw, Crown, Brain} from "lucide-react";
import "./styles.css";
import {LESSONS} from "./data/lessons";
import {loadState, saveState, resetState} from "./services/storage";
import {speakText} from "./services/tts";

function App(){
  const [state,setState]=useState(loadState);
  const [screen,setScreen]=useState("home");
  const [lesson,setLesson]=useState(null);
  const [index,setIndex]=useState(0);
  const [selected,setSelected]=useState(null);
  const [answered,setAnswered]=useState(false);
  const [score,setScore]=useState(0);
  const [toast,setToast]=useState("");

  useEffect(()=>saveState(state),[state]);

  useEffect(()=>{
    const today=new Date().toDateString();
    if(state.lastDay===today)return;
    const yesterday=new Date(Date.now()-86400000).toDateString();
    setState(s=>({...s,streak:s.lastDay===yesterday?s.streak+1:(s.lastDay?1:0),lastDay:today}));
  },[]);

  const notify=(text)=>{setToast(text);window.clearTimeout(notify.timer);notify.timer=window.setTimeout(()=>setToast(""),2600);};
  const startLesson=(item)=>{
    if(!state.completed.includes(item.id)&&state.hearts<=0){notify("Немає сердечок ❤️");return;}
    setLesson(item);setIndex(0);setSelected(null);setAnswered(false);setScore(0);setScreen("lesson");
  };
  const choose=(option)=>{
    if(answered)return;
    const q=lesson.questions[index];
    setSelected(option);setAnswered(true);
    if(option===q.answer){setScore(v=>v+1);notify("Правильно! ⭐");}
    else{setState(s=>({...s,hearts:Math.max(0,s.hearts-1),mistakes:s.mistakes+1}));notify("Не зовсім. Спробуй ще!");}
  };
  const next=()=>{
    if(index<lesson.questions.length-1){setIndex(v=>v+1);setSelected(null);setAnswered(false);return;}
    const perfect=score===lesson.questions.length;
    const gained=lesson.xp+(perfect?10:0);
    setState(s=>({...s,xp:s.xp+gained,gems:s.gems+(perfect?10:5),completed:s.completed.includes(lesson.id)?s.completed:[...s.completed,lesson.id],hearts:Math.min(5,s.hearts+(perfect?1:0)),level:Math.floor((s.xp+gained)/100)+1}));
    setScreen("result");
  };
  const reset=()=>{setState(resetState());setScreen("home");notify("Прогрес скинуто");};

  if(screen==="lesson")return <Lesson lesson={lesson} index={index} selected={selected} answered={answered} score={score} choose={choose} next={next} exit={()=>setScreen("home")} notify={notify}/>;
  if(screen==="result")return <Result lesson={lesson} score={score} state={state} home={()=>setScreen("home")} again={()=>startLesson(lesson)}/>;

  return <div className="app">
    <Header state={state} premium={()=>notify("PRO буде доступний на наступному етапі")}/>
    <main>
      {screen==="home"&&<HomeScreen state={state} lessons={LESSONS} startLesson={startLesson} setScreen={setScreen}/>} 
      {screen==="courses"&&<Courses lessons={LESSONS} state={state} startLesson={startLesson}/>} 
      {screen==="shop"&&<Shop state={state} setState={setState} notify={notify}/>} 
      {screen==="profile"&&<Profile state={state} reset={reset}/>} 
      {screen==="ai"&&<AIPractice/>}
    </main>
    {toast&&<div className="toast">{toast}</div>}
    <nav className="bottom">
      <button className={screen==="home"?"active":""} onClick={()=>setScreen("home")}><Home/><span>Головна</span></button>
      <button className={screen==="courses"?"active":""} onClick={()=>setScreen("courses")}><BookOpen/><span>Курс</span></button>
      <button className={screen==="ai"?"active":""} onClick={()=>setScreen("ai")}><Brain/><span>AI</span></button>
      <button className={screen==="shop"?"active":""} onClick={()=>setScreen("shop")}><Store/><span>Магазин</span></button>
      <button className={screen==="profile"?"active":""} onClick={()=>setScreen("profile")}><User/><span>Профіль</span></button>
    </nav>
  </div>;
}

function Header({state,premium}){return <header><div className="brand"><div className="logo">E</div><strong>English AI</strong></div><div className="stats"><span>🔥 {state.streak}</span><span>💎 {state.gems}</span><span>❤️ {state.hearts}</span><button className="pro" onClick={premium}><Crown size={15}/> PRO</button></div></header>}

function HomeScreen({state,lessons,startLesson,setScreen}){return <div className="page"><section className="hero"><div><p className="eyebrow">ТВОЄ НАВЧАННЯ</p><h1>Вивчай англійську<br/>щодня 🚀</h1><p>Короткі уроки, практика та AI-розмови.</p></div><div className="hero-icon">🦉</div></section><div className="goal card"><div className="goal-top"><b>Денна ціль</b><span>{Math.min(state.xp%100,state.dailyGoal)} / {state.dailyGoal} XP</span></div><div className="progress"><i style={{width:`${Math.min(100,(state.xp%100)/state.dailyGoal*100)}%`}}/></div></div><div className="section-title"><h2>Твій курс</h2><button onClick={()=>setScreen("courses")}>Усі уроки <ChevronRight size={17}/></button></div><div className="path">{lessons.slice(0,6).map((l,i)=><LessonCard key={l.id} lesson={l} index={i} state={state} lessons={lessons} startLesson={startLesson}/>)}</div><button className="ai-banner" onClick={()=>setScreen("ai")}><div className="ai-face">🤖</div><div><b>Поговори з AI</b><p>Практикуй англійську без страху помилок</p></div><ChevronRight/></button></div>}

function LessonCard({lesson,index,state,lessons,startLesson}){const done=state.completed.includes(lesson.id);const locked=index>0&&!state.completed.includes(lessons[index-1].id);return <button disabled={locked} className={`lesson-card ${done?"done":""} ${locked?"locked":""}`} onClick={()=>startLesson(lesson)}><div className="lesson-icon">{locked?<Lock size={23}/>:done?<Check size={25}/>:lesson.icon}</div><div><small>{lesson.unit}</small><h3>{lesson.title}</h3><span>{lesson.xp} XP · {lesson.questions.length} вправи</span></div><ChevronRight/></button>}

function Courses({lessons,state,startLesson}){return <div className="page"><div className="titlebar"><div><p className="eyebrow">КУРС</p><h1>Англійська A1 → B2</h1></div><div className="level">LVL {state.level}</div></div><div className="course-progress card"><b>Прогрес</b><div className="progress"><i style={{width:`${state.completed.length/lessons.length*100}%`}}/></div><span>{state.completed.length} з {lessons.length} уроків</span></div><div className="path">{lessons.map((l,i)=><LessonCard key={l.id} lesson={l} index={i} state={state} lessons={lessons} startLesson={startLesson}/>)}</div></div>}

function Lesson({lesson,index,selected,answered,score,choose,next,exit,notify}){
  const q=lesson.questions[index];
  const pct=index/lesson.questions.length*100;
  const [speaking,setSpeaking]=useState(false);

  const listen=async()=>{
    if(speaking)return;
    setSpeaking(true);
    const result=await speakText(q.answer);
    setSpeaking(false);
    if(result?.reason==="language-not-installed"){
      notify(`На Android немає голосу ${result.lang}. Відкрито встановлення голосу.`);
    }else if(!result?.ok){
      notify("Не вдалося запустити озвучку.");
    }
  };

  return <div className="lesson-screen"><div className="lesson-top"><button onClick={exit}><X/></button><div className="progress"><i style={{width:`${pct}%`}}/></div><span>❤️</span></div><div className="question"><div className="q-meta">УРОК · {index+1}/{lesson.questions.length}</div><h1>{q.q}</h1><button className="speak" onClick={listen} disabled={speaking}><Volume2/> {speaking?"Озвучення...":"Прослухати відповідь"}</button><div className="answers">{q.options.map(o=><button key={o} disabled={answered} className={`${answered&&o===q.answer?"correct":""} ${answered&&selected===o&&o!==q.answer?"wrong":""}`} onClick={()=>choose(o)}>{o}{answered&&o===q.answer?<Check/>:answered&&selected===o?<X/>:null}</button>)}</div></div>{answered&&<div className={`feedback ${selected===q.answer?"good":"bad"}`}><b>{selected===q.answer?"Чудово! 🎉":"Майже!"}</b><span>{selected===q.answer?"Правильна відповідь.":"Правильна відповідь: "+q.answer}</span></div>}<button className="continue" disabled={!answered} onClick={next}>{index===lesson.questions.length-1?"Завершити урок":"Продовжити"} <ChevronRight/></button></div>
}

function Result({lesson,score,state,home,again}){const total=lesson.questions.length;const perfect=score===total;return <div className="result"><div className="confetti">🎉</div><p className="eyebrow">УРОК ЗАВЕРШЕНО</p><h1>{perfect?"Ідеально!":"Молодець!"}</h1><p>Ти завершив урок «{lesson.title}».</p><div className="result-grid"><div><Star/><b>+{lesson.xp+(perfect?10:0)}</b><span>XP</span></div><div><Check/><b>{score}/{total}</b><span>Правильних</span></div><div><Flame/><b>{state.streak}</b><span>Серія</span></div></div><button className="continue" onClick={home}>Продовжити <ChevronRight/></button><button className="secondary" onClick={again}><RotateCcw/> Повторити урок</button></div>}

function Shop({state,setState,notify}){const buyHeart=()=>{if(state.gems<20){notify("Недостатньо 💎");return}setState(s=>({...s,gems:s.gems-20,hearts:Math.min(5,s.hearts+1)}));notify("Сердечко куплено ❤️")};return <div className="page"><p className="eyebrow">МАГАЗИН</p><h1>Магазин 💎</h1><p className="muted">Твої кристали: <b>{state.gems}</b></p><div className="shop-grid"><div className="shop-card"><div className="big">❤️</div><h3>Сердечко</h3><p>+1 життя</p><button onClick={buyHeart}>20 💎</button></div><div className="shop-card"><div className="big">🔥</div><h3>Заморозка серії</h3><p>Буде реалізована разом із системою streak freeze</p><button onClick={()=>notify("Функція готується")}>30 💎</button></div><div className="shop-card premium-card"><Crown className="crown"/><h3>English AI PRO</h3><p>AI-розмови, усі уроки, статистика</p><button onClick={()=>notify("PRO-підписку підключимо на наступному етапі")}>Оформити PRO</button></div></div></div>}

function Profile({state,reset}){return <div className="page"><div className="profile-head"><div className="avatar">🧑‍💻</div><div><p className="eyebrow">ПРОФІЛЬ</p><h1>Мій прогрес</h1><span>Рівень {state.level}</span></div></div><div className="stats-grid"><div><b>{state.xp}</b><span>XP</span></div><div><b>{state.streak}</b><span>днів серії</span></div><div><b>{state.completed.length}</b><span>уроків</span></div><div><b>{state.mistakes}</b><span>помилок</span></div></div><div className="card achievements"><h2>Досягнення 🏆</h2><div className="badges"><span>🔥 3 дні</span><span>⭐ 100 XP</span><span>📚 5 уроків</span></div></div><button className="danger" onClick={reset}>Скинути прогрес</button></div>}

function AIPractice(){const [messages,setMessages]=useState([{role:"ai",text:"Hi! 👋 I’m your English AI tutor. Tell me about your day in English."}]);const [input,setInput]=useState("");const send=()=>{const text=input.trim();if(!text)return;setMessages(m=>[...m,{role:"user",text},{role:"ai",text:smartReply(text)}]);setInput("")};return <div className="page ai-page"><div className="ai-header"><div className="ai-face">🤖</div><div><p className="eyebrow">AI TUTOR</p><h1>English Chat</h1><span>Поки що локальний демо-режим</span></div></div><div className="chat">{messages.map((m,i)=><div key={i} className={`bubble ${m.role}`}>{m.text}</div>)}</div><div className="chat-input"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Напиши англійською..."/><button onClick={send}>➤</button></div><div className="quick"><button onClick={()=>setInput("My name is Alex.")}>Introduce me</button><button onClick={()=>setInput("I want to practice speaking.")}>Practice</button><button onClick={()=>setInput("What should I learn today?")}>Help me</button></div></div>}

function smartReply(text){const x=text.toLowerCase();if(x.includes("name"))return "Nice to meet you! 😊 Try: “My name is Alex. I live in Ukraine.”";if(x.includes("practice"))return "Great! Let's practice. What did you do today?";if(x.includes("learn"))return "Today learn 5 useful phrases: How are you? / I'm fine. / What do you do? / I work from home. / See you tomorrow!";return `Good job! 👍 A more natural version may be: “${text.replace(/\.$/,"")}.” Keep going!`}

createRoot(document.getElementById("root")).render(<App/>);
