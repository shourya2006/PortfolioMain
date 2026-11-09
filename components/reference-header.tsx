'use client';

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import RollingText from './rolling-text';

export function ArrowUpRight({className='h-3.5 w-3.5'}:{className?:string}) {
 return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>;
}
const navigation=[{label:'Portfolio',href:'/portfolio'},{label:'Research',href:'/research'},{label:'Experience',href:'/#experience'},{label:'Resume',href:'/resume'},{label:'Contact',href:'/contact'}];
const social=[{label:'GitHub',href:'https://github.com/shourya2006'},{label:'LinkedIn',href:'https://www.linkedin.com/in/shourya-bafna-80a670215/'},{label:'Codeforces',href:'https://codeforces.com/profile/Kraven'},{label:'LeetCode',href:'https://leetcode.com/u/ShouryaW/'},{label:'CodeChef',href:'https://www.codechef.com/users/algo_x_addict'},{label:'Résumé',href:'/resume'}];

export default function ReferenceHeader({theme='dark',embedded=false}:{theme?:'light'|'dark';embedded?:boolean}) {
 const [open,setOpen]=useState(false),[visible,setVisible]=useState(false),[closing,setClosing]=useState(false);
 const toggle=useRef<HTMLButtonElement>(null),panel=useRef<HTMLDivElement>(null),closeTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const pathname=usePathname();const navId=useId();
 const close=useCallback(()=>{
  setOpen(false);setClosing(true);
  if(closeTimer.current)clearTimeout(closeTimer.current);
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  closeTimer.current=setTimeout(()=>{setVisible(false);setClosing(false);toggle.current?.focus({preventScroll:true})},reduced?0:300);
 },[]);
 const activate=()=>{
  if(open){close();return}
  if(closeTimer.current)clearTimeout(closeTimer.current);
  setClosing(false);setVisible(true);setOpen(true);
 };
 useEffect(()=>()=>{if(closeTimer.current)clearTimeout(closeTimer.current)},[]);
 useEffect(()=>{setOpen(false);setVisible(false);setClosing(false)},[pathname]);
 useEffect(()=>{
  if(!visible)return;
  const previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
  const handle=(event:KeyboardEvent)=>{
   if(event.key==='Escape'){event.preventDefault();close();return}
   if(event.key==='Tab'){
    const candidates=[toggle.current,...Array.from(panel.current?.querySelectorAll<HTMLAnchorElement>('a[href]')||[])].filter((el):el is HTMLButtonElement|HTMLAnchorElement=>!!el);
    const first=candidates[0],last=candidates[candidates.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}
   }
  };
  const resize=()=>{if(window.innerWidth>=1024){setOpen(false);setVisible(false);setClosing(false)}};
  document.addEventListener('keydown',handle);window.addEventListener('resize',resize);
  return()=>{document.removeEventListener('keydown',handle);window.removeEventListener('resize',resize);document.body.style.overflow=previousOverflow};
 },[visible,close]);
 const ink=theme==='light'?'text-surface-foreground':'text-foreground';
 const navInk=theme==='light'?'text-surface-foreground/85':'text-foreground/85';
 return <header data-site-header="true" className={`site-header ${embedded?'relative z-20 w-full':'fixed inset-x-0 top-0 z-40'} ${visible?'ref-header-menu-active':''}`}>
  <div className={embedded?'':'section-gutter'} style={!embedded?{background:'#000'}:undefined}><div className={`flex h-14 items-center justify-between md:h-16 ${embedded?'':'content-max'}`}>
   <Link href="/" aria-label="Shourya home" className="ref-header-brand relative z-50"><span style={visible?{color:'#1d1f20'}:undefined} className={`text-base font-semibold tracking-tight transition-colors duration-300 md:text-lg ${ink}`}>Shourya</span></Link>
   <nav aria-label="Primary navigation" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">{navigation.map(item=><Link key={item.href} href={item.href} aria-current={pathname===item.href?'page':undefined} className={`relative text-sm font-semibold transition-opacity hover:opacity-70 ${navInk}`}>{item.label}</Link>)}</nav>
   <Link href="/contact" data-roll-trigger className={`relative z-50 hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 lg:inline-flex ${theme==='light'?'bg-surface-foreground text-surface hover:bg-surface-foreground/90':'bg-primary text-primary-foreground hover:bg-primary/90'}`}><RollingText className="font-semibold">Let&apos;s talk</RollingText><ArrowUpRight/></Link>
   <button ref={toggle} type="button" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} aria-controls={navId} onClick={activate} data-roll-trigger className={`ref-menu-toggle relative z-50 h-10 w-[100px] cursor-pointer overflow-hidden rounded-full lg:hidden ${open?'is-open':''}`}><span className="ref-menu-toggle-track"><span className="ref-menu-toggle-label bg-primary text-primary-foreground"><RollingText className="font-semibold">Menu</RollingText></span><span className="ref-menu-toggle-label bg-background text-foreground"><RollingText className="font-semibold">Close</RollingText></span></span></button>
  </div></div>
  {visible&&<div ref={panel} id={navId} aria-label="Navigation menu" className={`ref-mobile-menu lg:hidden ${closing?'is-closing':''}`}><nav aria-label="Mobile navigation" className="ref-mobile-menu-inner"><div className="ref-mobile-links">{navigation.map((item,index)=><div key={item.href} className="ref-mobile-link-mask"><Link onClick={close} href={item.href} className="ref-mobile-link" style={{'--menu-index':index} as CSSProperties}><span className="ref-mobile-link-arrow"><ArrowUpRight className="h-5 w-5"/></span><span className="ref-mobile-link-label">{item.label}</span></Link></div>)}</div><div className="ref-mobile-socials">{social.map((item,index)=><a href={item.href} key={item.href} onClick={close} target={item.href.startsWith('https')?'_blank':undefined} rel={item.href.startsWith('https')?'noreferrer':undefined} style={{'--menu-index':index} as CSSProperties} data-roll-trigger><RollingText>{item.label}</RollingText></a>)}</div></nav></div>}
 </header>;
}
