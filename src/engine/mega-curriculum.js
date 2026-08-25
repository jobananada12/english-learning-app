// Scalable curriculum engine: stores a finite pedagogical seed and generates lesson instances on demand.
// 2,000,000,000 is a lesson-space, not 2 billion JSON records.

export const MEGA_LESSON_COUNT = 2_000_000_000;
export const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const LEVEL_META = {
  A1: { name: 'Beginner', units: 40, lessonsPerUnit: 8333334 },
  A2: { name: 'Elementary', units: 40, lessonsPerUnit: 8333334 },
  B1: { name: 'Intermediate', units: 40, lessonsPerUnit: 8333333 },
  B2: { name: 'Upper-Intermediate', units: 40, lessonsPerUnit: 8333333 },
  C1: { name: 'Advanced', units: 40, lessonsPerUnit: 8333333 },
  C2: { name: 'Mastery', units: 40, lessonsPerUnit: 8333333 },
};

const SEEDS = {
  A1: [['hello','привіт'],['name','імʼя'],['family','сімʼя'],['home','дім'],['water','вода'],['food','їжа'],['friend','друг'],['work','робота'],['school','школа'],['city','місто'],['today','сьогодні'],['tomorrow','завтра'],['good','добрий'],['want','хотіти'],['go','йти']],
  A2: [['yesterday','вчора'],['usually','зазвичай'],['already','вже'],['journey','подорож'],['health','здоровʼя'],['project','проєкт'],['experience','досвід'],['decide','вирішувати'],['improve','покращувати'],['although','хоча']],
  B1: [['opportunity','можливість'],['challenge','виклик'],['achievement','досягнення'],['relationship','стосунки'],['responsibility','відповідальність'],['environment','довкілля'],['community','громада'],['communicate','спілкуватися']],
  B2: [['evidence','доказ'],['consequence','наслідок'],['perspective','перспектива'],['assumption','припущення'],['strategy','стратегія'],['revenue','дохід'],['algorithm','алгоритм'],['privacy','приватність'],['justify','обґрунтовувати']],
  C1: [['substantial','значний'],['ambiguous','неоднозначний'],['coherent','звʼязний'],['controversial','суперечливий'],['contemporary','сучасний'],['facilitate','сприяти'],['inevitable','неминучий'],['underlying','основний'],['nuance','нюанс']],
  C2: [['meticulous','ретельний'],['ephemeral','нетривалий'],['pervasive','всеосяжний'],['discerning','проникливий'],['intrinsic','внутрішньо властивий'],['conundrum','складна проблема'],['proliferate','швидко поширюватися'],['circumvent','обходити'],['substantiate','підтверджувати доказами']]
};

const PATTERNS = {
  A1:['Vocabulary','Sentence building','Everyday dialogue','Listening','Basic grammar'],
  A2:['Vocabulary in context','Past and future','Everyday conversation','Reading','Grammar practice'],
  B1:['Communication','Narrative','Opinions','Phrasal verbs','Grammar in context'],
  B2:['Argumentation','Collocations','Formal English','Idioms','Complex grammar'],
  C1:['Academic English','Professional English','Nuance','Discourse','Advanced grammar'],
  C2:['Precision','Register','Rhetoric','Idiomatic mastery','Expert comprehension']
};

