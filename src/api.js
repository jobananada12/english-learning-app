const API_URL=(import.meta.env.VITE_API_URL||'').replace(/\/$/,'');
const TOKEN_KEY='english-ai-api-token-v1';
export const apiEnabled=Boolean(API_URL);
export const getToken=()=>localStorage.getItem(TOKEN_KEY);
export const setToken=t=>t?localStorage.setItem(TOKEN_KEY,t):localStorage.removeItem(TOKEN_KEY);
async function request(path,options={}){if(!API_URL)throw new Error('API disabled');const headers={'Content-Type':'application/json',...(options.headers||{})};const token=getToken();if(token)headers.Authorization=`Bearer ${token}`;const r=await fetch(`${API_URL}${path}`,{...options,headers});if(!r.ok)throw new Error((await r.json().catch(()=>({}))).error||`HTTP ${r.status}`);return r.json();}
export async function createGuest(){const x=await request('/api/auth/guest',{method:'POST'});setToken(x.token);return x.user;}
export async function getProgress(pair){return request(`/api/progress/${encodeURIComponent(pair)}`)}
export async function saveProgress(pair,data){return request(`/api/progress/${encodeURIComponent(pair)}`,{method:'PUT',body:JSON.stringify(data)})}
export async function getLeaderboard(){return request('/api/leaderboard')}
export async function submitScore(xp,name){return request('/api/leaderboard/score',{method:'POST',body:JSON.stringify({xp,name})})}
export async function checkout(priceId){return request('/api/checkout',{method:'POST',body:JSON.stringify({priceId})})}
