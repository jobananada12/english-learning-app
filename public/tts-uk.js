(() => {
  const answers = {
    '«My name is Alex» означає:': 'Мене звати Алекс',
    '«Goodbye»?': 'До побачення',
    '«Nice to meet you» — це:': 'Радий познайомитися',
    '«I would like some water» — це:': 'Я хочу води',
    'Як ввічливо попросити щось?': 'Please',
    '«Can I help you?» означає:': 'Вам допомогти?',
    '«I’d like a coffee, please.»': 'Я хотів би каву, будь ласка',
    '«The bill, please» — це:': 'Рахунок, будь ласка',
    '«Delicious» означає:': 'Смачний',
    '«Could I have some water?» — це:': 'Чи можна мені води?',
    '«Yesterday» означає:': 'Вчора',
    '«Twenty» — це:': '20',
    'Як буде 5?': 'Five',
    'Як буде 10?': 'Ten'
  };

  const normalize = s => String(s || '').replace(/\s+/g, ' ').trim();
  const hasCyrillic = s => /[\u0400-\u04FF]/.test(s);

  function getUkrainianAnswer(button) {
    const question = button.closest('.question');
    if (!question) return null;
    const h1 = question.querySelector('h1');
    const key = normalize(h1?.textContent);
    if (answers[key]) return answers[key];

    // If the user has already answered, the correct option is marked by React.
    const correct = question.querySelector('.answers button.correct');
    const text = normalize(correct?.textContent);
    return hasCyrillic(text) ? text : null;
  }

  function playUkrainian(text) {
    const url = 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=uk&q=' + encodeURIComponent(text);
    window.__ukTtsAudio?.pause();
    const audio = new Audio(url);
    audio.preload = 'auto';
    audio.volume = 1;
    window.__ukTtsAudio = audio;
    audio.play().catch(() => {
      // Browser autoplay policy can block an audio element created outside the click.
      // This function is called directly from the user's click event, so a second play is enough.
      audio.play().catch(() => {});
    });
  }

  document.addEventListener('click', event => {
    const button = event.target.closest?.('button.speak');
    if (!button) return;
    const text = getUkrainianAnswer(button);
    if (!text || !hasCyrillic(text)) return;

    // Stop the native speechSynthesis handler. Ukrainian is handled by real audio.
    event.preventDefault();
    event.stopImmediatePropagation();
    playUkrainian(text);
  }, true);
})();
