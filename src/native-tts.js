import { TextToSpeech } from '@capacitor-community/text-to-speech';

const isAndroidCapacitor = () => Boolean(window.Capacitor?.getPlatform && window.Capacitor.getPlatform() === 'android');

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
    const lang = button.dataset.ttsLang || (/^[\u0400-\u04FF]/.test(text || '') ? 'uk-UA' : 'en-US');
    if (!text) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    await nativeSpeak(text, lang);
  }, true);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
else install();
