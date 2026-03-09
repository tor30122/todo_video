# GitHub Classroom — Auto-Graded To-Do App Template

## What You Are Building

Create a **GitHub template repository** that will be used with **GitHub Classroom**. When a student accepts the assignment, they get a copy of this repo. The repo contains:

1. A GitHub Actions workflow that runs every time the student pushes code
2. A grading system that checks the student's code against specific requirements
3. An issue-based progression system — students see one issue at a time, and when they complete it, the next issue automatically appears
4. A screenshot system that captures what the student's web page looks like
5. Feedback comments posted directly on the GitHub issue (in Norwegian)

**All issue titles, issue bodies, feedback messages, hints, and comments must be written in Norwegian (Bokmål).** Code, filenames, variable names, and technical identifiers remain in English.

The students are **teenagers who are just learning to code**. The language must be simple, friendly, and encouraging. Avoid jargon. When technical terms are needed, explain them briefly.

---

## Repository File Structure

```
todo-app-template/
├── .github/
│ ├── workflows/
│ │ ├── setup.yml ← Runs once on first push to create Issue #1
│ │ └── validate.yml ← Runs on every push to main, validates code
│ └── grading/
│ ├── package.json ← Dependencies: cheerio, puppeteer
│ ├── package-lock.json ← Lock file (generate this with npm install)
│ ├── issues.json ← All 8 issues defined as JSON
│ ├── check.js ← Main checker script
│ ├── screenshot.js ← Puppeteer screenshot script
│ └── post-results.js ← Posts results, closes/opens issues
├── .gitignore
└── README.md
```

**IMPORTANT:** Do NOT include `index.html`, `style.css`, or `script.js`. The student creates these files as part of the assignment.

---

## Detailed File Specifications

### 1. `.gitignore`

```gitignore
node_modules/
.github/grading/node_modules/
.github/grading/screenshot.png
.github/grading/results.json
.DS_Store
```

### 2. `README.md`

Write this in Norwegian. It should be warm and welcoming. Content:

```markdown
# Gjør-det-selv: To-Do App

Velkommen! I dette prosjektet skal du bygge din egen to-do app fra bunnen av, steg for steg.

## Hvordan fungerer det?

1. Gå til **Issues**-fanen i dette repoet
2. Du vil se én åpen oppgave (issue) — les den nøye!
3. Skriv koden som oppgaven ber om
4. Push koden din til `main`-branchen
5. En robot sjekker koden din automatisk
6. Hvis alt er riktig: oppgaven lukkes og en ny åpnes
7. Hvis noe mangler: roboten legger igjen en kommentar som forklarer hva du må fikse

## Tips

- Les oppgaven nøye før du begynner å kode
- Push ofte — du får tilbakemelding hver gang!
- Ikke vær redd for å prøve og feile, det er sånn man lærer
- Alle filene du lager skal ligge i **hovedmappen** (root) av prosjektet

## Filer du skal lage

Gjennom prosjektet skal du etter hvert lage disse filene:

- `index.html` — nettsiden din
- `style.css` — utseendet til nettsiden
- `script.js` — funksjonaliteten (det som gjør at ting skjer)

Lykke til!
```

---

### 3. `.github/grading/package.json`

```json
{
 "name": "grading",
 "version": "1.0.0",
 "private": true,
 "dependencies": {
 "cheerio": "^1.0.0",
 "puppeteer": "^23.0.0"
 }
}
```

Generate a `package-lock.json` by running `npm install` inside `.github/grading/`.

---

### 4. `.github/grading/issues.json`

This is the heart of the system. Define all 8 issues here. Every issue has:
- `step` (number 1-8)
- `title` (string, in Norwegian, prefixed with "Steg X:")
- `body` (markdown string, in Norwegian, friendly tone)
- `labels` (array of strings)

Here are the 8 issues. Write the `body` field as rich GitHub-flavored markdown with clear instructions, a checklist of what the student needs to do, and a friendly hint at the bottom. Remember: these are teenagers learning to code — be clear, be kind, explain everything.

#### Issue 1 — Project Setup

