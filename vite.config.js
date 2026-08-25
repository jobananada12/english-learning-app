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
      // Android/Gradle generates report files while the app is running.
      // They are not source files and must not trigger Vite reloads.
      ignored: ['**/android/**', '**/android_backup/**']
    }
  }
})
