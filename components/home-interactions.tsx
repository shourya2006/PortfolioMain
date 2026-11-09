'use client';
import { useEffect, useState } from 'react';
import ReferenceHeader from './reference-header';

type ExpandContent = {summary:string; bullets:string[]};
const educationDetails:ExpandContent[]=[
 {summary:'Bachelor of Technology in Computer Science and AI at Newton School of Technology, Rishihood University.',bullets:['2024–2028','CGPA: 8.6 / 10']},
 {summary:'Intermediate (Class XII) at Satyameva Jayete International School.',bullets:['2023–2024','Class XII score: 62.0%']},
 {summary:'Matriculation (Class X) at Sarala Birla Gyan Jyoti.',bullets:['2021–2022','Class X score: 92.0%']},
];
const experienceDetails:ExpandContent[]=[
 {summary:'Full-stack development for a platform helping law students analyze constitutional topics and legal bills using retrieval-augmented generation.',bullets:['Developed end-to-end web features, connecting frontend interfaces with backend services.','Integrated RAG for retrieving constitutional data and legal documents.','Worked with React, Node.js, Express, MongoDB, Pinecone, and APIs.']},
 {summary:'Frontend development for Get Interview Confidence, refining the website’s design, performance, and user experience.',bullets:['Built responsive pages with HTML, CSS, JavaScript, and Next.js.','Collaborated with designers and backend developers on features and user workflows.','Used Git and GitHub for version control and team collaboration.']},
];