```json
{
 "step": 1,
 "title": "Steg 1: Lag filene dine",
 "labels": ["oppgave", "steg-1"],
 "body": "## Mål\n\nI dette første steget skal du lage de tre filene som alle nettsider trenger: en HTML-fil, en CSS-fil og en JavaScript-fil.\n\n## Hva du skal gjøre\n\n1. Lag en fil som heter `index.html` i hovedmappen\n2. Lag en fil som heter `style.css` i hovedmappen\n3. Lag en fil som heter `script.js` i hovedmappen\n4. I `index.html`, skriv grunnleggende HTML-kode (dette kalles \"boilerplate\"):\n - Start med `<!DOCTYPE html>`\n - Legg til `<html>`, `<head>` og `<body>`\n - Sett tittelen til `To-Do App` (inne i en `<title>`-tag)\n - Link til CSS-filen din med `<link rel=\"stylesheet\" href=\"style.css\">`\n - Link til JS-filen din med `<script src=\"script.js\"></script>` (legg denne rett før `</body>`)\n - Legg til en `<div>` med `id=\"app\"` inne i `<body>` — det er her appen din skal bo\n\n## Sjekkliste\n\n- [ ] `index.html` finnes\n- [ ] `style.css` finnes\n- [ ] `script.js` finnes\n- [ ] HTML-en har `<!DOCTYPE html>`\n- [ ] CSS-filen er linket i HTML-en\n- [ ] JS-filen er linket i HTML-en\n- [ ] Det finnes en `<div id=\"app\">` inne i `<body>`\n- [ ] Tittelen er satt til `To-Do App`\n\n## Tips\n\nHvis du bruker VS Code, kan du skrive `!` og trykke Tab i en tom HTML-fil for å få en startmal. Husk å endre tittelen og legge til det som mangler!\n\n`style.css` og `script.js` kan være helt tomme for nå — det viktige er at de finnes og er linket riktig.\n\nNår du er ferdig, bruk `git add`, `git commit` og `git push` for å sende koden din. Roboten sjekker automatisk."
}
```

#### Issue 2 — Input Field and Button

```json
{
 "step": 2,
 "title": "Steg 2: Legg til et tekstfelt og en knapp",
 "labels": ["oppgave", "steg-2"],
 "body": "## Mål\n\nNå skal du lage brukergrensesnittet (det brukeren ser og klikker på). Du trenger et tekstfelt der brukeren kan skrive inn en oppgave, og en knapp for å legge den til.\n\n## Hva du skal gjøre\n\nÅpne `index.html` og legg til dette inne i `<div id=\"app\">`:\n\n1. En overskrift (`<h1>`) med teksten du vil ha, for eksempel \"Min To-Do Liste\" eller \"Mine oppgaver\"\n2. Et tekstfelt: `<input type=\"text\" id=\"task-input\" placeholder=\"Skriv en oppgave...\">`\n - `id=\"task-input\"` — dette er viktig, roboten ser etter akkurat denne ID-en\n - `placeholder` er den grå teksten som vises når feltet er tomt\n3. En knapp: `<button id=\"add-btn\">Legg til</button>`\n - `id=\"add-btn\"` — også viktig!\n4. En tom liste der oppgavene skal vises: `<ul id=\"task-list\"></ul>`\n - `<ul>` betyr \"unordered list\" (punktliste)\n - Den er tom nå — vi fyller den med JavaScript i neste steg\n\n## Sjekkliste\n\n- [ ] Det finnes en `<input>` med `id=\"task-input\"`\n- [ ] Input-feltet har et `placeholder`-attributt\n- [ ] Det finnes en `<button>` med `id=\"add-btn\"`\n- [ ] Knappen har synlig tekst (f.eks. \"Legg til\")\n- [ ] Det finnes en `<ul>` med `id=\"task-list\"`\n\n## Tips\n\nTenk på rekkefølgen: overskrift først, så input og knapp, og til slutt listen. Det gir en naturlig flyt på siden.\n\nPush koden din når du er ferdig!"
}
```

#### Issue 3 — JavaScript: Add Tasks

```json
{
 "step": 3,
 "title": "Steg 3: Få knappen til å fungere med JavaScript",
 "labels": ["oppgave", "steg-3"],
 "body": "## Mål\n\nNå skal du skrive JavaScript som gjør at appen faktisk *gjør* noe! Når brukeren skriver en oppgave og klikker \"Legg til\", skal oppgaven dukke opp i listen.\n\n## Hva du skal gjøre\n\nÅpne `script.js` og skriv kode som gjør følgende:\n\n1. **Finn elementene**: Bruk `document.getElementById` for å hente tak i `task-input`, `add-btn` og `task-list`\n2. **Lytt etter klikk**: Bruk `addEventListener('click', ...)` på knappen\n3. **Når knappen klikkes**:\n - Hent teksten fra input-feltet (`.value`)\n - Hvis teksten er tom, skal ingenting skje (ikke legg til tomme oppgaver!)\n - Lag et nytt `<li>`-element med `document.createElement('li')`\n - Sett teksten til det brukeren skrev: `.textContent = ...`\n - Legg det til i listen med `task-list.appendChild(...)`\n - Tøm input-feltet etterpå (sett `.value = ''`)\n\n## Sjekkliste\n\n- [ ] Klikk på knappen legger til en ny oppgave i listen\n- [ ] Input-feltet tømmes etter at oppgaven er lagt til\n- [ ] Tomme oppgaver blir IKKE lagt til\n- [ ] Hver oppgave vises som et `<li>`-element\n- [ ] Teksten i oppgaven matcher det som ble skrevet\n\n## Tips\n\nHer er et lite skjelett for å komme i gang:\n\n```javascript\nconst input = document.getElementById('task-input');\nconst btn = document.getElementById('add-btn');\nconst list = document.getElementById('task-list');\n\nbtn.addEventListener('click', function {\n const text = input.value.trim;\n if (text === '') return;\n\n // Lag et nytt <li>-element her\n // Sett teksten\n // Legg det til i listen\n // Tøm input-feltet\n});\n```\n\n`.trim` fjerner mellomrom foran og bak — smart å bruke så man ikke legger til \"tomme\" oppgaver med bare mellomrom!"
}
```

#### Issue 4 — Flexbox Layout and CSS Styling

```json
{
 "step": 4,
 "title": "Steg 4: Gjør det pent med CSS",
 "labels": ["oppgave", "steg-4"],
 "body": "## Mål\n\nAppen fungerer, men den ser ganske kjedelig ut! Nå skal du bruke CSS og Flexbox for å style den.\n\n## Hva du skal gjøre\n\nÅpne `style.css` og legg til stiler:\n\n1. **Sentrer appen på siden**: Bruk Flexbox på `body` eller `#app` for å sentrere innholdet\n ```css\n body {\n display: flex;\n justify-content: center;\n min-height: 100vh;\n /* legg til en bakgrunnsfarge du liker */\n }\n ```\n2. **Legg input og knapp på samme rad**: Bruk `display: flex` på en container rundt input og knappen\n3. **Legg til en pen skrifttype**: Gå til [Google Fonts](https://fonts.google.com/), velg en font du liker, og legg til `<link>`-taggen i `<head>` i HTML-en din. Bruk den i CSS med `font-family`.\n4. **Style elementene**: Gi input-feltet, knappen og listen litt padding, farger og avrundede hjørner. Gjør det til ditt eget!\n\n## Sjekkliste\n\n- [ ] `display: flex` er brukt på minst én container\n- [ ] Input og knapp er visuelt plassert på samme rad\n- [ ] Body eller app-container er sentrert på siden\n- [ ] En egendefinert font er brukt (Google Fonts eller lignende)\n- [ ] Fargeskjema er brukt (ikke standard nettleserstiler)\n\n## Tips\n\nFlexbox er din beste venn for layout! Her er de viktigste egenskapene:\n- `display: flex` — gjør en container til en flex-container\n- `justify-content: center` — sentrerer horisontalt\n- `align-items: center` — sentrerer vertikalt\n- `gap: 10px` — lager mellomrom mellom elementene\n\nIkke vær redd for å eksperimentere med farger og størrelser. Det finnes ikke noe \"feil\" svar her — gjør det til ditt eget!"
}
```

#### Issue 5 — Delete Tasks

```json
{
 "step": 5,
 "title": "Steg 5: Slett oppgaver",
 "labels": ["oppgave", "steg-5"],
 "body": "## Mål\n\nBrukeren trenger en måte å fjerne oppgaver de ikke vil ha lenger. Du skal legge til en slett-knapp på hver oppgave.\n\n## Hva du skal gjøre\n\nÅpne `script.js` og endre koden der du lager nye oppgaver:\n\n1. Når du lager et nytt `<li>`-element, lag også en slett-knapp:\n ```javascript\n const deleteBtn = document.createElement('button');\n deleteBtn.textContent = 'X'; // eller 'Slett'\n ```\n2. Legg til en event listener på slett-knappen:\n ```javascript\n deleteBtn.addEventListener('click', function {\n li.remove; // fjerner hele oppgaven fra listen\n });\n ```\n3. Legg slett-knappen inn i `<li>`-elementet:\n ```javascript\n li.appendChild(deleteBtn);\n ```\n4. (Valgfritt) Style slett-knappen i CSS så den ser fin ut\n\n## Sjekkliste\n\n- [ ] Hver oppgave har en slett/fjern-knapp\n- [ ] Klikk på slett fjerner oppgaven fra siden\n- [ ] Slett-knappen har synlig tekst eller ikon (f.eks. 'X' eller 'Slett')\n- [ ] Andre oppgaver blir ikke påvirket når du sletter én\n\n## Tips\n\nDu kan bruke Flexbox (`display: flex` og `justify-content: space-between`) på hvert `<li>`-element for å plassere teksten til venstre og slett-knappen til høyre. Det ser mye ryddigere ut!"
}
```

#### Issue 6 — Mark Tasks as Complete

```json
{
 "step": 6,
 "title": "Steg 6: Marker oppgaver som ferdige",
 "labels": ["oppgave", "steg-6"],
 "body": "## Mål\n\nBrukere vil markere oppgaver som ferdige uten å slette dem. Du skal gjøre det mulig å klikke på en oppgave for å \"krysse den av\".\n\n## Hva du skal gjøre\n\n### I `script.js`:\n\n1. Legg til en event listener på hvert `<li>`-element (eller en del av det, som teksten):\n ```javascript\n li.addEventListener('click', function {\n li.classList.toggle('completed');\n });\n ```\n `classList.toggle` legger til klassen hvis den ikke er der, og fjerner den hvis den allerede er der. Smart!\n\n### I `style.css`:\n\n2. Style `.completed`-klassen:\n ```css\n .completed {\n text-decoration: line-through;\n opacity: 0.6;\n }\n ```\n Du kan også endre fargen, legge til en annen bakgrunn, eller hva du synes ser bra ut!\n\n## Sjekkliste\n\n- [ ] Klikk på en oppgave gir den et visuelt \"ferdig\"-utseende\n- [ ] Ferdige oppgaver har gjennomstreking eller en annen tydelig endring\n- [ ] En CSS-klasse (f.eks. `.completed`) brukes med `classList.toggle`\n- [ ] Man kan klikke igjen for å fjerne \"ferdig\"-markeringen\n\n## Tips\n\nPass på at klikk på slett-knappen ikke *også* toggler \"ferdig\"-statusen! Du kan bruke `event.stopPropagation` på slett-knappen, eller legge teksten i en egen `<span>` og lytte på klikk der i stedet.\n\nTest det nøye — klikk litt rundt og se at alt oppfører seg som forventet."
}
```

#### Issue 7 — LocalStorage

```json
{
 "step": 7,
 "title": "Steg 7: Lagre oppgavene med localStorage",
 "labels": ["oppgave", "steg-7"],
 "body": "## Mål\n\nAkkurat nå forsvinner alle oppgavene hvis du oppdaterer siden. Det er ikke så nyttig! Du skal bruke `localStorage` for å lagre oppgavene slik at de overlever en sideoppdatering.\n\n## Hva er localStorage?\n\n`localStorage` er en innebygd funksjon i nettleseren som lar deg lagre data som tekst. Dataen forsvinner ikke når du lukker siden — den blir liggende til du sletter den.\n\n## Hva du skal gjøre\n\n### 1. Lag en hjelpefunksjon for å lagre:\n```javascript\nfunction saveTasks {\n const tasks = [];\n document.querySelectorAll('#task-list li').forEach(function(li) {\n tasks.push({\n text: li.querySelector('span') ? li.querySelector('span').textContent : li.firstChild.textContent,\n completed: li.classList.contains('completed')\n });\n });\n localStorage.setItem('tasks', JSON.stringify(tasks));\n}\n```\n\n### 2. Lag en funksjon for å laste inn:\n```javascript\nfunction loadTasks {\n const saved = localStorage.getItem('tasks');\n if (saved) {\n const tasks = JSON.parse(saved);\n tasks.forEach(function(task) {\n // Bruk samme kode som du bruker for å lage en ny oppgave\n // men bruk task.text som tekst\n // og sjekk task.completed for å evt. legge til .completed-klassen\n });\n }\n}\n```\n\n### 3. Kall `saveTasks` hver gang noe endrer seg:\n- Etter at en oppgave er lagt til\n- Etter at en oppgave er slettet\n- Etter at en oppgave er markert som ferdig/uferdig\n\n### 4. Kall `loadTasks` når siden lastes:\n```javascript\nloadTasks;\n```\nLegg denne linjen nederst i `script.js` (eller i en `DOMContentLoaded`-listener).\n\n## Sjekkliste\n\n- [ ] Oppgaver lagres til localStorage når de legges til\n- [ ] Oppgaver lastes fra localStorage når siden åpnes\n- [ ] Slettede oppgaver fjernes også fra localStorage\n- [ ] \"Ferdig\"-status bevares i localStorage\n- [ ] `JSON.stringify` og `JSON.parse` brukes\n\n## Tips\n\nDu kan åpne DevTools (F12) → Application → Local Storage for å se hva som er lagret. Det er en god måte å feilsøke på!\n\n`JSON.stringify` gjør en JavaScript-array/objekt om til tekst. `JSON.parse` gjør teksten tilbake til et objekt. De jobber alltid som et par."
}
```

#### Issue 8 — Polish and Final Touches

```json
{
 "step": 8,
 "title": "Steg 8: Siste finpuss",
 "labels": ["oppgave", "steg-8"],
 "body": "## Mål\n\nAppen din fungerer! Nå skal du gjøre den enda bedre med noen siste detaljer: responsivt design, animasjoner, tastaturstøtte og en oppgaveteller.\n\n## Hva du skal gjøre\n\n### 1. Tastaturstøtte (Enter-tasten)\nBrukeren bør kunne trykke Enter for å legge til en oppgave, ikke bare klikke på knappen:\n```javascript\ninput.addEventListener('keydown', function(event) {\n if (event.key === 'Enter') {\n // Kjør samme kode som når knappen klikkes\n }\n});\n```\n\n### 2. Oppgaveteller\nVis hvor mange oppgaver brukeren har, f.eks. \"3 oppgaver\" eller \"2 av 5 fullført\":\n- Legg til et `<p>`-element i HTML-en (eller lag det med JavaScript)\n- Oppdater teksten hver gang en oppgave legges til, slettes eller markeres\n\n### 3. CSS-animasjon\nLegg til minst én CSS-overgang (transition) eller animasjon:\n```css\n/* Eksempel: smooth farge-endring på hover */\nbutton {\n transition: background-color 0.3s ease;\n}\nbutton:hover {\n background-color: #ddd;\n}\n\n/* Eksempel: fade-in for nye oppgaver */\nli {\n animation: fadeIn 0.3s ease;\n}\n@keyframes fadeIn {\n from { opacity: 0; transform: translateY(-10px); }\n to { opacity: 1; transform: translateY(0); }\n}\n```\n\n### 4. Responsivt design\nGjør at appen ser bra ut på mobil også:\n```css\n@media (max-width: 600px) {\n #app {\n padding: 10px;\n width: 95%;\n }\n /* Gjør eventuelt input og knapp til å stable vertikalt */\n}\n```\n\n## Sjekkliste\n\n- [ ] Appen er responsiv (ser bra ut på smal skjerm)\n- [ ] Minst én CSS-overgang eller animasjon er brukt\n- [ ] Trykke Enter i input-feltet legger til en oppgave\n- [ ] En oppgaveteller eller oppsummering vises\n- [ ] Ingen feil i konsollen ved sideinnlasting eller bruk\n\n## Tips\n\nÅpne DevTools (F12) og klikk på mobil-ikonet øverst for å teste hvordan siden ser ut på ulike skjermstørrelser.\n\n **Gratulerer!** Når du består dette siste steget, har du bygget en komplett to-do-app helt fra scratch. Det er noe å være stolt av!"
}
```

---

### 5. `.github/grading/check.js`

This is the main validation script. It receives the step number as a command line argument and runs **cumulative checks** — step 3 also re-checks steps 1 and 2, etc.

Write it with these exact specifications:

```javascript
const fs = require('fs');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const step = parseInt(process.argv[2]) || 0;
const results = { passed: true, step: step, checks: [] };

