// Scalable CEFR curriculum engine.
// 2,000,000,000 is an addressable lesson space, not stored lesson files.
// Lessons are generated deterministically from pedagogical seeds and can later
// be backed by larger licensed/open datasets without changing the UI contract.

export const MEGA_LESSON_COUNT = 2_000_000_000;
export const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const LEVEL_META = {
  A1: { name: 'Beginner', units: 40, focus: 'survival communication' },
  A2: { name: 'Elementary', units: 40, focus: 'everyday communication' },
  B1: { name: 'Intermediate', units: 40, focus: 'independent communication' },
  B2: { name: 'Upper-Intermediate', units: 40, focus: 'argumentation and fluency' },
  C1: { name: 'Advanced', units: 40, focus: 'academic and professional precision' },
  C2: { name: 'Mastery', units: 40, focus: 'nuance, register and expert comprehension' }
};

const VOCAB = {
  A1: [['hello','привіт'],['goodbye','до побачення'],['please','будь ласка'],['thanks','дякую'],['sorry','вибач'],['name','ім’я'],['friend','друг'],['family','сім’я'],['mother','мати'],['father','батько'],['home','дім'],['room','кімната'],['door','двері'],['water','вода'],['food','їжа'],['bread','хліб'],['apple','яблуко'],['school','школа'],['teacher','вчитель'],['book','книга'],['city','місто'],['street','вулиця'],['car','автомобіль'],['work','робота'],['day','день'],['night','ніч'],['today','сьогодні'],['tomorrow','завтра'],['yesterday','вчора'],['go','йти'],['come','приходити'],['eat','їсти'],['drink','пити'],['want','хотіти'],['need','потребувати'],['have','мати'],['make','робити'],['see','бачити'],['know','знати'],['like','подобатися'],['good','добрий'],['bad','поганий'],['big','великий'],['small','малий'],['new','новий'],['old','старий'],['hot','гарячий'],['cold','холодний']],
  A2: [['usually','зазвичай'],['sometimes','іноді'],['always','завжди'],['never','ніколи'],['already','вже'],['still','ще'],['often','часто'],['early','рано'],['late','пізно'],['journey','подорож'],['ticket','квиток'],['station','станція'],['hotel','готель'],['airport','аеропорт'],['health','здоров’я'],['doctor','лікар'],['medicine','ліки'],['weather','погода'],['shopping','покупки'],['price','ціна'],['cheap','дешевий'],['expensive','дорогий'],['experience','досвід'],['decision','рішення'],['decide','вирішувати'],['improve','покращувати'],['remember','пам’ятати'],['forget','забувати'],['explain','пояснювати'],['invite','запрошувати'],['arrive','прибувати'],['leave','вирушати'],['borrow','позичати'],['return','повертати'],['although','хоча']],
  B1: [['opportunity','можливість'],['challenge','виклик'],['achievement','досягнення'],['relationship','стосунки'],['responsibility','відповідальність'],['environment','довкілля'],['community','громада'],['communication','спілкування'],['choice','вибір'],['purpose','мета'],['habit','звичка'],['advantage','перевага'],['disadvantage','недолік'],['solution','рішення'],['behavior','поведінка'],['education','освіта'],['career','кар’єра'],['skill','навичка'],['research','дослідження'],['suggest','пропонувати'],['avoid','уникати'],['achieve','досягати'],['require','вимагати'],['depend','залежати'],['consider','розглядати'],['compare','порівнювати'],['describe','описувати'],['discuss','обговорювати'],['develop','розвивати'],['realize','усвідомлювати'],['manage','керувати'],['increase','збільшувати'],['reduce','зменшувати']],
  B2: [['evidence','доказ'],['consequence','наслідок'],['perspective','перспектива'],['assumption','припущення'],['strategy','стратегія'],['revenue','дохід'],['algorithm','алгоритм'],['privacy','приватність'],['policy','політика'],['impact','вплив'],['principle','принцип'],['approach','підхід'],['context','контекст'],['issue','питання'],['factor','чинник'],['outcome','результат'],['framework','структура'],['significant','значний'],['relevant','доречний'],['reliable','надійний'],['efficient','ефективний'],['complex','складний'],['justify','обґрунтовувати'],['evaluate','оцінювати'],['establish','встановлювати'],['implement','впроваджувати'],['maintain','підтримувати'],['assess','оцінювати'],['demonstrate','демонструвати'],['interpret','тлумачити'],['negotiate','вести переговори'],['distinguish','розрізняти']],
  C1: [['substantial','значний'],['ambiguous','неоднозначний'],['coherent','зв’язний'],['controversial','суперечливий'],['contemporary','сучасний'],['facilitate','сприяти'],['inevitable','неминучий'],['underlying','основний'],['nuance','нюанс'],['criterion','критерій'],['hypothesis','гіпотеза'],['phenomenon','явище'],['persuasive','переконливий'],['precise','точний'],['sophisticated','витончений'],['inherent','властивий'],['considerable','істотний'],['diminish','зменшувати'],['enhance','посилювати'],['derive','виводити'],['allocate','розподіляти'],['articulate','чітко висловлювати'],['anticipate','передбачати'],['convey','передавати'],['constrain','обмежувати'],['contribute','сприяти'],['contradict','суперечити'],['elaborate','детально пояснювати'],['infer','робити висновок'],['reinforce','підсилювати']],
  C2: [['meticulous','ретельний'],['ephemeral','нетривалий'],['pervasive','всеосяжний'],['discerning','проникливий'],['intrinsic','внутрішньо властивий'],['conundrum','складна проблема'],['proliferate','швидко поширюватися'],['circumvent','обходити'],['substantiate','підтверджувати доказами'],['ubiquitous','повсюдний'],['pragmatic','прагматичний'],['ostensibly','нібито'],['paradigm','парадигма'],['dichotomy','дихотомія'],['scrutinize','ретельно досліджувати'],['reconcile','узгоджувати'],['extrapolate','екстраполювати'],['corroborate','підтверджувати'],['juxtapose','зіставляти'],['underscore','підкреслювати'],['predominant','переважний'],['inadvertent','ненавмисний'],['intricate','складний'],['plausible','правдоподібний'],['ambivalence','подвійне ставлення'],['disparity','нерівність'],['profound','глибокий'],['tenuous','хиткий']]
};

