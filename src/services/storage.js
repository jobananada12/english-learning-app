import {DEFAULT_STATE} from "../data/lessons";

const STORAGE_KEY = "english-ai-state";

export function loadState(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const saved = raw ? JSON.parse(raw) : {};
    return {...DEFAULT_STATE, ...saved};
  } catch {
    return {...DEFAULT_STATE};
  }
}

export function saveState(state){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState(){
  localStorage.removeItem(STORAGE_KEY);
  return {...DEFAULT_STATE};
}
