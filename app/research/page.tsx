import type { Metadata } from 'next';
import ReferenceProjectIndex from '@/components/reference-project-index';
export const metadata: Metadata={title:'Research',description:'Applied machine learning work by Shourya Bafna: feature extraction, classical ML, and group-aware evaluation.'};
export default function Research(){return <ReferenceProjectIndex research/>}