const GRAMMAR = {
  A1:['be: am/is/are','have got','present simple','there is/are','can/can’t','basic questions'],
  A2:['past simple','going to','present continuous','comparatives','countable nouns','must/should'],
  B1:['present perfect','first conditional','relative clauses','used to','reported speech basics','gerunds and infinitives'],
  B2:['second conditional','passive voice','modal deduction','advanced relative clauses','reported speech','complex linking'],
  C1:['inversion','mixed conditionals','cleft sentences','nominalisation','advanced modality','discourse markers'],
  C2:['subtle modality','ellipsis','fronting','register shifts','rhetorical structures','fine-grained aspect']
};
const SKILLS = ['vocabulary','grammar','retrieval','reading','listening','translation'];

function hash(n){let x=Math.imul((n>>>0)^0x9e3779b9,0x85ebca6b);x^=x>>>13;x=Math.imul(x,0xc2b2ae35);x^=x>>>16;return x>>>0;}
function seededShuffle(items,seed){const out=[...items];for(let i=out.length-1;i>0;i--){const j=hash(seed+i)%(i+1);[out[i],out[j]]=[out[j],out[i]];}return out;}
function wordFor(seed,words,offset=0){return words[(seed+offset)%words.length];}

export function levelForLesson(id){const safe=Math.max(1,Math.min(MEGA_LESSON_COUNT,Math.floor(id)));const block=Math.floor((safe-1)/(MEGA_LESSON_COUNT/LEVELS.length));return LEVELS[Math.min(LEVELS.length-1,block)];}

function makeQuestions(seed,level,a,b,c){
  const grammar=GRAMMAR[level][seed%GRAMMAR[level].length];
  return [
    {type:'choice',skill:'vocabulary',q:`What does “${a[0]}” mean?`,options:seededShuffle([a[1],b[1],c[1],'інше значення'],seed),answer:a[1],sourceText:a[0],targetText:a[1],audioLanguage:'en-US'},
    {type:'choice',skill:'retrieval',q:`Choose the English word for “${b[1]}”.`,options:seededShuffle([a[0],b[0],c[0],'unknown'],seed+17),answer:b[0],sourceText:b[0],targetText:b[1],audioLanguage:'en-US'},
    {type:'choice',skill:'grammar',q:'Which grammar topic is being practiced?',options:seededShuffle([grammar,GRAMMAR[level][(seed+1)%GRAMMAR[level].length],GRAMMAR[level][(seed+2)%GRAMMAR[level].length],'spelling'],seed+31),answer:grammar,sourceText:grammar,audioLanguage:'en-US'},
    {type:'choice',skill:'context',q:'Which pair is correct?',options:seededShuffle([`${c[0]} — ${c[1]}`,`${a[0]} — ${c[1]}`,`${b[0]} — ${a[1]}`,`${c[0]} — ${b[1]}`],seed+53),answer:`${c[0]} — ${c[1]}`,sourceText:c[0],targetText:c[1],audioLanguage:'en-US'}
  ];
}

export function getVirtualLesson(id,source='uk',target='en'){
  const safeId=Math.max(1,Math.min(MEGA_LESSON_COUNT,Math.floor(Number(id)||1)));const level=levelForLesson(safeId);const seed=hash(safeId);const words=VOCAB[level];
  const a=wordFor(seed,words),b=wordFor(seed>>>5,words,3),c=wordFor(seed>>>11,words,7);const unit=1+((safeId-1)%LEVEL_META[level].units);
  return {id:`mega-${safeId}`,number:safeId,level,unit:`${level} · Unit ${unit}`,title:`${LEVEL_META[level].focus} · Lesson ${safeId.toLocaleString('en-US')}`,icon:level==='A1'?'🌱':level==='A2'?'🌿':level==='B1'?'🚀':level==='B2'?'🧠':level==='C1'?'🎓':'🏆',xp:10+LEVELS.indexOf(level)*5,questions:makeQuestions(seed,level,a,b,c),source,target,generated:true,metadata:{skill:SKILLS[seed%SKILLS.length],grammar:GRAMMAR[level][seed%GRAMMAR[level].length],reviewWeight:1+(seed%5),version:2}};
}

export function getCurriculumStats(){const perLevel=Math.floor(MEGA_LESSON_COUNT/LEVELS.length);return {lessonCount:MEGA_LESSON_COUNT,levels:LEVELS.map(level=>({level,...LEVEL_META[level],lessonCount:perLevel})),generation:'deterministic-on-demand',storage:'local-only',exerciseTypes:4,skills:SKILLS};}
export function getVocabularyStats(){return Object.fromEntries(LEVELS.map(level=>[level,{seedEntries:VOCAB[level].length,grammarTopics:GRAMMAR[level].length}]));}
