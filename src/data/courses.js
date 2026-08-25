import { buildCourse } from '../engine/course-engine';

const ukEn = buildCourse({
  id: 'uk-en', source: 'uk', target: 'en', title: 'Англійська', level: 'A1 → B2',
  lessons: [
    { id: 1, unit: 'Основи', title: 'Привітання', icon: '👋', xp: 20, questions: [
      { q: 'Як англійською «Привіт»?', options: ['Hello', 'Goodbye', 'Thanks', 'Please'], answer: 'Hello', audioLanguage: 'en' },
      { q: 'Як сказати «Дякую»?', options: ['Sorry', 'Thanks', 'Hello', 'Morning'], answer: 'Thanks', audioLanguage: 'en' },
      { q: 'Переклади: «Добрий ранок»', options: ['Good night', 'Good morning', 'Good evening', 'See you'], answer: 'Good morning', audioLanguage: 'en' },
      { q: 'Що означає «Goodbye»?', options: ['Будь ласка', 'Дякую', 'До побачення', 'Вибачте'], answer: 'До побачення', audioLanguage: 'uk' },
    ]},
    { id: 2, unit: 'Основи', title: 'Знайомство', icon: '🧑', xp: 25, questions: [
      { q: '«My name is Alex» означає:', options: ['Мене звати Алекс', 'Я люблю Алекса', 'Я з Алексом', 'Це мій друг'], answer: 'Мене звати Алекс', audioLanguage: 'uk' },
      { q: 'Переклади: «Як тебе звати?»', options: ['How are you?', 'What is your name?', 'Where are you?', 'Who are you?'], answer: 'What is your name?', audioLanguage: 'en' },
      { q: '«Nice to meet you» — це:', options: ['Радий познайомитися', 'До завтра', 'Мені шкода', 'Будь ласка'], answer: 'Радий познайомитися', audioLanguage: 'uk' },
      { q: 'Вибери правильне: «I ___ Ukrainian.»', options: ['am', 'is', 'are', 'be'], answer: 'am', audioLanguage: 'en' },
    ]},
    { id: 3, unit: 'Основи', title: 'Числа', icon: '🔢', xp: 25, questions: [
      { q: 'Як буде 5?', options: ['Four', 'Five', 'Fifteen', 'Fifty'], answer: 'Five', audioLanguage: 'en' },
      { q: 'Як буде 10?', options: ['Two', 'Ten', 'Twenty', 'Twelve'], answer: 'Ten', audioLanguage: 'en' },
      { q: 'Переклади: «Мені 25 років»', options: ['I have 25', 'I am 25 years old', 'I am 25 years', 'I do 25'], answer: 'I am 25 years old', audioLanguage: 'en' },
      { q: '«Twenty» — це:', options: ['12', '20', '30', '2'], answer: '20', audioLanguage: 'en' },
    ]},
    { id: 4, unit: 'Речення', title: 'To be', icon: '🧩', xp: 30, questions: [
      { q: 'She ___ happy.', options: ['am', 'is', 'are', 'be'], answer: 'is', audioLanguage: 'en' },
      { q: 'They ___ students.', options: ['am', 'is', 'are', 'be'], answer: 'are', audioLanguage: 'en' },
      { q: 'I ___ ready.', options: ['am', 'is', 'are', 'be'], answer: 'am', audioLanguage: 'en' },
      { q: 'We ___ at home.', options: ['am', 'is', 'are', 'be'], answer: 'are', audioLanguage: 'en' },
    ]},
    { id: 5, unit: 'Речення', title: 'Present Simple', icon: '⚡', xp: 35, questions: [
      { q: 'I ___ coffee every morning.', options: ['drink', 'drinks', 'drinking', 'drank'], answer: 'drink', audioLanguage: 'en' },
      { q: 'He ___ English.', options: ['study', 'studies', 'studying', 'studied'], answer: 'studies', audioLanguage: 'en' },
      { q: 'They ___ football.', options: ['play', 'plays', 'playing', 'played'], answer: 'play', audioLanguage: 'en' },
      { q: 'She ___ to work every day.', options: ['go', 'goes', 'going', 'gone'], answer: 'goes', audioLanguage: 'en' },
    ]},
    { id: 6, unit: 'Розмова', title: 'У магазині', icon: '🛒', xp: 35, questions: [
      { q: 'Переклади: «Скільки це коштує?»', options: ['How much is it?', 'How many is it?', 'What cost it?', 'How is cost?'], answer: 'How much is it?', audioLanguage: 'en' },
      { q: '«I would like some water» — це:', options: ['Я хочу води', 'Я випив воду', 'Де вода?', 'Вода закінчилась'], answer: 'Я хочу води', audioLanguage: 'uk' },
      { q: 'Як ввічливо попросити щось?', options: ['Give me!', 'Please', 'Go away', 'No'], answer: 'Please', audioLanguage: 'en' },
      { q: '«Can I help you?» означає:', options: ['Можеш мені допомогти?', 'Я можу купити?', 'Вам допомогти?', 'Де ти?'], answer: 'Вам допомогти?', audioLanguage: 'uk' },
    ]},
    { id: 7, unit: 'Розмова', title: 'У кафе', icon: '☕', xp: 40, questions: [
      { q: '«I\'d like a coffee, please.»', options: ['Я хотів би каву, будь ласка', 'Я не люблю каву', 'Де моя кава?', 'Кава готова'], answer: 'Я хотів би каву, будь ласка', audioLanguage: 'uk' },
      { q: '«The bill, please» — це:', options: ['Меню, будь ласка', 'Рахунок, будь ласка', 'Воду, будь ласка', 'Допомогу, будь ласка'], answer: 'Рахунок, будь ласка', audioLanguage: 'uk' },
      { q: '«Delicious» означає:', options: ['Дорогий', 'Смачний', 'Гарячий', 'Холодний'], answer: 'Смачний', audioLanguage: 'uk' },
      { q: '«Could I have some water?» — це:', options: ['Чи можна мені води?', 'Я не хочу води', 'Де вода?', 'Вода холодна'], answer: 'Чи можна мені води?', audioLanguage: 'uk' },
    ]},
    { id: 8, unit: 'Час', title: 'Past Simple', icon: '⏰', xp: 45, questions: [
      { q: 'Yesterday I ___ to the store.', options: ['go', 'went', 'goes', 'going'], answer: 'went', audioLanguage: 'en' },
      { q: 'She ___ a movie last night.', options: ['watch', 'watched', 'watches', 'watching'], answer: 'watched', audioLanguage: 'en' },
      { q: 'We ___ dinner at 8.', options: ['have', 'had', 'has', 'having'], answer: 'had', audioLanguage: 'en' },
      { q: '«Yesterday» означає:', options: ['Завтра', 'Сьогодні', 'Вчора', 'Зараз'], answer: 'Вчора', audioLanguage: 'uk' },
    ]},
  ]
});

