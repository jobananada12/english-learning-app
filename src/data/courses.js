import { buildCourse } from '../engine/course-engine';

// Full English curriculum: 6 CEFR levels × 10 units × 5 lessons = 300 lessons.
// Content is generated from curated topic banks so the app stays data-driven.
const LEVELS = [
  { code: 'A1', title: 'Beginner', topics: [
    ['Introductions', [['hello','привіт'],['goodbye','до побачення'],['name','імʼя'],['friend','друг'],['family','сімʼя'],['home','дім'],['country','країна'],['city','місто'],['today','сьогодні'],['tomorrow','завтра']]],
    ['People & Family', [['mother','мати'],['father','батько'],['brother','брат'],['sister','сестра'],['child','дитина'],['man','чоловік'],['woman','жінка'],['boy','хлопчик'],['girl','дівчинка'],['person','людина']]],
    ['Numbers & Time', [['one','один'],['five','пʼять'],['ten','десять'],['twenty','двадцять'],['morning','ранок'],['afternoon','день'],['evening','вечір'],['night','ніч'],['hour','година'],['minute','хвилина']]],
    ['Food & Drink', [['water','вода'],['bread','хліб'],['milk','молоко'],['coffee','кава'],['tea','чай'],['apple','яблуко'],['rice','рис'],['chicken','курка'],['breakfast','сніданок'],['dinner','вечеря']]],
    ['Home', [['house','будинок'],['room','кімната'],['kitchen','кухня'],['bathroom','ванна кімната'],['door','двері'],['window','вікно'],['table','стіл'],['chair','стілець'],['bed','ліжко'],['key','ключ']]],
    ['Daily Life', [['work','робота'],['study','навчатися'],['read','читати'],['write','писати'],['walk','ходити'],['sleep','спати'],['eat','їсти'],['drink','пити'],['live','жити'],['like','подобатися']]],
    ['Shopping', [['shop','магазин'],['price','ціна'],['money','гроші'],['cheap','дешевий'],['expensive','дорогий'],['buy','купувати'],['sell','продавати'],['cash','готівка'],['size','розмір'],['help','допомога']]],
    ['City & Travel', [['street','вулиця'],['station','станція'],['bus','автобус'],['train','поїзд'],['hotel','готель'],['airport','аеропорт'],['ticket','квиток'],['map','карта'],['left','ліворуч'],['right','праворуч']]],
    ['Weather', [['sun','сонце'],['rain','дощ'],['snow','сніг'],['wind','вітер'],['hot','спекотно'],['cold','холодно'],['warm','тепло'],['cloud','хмара'],['summer','літо'],['winter','зима']]],
    ['Basic Grammar', [['am','є / являюся'],['is','є / являється'],['are','є / являються'],['have','мати'],['has','має'],['can','могти'],['do','робити'],['go','йти'],['come','приходити'],['want','хотіти']]],
  ]},
  { code: 'A2', title: 'Elementary', topics: [
    ['Past & Memories', [['yesterday','вчора'],['last week','минулого тижня'],['visited','відвідав'],['watched','дивився'],['worked','працював'],['started','почав'],['finished','закінчив'],['remember','памʼятати'],['before','до / раніше'],['after','після']]],
    ['Plans & Future', [['tomorrow','завтра'],['next week','наступного тижня'],['plan','план'],['future','майбутнє'],['will','буду / буде'],['going to','збиратися'],['soon','скоро'],['later','пізніше'],['decide','вирішувати'],['hope','сподіватися']]],
    ['Health', [['health','здоровʼя'],['doctor','лікар'],['medicine','ліки'],['pain','біль'],['headache','головний біль'],['tired','втомлений'],['sick','хворий'],['healthy','здоровий'],['exercise','вправлятися'],['rest','відпочивати']]],
    ['Work', [['job','робота'],['office','офіс'],['manager','керівник'],['meeting','зустріч'],['email','електронний лист'],['project','проєкт'],['customer','клієнт'],['salary','зарплата'],['busy','зайнятий'],['free','вільний']]],
    ['Education', [['school','школа'],['lesson','урок'],['course','курс'],['teacher','вчитель'],['student','студент'],['question','питання'],['answer','відповідь'],['test','тест'],['learn','вчитися'],['practice','практикувати']]],
    ['Nature', [['river','річка'],['mountain','гора'],['forest','ліс'],['sea','море'],['lake','озеро'],['tree','дерево'],['flower','квітка'],['animal','тварина'],['bird','птах'],['world','світ']]],
    ['Technology', [['phone','телефон'],['computer','компʼютер'],['screen','екран'],['internet','інтернет'],['website','вебсайт'],['message','повідомлення'],['photo','фото'],['video','відео'],['download','завантажувати'],['password','пароль']]],
    ['Food & Cooking', [['recipe','рецепт'],['cook','готувати'],['boil','варити'],['fry','смажити'],['fresh','свіжий'],['sweet','солодкий'],['salty','солоний'],['hungry','голодний'],['menu','меню'],['restaurant','ресторан']]],
    ['Transport', [['drive','керувати'],['car','автомобіль'],['road','дорога'],['traffic','рух'],['journey','подорож'],['arrive','прибути'],['leave','виїхати'],['station','станція'],['bicycle','велосипед'],['plane','літак']]],
    ['Everyday Grammar', [['usually','зазвичай'],['sometimes','іноді'],['never','ніколи'],['already','вже'],['still','досі'],['yet','ще'],['enough','достатньо'],['too','занадто'],['because','тому що'],['although','хоча']]],
  ]},
  { code: 'B1', title: 'Intermediate', topics: [
    ['Experiences', [['experience','досвід'],['opportunity','можливість'],['challenge','виклик'],['success','успіх'],['failure','невдача'],['improve','покращувати'],['achieve','досягати'],['discover','відкривати'],['change','змінювати'],['remember','памʼятати']]],
    ['Work & Career', [['career','карʼєра'],['skill','навичка'],['position','посада'],['interview','співбесіда'],['colleague','колега'],['deadline','крайній термін'],['salary','зарплата'],['experience','досвід'],['responsibility','відповідальність'],['professional','професійний']]],
    ['Relationships', [['relationship','стосунки'],['trust','довіра'],['support','підтримка'],['respect','повага'],['argument','суперечка'],['advice','порада'],['agree','погоджуватися'],['disagree','не погоджуватися'],['honest','чесний'],['reliable','надійний']]],
    ['Travel', [['destination','місце призначення'],['abroad','за кордоном'],['passport','паспорт'],['luggage','багаж'],['reservation','бронювання'],['flight','політ'],['delay','затримка'],['tourist','турист'],['culture','культура'],['local','місцевий']]],
    ['Media', [['news','новини'],['article','стаття'],['report','звіт'],['source','джерело'],['headline','заголовок'],['interview','інтервʼю'],['opinion','думка'],['fact','факт'],['story','історія'],['publish','публікувати']]],
    ['Environment', [['environment','довкілля'],['pollution','забруднення'],['climate','клімат'],['energy','енергія'],['recycle','переробляти'],['waste','відходи'],['protect','захищати'],['reduce','зменшувати'],['resource','ресурс'],['nature','природа']]],
    ['Society', [['community','громада'],['government','уряд'],['law','закон'],['public','громадський'],['education','освіта'],['economy','економіка'],['service','послуга'],['citizen','громадянин'],['problem','проблема'],['solution','рішення']]],
    ['Communication', [['conversation','розмова'],['explain','пояснювати'],['suggest','пропонувати'],['mention','згадувати'],['mean','означати'],['express','виражати'],['discuss','обговорювати'],['describe','описувати'],['compare','порівнювати'],['respond','відповідати']]],
    ['Phrasal Verbs', [['find out','дізнатися'],['give up','здатися'],['look after','піклуватися'],['look for','шукати'],['pick up','підняти / забрати'],['put off','відкласти'],['turn on','увімкнути'],['turn off','вимкнути'],['get up','вставати'],['carry on','продовжувати']]],
    ['B1 Grammar', [['however','однак'],['therefore','тому / отже'],['unless','якщо не'],['while','поки / тоді як'],['despite','незважаючи на'],['instead','замість цього'],['probably','ймовірно'],['especially','особливо'],['recently','нещодавно'],['already','вже']]],
  ]},
  { code: 'B2', title: 'Upper-Intermediate', topics: [
    ['Abstract Ideas', [['approach','підхід'],['concept','поняття'],['issue','питання / проблема'],['impact','вплив'],['factor','чинник'],['evidence','доказ'],['purpose','мета'],['benefit','перевага'],['drawback','недолік'],['consequence','наслідок']]],
    ['Business', [['strategy','стратегія'],['market','ринок'],['customer','клієнт'],['revenue','дохід'],['profit','прибуток'],['investment','інвестиція'],['competition','конкуренція'],['brand','бренд'],['growth','зростання'],['launch','запуск']]],
    ['Science', [['research','дослідження'],['theory','теорія'],['method','метод'],['data','дані'],['result','результат'],['experiment','експеримент'],['evidence','доказ'],['process','процес'],['measure','вимірювати'],['analysis','аналіз']]],
    ['Technology & AI', [['algorithm','алгоритм'],['model','модель'],['dataset','набір даних'],['privacy','приватність'],['security','безпека'],['automation','автоматизація'],['device','пристрій'],['network','мережа'],['software','програмне забезпечення'],['update','оновлення']]],
    ['Culture', [['tradition','традиція'],['identity','ідентичність'],['heritage','спадщина'],['custom','звичай'],['diverse','різноманітний'],['influence','впливати'],['artistic','мистецький'],['audience','аудиторія'],['performance','виступ'],['festival','фестиваль']]],
    ['Debate', [['claim','твердження'],['argument','аргумент'],['counterargument','контраргумент'],['perspective','перспектива'],['assumption','припущення'],['justify','обґрунтовувати'],['criticize','критикувати'],['defend','захищати'],['convince','переконувати'],['reasonable','розумний / обґрунтований']]],
    ['Formal English', [['regarding','щодо'],['concerning','стосовно'],['furthermore','крім того'],['nevertheless','тим не менш'],['consequently','внаслідок цього'],['whereas','тоді як'],['require','вимагати'],['obtain','отримувати'],['ensure','забезпечувати'],['consider','розглядати']]],
    ['Collocations', [['make a decision','приймати рішення'],['take responsibility','брати відповідальність'],['reach an agreement','досягати угоди'],['raise awareness','підвищувати обізнаність'],['solve a problem','вирішувати проблему'],['gain experience','здобувати досвід'],['meet a deadline','вкластися в термін'],['pay attention','звертати увагу'],['keep in touch','підтримувати звʼязок'],['take advantage','користуватися перевагою']]],
    ['Idioms', [['break the ice','розрядити атмосферу'],['piece of cake','дуже легко'],['under the weather','почуватися недобре'],['once in a blue moon','дуже рідко'],['hit the nail on the head','влучити в точку'],['cost an arm and a leg','коштувати дуже дорого'],['on the same page','мати однакове розуміння'],['in the long run','у довгостроковій перспективі'],['by the way','до речі'],['so far so good','поки все добре']]],
    ['B2 Grammar', [['although','хоча'],['whereas','тоді як'],['provided that','за умови що'],['as long as','доти, доки / за умови'],['even though','навіть хоча'],['in case','на випадок якщо'],['would rather','волів би'],['had better','краще було б'],['used to','раніше зазвичай'],['be supposed to','мати щось зробити']]],
  ]},
  { code: 'C1', title: 'Advanced', topics: [
    ['Academic English', [['hypothesis','гіпотеза'],['framework','структура / система'],['perspective','перспектива'],['methodology','методологія'],['significant','значущий'],['relevant','релевантний'],['indicate','вказувати'],['demonstrate','демонструвати'],['evaluate','оцінювати'],['interpret','тлумачити']]],
    ['Professional Communication', [['negotiate','вести переговори'],['facilitate','сприяти'],['clarify','уточнювати'],['coordinate','координувати'],['implement','впроваджувати'],['prioritize','визначати пріоритети'],['delegate','делегувати'],['collaborate','співпрацювати'],['propose','пропонувати'],['resolve','вирішувати']]],
    ['Politics & Society', [['policy','політика / стратегія'],['legislation','законодавство'],['reform','реформа'],['inequality','нерівність'],['democracy','демократія'],['institution','установа'],['governance','управління'],['accountability','підзвітність'],['participation','участь'],['controversial','суперечливий']]],
    ['Economics', [['inflation','інфляція'],['recession','рецесія'],['supply','пропозиція'],['demand','попит'],['consumption','споживання'],['productivity','продуктивність'],['employment','зайнятість'],['inequality','нерівність'],['monetary','грошовий'],['financial','фінансовий']]],
    ['Psychology', [['behavior','поведінка'],['perception','сприйняття'],['motivation','мотивація'],['cognition','пізнання'],['bias','упередження'],['emotion','емоція'],['awareness','усвідомлення'],['resilience','стійкість'],['habit','звичка'],['decision-making','прийняття рішень']]],
    ['Advanced Vocabulary', [['subtle','тонкий / ледь помітний'],['compelling','переконливий'],['ambiguous','неоднозначний'],['coherent','звʼязний'],['precise','точний'],['plausible','правдоподібний'],['inevitable','неминучий'],['substantial','значний'],['controversial','суперечливий'],['intricate','складний / заплутаний']]],
    ['Nuance', [['apparently','очевидно / судячи з усього'],['arguably','можна стверджувати'],['presumably','ймовірно'],['roughly','приблизно'],['virtually','практично'],['notably','помітно / зокрема'],['considerably','значно'],['merely','лише'],['largely','здебільшого'],['relatively','відносно']]],
    ['Writing', [['thesis','теза'],['paragraph','абзац'],['cohesion','звʼязність'],['transition','перехід'],['argumentation','аргументація'],['conclusion','висновок'],['summarize','підсумовувати'],['paraphrase','перефразовувати'],['contrast','протиставляти'],['elaborate','детально пояснювати']]],
    ['C1 Idioms', [['read between the lines','читати між рядків'],['go the extra mile','докласти додаткових зусиль'],['rule of thumb','емпіричне правило'],['on the whole','загалом'],['at the expense of','за рахунок'],['in light of','з огляду на'],['with regard to','щодо'],['in terms of','з точки зору'],['to some extent','певною мірою'],['for the sake of','заради']]],
    ['C1 Grammar', [['inversion','інверсія'],['subjunctive','умовний / сослагальний спосіб'],['participle clause','дієприкметниковий зворот'],['cleft sentence','розщеплене речення'],['mixed conditional','змішаний умовний'],['reported speech','непряма мова'],['passive reporting','пасивна конструкція повідомлення'],['modal perfect','модальне перфектне'],['ellipsis','еліпсис'],['nominalisation','номіналізація']]],
  ]},
  { code: 'C2', title: 'Mastery', topics: [
    ['Precision', [['meticulous','ретельний'],['scrutinize','ретельно перевіряти'],['distinction','розмежування'],['connotation','конотація'],['implication','підтекст / наслідок'],['criterion','критерій'],['precedent','прецедент'],['validity','обґрунтованість'],['consistency','послідовність'],['rigorous','суворий / ретельний']]],
    ['Rhetoric', [['rhetoric','риторика'],['premise','передумова'],['fallacy','логічна помилка'],['counterclaim','контртвердження'],['rebuttal','спростування'],['emphasis','наголос'],['analogy','аналогія'],['hypothetical','гіпотетичний'],['persuasive','переконливий'],['rhetorical','риторичний']]],
    ['Literature', [['narrative','оповідь'],['protagonist','головний герой'],['metaphor','метафора'],['symbolism','символізм'],['irony','іронія'],['subtext','підтекст'],['genre','жанр'],['characterization','характеристика персонажа'],['imagery','образність'],['ambiguity','неоднозначність']]],
    ['Law & Ethics', [['jurisdiction','юрисдикція'],['liability','відповідальність'],['consent','згода'],['compliance','дотримання вимог'],['precedent','прецедент'],['legitimate','законний'],['ethical','етичний'],['conflict of interest','конфлікт інтересів'],['due process','належна правова процедура'],['disclosure','розкриття інформації']]],
    ['Science & Research', [['correlation','кореляція'],['causation','причинність'],['variable','змінна'],['replicate','відтворювати'],['bias','упередженість'],['sample','вибірка'],['statistical','статистичний'],['empirical','емпіричний'],['theoretical','теоретичний'],['reproducible','відтворюваний']]],
    ['Global Issues', [['geopolitical','геополітичний'],['humanitarian','гуманітарний'],['sustainability','сталість'],['displacement','переміщення'],['migration','міграція'],['infrastructure','інфраструктура'],['cooperation','співпраця'],['sovereignty','суверенітет'],['escalation','ескалація'],['reconstruction','відбудова']]],
    ['Master Collocations', [['pose a threat','становити загрозу'],['draw a distinction','проводити розмежування'],['reach a consensus','досягати консенсусу'],['bear in mind','мати на увазі'],['come to terms with','змиритися / прийняти'],['shed light on','пролити світло на'],['raise concerns','викликати занепокоєння'],['address an issue','розглядати проблему'],['undergo scrutiny','підлягати перевірці'],['yield results','давати результати']]],
    ['Master Idioms', [['the tip of the iceberg','верхівка айсберга'],['a double-edged sword','палиця з двома кінцями'],['devil is in the details','диявол у деталях'],['food for thought','їжа для роздумів'],['a blessing in disguise','добро під виглядом проблеми'],['jump on the bandwagon','приєднатися до популярної справи'],['miss the point','не зрозуміти суті'],['go without saying','само собою зрозуміло'],['by and large','загалом'],['in a nutshell','коротко кажучи']]],
    ['Register & Style', [['formal','формальний'],['informal','неформальний'],['colloquial','розмовний'],['academic','академічний'],['technical','технічний'],['literary','літературний'],['derogatory','зневажливий'],['euphemism','евфемізм'],['register','мовний регістр'],['tone','тон']]],
    ['C2 Grammar & Mastery', [['fronting','винесення на початок'],['inversion','інверсія'],['ellipsis','еліпсис'],['hedging','мовне помʼякшення'],['clefting','розщеплення речення'],['modality','модальність'],['discourse marker','дискурсивний маркер'],['lexical density','лексична насиченість'],['collocation','стійке сполучення'],['idiomaticity','ідіоматичність']]],
  ]},
];

