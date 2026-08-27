import { LANGUAGE_CATALOG, language } from './course-engine';

// Universal starter curriculum. Content is keyed by concepts, not by a fixed
// English/Ukrainian pair, so the same lesson generator works for every pair.
const L = {
  hello:{en:'hello',uk:'привіт',pl:'cześć',de:'hallo',fr:'bonjour',es:'hola',it:'ciao',pt:'olá',nl:'hallo',cs:'ahoj',sk:'ahoj',ro:'salut',hu:'szia',tr:'merhaba',sv:'hej',no:'hei',da:'hej',fi:'hei',ja:'こんにちは',ko:'안녕하세요',zh:'你好',ar:'مرحبا',hi:'नमस्ते'},
  goodbye:{en:'goodbye',uk:'до побачення',pl:'do widzenia',de:'auf Wiedersehen',fr:'au revoir',es:'adiós',it:'arrivederci',pt:'adeus',nl:'tot ziens',cs:'na shledanou',sk:'dovidenia',ro:'la revedere',hu:'viszlát',tr:'hoşça kal',sv:'hej då',no:'ha det',da:'farvel',fi:'näkemiin',ja:'さようなら',ko:'안녕히 가세요',zh:'再见',ar:'مع السلامة',hi:'अलविदा'},
  please:{en:'please',uk:'будь ласка',pl:'proszę',de:'bitte',fr:"s'il vous plaît",es:'por favor',it:'per favore',pt:'por favor',nl:'alstublieft',cs:'prosím',sk:'prosím',ro:'te rog',hu:'kérem',tr:'lütfen',sv:'snälla',no:'vær så snill',da:'venligst',fi:'ole hyvä',ja:'お願いします',ko:'부탁합니다',zh:'请',ar:'من فضلك',hi:'कृपया'},
  thanks:{en:'thanks',uk:'дякую',pl:'dziękuję',de:'danke',fr:'merci',es:'gracias',it:'grazie',pt:'obrigado',nl:'dank je',cs:'děkuji',sk:'ďakujem',ro:'mulțumesc',hu:'köszönöm',tr:'teşekkürler',sv:'tack',no:'takk',da:'tak',fi:'kiitos',ja:'ありがとう',ko:'감사합니다',zh:'谢谢',ar:'شكرا',hi:'धन्यवाद'},
  water:{en:'water',uk:'вода',pl:'woda',de:'Wasser',fr:'eau',es:'agua',it:'acqua',pt:'água',nl:'water',cs:'voda',sk:'voda',ro:'apă',hu:'víz',tr:'su',sv:'vatten',no:'vann',da:'vand',fi:'vesi',ja:'水',ko:'물',zh:'水',ar:'ماء',hi:'पानी'},
  food:{en:'food',uk:'їжа',pl:'jedzenie',de:'Essen',fr:'nourriture',es:'comida',it:'cibo',pt:'comida',nl:'eten',cs:'jídlo',sk:'jedlo',ro:'mâncare',hu:'étel',tr:'yemek',sv:'mat',no:'mat',da:'mad',fi:'ruoka',ja:'食べ物',ko:'음식',zh:'食物',ar:'طعام',hi:'भोजन'},
  home:{en:'home',uk:'дім',pl:'dom',de:'Zuhause',fr:'maison',es:'casa',it:'casa',pt:'casa',nl:'huis',cs:'domov',sk:'domov',ro:'acasă',hu:'otthon',tr:'ev',sv:'hem',no:'hjem',da:'hjem',fi:'koti',ja:'家',ko:'집',zh:'家',ar:'منزل',hi:'घर'},
  friend:{en:'friend',uk:'друг',pl:'przyjaciel',de:'Freund',fr:'ami',es:'amigo',it:'amico',pt:'amigo',nl:'vriend',cs:'přítel',sk:'priateľ',ro:'prieten',hu:'barát',tr:'arkadaş',sv:'vän',no:'venn',da:'ven',fi:'ystävä',ja:'友達',ko:'친구',zh:'朋友',ar:'صديق',hi:'दोस्त'},
  family:{en:'family',uk:'сім’я',pl:'rodzina',de:'Familie',fr:'famille',es:'familia',it:'famiglia',pt:'família',nl:'familie',cs:'rodina',sk:'rodina',ro:'familie',hu:'család',tr:'aile',sv:'familj',no:'familie',da:'familie',fi:'perhe',ja:'家族',ko:'가족',zh:'家庭',ar:'عائلة',hi:'परिवार'},
  book:{en:'book',uk:'книга',pl:'książka',de:'Buch',fr:'livre',es:'libro',it:'libro',pt:'livro',nl:'boek',cs:'kniha',sk:'kniha',ro:'carte',hu:'könyv',tr:'kitap',sv:'bok',no:'bok',da:'bog',fi:'kirja',ja:'本',ko:'책',zh:'书',ar:'كتاب',hi:'किताब'},
  city:{en:'city',uk:'місто',pl:'miasto',de:'Stadt',fr:'ville',es:'ciudad',it:'città',pt:'cidade',nl:'stad',cs:'město',sk:'mesto',ro:'oraș',hu:'város',tr:'şehir',sv:'stad',no:'by',da:'by',fi:'kaupunki',ja:'都市',ko:'도시',zh:'城市',ar:'مدينة',hi:'शहर'},
  work:{en:'work',uk:'робота',pl:'praca',de:'Arbeit',fr:'travail',es:'trabajo',it:'lavoro',pt:'trabalho',nl:'werk',cs:'práce',sk:'práca',ro:'muncă',hu:'munka',tr:'iş',sv:'arbete',no:'arbeid',da:'arbejde',fi:'työ',ja:'仕事',ko:'일',zh:'工作',ar:'عمل',hi:'काम'},
  good:{en:'good',uk:'добрий',pl:'dobry',de:'gut',fr:'bon',es:'bueno',it:'buono',pt:'bom',nl:'goed',cs:'dobrý',sk:'dobrý',ro:'bun',hu:'jó',tr:'iyi',sv:'bra',no:'god',da:'god',fi:'hyvä',ja:'良い',ko:'좋은',zh:'好',ar:'جيد',hi:'अच्छा'},
  bad:{en:'bad',uk:'поганий',pl:'zły',de:'schlecht',fr:'mauvais',es:'malo',it:'cattivo',pt:'mau',nl:'slecht',cs:'špatný',sk:'zlý',ro:'rău',hu:'rossz',tr:'kötü',sv:'dålig',no:'dårlig',da:'dårlig',fi:'huono',ja:'悪い',ko:'나쁜',zh:'坏',ar:'سيء',hi:'बुरा'},
  go:{en:'go',uk:'йти',pl:'iść',de:'gehen',fr:'aller',es:'ir',it:'andare',pt:'ir',nl:'gaan',cs:'jít',sk:'ísť',ro:'a merge',hu:'menni',tr:'gitmek',sv:'gå',no:'gå',da:'gå',fi:'mennä',ja:'行く',ko:'가다',zh:'去',ar:'يذهب',hi:'जाना'},
  eat:{en:'eat',uk:'їсти',pl:'jeść',de:'essen',fr:'manger',es:'comer',it:'mangiare',pt:'comer',nl:'eten',cs:'jíst',sk:'jesť',ro:'mânca',hu:'enni',tr:'yemek',sv:'äta',no:'spise',da:'spise',fi:'syödä',ja:'食べる',ko:'먹다',zh:'吃',ar:'يأكل',hi:'खाना'},
  drink:{en:'drink',uk:'пити',pl:'pić',de:'trinken',fr:'boire',es:'beber',it:'bere',pt:'beber',nl:'drinken',cs:'pít',sk:'piť',ro:'bea',hu:'inni',tr:'içmek',sv:'dricka',no:'drikke',da:'drikke',fi:'juoda',ja:'飲む',ko:'마시다',zh:'喝',ar:'يشرب',hi:'पीना'},
  want:{en:'want',uk:'хотіти',pl:'chcieć',de:'wollen',fr:'vouloir',es:'querer',it:'volere',pt:'querer',nl:'willen',cs:'chtít',sk:'chcieť',ro:'a vrea',hu:'akarni',tr:'istemek',sv:'vilja',no:'ville',da:'ville',fi:'haluta',ja:'欲しい',ko:'원하다',zh:'想要',ar:'يريد',hi:'चाहना'}
};
const LEVELS=['A1','A2','B1','B2','C1','C2'];
const FOCUS={A1:'survival communication',A2:'everyday communication',B1:'independent communication',B2:'fluency and argumentation',C1:'professional precision',C2:'nuance and mastery'};
const CONCEPTS=Object.keys(L);
const hash=n=>{let x=Math.imul((n>>>0)^0x9e3779b9,0x85ebca6b);x^=x>>>13;x=Math.imul(x,0xc2b2ae35);x^=x>>>16;return x>>>0};
const pick=(seed,offset=0)=>CONCEPTS[(hash(seed+offset))%CONCEPTS.length];
const shuffle=(a,s)=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=hash(s+i)%(i+1);[x[i],x[j]]=[x[j],x[i]]}return x};
const text=(concept,code)=>L[concept]?.[code]||L[concept]?.en||concept;
export const MEGA_LESSON_COUNT=2_000_000_000;
export function levelForLesson(id){return LEVELS[Math.min(5,Math.floor((Math.max(1,Math.floor(id))-1)/(MEGA_LESSON_COUNT/6)))];}
export function getVirtualLesson(id,source='uk',target='en'){
 const n=Math.max(1,Math.min(MEGA_LESSON_COUNT,Math.floor(Number(id)||1))),level=levelForLesson(n),seed=hash(n),a=pick(seed),b=pick(seed,19),c=pick(seed,47);
 const A=text(a,target), AS=text(a,source), B=text(b,target), BS=text(b,source), C=text(c,target), CS=text(c,source);
 const q=[
  {skill:'vocabulary',q:`What does “${A}” mean?`,options:shuffle([AS,BS,CS,text(pick(seed,73),source)],seed),answer:AS,sourceText:A,targetText:AS,audioLanguage:language(target).locale},
  {skill:'retrieval',q:`Choose the ${language(target).name} word for “${BS}”.`,options:shuffle([A,B,C,text(pick(seed,91),target)],seed+11),answer:B,sourceText:B,targetText:BS,audioLanguage:language(target).locale},
  {skill:'translation',q:`Translate “${CS}” into ${language(target).name}.`,options:shuffle([C,A,B,text(pick(seed,121),target)],seed+23),answer:C,sourceText:C,targetText:CS,audioLanguage:language(target).locale},
  {skill:'context',q:`Choose the correct ${language(source).name} ↔ ${language(target).name} pair.`,options:shuffle([`${A} — ${AS}`,`${B} — ${CS}`,`${C} — ${BS}`,`${A} — ${BS}`],seed+37),answer:`${A} — ${AS}`,sourceText:A,targetText:AS,audioLanguage:language(target).locale}
 ];
 return {id:`mega-${n}-${source}-${target}`,number:n,level,unit:`${level} · Unit ${1+(n-1)%40}`,title:`${FOCUS[level]} · ${language(source).name} → ${language(target).name}`,icon:level==='A1'?'🌱':level==='A2'?'🌿':level==='B1'?'🚀':level==='B2'?'🧠':level==='C1'?'🎓':'🏆',xp:10+LEVELS.indexOf(level)*5,questions:q,source,target,generated:true};
}
export function getCurriculumStats(){return {lessonCount:MEGA_LESSON_COUNT,levels:LEVELS.map(level=>({level,lessonCount:Math.floor(MEGA_LESSON_COUNT/6)})),supportedLanguages:LANGUAGE_CATALOG.length,languagePairs:LANGUAGE_CATALOG.length*(LANGUAGE_CATALOG.length-1),generation:'deterministic universal curriculum'};}