// Helper: add a check result
function check(name, passed, failReason) {
 results.checks.push({
 name,
 passed: !!passed,
 reason: passed ? null : (failReason || `Ikke bestått: ${name}`)
 });
 if (!passed) results.passed = false;
}

// Helper: read file safely
function readFile(path) {
 try { return fs.readFileSync(path, 'utf8'); } catch { return null; }
}

// ========== STEP 1: File structure ==========
if (step >= 1) {
 const htmlExists = fs.existsSync('index.html');
 const cssExists = fs.existsSync('style.css');
 const jsExists = fs.existsSync('script.js');

 check('index.html finnes', htmlExists, 'Filen index.html ble ikke funnet. Lag den i hovedmappen.');
 check('style.css finnes', cssExists, 'Filen style.css ble ikke funnet. Lag den i hovedmappen.');
 check('script.js finnes', jsExists, 'Filen script.js ble ikke funnet. Lag den i hovedmappen.');

 if (htmlExists) {
 const html = readFile('index.html');
 const $ = cheerio.load(html);

 check(
 'HTML har <!DOCTYPE html>',
 html.toLowerCase.includes('<!doctype html>'),
 'HTML-filen din mangler <!DOCTYPE html> helt øverst. Det skal være den aller første linjen.'
 );
 check(
 'CSS er linket i HTML',
 $('link[href="style.css"]').length > 0,
 'Fant ingen link til style.css. Legg til <link rel="stylesheet" href="style.css"> i <head>.'
 );
 check(
 'JS er linket i HTML',
 $('script[src="script.js"]').length > 0,
 'Fant ingen link til script.js. Legg til <script src="script.js"></script> før </body>.'
 );
 check(
 'Har <div id="app">',
 $('#app').length > 0,
 'Fant ingen <div id="app">. Legg til <div id="app"></div> inne i <body>.'
 );
 check(
 'Tittelen er "To-Do App"',
 $('title').text.trim.toLowerCase.includes('to-do app'),
 'Sidetittelen skal inneholde "To-Do App". Sjekk <title>-taggen i <head>.'
 );
 }
}

