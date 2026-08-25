import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const ukrainianTtsScript = `
<script>
(function () {
  if (!('speechSynthesis' in window)) return;
  const synth = window.speechSynthesis;
  const originalSpeak = synth.speak.bind(synth);

  synth.speak = function (utterance) {
    const text = utterance && String(utterance.text || '').trim();
    const lang = String(utterance && utterance.lang || '').toLowerCase();

    if (text && (lang === 'uk-ua' || lang.startsWith('uk-') || /[\\u0400-\\u04ff]/.test(text))) {
      try { synth.cancel(); } catch (_) {}
      const audio = new Audio(
        'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=uk&q=' + encodeURIComponent(text)
      );
      audio.volume = 1;
      audio.play().catch(function () {
        originalSpeak(utterance);
      });
      return;
    }

    originalSpeak(utterance);
  };
})();
</script>`

export default defineConfig({
  plugins: [
    {
      name: 'megaapp-language-ui-fix',
      enforce: 'pre',
      transform(code, id) {
        if (!id.endsWith('/src/MegaApp.jsx') && !id.endsWith('\\src\\MegaApp.jsx')) return null;
        let next = code.replaceAll('<span>UK</span>', '<span>UA</span>');
        next = next.replace(
          /function TranslateQuestion\(\{value,source,target\}\)\{[\\s\\S]*?\}\n?function TranslateOption/,
          `function TranslateQuestion({value,source,target}){const v=bilingual(value);const phrase=source==='uk'?v.uk:v.en;const mainLabel=target==='en'?'Translate':'Переклади';const localLabel=source==='uk'?'Переклади':'Translate';const mainSpeech=\`${'${mainLabel}'} \${phrase}\`;const localSpeech=\`${'${localLabel}'} \${phrase}\`;return <div className="translate-question"><div><b>{mainLabel} «{phrase}»</b><SpeakButton text={phrase} code={target} speechText={mainSpeech}/></div><div><b>{localLabel} «{phrase}»</b><SpeakButton text={phrase} code={source} speechText={localSpeech}/></div></div>}\nfunction TranslateOption`
        );
        if (next === code) return null;
        return { code: next, map: null };
      }
    },
    react(),
    {
      name: 'ukrainian-tts-fallback',
      transformIndexHtml(html) {
        return html.replace('</head>', ukrainianTtsScript + '</head>')
      }
    }
  ],
  server: {
    watch: {
      ignored: ['**/android/**', '**/android_backup/**']
    }
  }
})
