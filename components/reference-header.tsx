'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export function ArrowUpRight({className='h-3.5 w-3.5'}:{className?:string}) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>;
}

const navigation=[{label:'Portfolio',href:'/portfolio'},{label:'Research',href:'/research'},{label:'Experience',href:'/#experience'},{label:'Resume',href:'/resume'},{label:'Contact',href:'/contact'}];

export default function ReferenceHeader({theme='dark',embedded=false}:{theme?:'light'|'dark';embedded?:boolean}) {
  const [open,setOpen]=useState(false);
  useEffect(()=>{ if (!open) return; const previousOverflow=document.body.style.overflow; document.body.style.overflow='hidden'; const handle=(event:KeyboardEvent)=>{if(event.key==='Escape')setOpen(false)}; document.addEventListener('keydown',handle); return()=>{document.removeEventListener('keydown',handle);document.body.style.overflow=previousOverflow;}; },[open]);
  const ink=theme==='light'?'text-surface-foreground':'text-foreground';
  const navInk=theme==='light'?'text-surface-foreground/85':'text-foreground/85';
  return <header data-site-header="true" className={`site-header ${embedded?'relative z-20 w-full':'fixed inset-x-0 top-0 z-40'}`}>
    <div className={embedded?'':'section-gutter'} style={!embedded?{background:'#000'}:undefined}>
      <div className={`flex h-14 items-center justify-between md:h-16 ${embedded?'':'content-max'}`}>
        <Link href="/" aria-label="Shourya home" className="relative z-50"><span style={open?{color:'#1d1f20'}:undefined} className={`text-base font-semibold tracking-tight transition-colors duration-300 md:text-lg ${ink}`}>Shourya</span></Link>
        <nav aria-label="Primary navigation" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">{navigation.map(item=><Link key={item.href} href={item.href} className={`relative text-sm font-semibold transition-opacity hover:opacity-70 ${navInk}`}>{item.label}</Link>)}</nav>
        <Link href="/contact" className={`relative z-50 hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 lg:inline-flex ${theme==='light'?'bg-surface-foreground text-surface hover:bg-surface-foreground/90':'bg-primary text-primary-foreground hover:bg-primary/90'}`}><span className="font-semibold">Let&apos;s talk</span><ArrowUpRight/></Link>
        <button type="button" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} aria-controls="reference-mobile-nav" onClick={()=>setOpen(!open)} className="relative z-50 h-10 w-[100px] cursor-pointer overflow-hidden rounded-full bg-primary text-primary-foreground lg:hidden"><span className="font-semibold">{open?'Close':'Menu'}</span></button>
      </div>
    </div>
    {open&&<div id="reference-mobile-nav" style={{position:'fixed',inset:0,zIndex:45,background:'#ededed',color:'#1d1f20',padding:'104px 24px 40px',display:'flex',flexDirection:'column',justifyContent:'space-between'}} className="lg:hidden"><nav aria-label="Mobile navigation" style={{display:'flex',flexDirection:'column',gap:22}}>{navigation.map((item,index)=><Link onClick={()=>setOpen(false)} href={item.href} key={item.href} style={{display:'flex',gap:18,alignItems:'baseline',fontSize:'clamp(32px,8vw,52px)',fontWeight:600,letterSpacing:'-.04em'}}><span style={{fontFamily:'monospace',fontSize:12,opacity:.45}}>0{index+1}</span>{item.label}</Link>)}</nav><div style={{display:'flex',gap:24,fontSize:14}}><a href="https://github.com/shourya2006" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/shourya-bafna-80a670215/" target="_blank" rel="noreferrer">LinkedIn ↗</a><Link href="/resume" onClick={()=>setOpen(false)}>Resume ↗</Link></div></div>}
  </header>;
}
