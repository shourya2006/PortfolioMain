import type { Metadata } from 'next';
import ReferenceProjectIndex from '@/components/reference-project-index';
export const metadata: Metadata={title:'Portfolio',description:'Selected software and AI projects by Shourya Bafna: NextFlow, Smart Waste Segregator, and Vortex.'};
export default function Portfolio(){return <ReferenceProjectIndex/>}
