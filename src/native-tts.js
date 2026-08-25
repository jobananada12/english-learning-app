import { TextToSpeech } from '@capacitor-community/text-to-speech';

const isAndroidCapacitor = () => Boolean(window.Capacitor?.getPlatform && window.Capacitor.getPlatform() === 'android');

function detectLocale(text, question) {
  const value = `${question || ''} ${text || ''}`;
  if (/[\u0400-\u04FF]/.test(text || '')) return 'uk-UA';
  if (/[ąęłńóśźż]/i.test(value) || /Przetłumacz|oznacza|Jak powiedzieć|Jak masz/i.test(value)) return 'pl-PL';
  if (/[äöüß]/i.test(value) || /Übersetze|bedeutet|Wie sagt man|Wie heißt/i.test(value)) return 'de-DE';
  if (/[àâçéèêëîïôùûüÿœæ]/i.test(value)) return 'fr-FR';
  if (/[áéíóúñü]/i.test(value)) return 'es-ES';
  if (/[àèéìíîòóùú]/i.test(value)) return 'it-IT';
  return 'en-US';
}

async function nativeSpeak(text, lang) {
  try { await TextToSpeech.stop(); } catch {}
  try {
    await TextToSpeech.speak({ text: String(text), lang, rate: 0.9, pitch: 1.0, volume: 1.0, queueStrategy: 0 });
    return true;
  } catch (error) {
    console.error('[Native TTS] speak failed', error);
    return false;
  }
}

function install() {
  document.addEventListener('click', async event => {
    const button = event.target.closest?.('button.speak');
    if (!button || !isAndroidCapacitor()) return;
    const text = button.dataset.ttsText;
    if (!text) return;
    const question = button.closest('.question')?.querySelector('h1')?.textContent || '';
    const lang = button.dataset.ttsLang || detectLocale(text, question);
    event.preventDefault();
    event.stopImmediatePropagation();
    await nativeSpeak(text, lang);
  }, true);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
else install();
