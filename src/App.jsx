import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen, Flame, Heart, User, Home, Store, ChevronRight, Check, X,
  Volume2, Lock, Star, RotateCcw, Crown, Brain
} from 'lucide-react';
import './styles.css';
import { COURSES, DEFAULT_SOURCE, DEFAULT_TARGET } from './data/courses';
import { LANGUAGE_CATALOG, courseKey, getAudioLanguage, language } from './engine/course-engine';

const STORAGE = 'english-ai-state-v2';
const defaultState = { xp: 0, hearts: 5, streak: 0, lastDay: null, completed: [], gems: 50, level: 1, dailyGoal: 20, premium: false, mistakes: 0 };

function readState() {
  try { return { ...defaultState, ...(JSON.parse(localStorage.getItem(STORAGE) || '{}')) }; }
  catch { return defaultState; }
}
function saveState(state) { localStorage.setItem(STORAGE, JSON.stringify(state)); }

function speak(text, langCode) {
  const locale = getAudioLanguage(text, langCode);
  if (window.Capacitor?.getPlatform?.() === 'android') {
    document.querySelector('button.speak')?.setAttribute('data-tts-text', text);
    return;
  }
  if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const run = () => {
    const u = new SpeechSynthesisUtterance(String(text));
    u.lang = locale;
    u.rate = 0.9;
    u.pitch = 1;
    const voices = synth.getVoices();
    const exact = voices.find(v => v.lang?.toLowerCase() === locale.toLowerCase());
    const family = voices.find(v => v.lang?.toLowerCase().startsWith(locale.slice(0, 2).toLowerCase()));
    if (exact || family) u.voice = exact || family;
    synth.speak(u);
  };
  if (synth.getVoices().length) run();
  else {
    const handler = () => { synth.removeEventListener('voiceschanged', handler); run(); };
    synth.addEventListener('voiceschanged', handler);
    setTimeout(() => { synth.removeEventListener('voiceschanged', handler); run(); }, 500);
  }
}

