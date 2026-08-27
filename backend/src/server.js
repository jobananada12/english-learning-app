import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const app=express();
app.use(cors());
app.use(express.json());
const port=Number(process.env.PORT||8787);
const jwtSecret=process.env.JWT_SECRET||'CHANGE_ME_IN_PRODUCTION';
const supabase=process.env.SUPABASE_URL&&process.env.SUPABASE_SERVICE_ROLE_KEY?createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY):null;
const stripe=process.env.STRIPE_SECRET_KEY?new Stripe(process.env.STRIPE_SECRET_KEY):null;
const users=new Map();
const progress=new Map();
const scores=new Map();

function token(user){return jwt.sign({sub:user.id,email:user.email},jwtSecret,{expiresIn:'30d'});}
function auth(req,res,next){try{const h=req.headers.authorization||'';if(!h.startsWith('Bearer '))return res.status(401).json({error:'Authentication required'});req.user=jwt.verify(h.slice(7),jwtSecret);next()}catch{return res.status(401).json({error:'Invalid token'})}}
async function db(table,action,payload){if(!supabase)return null;try{if(action==='insert')return await supabase.from(table).insert(payload).select().single();if(action==='upsert')return await supabase.from(table).upsert(payload).select().single();if(action==='select')return await supabase.from(table).select('*').eq('user_id',payload.user_id);return null}catch{return null}}

app.get('/api/health',(req,res)=>res.json({ok:true,service:'english-ai-backend',time:new Date().toISOString(),database:Boolean(supabase),payments:Boolean(stripe)}));
app.post('/api/auth/guest',(req,res)=>{const id=`guest_${crypto.randomUUID()}`;const user={id,email:null,guest:true,created_at:new Date().toISOString()};users.set(id,user);res.json({user,token:token(user)})});
app.post('/api/auth/register',async(req,res)=>{const email=String(req.body.email||'').trim().toLowerCase();if(!email||!String(req.body.password||''))return res.status(400).json({error:'Email and password required'});const id=crypto.randomUUID();const user={id,email,guest:false,created_at:new Date().toISOString()};users.set(id,user);await db('profiles','upsert',{user_id:id,email});res.json({user,token:token(user)})});
app.get('/api/me',auth,(req,res)=>res.json({user:users.get(req.user.sub)||req.user}));

app.get('/api/progress/:pair',auth,async(req,res)=>{const key=`${req.user.sub}:${req.params.pair}`;const local=progress.get(key)||{pair:req.params.pair,xp:0,streak:0,completed:[],mistakes:0,mastery:{}};const remote=await db('progress','select',{user_id:req.user.sub});res.json({progress:local,remote:remote?.data||null})});
app.put('/api/progress/:pair',auth,async(req,res)=>{const value={pair:req.params.pair,xp:Number(req.body.xp||0),streak:Number(req.body.streak||0),completed:Array.isArray(req.body.completed)?req.body.completed:[],mistakes:Number(req.body.mistakes||0),mastery:req.body.mastery||{},updated_at:new Date().toISOString()};progress.set(`${req.user.sub}:${req.params.pair}`,value);await db('progress','upsert',{user_id:req.user.sub,language_pair:req.params.pair,data:value,updated_at:value.updated_at});res.json({ok:true,progress:value})});

app.get('/api/leaderboard',async(req,res)=>{const rows=[...scores.values()].sort((a,b)=>b.xp-a.xp).slice(0,100);res.json({entries:rows})});
app.post('/api/leaderboard/score',auth,async(req,res)=>{const xp=Math.max(0,Number(req.body.xp||0));const current=scores.get(req.user.sub)||{user_id:req.user.sub,name:req.body.name||'Player',xp:0};current.xp=Math.max(current.xp,xp);scores.set(req.user.sub,current);res.json({ok:true,entry:current})});

app.post('/api/checkout',auth,async(req,res)=>{if(!stripe)return res.status(503).json({error:'Stripe is not configured'});const priceId=String(req.body.priceId||process.env.STRIPE_PREMIUM_PRICE_ID||'');if(!priceId)return res.status(400).json({error:'Premium price is not configured'});const session=await stripe.checkout.sessions.create({mode:'subscription',line_items:[{price:priceId,quantity:1}],success_url:process.env.STRIPE_SUCCESS_URL||'https://example.com/success',cancel_url:process.env.STRIPE_CANCEL_URL||'https://example.com/cancel',client_reference_id:req.user.sub});res.json({url:session.url})});
app.post('/api/stripe/webhook',express.raw({type:'application/json'}),(req,res)=>{if(!stripe||!process.env.STRIPE_WEBHOOK_SECRET)return res.status(503).end();try{stripe.webhooks.constructEvent(req.body,req.headers['stripe-signature'],process.env.STRIPE_WEBHOOK_SECRET);res.json({received:true})}catch(e){res.status(400).send(`Webhook Error: ${e.message}`)}});

app.listen(port,()=>console.log(`English AI backend listening on :${port}`));
