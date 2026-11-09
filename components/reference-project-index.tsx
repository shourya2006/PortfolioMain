'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { projects } from '@/lib/projects';
import ReferenceHeader, { ArrowUpRight } from '@/components/reference-header';
import ReferenceFooter from '@/components/reference-footer';
import RollingText from '@/components/rolling-text';

export default function ReferenceProjectIndex({research=false}:{research?:boolean}) {
 const filters=research?['All','AI/ML']:['All','AI systems','Web apps','Applied ML'];
 const [active,setActive]=useState('All'),[mobileOpen,setMobileOpen]=useState(false),[sheetVisible,setSheetVisible]=useState(false),[sheetClosing,setSheetClosing]=useState(false);
 const trigger=useRef<HTMLButtonElement>(null),sheet=useRef<HTMLDivElement>(null),closeTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const sheetTitle=useId();
 useEffect(()=>{
  const sync=()=>{const tag=new URLSearchParams(window.location.search).get('tag')||'All';setActive(filters.includes(tag)?tag:'All')};sync();window.addEventListener('popstate',sync);return()=>window.removeEventListener('popstate',sync);
 },[research]);
 useEffect(()=>()=>{if(closeTimer.current)clearTimeout(closeTimer.current)},[]);
 const closeSheet=useCallback(()=>{
  setMobileOpen(false);setSheetClosing(true);if(closeTimer.current)clearTimeout(closeTimer.current);
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  closeTimer.current=setTimeout(()=>{setSheetVisible(false);setSheetClosing(false);trigger.current?.focus({preventScroll:true})},reduced?0:250);
 },[]);
 const openSheet=()=>{if(closeTimer.current)clearTimeout(closeTimer.current);setSheetClosing(false);setSheetVisible(true);setMobileOpen(true)};
 useEffect(()=>{
  if(!sheetVisible)return;
  const previous=document.body.style.overflow;document.body.style.overflow='hidden';
  const key=(event:KeyboardEvent)=>{
   if(event.key==='Escape'){event.preventDefault();closeSheet()}
   if(event.key==='Tab'){
    const controls=Array.from(sheet.current?.querySelectorAll<HTMLButtonElement>('button')||[]);const first=controls[0],last=controls[controls.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}
   }
  };
  const focus=setTimeout(()=>sheet.current?.querySelector<HTMLButtonElement>('button')?.focus({preventScroll:true}),0);
  const resize=()=>{if(window.innerWidth>=768)closeSheet()};document.addEventListener('keydown',key);window.addEventListener('resize',resize);
  return()=>{clearTimeout(focus);document.body.style.overflow=previous;document.removeEventListener('keydown',key);window.removeEventListener('resize',resize)};
 },[sheetVisible,closeSheet]);
 const entries=research?projects.filter(p=>p.category==='Applied ML'):projects;
 const filtered=entries.filter(p=>active==='All'||active==='AI/ML'||p.category===active);
 const choose=(tag:string)=>{setActive(tag);if(sheetVisible)closeSheet();const url=new URL(window.location.href);if(tag==='All')url.searchParams.delete('tag');else url.searchParams.set('tag',tag);window.history.pushState(window.history.state,'',url.pathname+url.search)};
 const count=(tag:string)=>tag==='All'||tag==='AI/ML'?entries.length:entries.filter(p=>p.category===tag).length;
 const noun=research?(filtered.length===1?'study':'studies'):(filtered.length===1?'project':'projects');
 return <div className="min-h-screen w-full"><ReferenceHeader/><main className="min-h-screen bg-background text-white ref-index-main" data-header-theme="dark"><div className="section-gutter section-y"><div className="content-max">
  <header className="mb-8 max-w-2xl md:mb-10"><span className="section-label mb-4">{research?'Research':'Portfolio'}</span><h1 className="type-section mb-4">{research?'Experiments in ML, data, and methods.':'AI systems and personal builds that shipped.'}</h1><p className="type-body-lg text-white/55 ref-route-intro">{research?'Applied machine learning — features, baselines, and what the evaluation proved.':'AI platforms, full-stack web apps, and applied machine learning — designed, built, and shipped.'}</p></header>
  <div className="hidden border-y border-white/15 py-5 md:block md:py-6"><div className="flex items-start justify-between gap-8"><div className="flex min-w-0 flex-1 flex-wrap gap-x-5 gap-y-3">{filters.map(tag=><button type="button" key={tag} onClick={()=>choose(tag)} aria-pressed={active===tag} className={`relative pb-1 font-sans text-sm tracking-[-0.01em] transition-colors ${active===tag?'text-white':'text-white/40 hover:text-white/70'}`}>{tag}<span className={`ml-1.5 font-mono text-[11px] tabular-nums ${active===tag?'text-white/45':'text-white/25'}`}>{count(tag)}</span>{active===tag&&<span aria-hidden="true" className="absolute inset-x-0 -bottom-px h-px bg-white/70"/>}</button>)}</div><p className="shrink-0 pt-0.5 font-mono text-[11px] tabular-nums tracking-[0.06em] text-white/35" aria-live="polite">{filtered.length} {noun}</p></div></div>
  <div className="md:hidden"><button ref={trigger} type="button" onClick={openSheet} aria-label="Select project category" aria-expanded={mobileOpen} aria-haspopup="dialog" className="flex w-full items-center justify-between rounded-[var(--radius-xl)] border border-white/20 bg-white/[0.04] px-4 py-3.5 transition-colors hover:border-white/35 hover:bg-white/[0.06]"><span className="type-body-sm text-white/85">{active}</span><span className="inline-flex items-center gap-2 text-white/40"><span className="font-mono text-[11px] tabular-nums">{filtered.length} {noun}</span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span></button></div>
  {sheetVisible&&<div className="md:hidden"><div className={`ref-category-backdrop ${sheetClosing?'is-closing':''}`} aria-hidden="true" onClick={closeSheet}/><div ref={sheet} role="dialog" aria-modal="true" aria-labelledby={sheetTitle} className={`ref-category-sheet ${sheetClosing?'is-closing':''}`}><div className="ref-category-sheet-header"><h3 id={sheetTitle}>Select category</h3><button type="button" className="ref-category-close" aria-label="Close categories" onClick={closeSheet}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg></button></div><div className="ref-category-options">{filters.map(tag=><button type="button" className="ref-category-option" key={tag} aria-pressed={active===tag} onClick={()=>choose(tag)}><span>{tag}</span><span className="font-mono text-[11px] text-white/45">{count(tag)}</span></button>)}</div></div></div>}
  <div className="mt-8 grid grid-cols-1 gap-5 md:mt-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3">{filtered.map(project=><Link key={project.slug} href={`/work/${project.slug}`} className="ref-index-card group flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] border border-white/20 bg-white/[0.05] transition-colors duration-300 hover:border-white/35 hover:bg-white/[0.07]">{!research&&<div className="relative mx-3 mt-3 overflow-hidden rounded-[calc(var(--radius-xl)-0.35rem)] border border-white/10 bg-black/50 md:mx-4 md:mt-4"><div className="relative aspect-[16/10]" style={{overflow:'hidden'}}>{project.image?<img className="ref-project-image" src={project.image} alt={`${project.title} preview`} loading="lazy"/>:<div className="flex h-full flex-col justify-end gap-3 p-5"><span className="type-heading text-2xl text-white/80">{project.title}</span><span className="font-mono text-[11px] text-white/40">{project.stack.slice(0,4).join(' · ')}</span></div>}</div></div>}<div className="flex flex-1 flex-col gap-3 border-t border-white/10 px-5 py-5 md:px-6 md:py-6"><div className="flex items-center justify-between gap-3"><span className="type-caption font-mono normal-case tracking-[0.08em] text-white/45">{research?'AI/ML':project.category} · {project.date}</span><ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-white/35 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/80"/></div><h2 className="type-heading text-lg leading-snug md:text-xl">{project.title}</h2><p className="type-body-sm line-clamp-3 flex-1 text-white/50">{project.description}</p></div></Link>)}</div>
 </div></div>{!research&&<section className="section-gutter section-y-sm"><div className="content-max"><span className="section-label mb-4">Open source</span><h2 className="type-section mb-4">See me on open source.</h2><p className="type-body-lg mb-6 max-w-2xl text-white/55">More of what I build lives in public — code, experiments, and projects on GitHub.</p><a href="https://github.com/shourya2006" target="_blank" rel="noreferrer" data-roll-trigger className="btn-pill-primary inline-flex gap-2 text-sm"><RollingText>Follow on GitHub</RollingText><ArrowUpRight/></a></div></section>}</main><ReferenceFooter/></div>;
}
