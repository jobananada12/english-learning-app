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
        '📱 ANDROID TTS', '',
        `Усього мов: ${(languages || []).length}`,
        `🇺🇦 Українська: ${uk.length ? uk.join(', ') : 'НЕ ЗНАЙДЕНО'}`,
        `🇬🇧 English: ${en.length ? en.join(', ') : 'НЕ ЗНАЙДЕНО'}`, '',
        'МОВИ:', (languages || []).join('\n') || '(список порожній)', '',
        'ГОЛОСИ:', voiceLines.join('\n') || '(голоси не знайдені)'
      ].join('\n');
      alert(message);
      if (uk.length) {
        try {
          await tts.speak({ text: 'Мене звати Алекс. Це тест української озвучки.', lang: uk[0], rate: 0.9, pitch: 1, volume: 1, queueStrategy: 0 });
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
    button.textContent = '🔊 МОВИ TTS';
    Object.assign(button.style, {
      position:'fixed', right:'12px', bottom:'145px', zIndex:'2147483647',
      display:'block', visibility:'visible', opacity:'1', pointerEvents:'auto',
      padding:'14px 18px', minWidth:'150px', borderRadius:'14px',
      border:'2px solid #222', background:'#58cc02', color:'#fff',
      fontSize:'15px', fontWeight:'800', cursor:'pointer',
      boxShadow:'0 5px 20px rgba(0,0,0,.35)'
    });
    button.onclick = async () => {
      const nativeHandled = await showNativeLanguages();
      if (nativeHandled) return;
      const synth = window.speechSynthesis;
      if (!synth || !window.SpeechSynthesisUtterance) { alert('❌ TTS не підтримується.'); return; }
      const voices = synth.getVoices();
      alert(`🌐 BROWSER TTS\n\nУсього голосів: ${voices.length}\n\n${voices.map(v => `${v.name} — ${v.lang}`).join('\n') || '(список порожній)'}`);
    };
    document.body.appendChild(button);
  }

  function boot() {
    addDiagnostic();
    setTimeout(addDiagnostic, 500);
    setTimeout(addDiagnostic, 2000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
