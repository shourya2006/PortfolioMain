import type { CSSProperties } from 'react';

/** The reference's two-copy, 20ms-per-character rolling label. */
export default function RollingText({children,className=''}:{children:string;className?:string}){
 const letters=Array.from(children);
 return <span className={`ref-roll ${className}`}><span className="sr-only">{children}</span><span className="ref-roll-row" aria-hidden="true">{letters.map((letter,index)=><span key={index} className="ref-roll-letter" style={{'--roll-index':index} as CSSProperties}>{letter}</span>)}</span><span className="ref-roll-row ref-roll-copy" aria-hidden="true">{letters.map((letter,index)=><span key={index} className="ref-roll-letter" style={{'--roll-index':index} as CSSProperties}>{letter}</span>)}</span></span>
}
