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

const lessonUiFix = {
  name: 'lesson-ui-fix',
  transform(code, id) {
    if (!id.replaceAll('\\', '/').endsWith('/src/MegaApp.jsx')) return null

    const questionReplacement = `function QuestionText({q,source,target}){\n  const targetText=String(q.questionTarget||q.q||'').trim();\n  const sourceText=String(q.questionSource||'').trim();\n  if(!targetText&&!sourceText)return null;\n  return <div className="question-lines">{targetText&&<div className="language-line"><span>{target.toUpperCase()}</span><b>{targetText}</b><AudioButton text={targetText} code={target}/></div>}{sourceText&&<div className="language-line"><span>{source.toUpperCase()}</span><b>{sourceText}</b><AudioButton text={sourceText} code={source}/></div>}</div>}\nfunction AnswerText`

    code = code.replace(/function QuestionText\\(\\{q,source,target\\}\\)\\{[\\s\\S]*?\\nfunction AnswerText/, questionReplacement)

    const answerReplacement = `function AnswerButton({value,q,source,target,answered,selected,choose}){\n  const [revealed,setRevealed]=useState(false);\n  useEffect(()=>setRevealed(false),[q?.q,value]);\n  const isCorrect=value===q.answer;\n  const isWrong=answered&&selected===value&&!isCorrect;\n  const raw=String(value||'');\n  let visibleText='';\n  let hiddenText='';\n  if(raw.includes(' — ')){\n    const [targetText,sourceText]=raw.split(' — ');\n    visibleText=targetText;\n    hiddenText=sourceText;\n  }else{\n    visibleText=translateWord(raw,source,target);\n    hiddenText=translateWord(raw,target,source);\n    if(visibleText===raw&&hiddenText!==raw){const tmp=visibleText;visibleText=hiddenText;hiddenText=tmp;}\n  }\n  return <button className={\`answer-card \${answered&&isCorrect?'correct':''} \${isWrong?'wrong':''}\`} disabled={answered} onClick={()=>choose(value)}>\n    <div className="answer-language">\n      <div className="language-line"><span>{target.toUpperCase()}</span><b>{visibleText}</b><AudioButton text={visibleText} code={target} small/></div>\n      <div className="language-line">\n        {revealed?<span className="hint-click revealed" onClick={e=>e.stopPropagation()}><span>{source.toUpperCase()}</span><b>{hiddenText}</b><AudioButton text={hiddenText} code={source} small/></span>:<span className="hint-click" onClick={e=>{e.stopPropagation();setRevealed(true)}}><b>Підказка</b></span>}\n      </div>\n    </div>\n    {answered&&isCorrect?<Check className="answer-status"/>:isWrong?<X className="answer-status"/>:null}\n  </button>\n}\nfunction Result`

    code = code.replace(/function AnswerButton\\(\\{value,q,source,target,answered,selected,choose\\}\\)\\{[\\s\\S]*?\\nfunction Result/, answerReplacement)

    return { code, map: null }
  }
}

export default defineConfig({
  plugins: [
    react(),
    lessonUiFix,
    {
      name: 'ukrainian-tts-fallback',
      transformIndexHtml(html) {
        return html.replace('</head>', ukrainianTtsScript + '</head>')
      }
    }
  ],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['approval-moodiness-cranial.ngrok-free.dev'],
    watch: {
      ignored: ['**/android/**', '**/android_backup/**']
    }
  }
})
