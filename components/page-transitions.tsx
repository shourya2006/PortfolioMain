'use client';
import { useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';

/** Mount entrances mirror the reference's reveals; its source has no global exit wipe. */
export default function PageTransitions({children}:{children:ReactNode}){
 const pathname=usePathname();
 useEffect(()=>{
  if(pathname==='/'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  let cancelled=false;const animations:Animation[]=[];
  let frame=0;
  const enter=()=>{frame=requestAnimationFrame(()=>{
   if(cancelled)return;
   const main=document.querySelector('main');if(!main)return;
   main.querySelectorAll<HTMLElement>('h1, .ref-route-intro').forEach((element,index)=>{
    animations.push(element.animate([{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}],{duration:450,delay:Math.min(index,2)*60,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'}));
   });
  })};
  if(document.documentElement.dataset.introState==='loading')window.addEventListener('portfolio:intro-complete',enter,{once:true});else enter();
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   const element=entry.target as HTMLElement;element.style.removeProperty('opacity');
   animations.push(element.animate([{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,delay:100,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'}));observer.unobserve(element);
  }),{threshold:.12});
  document.querySelectorAll<HTMLElement>('footer [data-ref-reveal]').forEach(element=>{element.style.opacity='0';observer.observe(element)});
  return()=>{cancelled=true;cancelAnimationFrame(frame);window.removeEventListener('portfolio:intro-complete',enter);observer.disconnect();document.querySelectorAll<HTMLElement>('footer [data-ref-reveal]').forEach(element=>element.style.removeProperty('opacity'));animations.forEach(animation=>animation.cancel())};
 },[pathname]);
 return <div data-portfolio-content>{children}</div>;
}
