import {LANGUAGE_CATALOG,language} from './language-catalog';
export {LANGUAGE_CATALOG,language};
export const MEGA_LESSON_COUNT=2000000000;
export const LEVELS=['A1','A2','B1','B2','C1','C2'];
const W={
hello:['привіт','hello','cześć','hallo','bonjour','hola','ciao','olá','water','voda','voda','salut','szia','merhaba','hej','hei','hej','hei','こんにちは','안녕하세요','你好','مرحبا','नमस्ते'],
water:['вода','water','woda','Wasser','eau','agua','acqua','água','water','voda','voda','apă','víz','yemek','vatten','vann','vand','vesi','水','물','水','ماء','पानी'],
food:['їжа','food','jedzenie','Essen','nourriture','comida','cibo','comida','eten','jídlo','jedlo','mâncare','étel','yemek','mat','mat','mad','ruoka','食べ物','음식','食物','طعام','भोजन'],
home:['дім','home','dom','Zuhause','maison','casa','casa','casa','huis','domov','domov','acasă','otthon','ev','hem','hjem','hjem','koti','家','집','家','منزل','घर'],
friend:['друг','friend','przyjaciel','Freund','ami','amigo','amico','amigo','vriend','přítel','priateľ','prieten','barát','arkadaş','vän','venn','ven','ystävä','友達','친구','朋友','صديق','दोस्त'],
book:['книга','book','książka','Buch','livre','libro','libro','livro','boek','kniha','kniha','carte','könyv','kitap','bok','bok','bog','kirja','本','책','书','كتاب','कितاب'],
good:['добрий','good','dobry','gut','bon','bueno','buono','bom','goed','dobrý','dobrý','bun','jó','iyi','bra','god','god','hyvä','良い','좋은','好','جيد','अच्छा'],
go:['йти','go','iść','gehen','aller','ir','andare','ir','gaan','jít','ísť','a merge','menni','gitmek','gå','gå','gå','mennä','行く','가다','去','يذهب','जाना'],
};
const K=Object.keys(W);
const hash=n=>{let x=Math.imul((n>>>0)^0x9e3779b9,0x85ebca6b);x^=x>>>13;return x>>>0};
const pick=(n,o=0)=>K[hash(n+o)%K.length];
const idx=c=>LANGUAGE_CATALOG.findIndex(x=>x.code===c);
const word=(k,c)=>W[k]?.[Math.max(0,idx(c))]||W[k]?.[1]||k;
const shuffle=(a,s)=>{const x=[...new Set(a)];for(let i=x.length-1;i>0;i--){const j=hash(s+i)%(i+1);[x[i],x[j]]=[x[j],x[i]]}return x};
const distinctKeys=(seed,count)=>{const out=[];let offset=0;while(out.length<count&&offset<K.length*4){const k=pick(seed,offset++);if(!out.includes(k))out.push(k)}return out};
export const levelForLesson=id=>{const n=Math.max(1,Math.min(MEGA_LESSON_COUNT,Math.floor(Number(id)||1)));return LEVELS[Math.min(LEVELS.length-1,Math.floor((n-1)*LEVELS.length/MEGA_LESSON_COUNT))]};
export function getVirtualLesson(id,source='uk',target='en'){
 const n=Math.max(1,Math.min(MEGA_LESSON_COUNT,Math.floor(Number(id)||1))),s=hash(n),level=levelForLesson(n),[a,b,c,d]=distinctKeys(s,4),A=word(a,target),AS=word(a,source),B=word(b,target),BS=word(b,source),C=word(c,target),CS=word(c,source),D=word(d,target),DS=word(d,source),sn=language(source).name,tn=language(target).name;
 const vocabulary=shuffle([AS,BS,CS,DS],s);
 const retrieval=shuffle([A,B,C,D],s+1);
 const translation=shuffle([A,B,C,D],s+2);
 const pairs=shuffle([`${A} — ${AS}`,`${B} — ${BS}`,`${C} — ${CS}`,`${D} — ${DS}`],s+3);
 return{id:`${source}-${target}-${n}`,number:n,level,unit:`${level} · Unit ${1+(n-1)%40}`,title:`${sn} → ${tn} · Lesson ${n.toLocaleString('en-US')}`,icon:['🌱','🌿','🚀','🧠','🎓','🏆'][LEVELS.indexOf(level)],xp:10+LEVELS.indexOf(level)*5,source,target,questions:[
  {skill:'vocabulary',q:`What does “${A}” mean?`,options:vocabulary,answer:AS,sourceText:A,targetText:AS},
  {skill:'retrieval',q:`Choose the ${tn} word for “${BS}”.`,options:retrieval,answer:B,sourceText:B,targetText:BS},
  {skill:'translation',q:`Translate “${CS}” into ${tn}.`,options:translation,answer:C,sourceText:C,targetText:CS},
  {skill:'context',q:`Choose the correct ${sn} ↔ ${tn} pair.`,options:pairs,answer:`${A} — ${AS}`,sourceText:A,targetText:AS}
 ]};
}
export const getCurriculumStats=()=>({lessonCount:MEGA_LESSON_COUNT,levels:LEVELS.map((level,i)=>{const start=Math.floor(i*MEGA_LESSON_COUNT/LEVELS.length)+1;const end=Math.floor((i+1)*MEGA_LESSON_COUNT/LEVELS.length);return{level,lessonCount:end-start+1}}),supportedLanguages:LANGUAGE_CATALOG.length,languagePairs:LANGUAGE_CATALOG.length*(LANGUAGE_CATALOG.length-1)});
export const getAudioLanguage=(text,preferred)=>preferred?language(preferred).locale:/^[\u0400-\u04FF]/.test(String(text||''))?'uk-UA':'en-US';