export default function HomeInteractions(){
 const [sticky,setSticky]=useState(false);
 useEffect(()=>{
  const cleanups:Array<()=>void>=[];
  const reducedQuery=window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced=reducedQuery.matches;
  const hero=document.querySelector('.hero-section');
  // The source observes the hero with a negative top margin rather than a fixed scroll offset.
  const headerObserver=new IntersectionObserver(([entry])=>setSticky(!entry.isIntersecting),{threshold:0,rootMargin:'-10% 0px 0px 0px'});
  if(hero)headerObserver.observe(hero);
  cleanups.push(()=>headerObserver.disconnect());

  const revealItems=Array.from(document.querySelectorAll<HTMLElement>('[data-ref-reveal]'));
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.add('ref-in-view');revealObserver.unobserve(entry.target)}
  }),{threshold:0.01});
  const wordSpans:HTMLElement[]=[];
  revealItems.forEach((el)=>{
   if(el.matches('h2 span')&&!el.querySelector('.ref-word-motion')){
    el.style.setProperty('--ref-reveal-opacity',getComputedStyle(el).opacity);
    const inner=document.createElement('span');inner.className='ref-word-motion';
    while(el.firstChild)inner.appendChild(el.firstChild);
    el.appendChild(inner);el.classList.add('ref-word-mask');wordSpans.push(el);
    el.style.setProperty('--ref-reveal-delay','.3s');el.style.setProperty('--ref-reveal-duration','.5s');
   }
   if(!reduced){el.classList.add('ref-will-reveal');revealObserver.observe(el)}
  });
  document.querySelectorAll<HTMLElement>('#work > .content-max > .grid > [data-ref-reveal]').forEach((el,index)=>{
   el.style.setProperty('--ref-reveal-delay',`${.06+.08*index}s`);el.style.setProperty('--ref-reveal-duration','.5s');el.style.setProperty('--ref-reveal-y','20px');
  });
  document.querySelectorAll<HTMLElement>('#experience > .content-max > .relative > [data-ref-reveal]').forEach((el,index)=>{
   el.style.setProperty('--ref-reveal-delay',`${.06*index}s`);el.style.setProperty('--ref-reveal-duration','.45s');el.style.setProperty('--ref-reveal-y','16px');
  });
  cleanups.push(()=>{revealObserver.disconnect();revealItems.forEach(el=>el.classList.remove('ref-will-reveal','ref-in-view'));wordSpans.forEach(el=>{const inner=el.querySelector('.ref-word-motion');if(inner){while(inner.firstChild)el.insertBefore(inner.firstChild,inner);inner.remove()}el.classList.remove('ref-word-mask')})});

  const glows=document.querySelectorAll<HTMLElement>('[data-glow-card]');
  const track=(event:PointerEvent)=>{const el=event.currentTarget as HTMLElement;const rect=el.getBoundingClientRect();el.style.setProperty('--x',`${event.clientX-rect.left}px`);el.style.setProperty('--y',`${event.clientY-rect.top}px`)};
  glows.forEach(el=>el.addEventListener('pointermove',track));
  cleanups.push(()=>glows.forEach(el=>el.removeEventListener('pointermove',track)));

  const aboutImage=document.querySelector<HTMLImageElement>('#about img.ref-about-placeholder');
  const portraitLayers:HTMLImageElement[]=[];
  const portraitParent=aboutImage?.parentElement;
  if(aboutImage&&portraitParent){
   aboutImage.classList.add('ref-portrait-default');
   // Education order: B.Tech, Class XII, Class X.
   [{src:'/images/education-btech.webp',position:'60% 40%'},{src:'/images/education-class12.webp',position:'60% 40%'},{src:'/images/education-class10.webp',position:'60% 40%'}].forEach(({src,position},index)=>{
    const image=aboutImage.cloneNode() as HTMLImageElement;image.removeAttribute('srcset');image.removeAttribute('sizes');image.src=src;image.alt='';image.setAttribute('aria-hidden','true');image.removeAttribute('fetchpriority');image.classList.remove('ref-portrait-default');image.classList.add('ref-education-portrait');image.style.objectPosition=position;image.dataset.educationPortrait=String(index);portraitParent.appendChild(image);portraitLayers.push(image);
   });
   cleanups.push(()=>{portraitLayers.forEach(el=>el.remove());aboutImage.classList.remove('ref-portrait-default');portraitParent.classList.remove('ref-portrait-selected')});
  }
  const showPortrait=(index:number|null)=>{
   portraitParent?.classList.toggle('ref-portrait-selected',index!==null);
   portraitLayers.forEach((el,i)=>el.classList.toggle('is-active',i===index));
  };

  function setupExpansions(rows:HTMLElement[],content:ExpandContent[],kind:'education'|'experience'){
   let pinned:number|null=null,hovered:number|null=null,focused:number|null=null;
   const panels:HTMLElement[]=[];
   const update=()=>{
    rows.forEach((row,index)=>{
     const open=index===pinned||index===hovered||index===focused;
     row.setAttribute('aria-expanded',String(open));row.classList.toggle('ref-row-expanded',open);
     panels[index].setAttribute('aria-hidden',String(!open));
    });
    if(kind==='education')showPortrait(hovered??focused??pinned);
   };
   rows.forEach((row,index)=>{
    const values=content[index];if(!values)return;
    const previous={role:row.getAttribute('role'),tabIndex:row.getAttribute('tabindex'),controls:row.getAttribute('aria-controls')};
    row.classList.add('ref-expand-row',`ref-${kind}-row`);row.tabIndex=0;row.setAttribute('role','button');
    row.setAttribute('aria-label',`${row.querySelector('.type-timeline-title')?.textContent||kind} — show details`);
    const panel=document.createElement('div');panel.className=`ref-row-details ref-${kind}-details`;panel.id=`${kind}-details-${index}`;
    const inner=document.createElement('div');inner.className='ref-row-details-inner';
    const pad=document.createElement('div');pad.className='ref-row-details-content';
    const summary=document.createElement('p');summary.className='type-body-sm text-muted-foreground';summary.textContent=values.summary;pad.appendChild(summary);
    const list=document.createElement('ul');list.className='ref-row-bullets';values.bullets.forEach(value=>{const item=document.createElement('li');item.className='type-body-sm';item.textContent=value;list.appendChild(item)});pad.appendChild(list);inner.appendChild(pad);panel.appendChild(inner);row.appendChild(panel);panels.push(panel);
    row.setAttribute('aria-controls',panel.id);
    if(kind==='education'){row.style.setProperty('--ref-reveal-delay',`${.08*index}s`);row.style.setProperty('--ref-reveal-duration','.5s');row.style.setProperty('--ref-reveal-x','-24px');row.style.setProperty('--ref-reveal-y','0px')}
    const enter=()=>{if(window.matchMedia('(hover: hover)').matches){hovered=index;update()}};const leave=()=>{hovered=null;update()};
    const focus=()=>{focused=index;update()};const blur=()=>{focused=null;update()};
    const toggle=()=>{pinned=pinned===index?null:index;focused=null;update()};
    const key=(event:KeyboardEvent)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();toggle()}if(event.key==='Escape'){pinned=null;hovered=null;focused=null;update();row.blur()}};
    row.addEventListener('mouseenter',enter);row.addEventListener('mouseleave',leave);row.addEventListener('focus',focus);row.addEventListener('blur',blur);row.addEventListener('click',toggle);row.addEventListener('keydown',key);
    cleanups.push(()=>{row.removeEventListener('mouseenter',enter);row.removeEventListener('mouseleave',leave);row.removeEventListener('focus',focus);row.removeEventListener('blur',blur);row.removeEventListener('click',toggle);row.removeEventListener('keydown',key);panel.remove();row.classList.remove('ref-expand-row',`ref-${kind}-row`,'ref-row-expanded');row.removeAttribute('aria-expanded');row.removeAttribute('aria-label');if(previous.role===null)row.removeAttribute('role');else row.setAttribute('role',previous.role);if(previous.tabIndex===null)row.removeAttribute('tabindex');else row.setAttribute('tabindex',previous.tabIndex);if(previous.controls===null)row.removeAttribute('aria-controls');else row.setAttribute('aria-controls',previous.controls)});
   });update();
  }
  setupExpansions(Array.from(document.querySelectorAll<HTMLElement>('[data-education-list] > div')),educationDetails,'education');
  setupExpansions(Array.from(document.querySelectorAll<HTMLElement>('#experience > .content-max > .relative > div > .cursor-pointer')),experienceDetails,'experience');

  // The reference follows the cursor with a spring-driven service preview. Use actual portfolio images.
  const serviceRows=Array.from(document.querySelectorAll<HTMLElement>('#services a.group'));
  if(serviceRows.length&&window.matchMedia('(hover: hover) and (min-width: 768px)').matches&&!reduced){
   const preview=document.createElement('div');preview.className='ref-service-preview';preview.setAttribute('aria-hidden','true');
   const image=document.createElement('img');image.alt='';preview.appendChild(image);document.body.appendChild(preview);
   const assets=['/images/projects/vortex.png','/images/projects/nextflow.png','/images/projects/waste.svg','/images/projects/nextflow.png'];
   let targetX=0,targetY=0,x=0,y=0,vx=0,vy=0,raf=0,last=0,active=false;
   const tick=(now:number)=>{
    const dt=last?Math.min((now-last)/1000,.032):.016;last=now;
    vx+=(50*(targetX-x)-10*vx)*dt;vy+=(50*(targetY-y)-10*vy)*dt;x+=vx*dt;y+=vy*dt;
    preview.style.transform=`translate3d(${x}px,${y}px,0)`;
    if(active||Math.abs(targetX-x)+Math.abs(targetY-y)+Math.abs(vx)+Math.abs(vy)>.2)raf=requestAnimationFrame(tick);else{raf=0;last=0}
   };
   const move=(event:PointerEvent)=>{targetX=event.clientX+20;targetY=event.clientY+20;if(!raf)raf=requestAnimationFrame(tick)};
   serviceRows.forEach((row,index)=>{
    const enter=(event:PointerEvent)=>{image.src=assets[index]||assets[0];if(!active&&!raf){x=event.clientX+20;y=event.clientY+20}active=true;preview.classList.add('is-visible');move(event)};
    const leave=()=>{active=false;preview.classList.remove('is-visible')};
    row.addEventListener('pointerenter',enter);row.addEventListener('pointermove',move);row.addEventListener('pointerleave',leave);
    cleanups.push(()=>{row.removeEventListener('pointerenter',enter);row.removeEventListener('pointermove',move);row.removeEventListener('pointerleave',leave)});
   });
   cleanups.push(()=>{if(raf)cancelAnimationFrame(raf);preview.remove()});
  }
  return()=>cleanups.reverse().forEach(cleanup=>cleanup());
 },[]);
 return <div className={`ref-sticky-header ${sticky?'ref-sticky-visible':''}`} aria-hidden={!sticky}>{sticky&&<ReferenceHeader/>}</div>;
}
