# Rudrexa Website

Static multi-page website for `https://www.rudrexa.com` built with HTML, CSS and JavaScript.

## Brand and SEO direction

- Public brand: `Rudrexa`
- Full company name: `Rudrexa Technologies`
- Production domain: `https://www.rudrexa.com`
- Primary SEO focus: technology company in Nepal, software development company in Nepal, web development company in Nepal, AI automation company Nepal, SEO services Nepal, cloud and cybersecurity services Nepal

## Structure

- `index.html` homepage
- `about/`, `services/`, `solutions/`, `work/`, `products/`, `process/`, `insights/`, `contact/`, `start-project/`, `privacy-policy/`, `terms/`
- `assets/css/styles.css` shared styling
- `assets/js/content.js` centralized content
- `assets/js/site.js` shared rendering, navigation and structured data
- `assets/js/start-project.js` multi-step form logic

## Local preview

Serve the project from the repository root so clean URLs resolve correctly.

Example:

```powershell
python -m http.server 8080
```

Then open:

- `http://127.0.0.1:8080/`

## Start Project form

The front-end form includes:

- Multi-step UX
- Client-side validation
- Honeypot field
- Loading, success and error states

The current repository does **not** include a live backend endpoint for secure submission storage or email delivery. The form is prepared to `POST` JSON to:

- `/api/start-project`

Before production launch, connect that endpoint to a secure server or serverless function with:

- Server-side validation
- Rate limiting
- Email delivery such as Resend
- Secrets stored outside client-side code

## Business-owner placeholders still to verify

- `[Verified business address]`
- `[Verified Nepal phone number]`
- `[Verified email address]`
- `[Verified social profiles]`
- Governing law for terms
- Final data-retention and analytics details for privacy policy

## Notes

- Concept projects are clearly labeled and can be replaced with real case studies later.
- No fake testimonials, fake awards, fake team members or invented office addresses are included.
