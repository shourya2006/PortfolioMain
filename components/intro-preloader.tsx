'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

type Phase='count'|'expand'|'text'|'exit';
type Geometry={vw:number;vh:number;boxW:number;boxH:number;gutter:number;radius:number};

// The reference's cubic-bezier curves, evaluated for the numeric counter and frame geometry.
function cubicBezier(x1:number,y1:number,x2:number,y2:number){
 const sample=(a:number,b:number,t:number)=>3*a*t*(1-t)*(1-t)+3*b*t*t*(1-t)+t*t*t;
 return (x:number)=>{let lo=0,hi=1,t=x;for(let i=0;i<18;i++){const value=sample(x1,x2,t);if(value<x)lo=t;else hi=t;t=(lo+hi)/2}return sample(y1,y2,t)};
}
const easeOut=cubicBezier(.33,1,.68,1);
const revealEase=cubicBezier(.22,1,.36,1);
const expandEase=cubicBezier(.76,0,.24,1);
function wait(ms:number,signal:AbortSignal){return new Promise<void>(resolve=>{const done=()=>{clearTimeout(timer);signal.removeEventListener('abort',done);resolve()};const timer=setTimeout(done,ms);signal.addEventListener('abort',done,{once:true});if(signal.aborted)done()})}
function tween(from:number,to:number,duration:number,ease:(t:number)=>number,update:(v:number)=>void,signal:AbortSignal){
 return new Promise<void>(resolve=>{let frame=0,start:number|undefined;const finish=()=>{cancelAnimationFrame(frame);signal.removeEventListener('abort',finish);resolve()};const tick=(time:number)=>{if(signal.aborted){finish();return}start??=time;const t=Math.min((time-start)/duration,1);update(from+(to-from)*ease(t));if(t<1)frame=requestAnimationFrame(tick);else finish()};signal.addEventListener('abort',finish,{once:true});if(signal.aborted)finish();else frame=requestAnimationFrame(tick)});
}

