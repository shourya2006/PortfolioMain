import Link from 'next/link';
import {projects,type Project} from '@/lib/projects';
import {ArrowUpRight} from '@/components/reference-header';
import ProjectGallery from '@/components/project-gallery';
import ProjectShare from '@/components/project-share';

/** Case-study body shared by the /work/[slug] page and the project pop-up. */
export default function ProjectDetail({p,titleId,shareUrl}:{p:Project;titleId?:string;shareUrl?:string}){
 const next=projects[(projects.indexOf(p)+1)%projects.length];
 const Title=titleId?'h2':'h1';
 return <><div className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-4">{p.category} · {p.date}</div><Title id={titleId} className="type-section max-w-4xl mb-5">{p.title}</Title><p className="type-body text-muted-foreground max-w-3xl">{p.description}</p><div className="flex flex-wrap gap-3 mt-8">{p.demo&&<a className="btn-pill ref-source-action" href={p.demo} target="_blank" rel="noreferrer">Visit {p.title}<ArrowUpRight/></a>}<a className="btn-pill-outline ref-source-action" href={p.github} target="_blank" rel="noreferrer">View source <ArrowUpRight/></a></div>{p.image&&<ProjectGallery title={p.title} src={p.image} alt={`${p.title} preview`}/>}<div className="ref-case-layout"><aside className="ref-case-aside"><span className="section-label">At a glance</span>{p.metrics.map(m=><div className="ref-case-metric" key={m.label}><strong>{m.value}</strong><span>{m.label}</span></div>)}<div className="ref-case-tags">{p.stack.map(t=><span key={t}>{t}</span>)}</div><ProjectShare url={shareUrl}/></aside><div><section className="ref-case-section"><span className="section-label">Overview</span><h2>What I set out to solve.</h2><p>{p.problem}</p></section><section className="ref-case-section"><span className="section-label">The approach</span><h2>How the pieces fit together.</h2><ol>{p.approach.map(s=><li key={s}>{s}</li>)}</ol></section><section className="ref-case-section"><span className="section-label">Impact & results</span><h2>What came out of it.</h2><p>{p.outcome}</p></section><section className="ref-case-section"><span className="section-label">More projects</span><h2>{next.title}</h2><p>{next.description}</p><Link className="arrow-link-underline mt-8 text-foreground" href={`/work/${next.slug}`}>Next project<ArrowUpRight/></Link></section></div></div></>;
}
