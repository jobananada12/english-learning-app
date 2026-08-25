import { TextToSpeech } from '@capacitor-community/text-to-speech';

const isAndroidCapacitor=()=>Boolean(window.Capacitor?.getPlatform&&window.Capacitor.getPlatform()==='android');

function detectLocale(text,explicit){
  if(explicit)return explicit;
  const value=String(text||'');
  if(/[\u0400-\u04FF]/.test(value))return'uk-UA';
  if(/[ąęłńóśźż]/i.test(value))return'pl-PL';
  if(/[äöüß]/i.test(value))return'de-DE';
  if(/[àâçéèêëîïôùûüÿœæ]/i.test(value))return'fr-FR';
  if(/[áéíóúñü]/i.test(value))return'es-ES';
  if(/[àèéìíîòóùú]/i.test(value))return'it-IT';
  return'en-US';
}

async function nativeSpeak(text,lang){
  try{await TextToSpeech.stop()}catch{}
  try{await TextToSpeech.speak({text:String(text),lang:detectLocale(text,lang),rate:.9,pitch:1,volume:1,queueStrategy:0});return true;}
  catch(error){console.error('[Native TTS] speak failed',error);return false;}
}

function install(){
  document.addEventListener('click',async event=>{
    const button=event.target.closest?.('button.speak');
    if(!button||!isAndroidCapacitor())return;
    const text=button.dataset.ttsText;
    if(!text)return;
    const lang=button.dataset.ttsLang||null;
    event.preventDefault();event.stopImmediatePropagation();
    await nativeSpeak(text,lang);
  },true);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