const plEn = buildCourse({ id: 'pl-en', source: 'pl', target: 'en', title: 'Angielski', level: 'A1', lessons: [
  { id: 1, unit: 'Podstawy', title: 'Powitania', icon: '👋', xp: 20, questions: [
    { q: 'Jak powiedzieć „Cześć”?', options: ['Hello', 'Goodbye', 'Thanks', 'Please'], answer: 'Hello', audioLanguage: 'en' },
    { q: '„Thank you” oznacza:', options: ['Dziękuję', 'Cześć', 'Przepraszam', 'Do widzenia'], answer: 'Dziękuję', audioLanguage: 'pl' },
    { q: 'Przetłumacz: „Dzień dobry”', options: ['Good night', 'Good morning', 'See you', 'Goodbye'], answer: 'Good morning', audioLanguage: 'en' },
  ]},
  { id: 2, unit: 'Podstawy', title: 'Przedstawianie się', icon: '🧑', xp: 25, questions: [
    { q: '„My name is Alex” oznacza:', options: ['Mam na imię Alex', 'Lubię Alexa', 'Jestem z Alexem', 'To mój przyjaciel'], answer: 'Mam na imię Alex', audioLanguage: 'pl' },
    { q: 'Przetłumacz: „Jak masz na imię?”', options: ['How are you?', 'What is your name?', 'Where are you?', 'Who are you?'], answer: 'What is your name?', audioLanguage: 'en' },
  ]},
]});

const deEn = buildCourse({ id: 'de-en', source: 'de', target: 'en', title: 'Englisch', level: 'A1', lessons: [
  { id: 1, unit: 'Grundlagen', title: 'Begrüßungen', icon: '👋', xp: 20, questions: [
    { q: 'Wie sagt man „Hallo“ auf Englisch?', options: ['Hello', 'Goodbye', 'Thanks', 'Please'], answer: 'Hello', audioLanguage: 'en' },
    { q: '„Thank you“ bedeutet:', options: ['Danke', 'Hallo', 'Tschüss', 'Bitte'], answer: 'Danke', audioLanguage: 'de' },
    { q: 'Übersetze: „Guten Morgen“', options: ['Good night', 'Good morning', 'Good evening', 'See you'], answer: 'Good morning', audioLanguage: 'en' },
  ]},
  { id: 2, unit: 'Grundlagen', title: 'Vorstellung', icon: '🧑', xp: 25, questions: [
    { q: '„My name is Alex“ bedeutet:', options: ['Ich heiße Alex', 'Ich mag Alex', 'Ich bin mit Alex', 'Das ist mein Freund'], answer: 'Ich heiße Alex', audioLanguage: 'de' },
    { q: 'Übersetze: „Wie heißt du?“', options: ['How are you?', 'What is your name?', 'Where are you?', 'Who are you?'], answer: 'What is your name?', audioLanguage: 'en' },
  ]},
]});

export const COURSES = {
  [ukEn.id]: ukEn,
  [plEn.id]: plEn,
  [deEn.id]: deEn,
};

export const DEFAULT_SOURCE = 'uk';
export const DEFAULT_TARGET = 'en';
