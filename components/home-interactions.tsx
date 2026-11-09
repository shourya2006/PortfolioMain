'use client';
import {useEffect, useState} from 'react';
import ReferenceHeader from './reference-header';
export default function HomeInteractions(){
 const [sticky,setSticky]=useState(false);
 useEffect(()=>{
  const hero=document.querySelector('.hero-section');
  const watch=()=>setSticky(!!hero&&hero.getBoundingClientRect().bottom<80);
  window.addEventListener('scroll',watch,{passive:true});watch();
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('ref-in-view');observer.unobserve(e.target)}}),{threshold:.08});
  document.querySelectorAll('[data-ref-reveal]').forEach(el=>{if(!reduced){el.classList.add('ref-will-reveal');observer.observe(el)}});
  const glows=document.querySelectorAll<HTMLElement>('[data-glow-card]');
  const track=(e:PointerEvent)=>{const el=e.currentTarget as HTMLElement;const r=el.getBoundingClientRect();el.style.setProperty('--x',`${e.clientX-r.left}px`);el.style.setProperty('--y',`${e.clientY-r.top}px`)};
  glows.forEach(el=>el.addEventListener('pointermove',track));
  return()=>{window.removeEventListener('scroll',watch);observer.disconnect();glows.forEach(el=>el.removeEventListener('pointermove',track))};
 },[]);
 return <div className={`ref-sticky-header ${sticky?'ref-sticky-visible':''}`} aria-hidden={!sticky}>{sticky&&<ReferenceHeader/>}</div>;
}
