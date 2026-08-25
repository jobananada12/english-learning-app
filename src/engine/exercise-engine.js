const hash = (n) => { let x = Math.imul((n ^ 0x9e3779b9) >>> 0, 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); x ^= x >>> 16; return x >>> 0; };
const shuffle = (items, seed) => { const a=[...items]; for(let i=a.length-1;i>0;i--){const j=hash(seed+i)%(i+1); [a[i],a[j]]=[a[j],a[i]];} return a; };
export const EXERCISE_TYPES=['translate','choice','word_order','fill_blank','listening','match','reading','review'];
const makeDistractors=(bank,correct,seed)=>shuffle(bank.filter(x=>x[0]!==correct[0]),seed).slice(0,3);
const pair=(en,uk)=>({en,uk});
export function buildExercises(lesson,source='uk',target='en'){
 const words=lesson.words||[]; if(!words.length)return[]; const out=[];
 for(let i=0;i<10;i++){
  const seed=hash((lesson.id||1)*97+i*31), item=words[i%words.length], ds=makeDistractors(words,item,seed), type=EXERCISE_TYPES[i%EXERCISE_TYPES.length];
  const en=item[0], uk=item[1];
  const bilingual=(textEn,textUk)=>({en:textEn,uk:textUk});
  if(type==='translate')out.push({id:`${lesson.id}-t${i}`,type,question:bilingual(`Translate “${uk}”`,`Переклади «${uk}»`),options:shuffle([item,...ds],seed).map(x=>bilingual(x[0],x[1])),answer:en,audio:[{text:uk,code:source},{text:en,code:target}]});
  else if(type==='choice')out.push({id:`${lesson.id}-c${i}`,type,question:bilingual(`What does “${en}” mean?`,`Що означає «${en}»?`),options:shuffle([item,...ds],seed+1).map(x=>bilingual(x[0],x[1])),answer:uk,audio:[{text:en,code:target},{text:uk,code:source}]});
  else if(type==='word_order'){const sentence=`I ${en} every day`,tokens=shuffle(sentence.split(' '),seed);out.push({id:`${lesson.id}-w${i}`,type,question:bilingual('Build the correct sentence','Склади правильне речення'),prompt:bilingual(`I ${en} every day`,`Я ${uk} щодня`),tokens,answer:sentence,audio:[{text:sentence,code:target},{text:`Я ${uk} щодня`,code:source}]});}
  else if(type==='fill_blank'){const sentence=`I want to ${en}`;out.push({id:`${lesson.id}-f${i}`,type,question:bilingual('Complete the sentence','Встав правильне слово'),prompt:bilingual(sentence.replace(en,'____'),`Я хочу ${uk}`),options:shuffle([item,...ds],seed).map(x=>bilingual(x[0],x[1])),answer:en,audio:[{text:sentence,code:target},{text:`Я хочу ${uk}`,code:source}]});}
  else if(type==='listening')out.push({id:`${lesson.id}-l${i}`,type,question:bilingual('Listen and choose','Прослухай і вибери'),options:shuffle([item,...ds],seed).map(x=>bilingual(x[0],x[1])),answer:en,audio:[{text:en,code:target},{text:uk,code:source}]});
  else if(type==='match')out.push({id:`${lesson.id}-m${i}`,type,question:bilingual('Find the correct translation','Знайди правильний переклад'),options:shuffle([item,...ds],seed).map(x=>bilingual(x[0],x[1])),answer:uk,audio:[{text:en,code:target},{text:uk,code:source}]});
  else if(type==='reading')out.push({id:`${lesson.id}-r${i}`,type,question:bilingual(`Read: “I ${en} every day.”`,`Прочитай: «I ${en} every day.»`),prompt:bilingual(`Key word: ${en}`,`Ключове слово: ${uk}`),options:shuffle([item,...ds],seed).map(x=>bilingual(x[0],x[1])),answer:en,audio:[{text:`I ${en} every day`,code:target},{text:`Я ${uk} щодня`,code:source}]});
  else out.push({id:`${lesson.id}-v${i}`,type:'review',question:bilingual(`Review: what does “${en}” mean?`,`Повторення: що означає «${en}»?`),options:shuffle([item,...ds],seed).map(x=>bilingual(x[0],x[1])),answer:uk,audio:[{text:en,code:target},{text:uk,code:source}]});
 }
 return out;
}