export default function App() {
  const [state, setState] = useState(readState);
  const [source, setSource] = useState(() => localStorage.getItem('english-ai-source') || DEFAULT_SOURCE);
  const [target, setTarget] = useState(() => localStorage.getItem('english-ai-target') || DEFAULT_TARGET);
  const [screen, setScreen] = useState('home');
  const [lesson, setLesson] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [toast, setToast] = useState('');

  const course = useMemo(() => COURSES[courseKey(source, target)] || null, [source, target]);
  const lessons = course?.lessons || [];
  const completed = state.completed.filter(id => lessons.some(l => l.id === id));

  useEffect(() => saveState(state), [state]);
  useEffect(() => {
    localStorage.setItem('english-ai-source', source);
    localStorage.setItem('english-ai-target', target);
  }, [source, target]);
  useEffect(() => {
    const today = new Date().toDateString();
    if (state.lastDay === today) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    setState(s => ({ ...s, streak: s.lastDay === yesterday ? s.streak + 1 : s.lastDay ? 1 : 0, lastDay: today }));
  }, []);

  const notify = text => { setToast(text); setTimeout(() => setToast(''), 1800); };
  const selectCourse = (nextSource, nextTarget) => {
    setSource(nextSource); setTarget(nextTarget); setScreen('home');
    notify(COURSES[courseKey(nextSource, nextTarget)] ? 'Курс перемкнено' : 'Цей курс ще готується');
  };
  const startLesson = l => {
    if (!completed.includes(l.id) && state.hearts <= 0) { notify('Немає сердечок ❤️'); return; }
    setLesson(l); setQuestionIndex(0); setSelected(null); setAnswered(false); setScore(0); setScreen('lesson');
  };
  const choose = option => {
    if (answered) return;
    setSelected(option); setAnswered(true);
    const q = lesson.questions[questionIndex];
    if (option === q.answer) { setScore(v => v + 1); notify('Правильно! +XP ⭐'); }
    else { setState(s => ({ ...s, hearts: Math.max(0, s.hearts - 1), mistakes: s.mistakes + 1 })); notify('Не зовсім. Наступного разу вийде!'); }
  };
  const next = () => {
    if (questionIndex < lesson.questions.length - 1) { setQuestionIndex(i => i + 1); setSelected(null); setAnswered(false); return; }
    const perfect = score === lesson.questions.length;
    const gained = lesson.xp + (perfect ? 10 : 0);
    setState(s => ({ ...s, xp: s.xp + gained, gems: s.gems + (perfect ? 10 : 5), completed: s.completed.includes(lesson.id) ? s.completed : [...s.completed, lesson.id], hearts: Math.min(5, s.hearts + (perfect ? 1 : 0)), level: Math.floor((s.xp + gained) / 100) + 1 }));
    setScreen('result');
  };
  const reset = () => { setState(defaultState); localStorage.removeItem(STORAGE); notify('Прогрес скинуто'); };

  if (screen === 'lesson') return <Lesson lesson={lesson} index={questionIndex} selected={selected} answered={answered} score={score} choose={choose} next={next} exit={() => setScreen('home')} />;
  if (screen === 'result') return <Result lesson={lesson} score={score} state={state} home={() => setScreen('home')} again={() => startLesson(lesson)} />;

  return <div className="app">
    <Header state={state} source={source} target={target} onCourse={() => setScreen('languages')} />
    <main>
      {screen === 'home' && <HomeScreen state={state} course={course} lessons={lessons} startLesson={startLesson} setScreen={setScreen} />}
      {screen === 'courses' && <Courses lessons={lessons} state={state} startLesson={startLesson} course={course} />}
      {screen === 'languages' && <LanguageScreen source={source} target={target} selectCourse={selectCourse} />}
      {screen === 'shop' && <Shop state={state} setState={setState} notify={notify} />}
      {screen === 'profile' && <Profile state={state} reset={reset} source={source} target={target} />}
      {screen === 'ai' && <AIPractice />}
    </main>
    {toast && <div className="toast">{toast}</div>}
    <nav className="bottom">
      <button className={screen === 'home' ? 'active' : ''} onClick={() => setScreen('home')}><Home /><span>Головна</span></button>
      <button className={screen === 'courses' ? 'active' : ''} onClick={() => setScreen('courses')}><BookOpen /><span>Курс</span></button>
      <button className={screen === 'ai' ? 'active' : ''} onClick={() => setScreen('ai')}><Brain /><span>AI</span></button>
      <button className={screen === 'shop' ? 'active' : ''} onClick={() => setScreen('shop')}><Store /><span>Магазин</span></button>
      <button className={screen === 'profile' ? 'active' : ''} onClick={() => setScreen('profile')}><User /><span>Профіль</span></button>
    </nav>
  </div>;
}

function Header({ state, source, target, onCourse }) {
  return <header><div className="brand"><div className="logo">E</div><strong>English AI</strong></div><div className="stats"><button className="language-pill" onClick={onCourse}>{language(source).flag} → {language(target).flag}</button><span>🔥 {state.streak}</span><span>💎 {state.gems}</span><span>❤️ {state.hearts}</span><button className="pro"><Crown size={15} /> PRO</button></div></header>;
}

function HomeScreen({ state, course, lessons, startLesson, setScreen }) {
  const progress = lessons.length ? Math.round((state.completed.filter(id => lessons.some(l => l.id === id)).length / lessons.length) * 100) : 0;
  if (!course) return <NoCourse setScreen={setScreen} />;
  return <div className="page"><section className="hero"><div><p className="eyebrow">{language(course.source).name.toUpperCase()} → {language(course.target).name.toUpperCase()}</p><h1>Вивчай мову<br />щодня 🚀</h1><p>Єдиний навчальний engine для всіх мов.</p></div><div className="hero-icon">🦉</div></section>
    <div className="goal card"><div className="goal-top"><b>Прогрес курсу</b><span>{progress}%</span></div><div className="progress"><i style={{ width: `${progress}%` }} /></div></div>
    <div className="section-title"><h2>{course.title}</h2><button onClick={() => setScreen('courses')}>Усі уроки <ChevronRight size={17} /></button></div>
    <div className="path">{lessons.slice(0, 6).map((l, i) => <LessonCard key={l.id} lesson={l} index={i} lessons={lessons} state={state} startLesson={startLesson} />)}</div>
    <button className="ai-banner" onClick={() => setScreen('ai')}><div className="ai-face">🤖</div><div><b>Поговори з AI</b><p>Практикуй {language(course.target).name} без страху помилок</p></div><ChevronRight /></button>
  </div>;
}

