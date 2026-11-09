'use client';
import {useCallback,useEffect,useId,useRef,useState,type ReactNode} from 'react';
import {projects,type Project} from '@/lib/projects';
import ProjectDetail from '@/components/project-detail';

/** Opens any same-site /work/<slug> link in a pop-up. The full page still serves new tabs, shared links and no-JS visits. */
export default function ProjectModalProvider({children}:{children:ReactNode}){
 const [project,setProject]=useState<Project|null>(null),[closing,setClosing]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null),opener=useRef<HTMLElement|null>(null),timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const id=useId();
 const close=useCallback(()=>{
  setClosing(true);if(timer.current)clearTimeout(timer.current);
  timer.current=setTimeout(()=>{setProject(null);setClosing(false)},window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:220);
 },[]);
 useEffect(()=>{
  const click=(event:MouseEvent)=>{
   if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   const link=event.target instanceof Element?event.target.closest<HTMLAnchorElement>('a[href]'):null;
   if(!link||link.target==='_blank'||link.hasAttribute('download'))return;
   const url=new URL(link.href,window.location.href);
   const match=url.origin===window.location.origin&&url.pathname.match(/^\/work\/([^/]+)\/?$/);
   const next=match&&projects.find(p=>p.slug===match[1]);
   if(!next)return;
   event.preventDefault();
   if(!dialog.current?.open)opener.current=link;
   if(timer.current)clearTimeout(timer.current);setClosing(false);setProject(next);
   dialog.current?.scrollTo({top:0});
  };
  document.addEventListener('click',click,true);return()=>document.removeEventListener('click',click,true);
 },[]);
 const isOpen=project!==null;
 useEffect(()=>{
  if(!isOpen)return;const el=dialog.current;if(!el)return;
  document.documentElement.classList.add('ref-contact-open');document.body.classList.add('ref-contact-open');
  el.showModal();
  return()=>{if(el.open)el.close();document.documentElement.classList.remove('ref-contact-open');document.body.classList.remove('ref-contact-open');if(opener.current?.isConnected)opener.current.focus({preventScroll:true})};
 },[isOpen]);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current)},[]);
 return <>{children}{project&&<dialog ref={dialog} className={`ref-contact-dialog ref-project-dialog ${closing?'is-closing':''}`} aria-labelledby={`${id}-title`} onCancel={event=>{event.preventDefault();close()}} onClose={()=>setProject(null)} onClick={event=>{if(event.target===event.currentTarget)close()}}>
  <div className="ref-contact-dialog-inner ref-case">
   <button type="button" className="ref-contact-close" onClick={close} aria-label={`Close ${project.title}`}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg></button>
   <ProjectDetail p={project} titleId={`${id}-title`} shareUrl={`${window.location.origin}/work/${project.slug}`}/>
  </div>
 </dialog>}</>;
}