// ========== STEP 2: Input, button, list ==========
if (step >= 2) {
 const html = readFile('index.html');
 if (html) {
 const $ = cheerio.load(html);

 check(
 'Input-felt med id="task-input"',
 $('#task-input').length > 0 && $('#task-input').is('input'),
 'Fant ingen <input> med id="task-input". Sjekk at ID-en er stavet riktig.'
 );
 check(
 'Input har placeholder',
 $('#task-input').attr('placeholder'),
 'Input-feltet mangler placeholder-attributt. Legg til f.eks. placeholder="Skriv en oppgave..."'
 );
 check(
 'Knapp med id="add-btn"',
 $('#add-btn').length > 0 && ($('#add-btn').is('button') || $('#add-btn').is('input[type="submit"]')),
 'Fant ingen <button> med id="add-btn". Sjekk at ID-en er stavet riktig.'
 );
 check(
 'Knappen har synlig tekst',
 $('#add-btn').text.trim.length > 0,
 'Knappen ser ut til å være tom. Legg til tekst som "Legg til" inne i <button>-taggen.'
 );
 check(
 'Liste med id="task-list"',
 $('#task-list').length > 0,
 'Fant ingen element med id="task-list". Legg til <ul id="task-list"></ul>.'
 );
 }
}

// ========== STEP 3: JS adds tasks (requires Puppeteer — checked in separate async block) ==========
// ========== STEP 4: Flexbox & styling ==========
// ========== STEP 5: Delete tasks ==========
// ========== STEP 6: Toggle completed ==========
// ========== STEP 7: localStorage ==========
// ========== STEP 8: Polish (Enter key, counter, animation, responsive) ==========

// Steps 3-8 require browser testing with Puppeteer.
// These are handled in an async function below.

