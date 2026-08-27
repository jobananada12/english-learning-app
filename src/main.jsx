import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import App from './MegaApp.jsx';
import './native-tts.js';
import './styles.css';
import {hasBackend,createGuestSession,getCloudProgress,saveCloudProgress} from './backend-api.js';

const PREFS='english-ai-global-prefs-v2';
const STORAGE='english-ai-global-state-v2';
const PAIR=p=>`${p.nativeLanguage}->${p.learningLanguage}`;

async function bootstrapCloud(){
 if(!hasBackend())return;
 try{
  if(!localStorage.getItem('english-ai-api-token')) await createGuestSession();
  const prefs=JSON.parse(localStorage.getItem(PREFS)||'{}');
  if(!prefs.nativeLanguage||!prefs.learningLanguage)return;
  const pair=PAIR(prefs),remote=await getCloudProgress(pair),cloud=remote?.progress;
  if(cloud){
   const local=JSON.parse(localStorage.getItem(STORAGE)||'{"profiles":{}}');local.profiles=local.profiles||{};
   const current=local.profiles[pair];
   if(!current||new Date(cloud.updated_at||0)>new Date(current.updated_at||0)){local.profiles[pair]={...current,...cloud};localStorage.setItem(STORAGE,JSON.stringify(local));}
  }
 }catch(e){console.warn('Cloud bootstrap unavailable; continuing offline.',e)}
}
function CloudSync(){useEffect(()=>{if(!hasBackend())return;let timer;const sync=async()=>{try{const p=JSON.parse(localStorage.getItem(PREFS)||'{}'),s=JSON.parse(localStorage.getItem(STORAGE)||'{"profiles":{}}');if(!p.nativeLanguage||!p.learningLanguage)return;const pair=PAIR(p),progress=s.profiles?.[pair];if(progress)await saveCloudProgress(pair,{...progress,updated_at:new Date().toISOString()})}catch(e){console.warn('Cloud sync skipped:',e)}};timer=setInterval(sync,5000);sync();return()=>clearInterval(timer)},[]);return null}
function Root(){const[ready,setReady]=useState(!hasBackend());useEffect(()=>{bootstrapCloud().finally(()=>setReady(true))},[]);if(!ready)return <div className="app"><main className="page"><div className="card"><h2>🌍 English AI</h2><p>Connecting your secure learning profile…</p></div></main></div>;return <><CloudSync/><App/></>}
createRoot(document.getElementById('root')).render(<Root/>);