function LessonCard({ lesson, index, lessons, state, startLesson }) {
  const done = state.completed.includes(lesson.id), locked = index > 0 && !state.completed.includes(lessons[index - 1].id);
  return <button disabled={locked} className={`lesson-card ${done ? 'done' : ''} ${locked ? 'locked' : ''}`} onClick={() => startLesson(lesson)}><div className="lesson-icon">{locked ? <Lock size={23} /> : done ? <Check size={25} /> : lesson.icon}</div><div><small>{lesson.unit}</small><h3>{lesson.title}</h3><span>{lesson.xp} XP · {lesson.questions.length} вправи</span></div><ChevronRight /></button>;
}

function Courses({ lessons, state, startLesson, course }) {
  if (!course) return <NoCourse />;
  return <div className="page"><div className="titlebar"><div><p className="eyebrow">КУРС · {course.level}</p><h1>{course.title}</h1></div><div className="level">LVL {state.level}</div></div><div className="course-progress card"><b>Прогрес</b><div className="progress"><i style={{ width: `${lessons.length ? state.completed.filter(id => lessons.some(l => l.id === id)).length / lessons.length * 100 : 0}%` }} /></div><span>{state.completed.filter(id => lessons.some(l => l.id === id)).length} з {lessons.length} уроків</span></div><div className="path">{lessons.map((l, i) => <LessonCard key={l.id} lesson={l} index={i} lessons={lessons} state={state} startLesson={startLesson} />)}</div></div>;
}

function LanguageScreen({ source, target, selectCourse }) {
  return <div className="page"><p className="eyebrow">LANGUAGE ENGINE</p><h1>Обери мови</h1><p className="muted">Мова навчання → мова, яку вивчаєш. Новий курс додається даними, а не новим застосунком.</p><div className="card" style={{ marginBottom: 16 }}><b>Я знаю</b><select value={source} onChange={e => selectCourse(e.target.value, target)}>{LANGUAGE_CATALOG.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}</select><b style={{ display: 'block', marginTop: 12 }}>Вивчаю</b><select value={target} onChange={e => selectCourse(source, e.target.value)}>{LANGUAGE_CATALOG.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}</select></div><div className="shop-grid">{Object.values(COURSES).map(c => <button key={c.id} className="shop-card" onClick={() => selectCourse(c.source, c.target)}><div className="big">{language(c.source).flag} → {language(c.target).flag}</div><h3>{c.title}</h3><p>{c.level} · {c.lessons.length} уроків</p></button>)}</div></div>;
}

function NoCourse({ setScreen }) { return <div className="page"><section className="hero"><div><p className="eyebrow">UNIVERSAL ENGINE</p><h1>Курс ще готується</h1><p>Архітектура вже підтримує цю пару мов. Потрібно лише додати контент курсу.</p></div><div className="hero-icon">🌍</div></section><button className="continue" onClick={() => setScreen?.('languages')}>Обрати інший курс <ChevronRight /></button></div>; }

function Lesson({ lesson, index, selected, answered, score, choose, next, exit }) {
  const q = lesson.questions[index], pct = index / lesson.questions.length * 100;
  const audioLanguage = q.audioLanguage || (/^[\u0400-\u04FF]/.test(q.answer) ? 'uk' : 'en');
  return <div className="lesson-screen"><div className="lesson-top"><button onClick={exit}><X /></button><div className="progress"><i style={{ width: `${pct}%` }} /></div><span>❤️</span></div><div className="question"><div className="q-meta">УРОК · {index + 1}/{lesson.questions.length}</div><h1>{q.q}</h1><button className="speak" data-tts-text={q.answer} onClick={() => speak(q.answer, audioLanguage)}><Volume2 /> Прослухати відповідь</button><div className="answers">{q.options.map(o => <button key={o} disabled={answered} className={`${answered && o === q.answer ? 'correct' : ''} ${answered && selected === o && o !== q.answer ? 'wrong' : ''}`} onClick={() => choose(o)}>{o}{answered && o === q.answer ? <Check /> : answered && selected === o ? <X /> : null}</button>)}</div></div>{answered && <div className={`feedback ${selected === q.answer ? 'good' : 'bad'}`}><b>{selected === q.answer ? 'Чудово! 🎉' : 'Майже!'}</b><span>{selected === q.answer ? 'Правильна відповідь.' : `Правильна відповідь: ${q.answer}`}</span></div>}<button className="continue" disabled={!answered} onClick={next}>{index === lesson.questions.length - 1 ? 'Завершити урок' : 'Продовжити'} <ChevronRight /></button></div>;
}