export default function IntroPreloader(){
 const pathname=usePathname();
 const [active,setActive]=useState(()=>pathname==='/');
 const [phase,setPhase]=useState<Phase>('count');
 const [progress,setProgress]=useState(0);
 const [expansion,setExpansion]=useState(0);
 const [geometry,setGeometry]=useState<Geometry|null>(null);
 const [reduced,setReduced]=useState(false);
 const portrait=useRef<HTMLImageElement>(null);
 const phaseRef=useRef<Phase>('count');
 useLayoutEffect(()=>{
  if(!active)return;
  const controller=new AbortController();const {signal}=controller;
  const root=document.documentElement,body=document.body;
  const content=document.querySelector<HTMLElement>('[data-portfolio-content]');
  const previous={rootOverflow:root.style.overflow,bodyOverflow:body.style.overflow,restoration:history.scrollRestoration,inert:content?.inert??false};
  const desktop=window.matchMedia('(min-width:768px)').matches;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const g={vw:window.innerWidth,vh:window.innerHeight,boxW:desktop?200:144,boxH:desktop?260:188,gutter:desktop?12:8,radius:desktop?48:40};
  setGeometry(g);setReduced(reduce);
  root.dataset.introState='loading';root.style.overflow='hidden';body.style.overflow='hidden';history.scrollRestoration='manual';window.scrollTo(0,0);if(content)content.inert=true;
  const initialHash=window.location.hash,initialPath=window.location.pathname;
  let unlocked=false;
  const unlock=(restoreHash=true)=>{if(unlocked)return;unlocked=true;root.style.overflow=previous.rootOverflow;body.style.overflow=previous.bodyOverflow;history.scrollRestoration=previous.restoration;if(content)content.inert=previous.inert;root.dataset.introState='ready';window.dispatchEvent(new Event('portfolio:intro-complete'));if(restoreHash&&initialHash&&window.location.pathname===initialPath&&window.location.hash===initialHash){let id=initialHash.slice(1);try{id=decodeURIComponent(id)}catch{}const target=document.getElementById(id);if(target)window.scrollTo({top:Math.max(0,target.getBoundingClientRect().top+window.scrollY-80),behavior:'instant'})}};
  const change=(p:Phase)=>{phaseRef.current=p;setPhase(p)};
  const imageReady=new Promise<void>(resolve=>{const image=new Image();const done=()=>{image.onload=null;image.onerror=null;signal.removeEventListener('abort',done);resolve()};image.onload=done;image.onerror=done;signal.addEventListener('abort',done,{once:true});image.src='/images/shourya-hero.png';if(image.complete)done()});
  const ready=Promise.race([Promise.all([imageReady,document.fonts?.ready??Promise.resolve()]),wait(2500,signal)]);
  const exit=async()=>{if(signal.aborted)return;change('exit');await wait(reduce?0:200,signal);if(signal.aborted)return;unlock();await wait(reduce?200:700,signal);if(signal.aborted)return;setActive(false)};
  void(async()=>{
   if(reduce){setProgress(100);setExpansion(1);change('expand');await Promise.race([ready,wait(450,signal)]);if(!signal.aborted)await exit();return}
   await Promise.all([tween(0,90,1000,easeOut,setProgress,signal),ready]);if(signal.aborted)return;
   await tween(90,100,300,revealEase,setProgress,signal);await wait(150,signal);if(signal.aborted)return;
   change('expand');await tween(0,1,950,expandEase,setExpansion,signal);if(signal.aborted)return;
   change('text');await wait(1150,signal);await exit();
  })();
  return()=>{controller.abort();unlock(false)};
  // The reference runs the intro only on a document's initial home-page mount.
  // eslint-disable-next-line react-hooks/exhaustive-deps
 },[]);
 if(!active)return null;
 const g=geometry;
 const e=expansion;
 const frameStyle=g?{left:(g.vw-g.boxW)/2+e*(g.gutter-(g.vw-g.boxW)/2),top:(g.vh-g.boxH)/2+e*(g.gutter-(g.vh-g.boxH)/2),width:g.boxW+e*(g.vw-2*g.gutter-g.boxW),height:g.boxH+e*(g.vh-2*g.gutter-g.boxH),borderRadius:16+e*(g.radius-16)}:undefined;
 return <div className={`ref-intro ref-intro-${phase} ${reduced?'ref-intro-reduced':''}`} role="status" aria-label="Loading portfolio" aria-busy={phase!=='exit'} data-intro-phase={phase}>
  {g&&<>
   <div className="ref-intro-guides" aria-hidden="true" style={{opacity:phase==='count'?1:0}}>
    {[0,1].map((n)=><span key={'h'+n} className="ref-intro-guide-horizontal" style={{top:(g.vh+(n===0?-g.boxH:g.boxH))/2,animationDelay:`${n*.06}s`}}/>)}
    {[0,1].map((n)=><span key={'v'+n} className="ref-intro-guide-vertical" style={{left:(g.vw+(n===0?-g.boxW:g.boxW))/2,animationDelay:`${.12+n*.06}s`}}/>)}
   </div>
   <div className="ref-intro-frame" style={frameStyle} aria-hidden="true">
    <div className="ref-intro-image-reveal" style={{clipPath:`inset(${100-progress}% 0% 0% 0%)`}}>
     <img ref={portrait} className="ref-intro-count-portrait" src="/images/shourya-hero.png" alt="" fetchPriority="high" style={{opacity:Math.max(0,1-e*1.7),transform:`scale(${1.12-.12*e})`}}/>
     <div className="ref-intro-final-portrait" style={{opacity:Math.min(1,e*1.7)}}><img className="ref-hero-image" src="/images/shourya-hero.png" alt=""/></div>
     <div className={`ref-intro-image-shades ${phase==='text'||phase==='exit'||reduced?'is-visible':''}`}><div className="ref-hero-mobile-shade absolute inset-0 md:hidden"/><div className="absolute inset-0 hidden bg-gradient-to-r from-surface/35 via-surface/10 to-transparent md:block"/><div className="absolute inset-0 hidden bg-gradient-to-t from-surface/25 via-transparent to-transparent md:block"/></div>
    </div>
    {!reduced&&<div className={`ref-intro-copy ${phase==='text'||phase==='exit'?'is-visible':''}`}><p className="type-display text-surface-foreground">{['Shourya','Bafna'].map((word,i)=><span key={word} className="ref-intro-word-mask"><span style={{transitionDelay:`${i*.12}s`}}>{word}</span></span>)}</p><p className="ref-intro-headline">I build practical AI and full-stack applications—from visual workflows to retrieval-augmented systems.</p></div>}
   </div>
  </>}
  <div className={`ref-intro-progress-ui ${phase==='count'&&!reduced?'is-visible':''}`}><span className="ref-intro-brand">Shourya</span><div className="ref-intro-progress-row"><span className="ref-intro-status">Building...</span><span className="ref-intro-percentage" aria-hidden="true">{Math.round(progress)}%</span></div></div>
 </div>;
}
