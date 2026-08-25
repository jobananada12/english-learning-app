import React, { useEffect, useState } from 'react';
import { BookOpen, Flame, User, Home, ChevronRight, Check, X, Volume2, Star, RotateCcw, Brain } from 'lucide-react';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import './styles.css';
import { DEFAULT_SOURCE, DEFAULT_TARGET } from './data/courses';
import { LANGUAGE_CATALOG, language, MEGA_LESSON_COUNT, getVirtualLesson, getCurriculumStats } from './engine/course-engine';

const STORAGE='english-ai-mega-state';
const initial={xp:0,streak:0,lastDay:null,completed:[],level:1,mistakes:0};
const read=()=>{try{return {...initial,...JSON.parse(localStorage.getItem(STORAGE)||'{}')}}catch{return initial}};
const save=s=>localStorage.setItem(STORAGE,JSON.stringify(s));

async function speak(text, locale){
  if(!text)return;
  const lang=locale||'en-US';
  try{
    await TextToSpeech.stop();
    await TextToSpeech.speak({text:String(text),lang,rate:0.9,pitch:1.0,volume:1.0});
  }catch(err){
    // Browser fallback for development/web preview.
    if(window.speechSynthesis){const u=new SpeechSynthesisUtterance(String(text));u.lang=lang;u.rate=.9;window.speechSynthesis.cancel();window.speechSynthesis.speak(u);}
    console.warn('TTS failed',err);
  }
}

function SpeakButton({text,locale,small=false}){
  return <button type="button" className={`speak-icon ${small?'small':''}`} aria-label={`Прослухати ${text}`} title={`Прослухати: ${text}`} onClick={e=>{e.stopPropagation();speak(text,locale)}}><Volume2 size={small?16:18}/></button>;
}

