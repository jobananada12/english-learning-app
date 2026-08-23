(() => {
  function addDiagnostic() {
    if (document.getElementById('uk-voice-test')) return;
    const button = document.createElement('button');
    button.id = 'uk-voice-test';
    button.type = 'button';
    button.textContent = '🔊 Перевірити український голос';
    Object.assign(button.style, {position:'fixed',right:'16px',bottom:'82px',zIndex:'99999',padding:'12px 16px',borderRadius:'12px',border:'1px solid #ccc',background:'#fff',color:'#111',fontWeight:'700',cursor:'pointer',boxShadow:'0 4px 16px rgba(0,0,0,.15)'});
    button.onclick = () => {
      const synth = window.speechSynthesis;
      if (!synth || !window.SpeechSynthesisUtterance) {
        alert('❌ speechSynthesis не підтримується цим браузером.');
        return;
      }
      const run = () => {
        const voices = synth.getVoices();
        const uk = voices.filter(v => /^uk(-|$)/i.test(v.lang));
        const lines = voices.map(v => `${v.name} — ${v.lang}`).join('\n');
        const info = uk.length
          ? `✅ Українські голоси знайдено: ${uk.length}\n\n${uk.map(v => `${v.name} — ${v.lang}`).join('\n')}`
          : `❌ Українського голосу НЕ знайдено.\n\nДоступні голоси:\n${lines || '(список голосів порожній)'}`;
        alert(info);
        if (uk[0]) {
          synth.cancel();
          const u = new SpeechSynthesisUtterance('Мене звати Алекс. Це тест української озвучки.');
          u.lang = uk[0].lang;
          u.voice = uk[0];
          u.rate = .9;
          synth.speak(u);
        }
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
