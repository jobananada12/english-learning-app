function isUkrainian(text){
  return /[\u0400-\u04FF]/.test(String(text));
}

export function speakText(text){
  if(typeof window === "undefined") return;

  const value = String(text ?? "").trim();
  if(!value || !("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;

  const synth = window.speechSynthesis;
  const ukrainian = isUkrainian(value);
  const lang = ukrainian ? "uk-UA" : "en-US";

  const speak = () => {
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(value);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    const voices = synth.getVoices();
    const exact = voices.find(v => v.lang?.toLowerCase() === lang.toLowerCase());
    const regional = voices.find(v => v.lang?.toLowerCase().startsWith(ukrainian ? "uk" : "en"));
    if(exact || regional) utterance.voice = exact || regional;
    synth.speak(utterance);
  };

  if(synth.getVoices().length){
    speak();
    return;
  }

  let finished = false;
  const onVoicesChanged = () => {
    if(finished) return;
    finished = true;
    synth.removeEventListener("voiceschanged", onVoicesChanged);
    speak();
  };

  synth.addEventListener("voiceschanged", onVoicesChanged);
  setTimeout(() => {
    if(finished) return;
    finished = true;
    synth.removeEventListener("voiceschanged", onVoicesChanged);
    speak();
  }, 700);
}
