const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/,'');

function getToken(){return localStorage.getItem('english-ai-api-token')}
function setToken(token){if(token)localStorage.setItem('english-ai-api-token',token);else localStorage.removeItem('english-ai-api-token')}
async function request(path,options={}){if(!API_BASE) return null;const headers={'Content-Type':'application/json',...(options.headers||{})};const token=getToken();if(token)headers.Authorization=`Bearer ${token}`;const r=await fetch(`${API_BASE}${path}`,{...options,headers});if(!r.ok)throw new Error((await r.text())||`API ${r.status}`);return r.json()}
export async function createGuestSession(){const data=await request('/api/auth/guest',{method:'POST'});if(data?.token)setToken(data.token);return data}
export async function register(email,password){const data=await request('/api/auth/register',{method:'POST',body:JSON.stringify({email,password})});if(data?.token)setToken(data.token);return data}
export function hasBackend(){return Boolean(API_BASE)}
export function logout(){setToken(null)}
export async function getCloudProgress(pair){return request(`/api/progress/${encodeURIComponent(pair)}`)}
export async function saveCloudProgress(pair,progress){return request(`/api/progress/${encodeURIComponent(pair)}`,{method:'PUT',body:JSON.stringify(progress)})}
export async function submitScore(xp,name){return request('/api/leaderboard/score',{method:'POST',body:JSON.stringify({xp,name})})}
export async function getLeaderboard(){return request('/api/leaderboard')}
export async function createPremiumCheckout(priceId){return request('/api/checkout',{method:'POST',body:JSON.stringify({priceId})})}
