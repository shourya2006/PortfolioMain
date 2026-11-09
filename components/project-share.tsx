'use client';

import {useEffect,useRef,useState} from 'react';

type CopyLinkProps={url?:string;label?:string;iconOnly?:boolean;className?:string};
function CopyIcon(){return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg>}
function CheckIcon(){return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>}

export function CopyLink({url,label='Copy link',iconOnly=false,className=''}:CopyLinkProps){
 const [status,setStatus]=useState<'idle'|'copied'|'failed'>('idle'),[fallback,setFallback]=useState('');
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null),input=useRef<HTMLInputElement>(null);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current)},[]);
 const copy=async()=>{
  const value=url||window.location.href;
  if(timer.current)clearTimeout(timer.current);
  try{
   if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');
   await navigator.clipboard.writeText(value);setStatus('copied');setFallback('');
   timer.current=setTimeout(()=>setStatus('idle'),2000);
  }catch{setStatus('failed');setFallback(value)}
 };
 const accessibleLabel=status==='copied'?'Link copied':status==='failed'?'Try copying the link again':label;
 return <div className={`ref-copy-wrap ${className}`}>
  <button type="button" className={`ref-copy-button ${iconOnly?'ref-copy-icon-only':''}`} onClick={copy} aria-label={accessibleLabel} data-copy-state={status} title={iconOnly?accessibleLabel:undefined}>
   <span className="ref-copy-symbol"><span className="ref-copy-normal"><CopyIcon/></span><span className="ref-copy-success"><CheckIcon/></span></span>
   {!iconOnly&&<span>{status==='copied'?'Copied':status==='failed'?'Try again':label}</span>}
  </button>
  <span className="ref-copy-announcement" aria-live="polite" role="status">{status==='copied'?'Link copied to clipboard.':status==='failed'?'Could not access the clipboard. Select the link below to copy it manually.':''}</span>
  {status==='failed'&&<input ref={input} className="ref-copy-fallback" aria-label="Link to copy manually" value={fallback} readOnly onFocus={event=>event.currentTarget.select()}/>}
 </div>;
}
export default function ProjectShare({url}:{url?:string}){return <div className="ref-project-share"><span className="font-mono text-xs text-muted-foreground">Share</span><CopyLink url={url} label="Copy project link" iconOnly/></div>}
