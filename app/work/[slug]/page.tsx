import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {projects} from '@/lib/projects';
import ReferenceHeader from '@/components/reference-header';
import ReferenceFooter from '@/components/reference-footer';
import ProjectDetail from '@/components/project-detail';
export function generateStaticParams(){return projects.map(p=>({slug:p.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const p=projects.find(p=>p.slug===slug);return {title:p?.title||'Project not found',description:p?.description}}
export default async function ProjectPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const p=projects.find(x=>x.slug===slug);if(!p)notFound();
 return <><ReferenceHeader/><main className="section-gutter pt-24 md:pt-32"><article className="ref-case"><Link className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground mb-10 md:mb-12" href="/portfolio">← Back to portfolio</Link><ProjectDetail p={p}/></article></main><ReferenceFooter/></>
}
