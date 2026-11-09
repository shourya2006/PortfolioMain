'use client';

import {useCallback,useEffect,useRef,useState,type KeyboardEvent} from 'react';

type ProjectGalleryProps={title:string;src:string;alt:string};

function Arrow({direction}:{direction:'left'|'right'}){
 return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={direction==='left'?'m12 19-7-7 7-7':'m12 5 7 7-7 7'}/><path d={direction==='left'?'M19 12H5':'M5 12h14'}/></svg>;
}
function Maximize(){return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>}

export default function ProjectGallery({title,src,alt}:ProjectGalleryProps){
 const [open,setOpen]=useState(false),[closing,setClosing]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null),closeButton=useRef<HTMLButtonElement>(null),opener=useRef<HTMLElement|null>(null),timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const show=(element:HTMLElement)=>{if(timer.current)clearTimeout(timer.current);opener.current=element;setClosing(false);setOpen(true)};
 const close=useCallback(()=>{
  if(timer.current)clearTimeout(timer.current);
  setClosing(true);
  const duration=window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:220;
  timer.current=setTimeout(()=>{setOpen(false);setClosing(false)},duration);
 },[]);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current)},[]);
 useEffect(()=>{
  if(!open)return;
  const el=dialog.current;if(!el)return;
  const previousRootOverflow=document.documentElement.style.overflow,previousBodyOverflow=document.body.style.overflow;
  document.documentElement.style.overflow='hidden';document.body.style.overflow='hidden';
  if(!el.open)el.showModal();
  closeButton.current?.focus({preventScroll:true});
  return()=>{
   if(el.open)el.close();
   document.documentElement.style.overflow=previousRootOverflow;document.body.style.overflow=previousBodyOverflow;
   if(opener.current?.isConnected)opener.current.focus({preventScroll:true});
  };
 },[open]);
 const trapFocus=(event:KeyboardEvent<HTMLDialogElement>)=>{
  if(event.key==='Tab'){
   const nodes=dialog.current?.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled]),[tabindex="0"]');
   if(!nodes?.length)return;
   const first=nodes[0],last=nodes[nodes.length-1];
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  }
 };
 return <section className="ref-project-gallery" aria-label={`${title} screens`}>
  <div className="ref-case-visual">
   <button type="button" className="ref-gallery-preview" aria-label="Open screen 1 of 1 full screen" onClick={event=>show(event.currentTarget)}>
    <img src={src} alt={alt}/><span className="ref-gallery-preview-hint"><Maximize/>View full screen</span>
   </button>
  </div>
  <div className="ref-gallery-toolbar">
   <p className="ref-gallery-count" aria-label="Screen 1 of 1">01 <span>/ 01</span></p>
   <div className="ref-gallery-toolbar-buttons">
    <button type="button" className="ref-gallery-control" disabled aria-label="Previous screen"><Arrow direction="left"/></button>
    <button type="button" className="ref-gallery-control" disabled aria-label="Next screen"><Arrow direction="right"/></button>
    <button type="button" className="ref-gallery-control" aria-label="View screens full screen" onClick={event=>show(event.currentTarget)}><Maximize/></button>
   </div>
  </div>
  <dialog ref={dialog} aria-label={`${title} screens`} className={`ref-gallery-dialog ${closing?'is-closing':''}`} onCancel={event=>{event.preventDefault();close()}} onClose={()=>setOpen(false)} onKeyDown={trapFocus} onClick={event=>{if(event.target===event.currentTarget)close()}}>
   <div className="ref-gallery-dialog-shell">
    <header className="ref-gallery-dialog-header"><div><p>{title}</p><span>01 / 01</span></div><button type="button" ref={closeButton} className="ref-gallery-control ref-gallery-close" aria-label="Close gallery" onClick={close}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m18 6-12 12M6 6l12 12"/></svg></button></header>
    <div className="ref-gallery-dialog-stage" onClick={event=>{if(event.target===event.currentTarget)close()}}>
     <img src={src} alt={alt}/>
     <button type="button" className="ref-gallery-control ref-gallery-prev" disabled aria-label="Previous screen"><Arrow direction="left"/></button>
     <button type="button" className="ref-gallery-control ref-gallery-next" disabled aria-label="Next screen"><Arrow direction="right"/></button>
    </div>
    <p className="ref-gallery-caption">{alt}</p>
   </div>
  </dialog>
 </section>;
}
