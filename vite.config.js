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
      audio.play().catch(function () { originalSpeak(utterance); });
      return;
    }
    originalSpeak(utterance);
  };
})();
</script>`

const lessonUiFix = {
  name: 'lesson-ui-fix',
  enforce: 'pre',
  transform(code, id) {
    if (!id.replaceAll('\\', '/').endsWith('/src/MegaApp.jsx')) return null

    const questionReplacement = `function QuestionText({q,source,target}){
  const targetText=String(q.questionTarget||q.q||'').trim();
  const sourceText=String(q.questionSource||'').trim();
  if(!targetText&&!sourceText)return null;
  return <div className="question-lines">{targetText&&<div className="language-line"><span>{target.toUpperCase()}</span><b>{targetText}</b><AudioButton text={targetText} code={target}/></div>}{sourceText&&<div className="language-line"><span>{source.toUpperCase()}</span><b>{sourceText}</b><AudioButton text={sourceText} code={source}/></div>}</div>}
function AnswerText`

    code = code.replace(/function QuestionText\(\{q,source,target\}\)\{[\s\S]*?\nfunction AnswerText/, questionReplacement)

    const answerReplacement = `function AnswerButton({value,q,source,target,answered,selected,choose}){
  const [revealed,setRevealed]=useState(false);
  useEffect(()=>setRevealed(false),[q?.q,value]);
  const isCorrect=value===q.answer;
  const isWrong=answered&&selected===value&&!isCorrect;
  const raw=String(value||'');
  let visibleText='';
  let hiddenText='';
  if(raw.includes(' — ')){
    const [targetText,sourceText]=raw.split(' — ');
    visibleText=targetText;
    hiddenText=sourceText;
  }else{
    visibleText=translateWord(raw,source,target);
    hiddenText=translateWord(raw,target,source);
    if(visibleText===raw&&hiddenText!==raw){const tmp=visibleText;visibleText=hiddenText;hiddenText=tmp;}
  }
  return <button className={\`answer-card \${answered&&isCorrect?'correct':''} \${isWrong?'wrong':''}\`} disabled={answered} onClick={()=>choose(value)}>
    <div className="answer-language">
      <div className="language-line"><span>{target.toUpperCase()}</span><b>{visibleText}</b><AudioButton text={visibleText} code={target} small/></div>
      <div className="language-line">
        {revealed?<span className="hint-click revealed" onClick={e=>e.stopPropagation()}><span>{source.toUpperCase()}</span><b>{hiddenText}</b><AudioButton text={hiddenText} code={source} small/></span>:<span className="hint-click" onClick={e=>{e.stopPropagation();setRevealed(true)}}><b>Підказка</b></span>}
      </div>
    </div>
    {answered&&isCorrect?<Check className="answer-status"/>:isWrong?<X className="answer-status"/>:null}
  </button>
}
function Result`

    code = code.replace(/function AnswerButton\(\{value,q,source,target,answered,selected,choose\}\)\{[\s\S]*?\nfunction Result/, answerReplacement)

    return { code, map: null }
  }
}

export default defineConfig({
  plugins: [
    lessonUiFix,
    react(),
    {
      name: 'ukrainian-tts-fallback',
      transformIndexHtml(html) { return html.replace('</head>', ukrainianTtsScript + '</head>') }
    }
  ],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['approval-moodiness-cranial.ngrok-free.dev'],
    watch: { ignored: ['**/android/**', '**/android_backup/**'] }
  }
})