export default function MegaApp(){
 const [state,setState]=useState(read); const [source,setSource]=useState(()=>localStorage.getItem('english-ai-source')||DEFAULT_SOURCE); const [target,setTarget]=useState(()=>localStorage.getItem('english-ai-target')||DEFAULT_TARGET);
 const [screen,setScreen]=useState('home'); const [lesson,setLesson]=useState(null); const [selected,setSelected]=useState(null); const [answered,setAnswered]=useState(false); const [score,setScore]=useState(0); const [number,setNumber]=useState(1); const [toast,setToast]=useState('');
 useEffect(()=>save(state),[state]); useEffect(()=>{localStorage.setItem('english-ai-source',source);localStorage.setItem('english-ai-target',target)},[source,target]);
 useEffect(()=>{const today=new Date().toDateString();if(state.lastDay===today)return;const yesterday=new Date(Date.now()-86400000).toDateString();setState(s=>({...s,lastDay:today,streak:s.lastDay===yesterday?s.streak+1:s.lastDay?1:0}))},[]);
 const notify=t=>{setToast(t);setTimeout(()=>setToast(''),1600)};
 const openLesson=n=>{const id=Math.max(1,Math.min(MEGA_LESSON_COUNT,Math.floor(Number(n)||1)));const l=getVirtualLesson(id,source,target);setLesson(l);setNumber(id);setSelected(null);setAnswered(false);setScore(0);setScreen('lesson')};
 const choose=o=>{if(answered)return;const q=lesson.questions[0];setSelected(o.answerText);setAnswered(true);if(o.answerText===q.answer){setScore(1);notify('Правильно! +XP ⭐')}else{setState(s=>({...s,mistakes:s.mistakes+1}));notify('Майже! Це слово буде повторено.')}};
 const finish=()=>{const gain=lesson.xp+(score?10:0);setState(s=>({...s,xp:s.xp+gain,level:Math.floor((s.xp+gain)/100)+1,completed:[...new Set([...s.completed,lesson.id])]}));setScreen('result')};
 if(screen==='lesson')return <Lesson lesson={lesson} source={source} target={target} selected={selected} answered={answered} choose={choose} finish={finish} exit={()=>setScreen('home')}/>;
 if(screen==='result')return <Result lesson={lesson} score={score} state={state} home={()=>setScreen('home')} again={()=>openLesson(number)}/>;
 return <div className="app"><Header state={state} source={source} target={target} languages={()=>setScreen('languages')}/><main>{screen==='home'&&<Home state={state} source={source} target={target} openLesson={openLesson} courses={()=>setScreen('courses')} ai={()=>setScreen('ai')}/>} {screen==='courses'&&<Courses state={state} openLesson={openLesson} number={number} setNumber={setNumber}/>} {screen==='languages'&&<Languages source={source} target={target} setSource={setSource} setTarget={setTarget}/>} {screen==='profile'&&<Profile state={state} reset={()=>{setState(initial);localStorage.removeItem(STORAGE)}}/>} {screen==='ai'&&<AI/>}</main>{toast&&<div className="toast">{toast}</div>}<nav className="bottom"><button className={screen==='home'?'active':''} onClick={()=>setScreen('home')}><Home/><span>Головна</span></button><button className={screen==='courses'?'active':''} onClick={()=>setScreen('courses')}><BookOpen/><span>Курс</span></button><button className={screen==='ai'?'active':''} onClick={()=>setScreen('ai')}><Brain/><span>AI</span></button><button className={screen==='profile'?'active':''} onClick={()=>setScreen('profile')}><User/><span>Профіль</span></button></nav></div>
}
function Header({state,source,target,languages}){return <header><div className="brand"><div className="logo">E</div><strong>English AI</strong></div><div className="stats"><button className="language-pill" onClick={languages}>{language(source).flag} → {language(target).flag}</button><span>🔥 {state.streak}</span><span>⭐ {state.xp}</span></div></header>}
function Home({state,source,target,openLesson,courses,ai}){const s=getCurriculumStats();return <div className="page"><section className="hero"><div><p className="eyebrow">{language(source).name.toUpperCase()} → {language(target).name.toUpperCase()}</p><h1>English AI 🚀</h1><p>2 000 000 000 адресованих уроків. A1–C2. Все безкоштовно.</p></div><div className="hero-icon">🦉</div></section><div className="goal card"><div className="goal-top"><b>Мега-курс</b><span>{s.lessonCount.toLocaleString('en-US')} уроків</span></div><p>Контент генерується на вимогу. Мільярди уроків не зберігаються на телефоні.</p></div><div className="level-grid">{s.levels.map((x,i)=><button className="level-chip" key={x.level} onClick={()=>openLesson(Math.floor(i*MEGA_LESSON_COUNT/6)+1)}><b>{x.level}</b><span>{Math.floor(MEGA_LESSON_COUNT/6).toLocaleString('en-US')} уроків</span></button>)}</div><div className="section-title"><h2>Почати</h2></div><div className="path">{[1,2,3,4,5].map(n=><LessonCard key={n} lesson={getVirtualLesson(n,source,target)} state={state} openLesson={openLesson}/>)}</div><button className="continue" onClick={courses}>Відкрити курс <ChevronRight/></button><button className="ai-banner" onClick={ai}><div className="ai-face">🤖</div><div><b>AI Tutor</b><p>Практикуй англійську</p></div><ChevronRight/></button></div>}
function LessonCard({lesson,state,openLesson}){const done=state.completed.includes(lesson.id);return <button className={`lesson-card ${done?'done':''}`} onClick={()=>openLesson(lesson.number)}><div className="lesson-icon">{done?<Check size={25}/>:lesson.icon}</div><div><small>{lesson.unit}</small><h3>{lesson.title}</h3><span>{lesson.xp} XP · FREE</span></div><ChevronRight/></button>}
function Courses({state,openLesson,number,setNumber}){return <div className="page"><p className="eyebrow">MEGA CURRICULUM</p><h1>Усі рівні відкриті</h1><div className="card"><h2>Відкрити будь-який урок</h2><p>Номер від 1 до 2 000 000 000.</p><input type="number" min="1" max={MEGA_LESSON_COUNT} value={number} onChange={e=>setNumber(Math.max(1,Math.min(MEGA_LESSON_COUNT,Number(e.target.value)||1)))}/><button className="continue" onClick={()=>openLesson(number)}>Урок #{Number(number).toLocaleString('en-US')} <ChevronRight/></button></div><div className="level-grid">{['A1','A2','B1','B2','C1','C2'].map((l,i)=><button className="level-chip" key={l} onClick={()=>openLesson(Math.floor(i*MEGA_LESSON_COUNT/6)+1)}><b>{l}</b><span>FREE</span></button>)}</div><p className="muted">Завершено: {state.completed.length} · XP: {state.xp}</p></div>}
function Languages({source,target,setSource,setTarget}){return <div className="page"><p className="eyebrow">LANGUAGE ENGINE</p><h1>Мови</h1><div className="card"><b>Я знаю</b><select value={source} onChange={e=>setSource(e.target.value)}>{LANGUAGE_CATALOG.map(l=><option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}</select><b>Вивчаю</b><select value={target} onChange={e=>setTarget(e.target.value)}>{LANGUAGE_CATALOG.map(l=><option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}</select></div><p className="muted">Одна логіка уроків, різні мовні дані.</p></div>}
function Lesson({lesson,source,target,selected,answered,choose,finish,exit}){
 const q=lesson.questions[0];
 const sourceLocale=language(source).locale; const targetLocale=language(target).locale;
 return <div className="lesson-screen"><div className="lesson-top"><button onClick={exit}><X/></button><div className="progress"><i style={{width:'100%'}}/></div><span>FREE</span></div><div className="question"><div className="q-meta">{lesson.level} · УРОК #{lesson.number.toLocaleString('en-US')}</div>
   <div className="question-line"><h1>{q.enQ||q.q}</h1><SpeakButton text={q.enQ||q.q} locale={targetLocale}/></div>
   <div className="question-line localized"><h2>{q.q}</h2><SpeakButton text={q.q} locale={sourceLocale}/></div>
   <div className="answers">{q.options.map(o=><div key={o.answerText} role="button" tabIndex={0} className={`answer-card ${answered&&o.answerText===q.answer?'correct':''} ${answered&&selected===o.answerText&&o.answerText!==q.answer?'wrong':''}`} onClick={()=>choose(o)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' ')choose(o)}}>
      <div className="answer-language"><span>EN</span><b>{o.en}</b><SpeakButton text={o.en} locale={targetLocale} small/></div>
      <div className="answer-language native"><span>{source.toUpperCase()}</span><b>{o.native}</b><SpeakButton text={o.native} locale={sourceLocale} small/></div>
      {answered&&o.answerText===q.answer?<Check className="answer-status"/>:answered&&selected===o.answerText?<X className="answer-status"/>:null}
   </div>)}</div></div>{answered&&<div className={`feedback ${selected===q.answer?'good':'bad'}`}><b>{selected===q.answer?'Чудово! 🎉':'Майже!'}</b><span>{selected===q.answer?'Правильна відповідь.':`Правильна відповідь: ${q.answer}`}</span></div>}<button className="continue" disabled={!answered} onClick={finish}>Завершити урок <ChevronRight/></button></div>
}
function Result({lesson,score,state,home,again}){return <div className="result"><div className="confetti">🎉</div><p className="eyebrow">УРОК ЗАВЕРШЕНО</p><h1>{score?'Молодець!':'Урок пройдений!'}</h1><p>#{lesson.number.toLocaleString('en-US')} · {lesson.level}</p><div className="result-grid"><div><Star/><b>+{lesson.xp+(score?10:0)}</b><span>XP</span></div><div><Check/><b>{score}/1</b><span>Правильних</span></div><div><Flame/><b>{state.streak}</b><span>Серія</span></div></div><button className="continue" onClick={home}>Продовжити <ChevronRight/></button><button className="secondary" onClick={again}><RotateCcw/> Повторити</button></div>}
function Profile({state,reset}){return <div className="page"><p className="eyebrow">ПРОФІЛЬ</p><h1>Мій прогрес</h1><div className="stats-grid"><div><b>{state.xp}</b><span>XP</span></div><div><b>{state.streak}</b><span>днів серії</span></div><div><b>{state.completed.length}</b><span>уроків</span></div><div><b>{state.mistakes}</b><span>помилок</span></div></div><div className="card"><h2>🆓 Безкоштовно</h2><p>A1–C2 і весь мега-курс доступні без підписки.</p></div><button className="danger" onClick={reset}>Скинути прогрес</button></div>}
function AI(){const [messages,setMessages]=useState([{r:'ai',t:'Hi! 👋 Tell me about your day in English.'}]);const [v,setV]=useState('');const send=()=>{if(!v.trim())return;const x=v.trim();setMessages(m=>[...m,{r:'user',t:x},{r:'ai',t:`Good job! 👍 Keep going with: “${x.replace(/\.$/,'')}.”`}]);setV('')};return <div className="page ai-page"><div className="ai-header"><div className="ai-face">🤖</div><div><p className="eyebrow">AI TUTOR</p><h1>English Chat</h1></div></div><div className="chat">{messages.map((m,i)=><div key={i} className={`bubble ${m.r}`}>{m.t}</div>)}</div><div className="chat-input"><input value={v} onChange={e=>setV(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Напиши англійською..."/><button onClick={send}>➤</button></div></div>}
