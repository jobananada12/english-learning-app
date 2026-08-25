const hash = (n) => { let x = Math.imul((n ^ 0x9e3779b9) >>> 0, 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); x ^= x >>> 16; return x >>> 0; };
const shuffle = (items, seed) => { const a=[...items]; for(let i=a.length-1;i>0;i--){const j=hash(seed+i)%(i+1); [a[i],a[j]]=[a[j],a[i]];} return a; };

export const EXERCISE_TYPES = ['translate','choice','word_order','fill_blank','listening','match','reading','review'];

function makeDistractors(wordBank, correct, seed){
  return shuffle(wordBank.filter(x=>x[0]!==correct[0]).slice(0,8), seed).slice(0,3);
}

export function buildExercises(lesson, source='uk', target='en'){
  const words=lesson.words || [];
  if(!words.length) return [];
  const out=[];
  for(let i=0;i<10;i++){
    const seed=hash((lesson.id||1)*97+i*31); const item=words[i%words.length]; const distractors=makeDistractors(words,item,seed);
    const type=EXERCISE_TYPES[i%EXERCISE_TYPES.length];
    if(type==='translate') out.push({id:`${lesson.id}-t${i}`,type,question:`Переклади «${item[1]}» англійською`,prompt:item[1],options:shuffle([item,...distractors],seed).map(x=>x[0]),answer:item[0],audio:item[1],audioLanguage:source});
    else if(type==='choice') out.push({id:`${lesson.id}-c${i}`,type,question:`What does “${item[0]}” mean?`,prompt:item[0],options:shuffle([item,...distractors],seed+1).map(x=>x[1]),answer:item[1],audio:item[0],audioLanguage:target});
    else if(type==='word_order') { const sentence=`I ${item[0]} every day`; const tokens=sentence.split(' '); out.push({id:`${lesson.id}-w${i}`,type,question:'Склади правильне речення',prompt:'',tokens:shuffle(tokens,seed),answer:sentence,audio:sentence,audioLanguage:target}); }
    else if(type==='fill_blank') { const sentence=`I want to ${item[0]}`; out.push({id:`${lesson.id}-f${i}`,type,question:'Встав правильне слово',prompt:sentence.replace(item[0],'____'),options:shuffle([item[0],...distractors.map(x=>x[0])],seed),answer:item[0],audio:sentence,audioLanguage:target}); }
    else if(type==='listening') out.push({id:`${lesson.id}-l${i}`,type,question:'Прослухай і вибери слово',prompt:item[0],options:shuffle([item[0],...distractors.map(x=>x[0])],seed),answer:item[0],audio:item[0],audioLanguage:target});
    else if(type==='match') out.push({id:`${lesson.id}-m${i}`,type,question:'Знайди правильний переклад',prompt:item[0],options:shuffle([item[1],...distractors.map(x=>x[1])],seed),answer:item[1],audio:item[0],audioLanguage:target});
    else if(type==='reading') out.push({id:`${lesson.id}-r${i}`,type,question:`Прочитай: “I ${item[0]} every day.” Що є ключовим словом?`,prompt:'',options:shuffle([item[0],...distractors.map(x=>x[0])],seed),answer:item[0],audio:`I ${item[0]} every day`,audioLanguage:target});
    else out.push({id:`${lesson.id}-v${i}`,type:'review',question:`Повторення: що означає “${item[0]}”?`,prompt:item[0],options:shuffle([item[1],...distractors.map(x=>x[1])],seed),answer:item[1],audio:item[0],audioLanguage:target});
  }
  return out;
}