async function runBrowserChecks {
 if (step < 3) return;

 let browser;
 try {
 browser = await puppeteer.launch({
 headless: 'new',
 args: ['--no-sandbox', '--disable-setuid-sandbox']
 });
 const page = await browser.newPage;
 await page.setViewport({ width: 1280, height: 800 });

 const filePath = require('path').resolve('index.html');
 await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0' });

 // ===== STEP 3: Adding tasks =====
 if (step >= 3) {
 // Type into input and click button
 const inputExists = await page.$('#task-input');
 const btnExists = await page.$('#add-btn');

 if (inputExists && btnExists) {
 // Try adding a task
 await page.type('#task-input', 'Testoppgave');
 await page.click('#add-btn');
 await new Promise(r => setTimeout(r, 500));

 const taskItems = await page.$$('#task-list li');
 check(
 'Klikk på knappen legger til oppgave',
 taskItems.length > 0,
 'Ingen <li> dukket opp i #task-list etter klikk. Sjekk at addEventListener er satt opp riktig.'
 );

 // Check text content
 if (taskItems.length > 0) {
 const taskText = await page.evaluate(el => el.textContent, taskItems[0]);
 check(
 'Oppgaven viser riktig tekst',
 taskText.includes('Testoppgave'),
 'Oppgaveteksten matcher ikke det som ble skrevet. Sjekk at du setter textContent riktig.'
 );
 }

 // Check input is cleared
 const inputValue = await page.$eval('#task-input', el => el.value);
 check(
 'Input-feltet tømmes etter tillegg',
 inputValue === '',
 'Input-feltet ble ikke tømt. Sett input.value = "" etter at oppgaven er lagt til.'
 );

 // Check empty input doesn't add task
 await page.click('#add-btn');
 await new Promise(r => setTimeout(r, 300));
 const taskItemsAfterEmpty = await page.$$('#task-list li');
 check(
 'Tomme oppgaver legges ikke til',
 taskItemsAfterEmpty.length === taskItems.length,
 'En tom oppgave ble lagt til. Sjekk at du stopper funksjonen hvis input er tomt.'
 );
 } else {
 check('Klikk på knappen legger til oppgave', false, 'Kunne ikke finne input-felt eller knapp for å teste.');
 check('Input-feltet tømmes etter tillegg', false, 'Kunne ikke teste — mangler input-felt eller knapp.');
 check('Tomme oppgaver legges ikke til', false, 'Kunne ikke teste — mangler input-felt eller knapp.');
 }
 }

 // ===== STEP 4: Flexbox & styling =====
 if (step >= 4) {
 const css = readFile('style.css') || '';
 const html = readFile('index.html') || '';

 check(
 'display: flex er brukt',
 css.includes('display: flex') || css.includes('display:flex'),
 'Fant ingen bruk av "display: flex" i style.css. Bruk Flexbox for å organisere layouten.'
 );

 // Check visual alignment of input and button
 const inputBox = await page.$eval('#task-input', el => {
 const rect = el.getBoundingClientRect;
 return { top: rect.top, bottom: rect.bottom };
 }).catch( => null);
 const btnBox = await page.$eval('#add-btn', el => {
 const rect = el.getBoundingClientRect;
 return { top: rect.top, bottom: rect.bottom };
 }).catch( => null);

 if (inputBox && btnBox) {
 const sameRow = Math.abs(inputBox.top - btnBox.top) < 30;
 check(
 'Input og knapp er på samme rad',
 sameRow,
 'Input-feltet og knappen ser ikke ut til å være på samme rad. Prøv å bruke display: flex på containeren rundt dem.'
 );
 }

 // Check for custom font
 const hasCustomFont = html.includes('fonts.googleapis.com') ||
 css.match(/font-family\s*:(?!.*(?:arial|times|serif|sans-serif|monospace)\s*[;}\n])/i);
 check(
 'Egendefinert font er brukt',
 hasCustomFont,
 'Fant ingen egendefinert font. Prøv Google Fonts: legg til en <link> i HTML-en og bruk font-family i CSS.'
 );

 // Check for non-default styling
 const hasColors = css.includes('background') || css.includes('color:') || css.includes('color :');
 check(
 'Fargeskjema er brukt',
 hasColors,
 'Fant nesten ingen farger i CSS-en. Legg til bakgrunnsfarger, tekstfarger osv. for å gi appen din et personlig preg!'
 );
 }

 // ===== STEP 5: Delete tasks =====
 if (step >= 5) {
 // Clear and add a fresh task
 await page.evaluate( => {
 document.getElementById('task-list').innerHTML = '';
 });
 await page.type('#task-input', 'Oppgave som skal slettes');
 await page.click('#add-btn');
 await new Promise(r => setTimeout(r, 500));

 const deleteBtn = await page.$('#task-list li button');
 check(
 'Oppgaver har slett-knapp',
 deleteBtn !== null,
 'Fant ingen <button> inne i oppgaveelementene. Legg til en slett-knapp i hvert <li>-element.'
 );

 if (deleteBtn) {
 const deleteBtnText = await page.evaluate(el => el.textContent || el.innerHTML, deleteBtn);
 check(
 'Slett-knapp har synlig tekst/ikon',
 deleteBtnText.trim.length > 0,
 'Slett-knappen ser ut til å være tom. Legg til tekst som "X" eller "Slett".'
 );

 // Add another task, then delete the first one
 await page.type('#task-input', 'Oppgave som skal beholdes');
 await page.click('#add-btn');
 await new Promise(r => setTimeout(r, 300));

 const countBefore = await page.$$eval('#task-list li', els => els.length);
 await deleteBtn.click;
 await new Promise(r => setTimeout(r, 300));
 const countAfter = await page.$$eval('#task-list li', els => els.length);

 check(
 'Klikk på slett fjerner oppgaven',
 countAfter === countBefore - 1,
 'Oppgaven ble ikke fjernet etter klikk. Bruk li.remove i slett-knappens event listener.'
 );

 // Check remaining task is intact
 if (countAfter > 0) {
 const remainingText = await page.$eval('#task-list li', el => el.textContent);
 check(
 'Andre oppgaver er upåvirket',
 remainingText.includes('beholdes'),
 'Det ser ut som feil oppgave ble slettet, eller andre oppgaver ble påvirket.'
 );
 }
 }
 }

 // ===== STEP 6: Toggle completed =====
 if (step >= 6) {
 await page.evaluate( => {
 document.getElementById('task-list').innerHTML = '';
 });
 await page.type('#task-input', 'Klikk-test');
 await page.click('#add-btn');
 await new Promise(r => setTimeout(r, 500));

 const li = await page.$('#task-list li');
 if (li) {
 // Click on the li (or its text span)
 const clickTarget = await page.$('#task-list li span') || li;
 await clickTarget.click;
 await new Promise(r => setTimeout(r, 300));

 const hasCompleted = await page.$eval('#task-list li', el =>
 el.classList.contains('completed')
 );
 check(
 'Klikk gir visuell "ferdig"-status',
 hasCompleted,
 'Oppgaven fikk ikke klassen "completed" etter klikk. Bruk classList.toggle("completed").'
 );

 // Check CSS for completed style
 const css = readFile('style.css') || '';
 check(
 'Ferdige oppgaver har gjennomstreking eller annen endring',
 css.includes('.completed') && (css.includes('line-through') || css.includes('opacity') || css.includes('text-decoration')),
 'Fant ingen styling for .completed i CSS. Legg til f.eks. text-decoration: line-through.'
 );

 // Toggle back
 await clickTarget.click;
 await new Promise(r => setTimeout(r, 300));
 const stillCompleted = await page.$eval('#task-list li', el =>
 el.classList.contains('completed')
 );
 check(
 'Kan fjerne "ferdig"-markering ved å klikke igjen',
 !stillCompleted,
 'Klassen "completed" ble ikke fjernet ved nytt klikk. classList.toggle skal håndtere dette automatisk.'
 );
 }
 }

 // ===== STEP 7: localStorage =====
 if (step >= 7) {
 // Clear and add tasks, then check localStorage
 await page.evaluate( => {
 localStorage.clear;
 document.getElementById('task-list').innerHTML = '';
 });

 await page.type('#task-input', 'Lagret oppgave');
 await page.click('#add-btn');
 await new Promise(r => setTimeout(r, 500));

 const stored = await page.evaluate( => localStorage.getItem('tasks'));
 check(
 'Oppgaver lagres til localStorage',
 stored !== null,
 'Fant ingenting i localStorage under nøkkelen "tasks". Bruk localStorage.setItem("tasks", JSON.stringify(...)).'
 );

 if (stored) {
 let parsed;
 try {
 parsed = JSON.parse(stored);
 check(
 'JSON.stringify/JSON.parse brukes',
 Array.isArray(parsed),
 'Dataen i localStorage er ikke en gyldig JSON-array. Bruk JSON.stringify for å lagre og JSON.parse for å lese.'
 );
 } catch {
 check('JSON.stringify/JSON.parse brukes', false, 'Kunne ikke parse dataen i localStorage som JSON.');
 }

 // Check that completed state is stored
 if (parsed && parsed.length > 0) {
 const hasCompletedProp = parsed[0].hasOwnProperty('completed');
 check(
 '"Ferdig"-status lagres',
 hasCompletedProp,
 'Oppgaveobjektene i localStorage mangler en "completed"-egenskap. Lagre { text: "...", completed: true/false }.'
 );
 }
 }

 // Reload page and check if tasks are loaded
 await page.reload({ waitUntil: 'networkidle0' });
 await new Promise(r => setTimeout(r, 500));

 const tasksAfterReload = await page.$$('#task-list li');
 check(
 'Oppgaver lastes fra localStorage ved sideåpning',
 tasksAfterReload.length > 0,
 'Ingen oppgaver dukket opp etter sideoppdatering. Kall loadTasks når siden laster.'
 );

 // Delete and check localStorage is updated
 if (tasksAfterReload.length > 0) {
 const delBtn = await page.$('#task-list li button');
 if (delBtn) {
 await delBtn.click;
 await new Promise(r => setTimeout(r, 500));
 const storedAfterDelete = await page.evaluate( => localStorage.getItem('tasks'));
 const parsedAfterDelete = storedAfterDelete ? JSON.parse(storedAfterDelete) : [];
 check(
 'Slettede oppgaver fjernes fra localStorage',
 parsedAfterDelete.length === 0,
 'Etter sletting er oppgaven fortsatt i localStorage. Kall saveTasks etter sletting.'
 );
 }
 }
 }

 // ===== STEP 8: Polish =====
 if (step >= 8) {
 const css = readFile('style.css') || '';

 // Check responsive
 check(
 'Appen er responsiv',
 css.includes('@media'),
 'Fant ingen @media-query i CSS-en. Bruk @media (max-width: 600px) { ... } for å tilpasse mobilvisning.'
 );

 // Check animation/transition
 const hasAnimation = css.includes('transition') || css.includes('@keyframes') || css.includes('animation');
 check(
 'CSS-overgang eller animasjon er brukt',
 hasAnimation,
 'Fant ingen transition eller animation i CSS-en. Legg til f.eks. transition: background-color 0.3s ease på en knapp.'
 );

 // Check Enter key support
 await page.evaluate( => {
 document.getElementById('task-list').innerHTML = '';
 localStorage.clear;
 });
 await page.type('#task-input', 'Enter-test');
 await page.keyboard.press('Enter');
 await new Promise(r => setTimeout(r, 500));

 const tasksAfterEnter = await page.$$('#task-list li');
 check(
 'Enter-tasten legger til oppgave',
 tasksAfterEnter.length > 0,
 'Trykk på Enter la ikke til en oppgave. Bruk input.addEventListener("keydown", ...) og sjekk event.key === "Enter".'
 );

 // Check for task counter
 const pageText = await page.evaluate( => document.body.innerText);
 const hasCounter = /\d+\s*(oppgave|tasks?|gjøremål|fullført|igjen)/i.test(pageText) ||
 /\d+\s*(av|of)\s*\d+/i.test(pageText);
 check(
 'Oppgaveteller vises',
 hasCounter,
 'Fant ingen oppgaveteller på siden. Vis f.eks. "3 oppgaver" eller "2 av 5 fullført" et sted på siden.'
 );

 // Check no console errors
 const consoleErrors = [];
 page.on('pageerror', err => consoleErrors.push(err.message));
 await page.reload({ waitUntil: 'networkidle0' });
 await new Promise(r => setTimeout(r, 500));
 check(
 'Ingen konsoll-feil',
 consoleErrors.length === 0,
 `Det er feil i konsollen: ${consoleErrors.join('; ')}. Åpne DevTools (F12) → Console for å feilsøke.`
 );
 }

 await browser.close;
 } catch (err) {
 if (browser) await browser.close;
 console.error('Browser check error:', err.message);
 // Don't fail silently — add a check result
 check('Nettlesertesting', false, `Kunne ikke kjøre nettlesertester: ${err.message}`);
 }
}

