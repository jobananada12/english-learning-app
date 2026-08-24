(() => {
  function getNativeTTS() {
    return window.Capacitor?.Plugins?.TextToSpeech || null;
  }

  async function showNativeLanguages() {
    const tts = getNativeTTS();
    if (!tts) return false;

    try {
      const [{ languages }, { voices }] = await Promise.all([
        tts.getSupportedLanguages(),
        tts.getSupportedVoices()
      ]);

      const uk = (languages || []).filter(l => /^uk(-|$)/i.test(l));
      const en = (languages || []).filter(l => /^en(-|$)/i.test(l));
      const voiceLines = (voices || []).map((v, i) => `${i + 1}. ${v.name || '(без назви)'} — ${v.lang || '?'}${v.localService ? ' — local' : ' — network'}`);

      const message = [
        '📱 ANDROID TTS',
        '',
        `Усього мов: ${(languages || []).length}`,
        `🇺🇦 Українська: ${uk.length ? uk.join(', ') : 'НЕ ЗНАЙДЕНО'}`,
        `🇬🇧 English: ${en.length ? en.join(', ') : 'НЕ ЗНАЙДЕНО'}`,
        '',
        'МОВИ:',
        (languages || []).join('\n') || '(список порожній)',
        '',
        'ГОЛОСИ:',
        voiceLines.join('\n') || '(голоси не знайдені)'
      ].join('\n');

      alert(message);

      if (uk.length) {
        try {
          await tts.speak({
            text: 'Мене звати Алекс. Це тест української озвучки.',
            lang: uk[0],
            rate: 0.9,
            pitch: 1.0,
            volume: 1.0,
            queueStrategy: 0
          });
        } catch (e) {
          alert(`❌ Український TTS знайдений, але озвучення завершилось помилкою:\n${e?.message || e}`);
        }
      }
      return true;
    } catch (e) {
      alert(`❌ Не вдалося отримати список Android TTS:\n${e?.message || e}`);
      return true;
    }
  }

  function addDiagnostic() {
    if (document.getElementById('uk-voice-test')) return;

    const button = document.createElement('button');
    button.id = 'uk-voice-test';
    button.type = 'button';
    button.textContent = '🔊 Показати мови TTS';
    Object.assign(button.style, {
      position:'fixed', right:'16px', bottom:'82px', zIndex:'99999',
      padding:'12px 16px', borderRadius:'12px', border:'1px solid #ccc',
      background:'#fff', color:'#111', fontWeight:'700', cursor:'pointer',
      boxShadow:'0 4px 16px rgba(0,0,0,.15)'
    });

    button.onclick = async () => {
      const nativeHandled = await showNativeLanguages();
      if (nativeHandled) return;

      const synth = window.speechSynthesis;
      if (!synth || !window.SpeechSynthesisUtterance) {
        alert('❌ TTS не підтримується.');
        return;
      }

      const run = () => {
        const voices = synth.getVoices();
        const lines = voices.map(v => `${v.name} — ${v.lang}`).join('\n');
        alert(`🌐 BROWSER TTS\n\nУсього голосів: ${voices.length}\n\n${lines || '(список порожній)'}`);
      };

      if (synth.getVoices().length) run();
      else {
        const handler = () => { synth.removeEventListener('voiceschanged', handler); run(); };
        synth.addEventListener('voiceschanged', handler);
        setTimeout(run, 1000);
      }
    };

    document.body.appendChild(button);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addDiagnostic);
  else addDiagnostic();
})();
