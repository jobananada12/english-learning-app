import { Capacitor } from "@capacitor/core";
import { TextToSpeech } from "@capacitor-community/text-to-speech";

function isUkrainian(text) {
  return /[\u0400-\u04FF]/.test(String(text));
}

function browserSpeak(value, lang) {
  if (typeof window === "undefined") return false;
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return false;

  const synth = window.speechSynthesis;
  const ukrainian = lang.toLowerCase().startsWith("uk");

  const speak = () => {
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(value);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = synth.getVoices();
    const exact = voices.find(v => v.lang?.toLowerCase() === lang.toLowerCase());
    const regional = voices.find(v => v.lang?.toLowerCase().startsWith(ukrainian ? "uk" : "en"));
    if (exact || regional) utterance.voice = exact || regional;
    synth.speak(utterance);
  };

  if (synth.getVoices().length) {
    speak();
    return true;
  }

  let finished = false;
  const onVoicesChanged = () => {
    if (finished) return;
    finished = true;
    synth.removeEventListener("voiceschanged", onVoicesChanged);
    speak();
  };

  synth.addEventListener("voiceschanged", onVoicesChanged);
  setTimeout(() => {
    if (finished) return;
    finished = true;
    synth.removeEventListener("voiceschanged", onVoicesChanged);
    speak();
  }, 700);

  return true;
}

/**
 * Speaks text using native Android TTS inside Capacitor and browser
 * SpeechSynthesis everywhere else. Returns a small status object so the UI
 * can tell the user when an Android language pack is missing.
 */
export async function speakText(text) {
  const value = String(text ?? "").trim();
  if (!value) return { ok: false, reason: "empty" };

  const ukrainian = isUkrainian(value);
  const lang = ukrainian ? "uk-UA" : "en-US";

  if (Capacitor.isNativePlatform()) {
    try {
      const support = await TextToSpeech.isLanguageSupported({ lang });

      if (!support.supported) {
        if (Capacitor.getPlatform() === "android") {
          try {
            await TextToSpeech.openInstall();
          } catch {
            // The system installer is optional; keep the app usable.
          }
        }
        return { ok: false, reason: "language-not-installed", lang };
      }

      await TextToSpeech.speak({
        text: value,
        lang,
        rate: 0.9,
        pitch: 1,
        volume: 1,
        queueStrategy: 0
      });

      return { ok: true, native: true, lang };
    } catch (error) {
      console.warn("Native TTS failed, using browser fallback:", error);
    }
  }

  return {
    ok: browserSpeak(value, lang),
    native: false,
    lang
  };
}

export async function stopSpeaking() {
  try {
    if (Capacitor.isNativePlatform()) {
      await TextToSpeech.stop();
      return;
    }
  } catch {
    // Continue with browser fallback.
  }

  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