// Run everything
(async => {
 await runBrowserChecks;

 // Write results
 fs.writeFileSync('results.json', JSON.stringify(results, null, 2));
 console.log(JSON.stringify(results, null, 2));

 // Exit with appropriate code
 process.exit(results.passed ? 0 : 1);
});
```

**IMPORTANT NOTES for check.js:**
- All checks are cumulative. Step 5 also checks steps 1-4.
- All check names and failure reasons are in Norwegian.
- The `check` function takes a name, a boolean, and a specific failure reason with guidance.
- Steps 1-2 use static file analysis (cheerio). Steps 3-8 use Puppeteer for live browser testing.
- The script writes `results.json` with a `{ passed, step, checks }` structure.

---

### 6. `.github/grading/screenshot.js`

```javascript
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async => {
 // Don't crash if index.html doesn't exist yet
 if (!fs.existsSync('index.html')) {
 console.log('index.html not found, skipping screenshot');
 // Create a placeholder image
 fs.writeFileSync('screenshot.png', Buffer.alloc(0));
 return;
 }

 const browser = await puppeteer.launch({
 headless: 'new',
 args: ['--no-sandbox', '--disable-setuid-sandbox']
 });

 const page = await browser.newPage;
 await page.setViewport({ width: 1280, height: 800 });

 const filePath = path.resolve('index.html');
 await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0' });

 // For steps that have JS functionality, simulate some interactions
 // so the screenshot shows the app in use
 try {
 const input = await page.$('#task-input');
 const btn = await page.$('#add-btn');
 if (input && btn) {
 await input.type('Eksempeloppgave 1');
 await page.click('#add-btn');
 await new Promise(r => setTimeout(r, 300));

 await input.type('Eksempeloppgave 2');
 await page.click('#add-btn');
 await new Promise(r => setTimeout(r, 300));

 await input.type('Eksempeloppgave 3 (ferdig!)');
 await page.click('#add-btn');
 await new Promise(r => setTimeout(r, 300));

 // Try to mark the last one as completed
 const items = await page.$$('#task-list li');
 if (items.length > 0) {
 const lastItem = items[items.length - 1];
 const span = await lastItem.$('span');
 if (span) await span.click;
 else await lastItem.click;
 }
 }
 } catch (e) {
 // Interactions are best-effort — don't fail the screenshot
 }

 await new Promise(r => setTimeout(r, 500));

 await page.screenshot({
 path: 'screenshot.png',
 fullPage: true,
 type: 'png'
 });

 await browser.close;
 console.log('Screenshot saved to screenshot.png');
});
```

---

### 7. `.github/grading/post-results.js`

This script is called by the workflow. It reads `results.json`, uploads the screenshot, posts a comment on the current issue, and manages issue transitions. It takes the current issue number and step as arguments.

```javascript
const fs = require('fs');
const path = require('path');

