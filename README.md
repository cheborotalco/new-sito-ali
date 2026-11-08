# alisac.it — v2 (redesign)

Nuovo sito, scritto da zero: HTML + CSS + un solo file JS, senza build step, senza framework,
senza bundle duplicati. Si apre, si modifica, si pubblica.

**Anteprima locale**

```bash
cd ~/Documents/alisac-v2
python3 -m http.server 8099
# http://localhost:8099
```

---

## Struttura

```
alisac-v2/
├── index.html                  home: hero, credenziali, numeri, approccio,
│                               focus area, servizi, lavori, mindset, contatti
├── privacy.html                privacy policy (testo originale, nuovo layout)
├── cookies.html                cookie policy (testo originale, nuovo layout)
├── api/contact.js              function serverless → Resend (invariata)
├── vercel.json                 redirect www → apex
├── robots.txt · sitemap.xml
├── assets/
│   ├── css/main.css            design system + tutte le sezioni
│   ├── css/legal.css           stile pagine legali
│   ├── js/main.js              nav, menu mobile, reveal, contatori, form
│   └── img/alisa.jpg · favicon.svg
└── docs/screenshots/           scatti desktop/mobile di questa versione
```

Niente `node_modules`, niente compilazione: quello che vedi nel file è quello che va online.

## Design system

| Token | Valore | Uso |
|---|---|---|
| `--paper` | `#ffffff` | sfondo |
| `--paper-soft` | `#f7f5fb` | sezioni alternate |
| `--ink` | `#181042` | testo, bottoni primari, blocco mindset |
| `--violet` | `#b665ff` | accenti, numeri, hover, gradienti |
| `--cyan` | `#00bfe0` | micro-accenti, bullet, stati |
| `--orange` | `#f16223` | un solo uso: kicker dei case study |
| Motion | `cubic-bezier(.16,1,.3,1)`, 0.7–0.8s | reveal, hover, contatori |
| Radius | 12 / 20 / 28 / 36 px | input, card, sezioni |

Tipografia: system font stack (SF Pro su Apple, Segoe su Windows) — nessun font da scaricare, nessun layout shift, look nativo. Scala fluida con `clamp()`.

Mobile-first: breakpoint principali a 640 / 900px, nessun overflow orizzontale a 320 px, target touch ≥ 44 px, safe-area iOS rispettata, nav a pannello con blocco dello scroll.

## Cosa è cambiato rispetto al sito attuale

