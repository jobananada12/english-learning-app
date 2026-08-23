(() => {
  // Ukrainian answers used by the course. This fallback is independent of
  // Windows/Chrome installed voices, so uk-UA audio works even when the
  // browser exposes no Ukrainian SpeechSynthesisVoice.
  const answers = {
    'Що означає «Goodbye»?': 'До побачення',
    '«My name is Alex» означає:': 'Мене звати Алекс',
    '«Nice to meet you» — це:': 'Радий познайомитися',
    '«I would like some water» — це:': 'Я хочу води',
    '«Can I help you?» означає:': 'Вам допомогти?',
    '«I’d like a coffee, please.»': 'Я хотів би каву, будь ласка',
    '«I\'d like a coffee, please.»': 'Я хотів би каву, будь ласка',
    '«The bill, please» — це:': 'Рахунок, будь ласка',
    '«Delicious» означає:': 'Смачний',
    '«Could I have some water?» — це:': 'Чи можна мені води?',
    '«Yesterday» означає:': 'Вчора',
    '«Twenty» — це:': '20'
  };

  const normalize = s => String(s || '')
    .replace(/\s+/g, ' ')
    .replace(/[’]/g, "'")
    .trim();

  const hasCyrillic = s => /[\u0400-\u04FF]/.test(s);

  function getUkrainianAnswer(button) {
    const question = button.closest('.question');
    if (!question) return null;

    const h1 = question.querySelector('h1');
    const key = normalize(h1?.textContent);
    const normalizedAnswers = Object.entries(answers);
    const found = normalizedAnswers.find(([k]) => normalize(k) === key);
    if (found) return found[1];

    // If the user has already answered, React marks the correct option.
    const correct = question.querySelector('.answers button.correct');
    const text = normalize(correct?.textContent);
    return hasCyrillic(text) ? text : null;
  }

  function playUkrainian(text) {
    const url = 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=uk&q=' + encodeURIComponent(text);

    if (window.__ukTtsAudio) {
      window.__ukTtsAudio.pause();
      window.__ukTtsAudio.currentTime = 0;
    }

    const audio = new Audio(url);
    audio.preload = 'auto';
    audio.volume = 1;
    window.__ukTtsAudio = audio;
    audio.play().catch(() => {});
  }

  // Capture before React's onClick. English is left completely untouched.
  document.addEventListener('click', event => {
    const button = event.target.closest?.('button.speak');
    if (!button) return;

    const text = getUkrainianAnswer(button);
    if (!text || !hasCyrillic(text)) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    playUkrainian(text);
  }, true);
})();
