export const PROGRESS_STORAGE='english-ai-progress-v3';
export const initialProgress={xp:0,streak:0,lastDay:null,completed:{},mistakes:0,hearts:999,level:1};
export function loadProgress(){try{return {...initialProgress,...JSON.parse(localStorage.getItem(PROGRESS_STORAGE)||'{}')}}catch{return {...initialProgress}}}
export function saveProgress(state){localStorage.setItem(PROGRESS_STORAGE,JSON.stringify(state));}
export function completeLesson(state,lessonId,score,total,xp){const key=String(lessonId);const old=state.completed?.[key]||{};const accuracy=total?score/total:0;const stars=accuracy>=.9?3:accuracy>=.7?2:accuracy>0?1:0;const today=new Date().toDateString();const yesterday=new Date(Date.now()-86400000).toDateString();const streak=state.lastDay===today?state.streak:(state.lastDay===yesterday?state.streak+1:state.lastDay?1:1);const gain=xp+Math.round(accuracy*10);return {...state,xp:state.xp+gain,level:Math.floor((state.xp+gain)/100)+1,streak,lastDay:today,mistakes:state.mistakes+(total-score),completed:{...state.completed,[key]:{completed:true,score,total,accuracy,stars,attempts:(old.attempts||0)+1,lastPlayed:new Date().toISOString()}}};}
export function isLessonComplete(state,id){return Boolean(state.completed?.[String(id)]?.completed)}
export function lessonMastery(state,id){return state.completed?.[String(id)]?.accuracy||0}
export function resetProgress(){localStorage.removeItem(PROGRESS_STORAGE); return {...initialProgress};}
