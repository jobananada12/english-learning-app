import { TextToSpeech } from '@capacitor-community/text-to-speech';

const ANSWERS = {
  'Як англійською «Привіт»?': 'Hello',
  'Як сказати «Дякую»?': 'Thanks',
  'Переклади: «Добрий ранок»': 'Good morning',
  'Що означає «Goodbye»?': 'До побачення',
  '«My name is Alex» означає:': 'Мене звати Алекс',
  'Переклади: «Як тебе звати?»': 'What is your name?',
  '«Nice to meet you» — це:': 'Радий познайомитися',
  'Вибери правильне: «I ___ Ukrainian.»': 'am',
  'Як буде 5?': 'Five',
  'Як буде 10?': 'Ten',
  'Переклади: «Мені 25 років»': 'I am 25 years old',
  '«Twenty» — це:': '20',
  'She ___ happy.': 'is',
  'They ___ students.': 'are',
  'I ___ ready.': 'am',
  'We ___ at home.': 'are',
  'I ___ coffee every morning.': 'drink',
  'He ___ English.': 'studies',
  'They ___ football.': 'play',
  'She ___ to work every day.': 'goes',
  'Переклади: «Скільки це коштує?»': 'How much is it?',
  '«I would like some water» — це:': 'Я хочу води',
  'Як ввічливо попросити щось?': 'Please',
  '«Can I help you?» означає:': 'Вам допомогти?',
  '«I’d like a coffee, please.»': 'Я хотів би каву, будь ласка',
  '«I\'d like a coffee, please.»': 'Я хотів би каву, будь ласка',
  '«The bill, please» — це:': 'Рахунок, будь ласка',
  '«Delicious» означає:': 'Смачний',
  '«Could I have some water?» — це:': 'Чи можна мені води?',
  'Yesterday I ___ to the store.': 'went',
  'She ___ a movie last night.': 'watched',
  'We ___ dinner at 8.': 'had',
  '«Yesterday» означає:': 'Вчора'
};

const normalize = value => String(value || '').replace(/\s+/g, ' ').trim();
const isAndroidCapacitor = () => Boolean(window.Capacitor?.getPlatform && window.Capacitor.getPlatform() === 'android');

async function nativeSpeak(text, lang) {
  try {
    await TextToSpeech.stop();
  } catch {}

  try {
    console.log('[Native TTS]', { text, lang });
    await TextToSpeech.speak({
      text,
      lang,
      rate: lang.startsWith('uk') ? 0.9 : 0.9,
      pitch: 1.0,
      volume: 1.0,
      queueStrategy: 0
    });
    console.log('[Native TTS] speak completed');
    return true;
  } catch (error) {
    console.error('[Native TTS] speak failed', error);
    return false;
  }
}

function getAnswer(button) {
  const question = button.closest('.question');
  const key = normalize(question?.querySelector('h1')?.textContent);
  return ANSWERS[key] || null;
}

function install() {
  document.addEventListener('click', async event => {
    const button = event.target.closest?.('button.speak');
    if (!button) return;

    const answer = getAnswer(button);
    if (!answer) return;

    const lang = /[\u0400-\u04FF]/.test(answer) ? 'uk-UA' : 'en-US';

    // On the APK use Android's native Google TTS. This bypasses Chrome speechSynthesis.
    if (isAndroidCapacitor()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      await nativeSpeak(answer, lang);
    }
  }, true);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', install);
} else {
  install();
}