// This script is meant to be run via actions/github-script,
// so `github`, `context`, and `core` are available globally.
// However, we export a function that the workflow calls.

module.exports = async ({ github, context, core }) => {
 const results = JSON.parse(fs.readFileSync('.github/grading/results.json', 'utf8'));
 const issues = JSON.parse(fs.readFileSync('.github/grading/issues.json', 'utf8'));

 const owner = context.repo.owner;
 const repo = context.repo.repo;

 // Find current open assignment issue
 const openIssues = await github.rest.issues.listForRepo({
 owner, repo,
 state: 'open',
 labels: 'oppgave',
 sort: 'created',
 direction: 'asc'
 });

 if (openIssues.data.length === 0) {
 core.info('No open assignment issues found.');
 return;
 }

 const currentIssue = openIssues.data[0];
 const currentStep = results.step;

 // Upload screenshot
 let screenshotUrl = '';
 const screenshotPath = '.github/grading/screenshot.png';
 if (fs.existsSync(screenshotPath) && fs.statSync(screenshotPath).size > 0) {
 try {
 // Upload as issue comment image
 const imageBuffer = fs.readFileSync(screenshotPath);
 const base64 = imageBuffer.toString('base64');
 // GitHub doesn't have a direct image upload API for issues,
 // so we'll use a markdown trick with a repository file
 // For simplicity, we include it as a base64 data URL in the comment
 // Note: GitHub markdown doesn't support data URIs in issues.
 // Instead, we'll commit the screenshot to a branch.

 const branchName = 'screenshots';
 const fileName = `screenshots/step-${currentStep}-${Date.now}.png`;

 // Ensure screenshots branch exists
 try {
 await github.rest.git.getRef({ owner, repo, ref: `heads/${branchName}` });
 } catch {
 // Create branch from main
 const mainRef = await github.rest.git.getRef({ owner, repo, ref: 'heads/main' });
 await github.rest.git.createRef({
 owner, repo,
 ref: `refs/heads/${branchName}`,
 sha: mainRef.data.object.sha
 });
 }

 // Get current commit on screenshots branch
 const branch = await github.rest.git.getRef({ owner, repo, ref: `heads/${branchName}` });
 const commit = await github.rest.git.getCommit({ owner, repo, commit_sha: branch.data.object.sha });

 // Create blob
 const blob = await github.rest.git.createBlob({
 owner, repo,
 content: base64,
 encoding: 'base64'
 });

 // Create tree
 const tree = await github.rest.git.createTree({
 owner, repo,
 base_tree: commit.data.tree.sha,
 tree: [{
 path: fileName,
 mode: '100644',
 type: 'blob',
 sha: blob.data.sha
 }]
 });

 // Create commit
 const newCommit = await github.rest.git.createCommit({
 owner, repo,
 message: `Skjermbilde for steg ${currentStep}`,
 tree: tree.data.sha,
 parents: [branch.data.object.sha]
 });

 // Update branch ref
 await github.rest.git.updateRef({
 owner, repo,
 ref: `heads/${branchName}`,
 sha: newCommit.data.sha
 });

 screenshotUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branchName}/${fileName}`;
 } catch (err) {
 core.warning(`Could not upload screenshot: ${err.message}`);
 }
 }

 // Build the comment
 let comment = '';

 if (results.passed) {
 comment += `## Steg ${currentStep} er godkjent!\n\n`;
 comment += `Bra jobba! Alle sjekkene er bestått. `;
 if (currentStep < 8) {
 comment += `Neste oppgave er klar for deg — sjekk Issues-fanen!\n\n`;
 } else {
 comment += `**Du har fullført hele prosjektet! Gratulerer!**\n\n`;
 }
 } else {
 comment += `## Steg ${currentStep} — nesten der!\n\n`;
 comment += `Noen av sjekkene ble ikke bestått. Det er helt normalt — les tilbakemeldingen under og prøv igjen!\n\n`;
 }

 // Add checklist
 comment += `### Sjekkliste\n\n`;
 for (const c of results.checks) {
 const icon = c.passed ? '[BESTATT]' : '[FEILET]';
 comment += `- ${icon} **${c.name}**`;
 if (!c.passed && c.reason) {
 comment += `\n > ${c.reason}`;
 }
 comment += `\n`;
 }

 // Add screenshot
 if (screenshotUrl) {
 comment += `\n### Slik ser siden din ut nå\n\n`;
 comment += `![Skjermbilde av siden](${screenshotUrl})\n`;
 }

 // Post the comment
 await github.rest.issues.createComment({
 owner, repo,
 issue_number: currentIssue.number,
 body: comment
 });

 // If passed: close current issue and open next one
 if (results.passed) {
 // Close current issue
 await github.rest.issues.update({
 owner, repo,
 issue_number: currentIssue.number,
 state: 'closed'
 });

 // Open next issue if there is one
 const nextStep = currentStep + 1;
 const nextIssueData = issues.find(i => i.step === nextStep);

 if (nextIssueData) {
 // Ensure labels exist
 for (const label of nextIssueData.labels) {
 try {
 await github.rest.issues.getLabel({ owner, repo, name: label });
 } catch {
 await github.rest.issues.createLabel({
 owner, repo,
 name: label,
 color: label === 'oppgave' ? '0075ca' : 'e4e669'
 });
 }
 }

 await github.rest.issues.create({
 owner, repo,
 title: nextIssueData.title,
 body: nextIssueData.body,
 labels: nextIssueData.labels
 });
 }
 }
};
```

---

### 8. `.github/workflows/setup.yml`

This workflow runs ONCE when the repository is first created (the student's copy). It creates Issue #1 and the "oppgave" label.

```yaml
name: Setup First Issue
on:
 push:
 branches: [main]