function shuffle(items, seed) {
  const out = [...items];
  let x = seed + 17;
  for (let i = out.length - 1; i > 0; i--) {
    x = (x * 9301 + 49297) % 233280;
    const j = Math.floor((x / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function makeQuestions(words, lessonNumber, level) {
  const picks = shuffle(words, lessonNumber).slice(0, 4);
  return picks.map(([en, uk], index) => {
    const distractors = shuffle(words.filter(([word]) => word !== en), lessonNumber + index * 11).slice(0, 3).map(([, tr]) => tr);
    const options = shuffle([uk, ...distractors], lessonNumber + index);
    return {
      q: level === 'A1' || level === 'A2'
        ? `Що означає “${en}”?`
        : `Choose the best Ukrainian meaning of “${en}”.`,
      options,
      answer: uk,
      audioLanguage: 'en',
      sourceText: en,
      targetText: uk,
    };
  });
}

function makeLessons(level, topics) {
  const lessons = [];
  topics.forEach(([unit, words], unitIndex) => {
    for (let lessonIndex = 0; lessonIndex < 5; lessonIndex++) {
      const number = unitIndex * 5 + lessonIndex + 1;
      const kind = ['Vocabulary', 'Translation', 'Grammar in context', 'Listening', 'Review'][lessonIndex];
      lessons.push({
        id: `${level.code.toLowerCase()}-${String(unitIndex + 1).padStart(2, '0')}-${lessonIndex + 1}`,
        unit: `${level.code} · ${unit}`,
        title: `${kind} ${lessonIndex + 1}`,
        icon: ['📚', '🔄', '🧩', '🎧', '⭐'][lessonIndex],
        xp: 20 + unitIndex * 2 + lessonIndex * 3,
        questions: makeQuestions(words, number, level.code),
      });
    }
  });
  return lessons;
}

const ukEnLessons = LEVELS.flatMap(level => makeLessons(level, level.topics));

const ukEn = buildCourse({
  id: 'uk-en',
  source: 'uk',
  target: 'en',
  title: 'Англійська — повний курс',
  level: 'A1 → C2',
  lessons: ukEnLessons,
});

// Keep the existing additional language entry points. Their full content can use
// the same engine; the complete A1-C2 curriculum above is the primary English course.
function makeStarterCourse(source, title) {
  const base = LEVELS[0];
  const lessons = makeLessons(base, base.topics.slice(0, 2));
  return buildCourse({ id: `${source}-en`, source, target: 'en', title, level: 'A1 starter', lessons });
}

const plEn = makeStarterCourse('pl', 'Angielski');
const deEn = makeStarterCourse('de', 'Englisch');
const frEn = makeStarterCourse('fr', 'Anglais');
const esEn = makeStarterCourse('es', 'Inglés');

export const COURSES = {
  [ukEn.id]: ukEn,
  [plEn.id]: plEn,
  [deEn.id]: deEn,
  [frEn.id]: frEn,
  [esEn.id]: esEn,
};

export const DEFAULT_SOURCE = 'uk';
export const DEFAULT_TARGET = 'en';
