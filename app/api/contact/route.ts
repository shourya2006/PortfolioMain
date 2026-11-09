import {handleContact} from '@/lib/contact-server';

// On Vercel this serves the contact form; on Cloudflare the Worker answers /api/contact before reaching here.
export function POST(request: Request) {
  const {RESEND_API_KEY, RESEND_FROM_EMAIL, CONTACT_TO_EMAIL} = process.env;
  return handleContact(request, {RESEND_API_KEY, RESEND_FROM_EMAIL, CONTACT_TO_EMAIL});
}
