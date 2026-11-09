declare namespace Cloudflare {
  interface Env {
    RESEND_API_KEY?: string;
    RESEND_FROM_EMAIL?: string;
    CONTACT_TO_EMAIL?: string;
    DB?: D1Database;
    BUCKET?: R2Bucket;
  }
}
