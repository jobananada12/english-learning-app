// Scalable curriculum engine: stores a finite pedagogical seed and generates lesson instances on demand.
// IMPORTANT: 2,000,000,000 is a lesson-space, not 2 billion JSON records. The app materializes only the lesson being studied.

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
  A1: [
    ['hello', 'привіт'], ['name', 'імʼя'], ['family', 'сімʼя'], ['home', 'дім'], ['water', 'вода'],
    ['food', 'їжа'], ['friend', 'друг'], ['work', 'робота'], ['school', 'школа'], ['city', 'місто'],
    ['today', 'сьогодні'], ['tomorrow', 'завтра'], ['good', 'добрий'], ['want', 'хотіти'], ['go', 'йти']
  ],
  A2: [
    ['yesterday', 'вчора'], ['usually', 'зазвичай'], ['already', 'вже'], ['journey', 'подорож'], ['health', 'здоровʼя'],
    ['project', 'проєкт'], ['experience', 'досвід'], ['decide', 'вирішувати'], ['improve', 'покращувати'], ['although', 'хоча']
  ],
  B1: [
    ['opportunity', 'можливість'], ['challenge', 'виклик'], ['achievement', 'досягнення'], ['relationship', 'стосунки'],
    ['responsibility', 'відповідальність'], ['environment', 'довкілля'], ['community', 'громада'], ['communicate', 'спілкуватися']
  ],
  B2: [
    ['evidence', 'доказ'], ['consequence', 'наслідок'], ['perspective', 'перспектива'], ['assumption', 'припущення'],
    ['strategy', 'стратегія'], ['revenue', 'дохід'], ['algorithm', 'алгоритм'], ['privacy', 'приватність'], ['justify', 'обґрунтовувати']
  ],
  C1: [
    ['substantial', 'значний'], ['ambiguous', 'неоднозначний'], ['coherent', 'звʼязний'], ['controversial', 'суперечливий'],
    ['contemporary', 'сучасний'], ['facilitate', 'сприяти'], ['inevitable', 'неминучий'], ['underlying', 'основний'], ['nuance', 'нюанс']
  ],
  C2: [
    ['meticulous', 'ретельний'], ['ephemeral', 'нетривалий'], ['pervasive', 'всеосяжний'], ['discerning', 'проникливий'],
    ['intrinsic', 'внутрішньо властивий'], ['conundrum', 'складна проблема'], ['proliferate', 'швидко поширюватися'],
    ['circumvent', 'обходити'], ['substantiate', 'підтверджувати доказами']
  ]
};

const PATTERNS = {
  A1: ['Vocabulary', 'Sentence building', 'Everyday dialogue', 'Listening', 'Basic grammar'],
  A2: ['Vocabulary in context', 'Past and future', 'Everyday conversation', 'Reading', 'Grammar practice'],
  B1: ['Communication', 'Narrative', 'Opinions', 'Phrasal verbs', 'Grammar in context'],
  B2: ['Argumentation', 'Collocations', 'Formal English', 'Idioms', 'Complex grammar'],
  C1: ['Academic English', 'Professional English', 'Nuance', 'Discourse', 'Advanced grammar'],
  C2: ['Precision', 'Register', 'Rhetoric', 'Idiomatic mastery', 'Expert comprehension']
};

function hash(n) {
  let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); x ^= x >>> 16;
  return x >>> 0;
}

export function levelForLesson(id) {
  const block = Math.floor((id - 1) / (MEGA_LESSON_COUNT / 6));
  return LEVELS[Math.min(5, block)];
}

export function getVirtualLesson(id, source = 'uk', target = 'en') {
  const safeId = Math.max(1, Math.min(MEGA_LESSON_COUNT, Math.floor(id)));
  const level = levelForLesson(safeId);
  const seed = hash(safeId);
  const words = SEEDS[level];
  const pattern = PATTERNS[level][seed % PATTERNS[level].length];
  const a = words[seed % words.length];
  const b = words[(seed >>> 8) % words.length];
  const c = words[(seed >>> 16) % words.length];
  const variant = seed % 4;
  let questions;
  if (variant === 0) {
    questions = [{ type: 'choice', q: `What does “${a[0]}” mean?`, options: shuffle([a[1], b[1], c[1], 'інше значення'], seed), answer: a[1], sourceText: a[0], targetText: a[1], audioLanguage: target }];
  } else if (variant === 1) {
    questions = [{ type: 'choice', q: `Choose the English word for “${a[1]}”.`, options: shuffle([a[0], b[0], c[0], 'unknown'], seed), answer: a[0], sourceText: a[0], targetText: a[1], audioLanguage: target }];
  } else if (variant === 2) {
    questions = [{ type: 'choice', q: `Which word completes the ${pattern} task?`, options: shuffle([a[0], b[0], c[0], 'none'], seed), answer: a[0], sourceText: `${a[0]} ${b[0]}`, audioLanguage: target }];
  } else {
    questions = [{ type: 'choice', q: `Which pair is correct?`, options: shuffle([`${a[0]} — ${a[1]}`, `${b[0]} — ${a[1]}`, `${c[0]} — ${b[1]}`, `${a[0]} — ${c[1]}`], seed), answer: `${a[0]} — ${a[1]}`, sourceText: a[0], audioLanguage: target }];
  }
  return { id: `mega-${safeId}`, number: safeId, level, unit: `${level} · Unit ${1 + ((safeId - 1) % 40)}`, title: `${pattern} · Lesson ${safeId.toLocaleString()}`, icon: level === 'A1' ? '🌱' : level === 'A2' ? '🌿' : level === 'B1' ? '🚀' : level === 'B2' ? '🧠' : level === 'C1' ? '🎓' : '🏆', xp: 10 + (LEVELS.indexOf(level) * 5), questions, source, target, generated: true };
}

function shuffle(items, seed) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) { const j = hash(seed + i) % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export function getCurriculumStats() {
  return { lessonCount: MEGA_LESSON_COUNT, levels: LEVELS.map(level => ({ level, ...LEVEL_META[level], lessonCount: Math.floor(MEGA_LESSON_COUNT / 6) })), generation: 'deterministic-on-demand', storage: 'local-only' };
}
