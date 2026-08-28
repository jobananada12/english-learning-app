import {LANGUAGE_CATALOG,language,MEGA_LESSON_COUNT,LEVELS,getVirtualLesson,getCurriculumStats,getAudioLanguage,levelForLesson,translateWord} from './universal-engine';
export {LANGUAGE_CATALOG,language,MEGA_LESSON_COUNT,LEVELS,getVirtualLesson,getCurriculumStats,getAudioLanguage,levelForLesson,translateWord};
export const courseKey=(source,target)=>`${source}-${target}`;
export const normalizeQuestion=q=>({type:q.type||'choice',q:String(q.q||''),options:Array.isArray(q.options)?q.options:[],answer:String(q.answer||''),sourceText:q.sourceText||null,targetText:q.targetText||null,audioLanguage:q.audioLanguage||null});
export const normalizeLesson=(lesson,index)=>({id:lesson.id??index+1,unit:lesson.unit||'Basics',title:lesson.title||`Lesson ${index+1}`,icon:lesson.icon||'📘',xp:lesson.xp||20,questions:(lesson.questions||[]).map(normalizeQuestion)});
export const buildCourse=({id,source,target,title,level='A1',lessons=[]})=>({id:id||courseKey(source,target),source,target,title:title||`${language(source).name} → ${language(target).name}`,level,lessons:lessons.map(normalizeLesson),lessonCount:MEGA_LESSON_COUNT,virtual:true});
export const getCourse=(courses,source,target)=>courses[courseKey(source,target)]||null;
export const getAvailableTargets=(courses,source)=>Object.values(courses).filter(c=>c.source===source).map(c=>c.target);