function Result({ lesson, score, state, home, again }) { const total = lesson.questions.length, perfect = score === total; return <div className="result"><div className="confetti">🎉</div><p className="eyebrow">УРОК ЗАВЕРШЕНО</p><h1>{perfect ? 'Ідеально!' : 'Молодець!'}</h1><p>Ти завершив урок «{lesson.title}».</p><div className="result-grid"><div><Star /><b>+{lesson.xp + (perfect ? 10 : 0)}</b><span>XP</span></div><div><Check /><b>{score}/{total}</b><span>Правильних</span></div><div><Flame /><b>{state.streak}</b><span>Серія</span></div></div><button className="continue" onClick={home}>Продовжити <ChevronRight /></button><button className="secondary" onClick={again}><RotateCcw /> Повторити урок</button></div>; }

function Shop({ state, setState, notify }) { const buy = () => { if (state.gems < 20) return notify('Недостатньо 💎'); setState(s => ({ ...s, gems: s.gems - 20, hearts: Math.min(5, s.hearts + 1) })); notify('Покупку виконано!'); }; return <div className="page"><p className="eyebrow">МАГАЗИН</p><h1>Магазин 💎</h1><p className="muted">Твої кристали: <b>{state.gems}</b></p><div className="shop-grid"><div className="shop-card"><div className="big">❤️</div><h3>Сердечко</h3><p>+1 життя</p><button onClick={buy}>20 💎</button></div><div className="shop-card premium-card"><Crown className="crown" /><h3>English AI PRO</h3><p>AI-розмови, усі курси, статистика</p><button onClick={() => notify('PRO-підписку підключимо наступним етапом')}>Оформити PRO</button></div></div></div>; }

function Profile({ state, reset, source, target }) { return <div className="page"><div className="profile-head"><div className="avatar">🧑‍💻</div><div><p className="eyebrow">ПРОФІЛЬ</p><h1>Мій прогрес</h1><span>{language(source).flag} → {language(target).flag} · Рівень {state.level}</span></div></div><div className="stats-grid"><div><b>{state.xp}</b><span>XP</span></div><div><b>{state.streak}</b><span>днів серії</span></div><div><b>{state.completed.length}</b><span>уроків</span></div><div><b>{state.mistakes}</b><span>помилок</span></div></div><div className="card achievements"><h2>Архітектура 🧠</h2><div className="badges"><span>🌍 Multi-language</span><span>📚 Data-driven</span><span>🔊 TTS locale</span></div></div><button className="danger" onClick={reset}>Скинути прогрес</button></div>; }

function AIPractice() { const [messages, setMessages] = useState([{ role: 'ai', text: 'Hi! 👋 I’m your English AI tutor. Tell me about your day in English.' }]); const [input, setInput] = useState(''); const send = () => { if (!input.trim()) return; const text = input.trim(); setMessages(m => [...m, { role: 'user', text }, { role: 'ai', text: smartReply(text) }]); setInput(''); }; return <div className="page ai-page"><div className="ai-header"><div className="ai-face">🤖</div><div><p className="eyebrow">AI TUTOR</p><h1>English Chat</h1><span>Практикуйся без страху</span></div></div><div className="chat">{messages.map((m, i) => <div key={i} className={`bubble ${m.role}`}>{m.text}</div>)}</div><div className="chat-input"><input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Напиши англійською..." /><button onClick={send}>➤</button></div><div className="quick"><button onClick={() => setInput('My name is Alex.')}>Introduce me</button><button onClick={() => setInput('I want to practice speaking.')}>Practice</button><button onClick={() => setInput('What should I learn today?')}>Help me</button></div></div>; }
function smartReply(t) { const x = t.toLowerCase(); if (x.includes('name')) return 'Nice to meet you! 😊 Try: “My name is Alex. I live in Ukraine.”'; if (x.includes('practice')) return 'Great! Let\'s practice. What did you do today?'; if (x.includes('learn')) return 'Today learn 5 useful phrases: How are you? / I\'m fine. / What do you do? / I work from home. / See you tomorrow!'; return `Good job! 👍 A more natural version may be: “${t.replace(/\.$/, '')}.” Keep going!`; }
