import { speak } from './engine/tts';
function install(){document.addEventListener('click',async event=>{const button=event.target.closest?.('button.speak');if(!button)return;const text=button.dataset.ttsText;if(!text)return;event.preventDefault();event.stopImmediatePropagation();await speak(text,button.dataset.ttsLang||'en-US');},true)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