// Question templates are localized at runtime. English remains the learning language.
const QUESTION_TEMPLATES = {
  uk:{meaning:'Що означає «{word}»?', english:'Яке англійське слово означає «{native}»?', pair:'Яка пара є правильною?', task:'Яке слово підходить до завдання «{pattern}»?'},
  pl:{meaning:'Co oznacza „{word}”?', english:'Jakie angielskie słowo oznacza „{native}”?', pair:'Która para jest poprawna?', task:'Które słowo pasuje do zadania „{pattern}”?'},
  de:{meaning:'Was bedeutet „{word}“?', english:'Welches englische Wort bedeutet „{native}“?', pair:'Welches Paar ist richtig?', task:'Welches Wort passt zur Aufgabe „{pattern}“?'},
  fr:{meaning:'Que signifie « {word} » ?', english:'Quel mot anglais signifie « {native} » ?', pair:'Quelle paire est correcte ?', task:'Quel mot correspond à la tâche « {pattern} » ?'},
  es:{meaning:'¿Qué significa «{word}»?', english:'¿Qué palabra inglesa significa «{native}»?', pair:'¿Qué pareja es correcta?', task:'¿Qué palabra corresponde a la tarea «{pattern}»?'},
  it:{meaning:'Che cosa significa «{word}»?', english:'Quale parola inglese significa «{native}»?', pair:'Quale coppia è corretta?', task:'Quale parola completa l’attività «{pattern}»?'},
  pt:{meaning:'O que significa «{word}»?', english:'Quale palavra inglesa significa «{native}»?', pair:'Qual é o par correto?', task:'Qual palavra corresponde à tarefa «{pattern}»?'},
  nl:{meaning:'Wat betekent „{word}“?', english:'Welk Engels woord betekent „{native}“?', pair:'Welk paar is correct?', task:'Welk woord past bij de taak „{pattern}“?'},
  cs:{meaning:'Co znamená „{word}“?', english:'Které anglické slovo znamená „{native}“?', pair:'Která dvojice je správná?', task:'Které slovo patří k úkolu „{pattern}“?'},
  sk:{meaning:'Čo znamená „{word}“?', english:'Ktoré anglické slovo znamená „{native}“?', pair:'Ktorá dvojica je správna?', task:'Ktoré slovo patrí k úlohe „{pattern}“?'},
  ro:{meaning:'Ce înseamnă „{word}”?', english:'Ce cuvânt englezesc înseamnă „{native}”?', pair:'Care pereche este corectă?', task:'Ce cuvânt se potrivește sarcinii „{pattern}”?'},
  hu:{meaning:'Mit jelent a(z) „{word}”?', english:'Melyik angol szó jelenti azt, hogy „{native}”?', pair:'Melyik pár helyes?', task:'Melyik szó illik a(z) „{pattern}” feladathoz?'},
  tr:{meaning:'“{word}” ne demek?', english:'“{native}” anlamına gelen İngilizce kelime hangisi?', pair:'Hangi eşleşme doğru?', task:'“{pattern}” görevine hangi kelime uyar?'},
  sv:{meaning:'Vad betyder ”{word}”?', english:'Vilket engelskt ord betyder ”{native}”?', pair:'Vilket par är korrekt?', task:'Vilket ord passar uppgiften ”{pattern}”?'},
  no:{meaning:'Hva betyr «{word}»?', english:'Hvilket engelsk ord betyr «{native}»?', pair:'Hvilket par er riktig?', task:'Hvilket ord passer til oppgaven «{pattern}»?'},
  da:{meaning:'Hvad betyder ”{word}”?', english:'Hvilket engelsk ord betyder ”{native}”?', pair:'Hvilket par er korrekt?', task:'Hvilket ord passer til opgaven ”{pattern}”?'},
  fi:{meaning:'Mitä ”{word}” tarkoittaa?', english:'Mikä englanninkielinen sana tarkoittaa ”{native}”?', pair:'Mikä pari on oikein?', task:'Mikä sana sopii tehtävään ”{pattern}”?'},
  ja:{meaning:'「{word}」はどういう意味ですか？', english:'「{native}」を意味する英単語はどれですか？', pair:'正しい組み合わせはどれですか？', task:'「{pattern}」の課題に合う単語はどれですか？'},
  ko:{meaning:'“{word}”은 무슨 뜻인가요?', english:'“{native}”를 의미하는 영어 단어는 무엇인가요?', pair:'올바른 짝은 무엇인가요?', task:'“{pattern}” 과제에 맞는 단어는 무엇인가요?'},
  zh:{meaning:'“{word}”是什么意思？', english:'哪个英语单词表示“{native}”？', pair:'哪一组是正确的？', task:'哪个单词适合“{pattern}”任务？'},
  ar:{meaning:'ماذا تعني «{word}»؟', english:'ما الكلمة الإنجليزية التي تعني «{native}»؟', pair:'أي زوج صحيح؟', task:'أي كلمة تناسب مهمة «{pattern}»؟'},
  hi:{meaning:'“{word}” का क्या अर्थ है?', english:'“{native}” के लिए अंग्रेज़ी शब्द कौन सा है?', pair:'सही जोड़ी कौन सी है?', task:'“{pattern}” कार्य के लिए कौन सा शब्द सही है?'}
};

function hash(n){let x=Math.imul(n^0x9e3779b9,0x85ebca6b);x^=x>>>13;x=Math.imul(x,0xc2b2ae35);x^=x>>>16;return x>>>0;}
function template(source,type,values){const t=QUESTION_TEMPLATES[source]||QUESTION_TEMPLATES.uk;return (t[type]||QUESTION_TEMPLATES.uk[type]||'What does “{word}” mean?').replace(/\{(\w+)\}/g,(_,k)=>values[k]??'');}

export function levelForLesson(id){const block=Math.floor((id-1)/(MEGA_LESSON_COUNT/6));return LEVELS[Math.min(5,block)];}

export function getVirtualLesson(id,source='uk',target='en'){
 const safeId=Math.max(1,Math.min(MEGA_LESSON_COUNT,Math.floor(id)));const level=levelForLesson(safeId);const seed=hash(safeId);const words=SEEDS[level];const pattern=PATTERNS[level][seed%PATTERNS[level].length];
 const a=words[seed%words.length],b=words[(seed>>>8)%words.length],c=words[(seed>>>16)%words.length],variant=seed%4;
 const nativeFor=pair=>pair[1];
 const options=[a,b,c,[a[0],'інше значення']].map((pair,i)=>({en:pair[0],native:source==='uk'?pair[1]:pair[0],isDistractor:i===3}));
 let question;
 if(variant===0) question={type:'meaning',q:template(source,'meaning',{word:a[0]}),sourceText:a[0],targetText:a[1]};
 else if(variant===1) question={type:'english',q:template(source,'english',{native:a[1]}),sourceText:a[1],targetText:a[0]};
 else if(variant===2) question={type:'task',q:template(source,'task',{pattern}),sourceText:pattern,targetText:pattern};
 else question={type:'pair',q:template(source,'pair',{}),sourceText:a[0],targetText:a[1]};
 question.options=shuffle(options,seed).map(x=>({...x,answerText:`${x.en} — ${x.native}`}));
 question.answer=question.options.find(x=>x.en===a[0])?.answerText||`${a[0]} — ${a[1]}`;
 question.audioLanguage=target;
 return {id:`mega-${safeId}`,number:safeId,level,unit:`${level} · Unit ${1+((safeId-1)%40)}`,title:`${pattern} · Lesson ${safeId.toLocaleString()}`,icon:level==='A1'?'🌱':level==='A2'?'🌿':level==='B1'?'🚀':level==='B2'?'🧠':level==='C1'?'🎓':'🏆',xp:10+(LEVELS.indexOf(level)*5),questions:[question],source,target,generated:true};
}
function shuffle(items,seed){const a=[...items];for(let i=a.length-1;i>0;i--){const j=hash(seed+i)%(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
export function getCurriculumStats(){return {lessonCount:MEGA_LESSON_COUNT,levels:LEVELS.map(level=>({level,...LEVEL_META[level],lessonCount:Math.floor(MEGA_LESSON_COUNT/6)})),generation:'deterministic-on-demand',storage:'local-only'};}
