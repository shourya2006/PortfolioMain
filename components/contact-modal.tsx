'use client';
import {useCallback,useEffect,useId,useRef,useState,type FormEvent,type ReactNode} from 'react';
import {ArrowUpRight} from './reference-header';
import {contactEmail} from '@/lib/utils';

const empty={name:'',email:'',subject:'',message:'',website:''};
type FormValues=typeof empty;
export default function ContactModalProvider({children}:{children:ReactNode}){
 const [open,setOpen]=useState(false),[closing,setClosing]=useState(false),[values,setValues]=useState<FormValues>(empty);
 const [status,setStatus]=useState<'idle'|'sending'|'sent'|'error'>('idle'),[error,setError]=useState('');
 const dialog=useRef<HTMLDialogElement>(null),opener=useRef<HTMLElement|null>(null),firstField=useRef<HTMLInputElement>(null),successTitle=useRef<HTMLHeadingElement>(null);
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null),request=useRef<AbortController|null>(null),requestId=useRef<string|null>(null);
 const id=useId();
 const close=useCallback(()=>{
  setClosing(true);request.current?.abort();
  if(timer.current)clearTimeout(timer.current);
  timer.current=setTimeout(()=>{setOpen(false);setClosing(false)},window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:220);
 },[]);
 const show=useCallback((element:HTMLElement)=>{
  if(timer.current)clearTimeout(timer.current);opener.current=element;setClosing(false);
  if(status==='sent'){setValues(empty);requestId.current=null;}setStatus(status==='sending'?'sending':'idle');
  setError('');setOpen(true);
 },[status]);
 useEffect(()=>{
  const click=(event:MouseEvent)=>{
   if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   const element=event.target instanceof Element?event.target.closest<HTMLElement>('[data-contact-trigger],a[href]'):null;
   if(!element)return;
   let matches=element.hasAttribute('data-contact-trigger');
   if(element instanceof HTMLAnchorElement){
    if(element.target==='_blank'||element.hasAttribute('download'))return;
    const url=new URL(element.href,window.location.href);matches ||= url.origin===window.location.origin&&url.pathname.replace(/\/$/,'')==='/contact';
   }
   if(!matches)return;event.preventDefault();if(!open)show(element);
  };
  document.addEventListener('click',click,true);return()=>document.removeEventListener('click',click,true);
 },[open,show]);
 useEffect(()=>{
  if(!open)return;const el=dialog.current;if(!el)return;
  document.documentElement.classList.add('ref-contact-open');document.body.classList.add('ref-contact-open');
  el.showModal();firstField.current?.focus({preventScroll:true});
  return()=>{if(el.open)el.close();document.documentElement.classList.remove('ref-contact-open');document.body.classList.remove('ref-contact-open');if(opener.current?.isConnected)opener.current.focus({preventScroll:true})};
 },[open]);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);request.current?.abort()},[]);
 useEffect(()=>{if(status==='sent')successTitle.current?.focus({preventScroll:true})},[status]);
 const update=(key:keyof FormValues,value:string)=>{setValues(v=>({...v,[key]:value}));if(status==='error'){setStatus('idle');setError('')}requestId.current=null};
 const submit=async(event:FormEvent<HTMLFormElement>)=>{
  event.preventDefault();if(status==='sending')return;
  if(!event.currentTarget.reportValidity())return;
  setStatus('sending');setError('');request.current?.abort();const controller=new AbortController();request.current=controller;
  requestId.current ||= crypto.randomUUID();
  try{
   const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...values,requestId:requestId.current}),signal:controller.signal});
   let result:{ok?:boolean;error?:string}={};try{result=await response.json()}catch{}
   if(!response.ok||result.ok!==true)throw new Error(result.error||'Your message couldn’t be sent. Please try again.');
   setStatus('sent');
  }catch(e){if(controller.signal.aborted){setStatus('idle');return}setStatus('error');setError(e instanceof Error?e.message:'Your message couldn’t be sent. Please try again.')}
 };
 return <>{children}<dialog ref={dialog} className={`ref-contact-dialog ${closing?'is-closing':''}`} aria-labelledby={`${id}-title`} onCancel={event=>{event.preventDefault();close()}} onClose={()=>setOpen(false)} onClick={event=>{if(event.target===event.currentTarget)close()}} onKeyDown={event=>{
  if(event.key!=='Tab')return;const nodes=Array.from(dialog.current?.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled]):not([tabindex="-1"]),textarea:not([disabled]),a[href]')||[]);const first=nodes[0],last=nodes[nodes.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}
 }}>
  <div className="ref-contact-dialog-inner">
   <button type="button" className="ref-contact-close" onClick={close} aria-label="Close contact form"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg></button>
   {status==='sent'?<div className="ref-contact-success"><span className="ref-contact-success-icon" aria-hidden="true">✓</span><span className="section-label">Message sent</span><h2 ref={successTitle} tabIndex={-1} id={`${id}-title`}>Thanks for<br/><span>reaching out.</span></h2><p>Your message is on its way to my inbox. I’ll reply to <strong>{values.email}</strong>.</p><button type="button" className="btn-pill-primary" onClick={close}>Back to exploring <ArrowUpRight/></button></div>:<>
    <span className="section-label">Contact</span><h2 className="ref-contact-title" id={`${id}-title`}>Let’s <span>talk.</span></h2><p className="ref-contact-intro">Have a project, a question, or a good problem? Send me a message.</p>
    <form onSubmit={submit} className="ref-contact-form">
     <fieldset disabled={status==='sending'}><div className="ref-contact-field-grid"><label htmlFor={`${id}-name`}>Your name<input ref={firstField} id={`${id}-name`} name="name" autoComplete="name" value={values.name} onChange={e=>update('name',e.target.value)} placeholder="What should I call you?" required minLength={2} maxLength={100}/></label><label htmlFor={`${id}-email`}>Email address<input id={`${id}-email`} name="email" type="email" autoComplete="email" value={values.email} onChange={e=>update('email',e.target.value)} placeholder="you@example.com" required maxLength={254}/></label></div><label htmlFor={`${id}-subject`}>What’s on your mind?<input id={`${id}-subject`} name="subject" value={values.subject} onChange={e=>update('subject',e.target.value)} placeholder="A project, an opportunity, a conversation…" required maxLength={160}/></label><label htmlFor={`${id}-message`}>Your message<textarea id={`${id}-message`} name="message" value={values.message} onChange={e=>update('message',e.target.value)} placeholder="Tell me a little about it." rows={4} required minLength={10} maxLength={5000}/></label><div className="ref-contact-message-count" aria-hidden="true">{values.message.length.toLocaleString()} / 5,000</div><div className="ref-contact-honeypot" aria-hidden="true"><label htmlFor={`${id}-website`}>Website<input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={e=>update('website',e.target.value)}/></label></div></fieldset>
     {status==='error'&&<div className="ref-contact-error" role="alert"><p>{error}</p><a href={`mailto:${contactEmail}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(`${values.message}\n\n— ${values.name} (${values.email})`)}`}>Email it to me instead ({contactEmail}) ↗</a> <a href="https://www.linkedin.com/in/shourya-bafna-80a670215/" target="_blank" rel="noreferrer">or reach me on LinkedIn ↗</a></div>}
     <div className="ref-contact-submit-row"><p>Your details are used to reply<br/>to this conversation.</p><button type="submit" className="btn-pill-primary ref-contact-submit" disabled={status==='sending'}>{status==='sending'?<><span className="ref-contact-spinner" aria-hidden="true"/>Sending…</>:<>Send message <ArrowUpRight/></>}</button></div><p className="ref-contact-sending-status" role="status" aria-live="polite">{status==='sending'?'Sending your message…':''}</p>
    </form>
   </>}
  </div>
 </dialog></>;
}