- **Mobile ripensato da zero**: hero che sta in una schermata, CTA impilate a tutta larghezza, menu a pannello, form a colonna singola, nessun testo che si sovrappone.
- **Certificazioni dentro la hero**: etichetta "My certifications:" e tre pill con testo a sinistra e badge ufficiale a destra (immagini PNG in `assets/img/`). Niente sezione separata. Su mobile restano su una riga a 390px e vanno a capo a 320px. Sono dichiarate anche nel JSON-LD (`hasCredential`).
- **Servizi con le tre categorie del vecchio sito**: tab Private client / Investor / Startup, tre servizi per categoria (9 in totale, contenuti recuperati dal sito attuale). Prezzi rimossi. La terza scheda di Private client mantiene le due varianti **Standard** e "Growth" affiancate, ognuna con il proprio CTA. Le CTA "Request a quote" sono arancioni (`#f16223`). "Not included" è tornato a essere una riga piccola, non un elenco puntato.
- **Focus area riscritte** e rese concrete: Agile & product ownership (Scrum, Kanban, backlog, metriche di flusso), AI fundamentals (supervised/unsupervised/reinforcement, famiglie di modelli, foundation model e LLM, prompt vs fine-tuning vs RAG, valutazione e costi), cloud foundations (servizi AWS core, IAM e sicurezza, regioni e modelli di deployment, costi, migrazione), delivery governance PMP.
- **Hero e lessico**: eyebrow "IT Project Manager", badge "Available for new projects" con pallina verde pulsante sulla foto, riga lingue "Speaking Italian · English · Russian". Su mobile la hero cambia composizione: le certificazioni e le righe lingua/sede stanno in un'unica card, e il ritratto diventa un cerchio con anello gradiente che si appoggia sul bordo inferiore della card (badge "Available" sotto). Su desktop resta la hero a due colonne con foto rettangolare.
- **Ordine delle sezioni**: Work ora viene prima di Services (Approach → Focus areas → Work → Services → Mindset → Contact), con nav e footer riallineati e numerazione 01–05 aggiornata.
- **Numeri dentro Selected work**: i 10+ progetti / 5 paesi / €550K+ / 6 mercati sono la testata della sezione Work.
- **Case study in carosello**: la card centrale è quella attiva (più grande, con ombra), le altre due stanno ai lati più piccole e attenuate; frecce circolari, rotazione circolare (dopo l'ultima si torna alla prima), click sulle laterali per portarle al centro, swipe su mobile e frecce da tastiera.
- **Mindset**: frase a tutta larghezza del contenitore, parole rivelate una per una allo scroll, parole chiave in gradiente viola→ciano, aurora animata sullo sfondo scuro. Rimossi i chip People / Time / Budget / Clarity.
- **Form**: aggiunta la nota "No spam, no newsletter" sotto il pulsante, oltre a honeypot e validazione.
- **Hero e footer**: lo sfondo della hero sfuma con una maschera (nessun taglio netto a filo sezione). Footer ristrutturato: brand + CTA, tre colonne (Navigate, Contact, Credentials) e barra legale con "Back to top". Le credenziali PMP e PSPO I linkano al badge Credly (nuova scheda, `rel="noopener noreferrer"`); AWS resta testo finché non prendi la certificazione.
- **Form contatti**: stessi campi e stesso endpoint `/api/contact`; il campo del canale preferito ora mostra solo quello selezionato; aggiunto honeypot e validazione client; resta da aggiungere un rate limit lato server.
- **Nessuna analytics** (come prima). Se vuoi, si attiva Vercel Analytics in 5 minuti.

## Dove si modifica cosa

| Vuoi cambiare | File / punto |
|---|---|
| Testi della home | `index.html` (ogni sezione è un `<section>` con id) |
| Colori, spazi, tipografia | `assets/css/main.css`, blocco `:root` in cima |
| Menu mobile, animazioni, form | `assets/js/main.js` |
| Email/Telegram del form | `api/contact.js` (env `CONTACT_TO_EMAIL`) + i link in `index.html` |
| Foto | sostituisci `assets/img/alisa.jpg` (meglio 1200×1500, < 200 KB) |
| Policy | `privacy.html`, `cookies.html` — **il testo è quello originale**: se aggiorni i servizi usati (es. Google Fonts non è più caricato), va aggiornato |

### Badge delle certificazioni

I badge ufficiali sono in `assets/img/cert-pmp.png`, `cert-pspo.png`, `cert-aws.png` (192×192, ottimizzati a 25–30 KB), usati nella hero con `<span class="cred-badge">`. Per aggiornarli basta sovrascrivere i file mantenendo il nome. Per aggiungerne un quarto, copia un blocco `.cred-badge` in `index.html` e aggiungi la relativa immagine.

## Pubblicazione (quando decidi)

Il sito attuale continua a vivere su `cheborotalco/new-sito-ali`. Per il nuovo:

1. nuovo repo GitHub (es. `alisac-site`), push di questa cartella;
2. nuovo progetto Vercel collegato al repo (framework preset: **Other**, nessuna build);
3. verifica sull'URL `*.vercel.app`;
4. solo allora sposta il dominio `alisac.it` (GoDaddy DNS → Vercel) e tieni il vecchio deploy come rollback.

Il backup completo dell'originale è in `~/Backups/alisac-original-2026-11-08/` (+ `alisac-backup-2026-11-08.tar.gz`).

## Da decidere

- **Lingue**: ora è solo inglese. Il sito attuale aveva switcher EN/IT/RU via sostituzione di testo (fragile). Meglio `it.alisac.it` / `alisac.it/ru/` con pagine vere — richiede però tradurre i testi e duplicare le pagine.
- **Badge ufficiali** delle certificazioni (vedi sopra).
- **Analytics**: attivare Vercel Analytics o nessuna misurazione?
- **Form**: aggiungere rate limiting lato server (oggi solo honeypot + validazione).
- **Testi legali**: allineare la cookie policy ai servizi realmente usati (Google Fonts non c'è più).