jobs:
 setup:
 runs-on: ubuntu-latest
 # Only run if no issues exist yet (first time setup)
 steps:
 - uses: actions/checkout@v4

 - name: Check if setup is needed
 id: check
 uses: actions/github-script@v7
 with:
 script: |
 const issues = await github.rest.issues.listForRepo({
 owner: context.repo.owner,
 repo: context.repo.repo,
 state: 'all'
 });
 core.setOutput('needs_setup', issues.data.length === 0 ? 'true' : 'false');

 - name: Create labels
 if: steps.check.outputs.needs_setup == 'true'
 uses: actions/github-script@v7
 with:
 script: |
 const labels = [
 { name: 'oppgave', color: '0075ca', description: 'Oppgave som skal løses' },
 { name: 'steg-1', color: 'e4e669', description: 'Steg 1' }
 ];
 for (const label of labels) {
 try {
 await github.rest.issues.createLabel({
 owner: context.repo.owner,
 repo: context.repo.repo,
 ...label
 });
 } catch (e) {
 // Label might already exist
 }
 }

 - name: Create first issue
 if: steps.check.outputs.needs_setup == 'true'
 uses: actions/github-script@v7
 with:
 script: |
 const fs = require('fs');
 const issues = JSON.parse(fs.readFileSync('.github/grading/issues.json', 'utf8'));
 const first = issues.find(i => i.step === 1);

 await github.rest.issues.create({
 owner: context.repo.owner,
 repo: context.repo.repo,
 title: first.title,
 body: first.body,
 labels: first.labels
 });
```

---

### 9. `.github/workflows/validate.yml`

This is the main workflow. It runs on every push to `main`.

```yaml
name: Sjekk oppgaven
on:
 push:
 branches: [main]

# Prevent concurrent runs to avoid race conditions
concurrency:
 group: grading-${{ github.ref }}
 cancel-in-progress: true

permissions:
 issues: write
 contents: write

jobs:
 validate:
 runs-on: ubuntu-latest
 steps:
 - uses: actions/checkout@v4

 - uses: actions/setup-node@v4
 with:
 node-version: 20

 - name: Install grading dependencies
 working-directory: .github/grading
 run: npm ci

 - name: Determine current step
 id: current
 uses: actions/github-script@v7
 with:
 script: |
 const issues = await github.rest.issues.listForRepo({
 owner: context.repo.owner,
 repo: context.repo.repo,
 state: 'open',
 labels: 'oppgave',
 sort: 'created',
 direction: 'asc'
 });

 if (issues.data.length === 0) {
 core.setOutput('step', '0');
 core.setOutput('has_issue', 'false');
 return;
 }

 const current = issues.data[0];
 // Extract step number from title "Steg X: ..."
 const match = current.title.match(/Steg\s+(\d+)/i);
 const step = match ? match[1] : '0';

 core.setOutput('step', step);
 core.setOutput('issue_number', current.number.toString);
 core.setOutput('has_issue', 'true');

 - name: Run validation checks
 if: steps.current.outputs.has_issue == 'true'
 working-directory: .github/grading
 run: node check.js ${{ steps.current.outputs.step }}
 continue-on-error: true

 - name: Capture screenshot
 if: steps.current.outputs.has_issue == 'true'
 working-directory: .github/grading
 run: node screenshot.js
 continue-on-error: true

 - name: Post results and manage issues
 if: steps.current.outputs.has_issue == 'true'
 uses: actions/github-script@v7
 with:
 script: |
 const postResults = require('./.github/grading/post-results.js');
 await postResults({ github, context, core });
```

---

## Important Implementation Notes

### Workflow Permissions
The template repo must have **Actions enabled** and workflow permissions set to **Read and write** so the action can create/close issues and push screenshots. In the template repo go to: Settings → Actions → General → Workflow permissions → **Read and write permissions**.

### Label System
All assignment issues use the label `oppgave` (Norwegian for "task"). Each step also has its own label (`steg-1`, `steg-2`, etc.). The system finds the current step by looking for the open issue with the `oppgave` label.

### Screenshot Branch
Screenshots are committed to a `screenshots` branch so they don't clutter the student's main branch. The images are referenced by their raw GitHub URL in issue comments.

### Concurrency
The validate workflow uses a concurrency group. If a student pushes multiple times quickly, only the latest push is validated. This avoids race conditions with issue creation.

### Puppeteer on GitHub Actions
Puppeteer runs headless Chrome. On Ubuntu runners it needs the `--no-sandbox` flag. The `package.json` must include puppeteer as a dependency. The runner installs Chromium automatically.

### Cumulative Checks
Each step re-runs all previous checks. If a student accidentally breaks something from a previous step, they'll see that in the feedback. This ensures the app always works end-to-end.

### Error Handling
Every check that can fail gracefully does. If `index.html` doesn't exist, the file checks fail but the script doesn't crash. If Puppeteer can't launch, a descriptive error is added to the results. The `continue-on-error: true` flags in the workflow ensure the results are always posted even if a check script exits with code 1.

### Norwegian Language
**All** user-facing text must be in Norwegian Bokmål:
- Issue titles and bodies
- Check names in the checklist
- Failure reasons / feedback messages
- Hints and tips
- The README
- Commit messages for screenshots
- Label descriptions

Code identifiers (variable names, function names, CSS class names, file names) stay in English, as is standard practice.

### Student Experience
When a student pushes code:
1. They see a running workflow in the Actions tab (takes ~30-60 seconds)
2. A comment appears on their current issue with a / checklist
3. If they pass, the issue closes and a new one opens — they get a notification
4. If they fail, they read the feedback, fix their code, and push again
5. This repeats until all 8 steps are complete

The goal is a smooth, game-like progression where each push gives immediate, clear feedback. The student never needs to understand GitHub Actions — they just read issues, write code, and push.

---

## Testing Checklist

After creating the template repo, verify:

- [ ] `npm ci` works in `.github/grading/`
- [ ] `issues.json` is valid JSON with all 8 issues
- [ ] `check.js` runs for each step without crashing (even when files are missing)
- [ ] `screenshot.js` runs and creates a PNG (even on an empty page)
- [ ] `post-results.js` exports a function that can be called by `actions/github-script`
- [ ] `setup.yml` creates the first issue on initial push
- [ ] `validate.yml` triggers on push to main
- [ ] All Norwegian text reads naturally and is encouraging
- [ ] Each issue is clear enough for a teenager with no prior experience
- [ ] The README explains the process clearly

---

## Summary

This template creates a self-paced, automatically graded, 8-step assignment that takes a student from zero to a complete to-do app with localStorage persistence. Every push triggers validation, every issue provides detailed feedback in Norwegian, and the progression is fully automated. The student just needs to read, code, and push.
