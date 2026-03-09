const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const repoRoot = path.resolve(__dirname, '../..');
const step = parseInt(process.argv[2]) || 0;
const results = { passed: true, step: step, checks: [] };

// Helper: format inline code for HTML context (used in hints)
function code(str) {
  return '<code>' + str.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code>';
}

// Helper: add a check result
function check(name, passed, failStatus, failHint) {
  results.checks.push({
    name,
    passed: !!passed,
    status: passed ? 'Bestått' : (failStatus || 'Ikke bestått'),
    hint: passed ? null : (failHint || null)
  });
  if (!passed) results.passed = false;
}

// Helper: read file safely
function readFile(filePath) {
  try { return fs.readFileSync(filePath, 'utf8'); } catch (e) { return null; }
}

// ========== STEP 1: File structure ==========
if (step >= 1) {
  const htmlExists = fs.existsSync(path.join(repoRoot, 'index.html'));
  const cssExists = fs.existsSync(path.join(repoRoot, 'style.css'));
  const jsExists = fs.existsSync(path.join(repoRoot, 'script.js'));

  check('index.html finnes', htmlExists,
    'Ikke funnet',
    'Lag filen ' + code('index.html') + ' i hovedmappen');
  check('style.css finnes', cssExists,
    'Ikke funnet',
    'Lag filen ' + code('style.css') + ' i hovedmappen');
  check('script.js finnes', jsExists,
    'Ikke funnet',
    'Lag filen ' + code('script.js') + ' i hovedmappen');

  if (htmlExists) {
    const html = readFile(path.join(repoRoot, 'index.html'));
    const $ = cheerio.load(html);

    check(
      'HTML har <!DOCTYPE html>',
      html.toLowerCase().includes('<!doctype html>'),
      'Mangler',
      'Legg til ' + code('<!DOCTYPE html>') + ' som aller første linje i filen'
    );
    check(
      'CSS er koblet til i HTML',
      $('link[href="style.css"]').length > 0,
      'Ikke funnet',
      'Legg til ' + code('<link rel="stylesheet" href="style.css">') + ' i ' + code('<head>')
    );
    check(
      'JS er koblet til i HTML',
      $('script[src="script.js"]').length > 0,
      'Ikke funnet',
      'Legg til ' + code('<script src="script.js"></script>') + ' rett før ' + code('</body>')
    );
    check(
      'Har <div id="app">',
      $('#app').length > 0,
      'Ikke funnet',
      'Legg til ' + code('<div id="app"></div>') + ' inne i ' + code('<body>')
    );
    check(
      'Tittelen er "To-Do App"',
      $('title').text().trim().toLowerCase().includes('to-do app'),
      'Feil tittel',
      'Sjekk ' + code('<title>') + '-taggen i ' + code('<head>')
    );
  }
}

// ========== STEP 2: Input, button, list ==========
if (step >= 2) {
  const html = readFile(path.join(repoRoot, 'index.html'));
  if (html) {
    const $ = cheerio.load(html);

    check(
      'Input-felt med id="task-input"',
      $('#task-input').length > 0 && $('#task-input').is('input'),
      'Ikke funnet',
      'Legg til ' + code('<input id="task-input">') + ' — sjekk at ID-en er stavet riktig'
    );
    check(
      'Input har placeholder',
      $('#task-input').attr('placeholder'),
      'Mangler',
      'Legg til f.eks. ' + code('placeholder="Skriv en oppgave..."') + ' på input-feltet'
    );
    check(
      'Knapp med id="add-btn"',
      $('#add-btn').length > 0 && ($('#add-btn').is('button') || $('#add-btn').is('input[type="submit"]')),
      'Ikke funnet',
      'Legg til ' + code('<button id="add-btn">Legg til</button>') + ' — sjekk at ID-en er stavet riktig'
    );
    check(
      'Knappen har synlig tekst',
      $('#add-btn').text().trim().length > 0,
      'Tom knapp',
      'Legg til tekst inne i ' + code('<button>') + '-taggen, f.eks. "Legg til"'
    );
    check(
      'Liste med id="task-list"',
      $('#task-list').length > 0,
      'Ikke funnet',
      'Legg til ' + code('<ul id="task-list"></ul>') + ' i HTML-en'
    );
  }
}

// ========== STEP 3-8: Browser checks ==========

async function runBrowserChecks() {
  if (step < 3) return;

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      timeout: 30000
    });
    const page = await browser.newPage();
    page.setDefaultTimeout(10000);
    await page.setViewport({ width: 1280, height: 800 });

    const filePath = path.join(repoRoot, 'index.html');
    await page.goto(pathToFileURL(filePath).href, { waitUntil: 'networkidle0', timeout: 15000 });

    // ===== STEP 3: Adding tasks =====
    if (step >= 3) {
      const inputExists = await page.$('#task-input');
      const btnExists = await page.$('#add-btn');

      if (inputExists && btnExists) {
        await page.type('#task-input', 'Testoppgave');
        await page.click('#add-btn');
        await new Promise(function(r) { setTimeout(r, 500); });

        const taskItems = await page.$$('#task-list li');
        check(
          'Klikk på knappen legger til oppgave',
          taskItems.length > 0,
          'Ingen oppgave lagt til',
          'Sjekk at ' + code('addEventListener') + ' er koblet til knappen og at du lager et ' + code('<li>') + ' i ' + code('#task-list')
        );

        if (taskItems.length > 0) {
          const taskText = await page.evaluate(function(el) { return el.textContent; }, taskItems[0]);
          check(
            'Oppgaven viser riktig tekst',
            taskText.includes('Testoppgave'),
            'Feil tekst',
            'Sjekk at du setter ' + code('li.textContent') + ' til verdien fra input-feltet'
          );
        }

        const inputValue = await page.$eval('#task-input', function(el) { return el.value; });
        check(
          'Input-feltet tømmes etter tillegg',
          inputValue === '',
          'Ikke tømt',
          'Legg til ' + code('input.value = ""') + ' etter at oppgaven er lagt til'
        );

        await page.click('#add-btn');
        await new Promise(function(r) { setTimeout(r, 300); });
        const taskItemsAfterEmpty = await page.$$('#task-list li');
        check(
          'Tomme oppgaver legges ikke til',
          taskItemsAfterEmpty.length === taskItems.length,
          'Tom oppgave ble lagt til',
          'Sjekk at input ikke er tomt før du legger til: ' + code('if (input.value.trim() === "") return')
        );
      } else {
        check('Klikk på knappen legger til oppgave', false, 'Mangler elementer', 'Kunne ikke finne input-felt eller knapp');
        check('Input-feltet tømmes etter tillegg', false, 'Ikke testet', 'Mangler input-felt eller knapp');
        check('Tomme oppgaver legges ikke til', false, 'Ikke testet', 'Mangler input-felt eller knapp');
      }
    }

    // ===== STEP 4: Flexbox & styling =====
    if (step >= 4) {
      const css = readFile(path.join(repoRoot, 'style.css')) || '';
      const html = readFile(path.join(repoRoot, 'index.html')) || '';

      check(
        'display: flex er brukt',
        css.includes('display: flex') || css.includes('display:flex'),
        'Ikke funnet i CSS',
        'Legg til f.eks. ' + code('.input-group { display: flex; }') + ' for å organisere layouten med Flexbox'
      );

      const inputBox = await page.$eval('#task-input', function(el) {
        const rect = el.getBoundingClientRect();
        return { top: rect.top, bottom: rect.bottom };
      }).catch(function() { return null; });
      const btnBox = await page.$eval('#add-btn', function(el) {
        const rect = el.getBoundingClientRect();
        return { top: rect.top, bottom: rect.bottom };
      }).catch(function() { return null; });

      if (inputBox && btnBox) {
        const sameRow = Math.abs(inputBox.top - btnBox.top) < 30;
        check(
          'Input og knapp er på samme rad',
          sameRow,
          'Ikke på samme rad',
          'Bruk ' + code('display: flex') + ' på containeren rundt input og knapp'
        );
      }

      const hasCustomFont = html.includes('fonts.googleapis.com') ||
        html.includes('fonts.bunny.net') ||
        css.includes('@import') ||
        css.includes('@font-face') ||
        css.match(/font-family\s*:.*['"][^'"]+['"]/i);
      check(
        'Egendefinert font er brukt',
        hasCustomFont,
        'Ikke funnet',
        'Prøv Google Fonts: legg til en ' + code('<link>') + ' i HTML og bruk ' + code('font-family: "Fontnavnet", sans-serif') + ' i CSS'
      );

      const hasColors = css.includes('background') || css.includes('color:') || css.includes('color :');
      check(
        'Fargeskjema er brukt',
        hasColors,
        'Nesten ingen farger',
        'Legg til f.eks. ' + code('body { background-color: #f0f0f0; color: #333; }')
      );
    }

    // ===== STEP 5: Delete tasks =====
    if (step >= 5) {
      await page.evaluate(function() {
        document.getElementById('task-list').innerHTML = '';
      });
      await page.type('#task-input', 'Oppgave som skal slettes');
      await page.click('#add-btn');
      await new Promise(function(r) { setTimeout(r, 500); });

      const deleteBtn = await page.$('#task-list li button');
      check(
        'Oppgaver har slett-knapp',
        deleteBtn !== null,
        'Ikke funnet',
        'Legg til en ' + code('<button>') + ' inne i hvert ' + code('<li>') + '-element, f.eks. ' + code('<button>Slett</button>')
      );

      if (deleteBtn) {
        const deleteBtnText = await page.evaluate(function(el) { return el.textContent || el.innerHTML; }, deleteBtn);
        check(
          'Slett-knapp har synlig tekst/ikon',
          deleteBtnText.trim().length > 0,
          'Tom knapp',
          'Legg til tekst i slett-knappen, f.eks. "X" eller "Slett"'
        );

        await page.type('#task-input', 'Oppgave som skal beholdes');
        await page.click('#add-btn');
        await new Promise(function(r) { setTimeout(r, 300); });

        const countBefore = await page.$$eval('#task-list li', function(els) { return els.length; });
        await deleteBtn.click();
        await new Promise(function(r) { setTimeout(r, 300); });
        const countAfter = await page.$$eval('#task-list li', function(els) { return els.length; });

        check(
          'Klikk på slett fjerner oppgaven',
          countAfter === countBefore - 1,
          'Ikke fjernet',
          'Bruk ' + code('li.remove()') + ' i slett-knappens hendelseslytter'
        );

        if (countAfter > 0) {
          const remainingText = await page.$eval('#task-list li', function(el) { return el.textContent; });
          check(
            'Andre oppgaver er upåvirket',
            remainingText.includes('beholdes'),
            'Feil oppgave slettet',
            'Sjekk at du sletter riktig ' + code('<li>') + ' — bruk ' + code('event.target.closest("li").remove()')
          );
        }
      }
    }

    // ===== STEP 6: Toggle completed =====
    if (step >= 6) {
      await page.evaluate(function() {
        document.getElementById('task-list').innerHTML = '';
      });
      await page.type('#task-input', 'Klikk-test');
      await page.click('#add-btn');
      await new Promise(function(r) { setTimeout(r, 500); });

      const li = await page.$('#task-list li');
      if (li) {
        const clickTarget = await page.$('#task-list li span') || li;
        await clickTarget.click();
        await new Promise(function(r) { setTimeout(r, 300); });

        const hasCompleted = await page.$eval('#task-list li', function(el) {
          return el.classList.contains('completed');
        });
        check(
          'Klikk gir visuell "ferdig"-status',
          hasCompleted,
          'Klasse ikke lagt til',
          'Bruk ' + code('li.classList.toggle("completed")') + ' når brukeren klikker på oppgaven'
        );

        const css = readFile(path.join(repoRoot, 'style.css')) || '';
        check(
          'Ferdige oppgaver har gjennomstreking eller annen endring',
          css.includes('.completed') && (css.includes('line-through') || css.includes('opacity') || css.includes('text-decoration')),
          'Ingen styling for .completed',
          'Legg til f.eks. ' + code('.completed { text-decoration: line-through; opacity: 0.6; }')
        );

        await clickTarget.click();
        await new Promise(function(r) { setTimeout(r, 300); });
        const stillCompleted = await page.$eval('#task-list li', function(el) {
          return el.classList.contains('completed');
        });
        check(
          'Kan fjerne "ferdig"-markering ved å klikke igjen',
          !stillCompleted,
          'Klasse ikke fjernet',
          code('classList.toggle') + ' håndterer dette automatisk — sjekk at du bruker ' + code('toggle') + ' og ikke ' + code('add')
        );
      }
    }

    // ===== STEP 7: localStorage =====
    if (step >= 7) {
      await page.evaluate(function() {
        localStorage.clear();
        document.getElementById('task-list').innerHTML = '';
      });

      await page.type('#task-input', 'Lagret oppgave');
      await page.click('#add-btn');
      await new Promise(function(r) { setTimeout(r, 500); });

      const stored = await page.evaluate(function() { return localStorage.getItem('tasks'); });
      check(
        'Oppgaver lagres til localStorage',
        stored !== null,
        'Ingenting lagret',
        'Bruk ' + code('localStorage.setItem("tasks", JSON.stringify(tasks))') + ' etter endringer'
      );

      if (stored) {
        var parsed;
        try {
          parsed = JSON.parse(stored);
          check(
            'JSON.stringify/JSON.parse brukes',
            Array.isArray(parsed),
            'Ugyldig format',
            'Dataen i localStorage må være en JSON-array — bruk ' + code('JSON.stringify') + ' for å lagre og ' + code('JSON.parse') + ' for å lese'
          );
        } catch (e) {
          check('JSON.stringify/JSON.parse brukes', false, 'Ugyldig JSON', 'Kunne ikke parse dataen i localStorage som JSON');
        }

        if (parsed && parsed.length > 0) {
          const hasCompletedProp = parsed[0].hasOwnProperty('completed');
          check(
            '"Ferdig"-status lagres',
            hasCompletedProp,
            'Mangler completed-egenskap',
            'Lagre oppgaver som ' + code('{ text: "...", completed: true/false }')
          );
        }
      }

      await page.reload({ waitUntil: 'networkidle0' });
      await new Promise(function(r) { setTimeout(r, 500); });

      const tasksAfterReload = await page.$$('#task-list li');
      check(
        'Oppgaver lastes fra localStorage ved sideåpning',
        tasksAfterReload.length > 0,
        'Ingen oppgaver etter reload',
        'Kall ' + code('loadTasks()') + ' når siden laster — les fra localStorage og bygg listen'
      );

      if (tasksAfterReload.length > 0) {
        const delBtn = await page.$('#task-list li button');
        if (delBtn) {
          await delBtn.click();
          await new Promise(function(r) { setTimeout(r, 500); });
          const storedAfterDelete = await page.evaluate(function() { return localStorage.getItem('tasks'); });
          const parsedAfterDelete = storedAfterDelete ? JSON.parse(storedAfterDelete) : [];
          check(
            'Slettede oppgaver fjernes fra localStorage',
            parsedAfterDelete.length === 0,
            'Fortsatt lagret etter sletting',
            'Kall ' + code('saveTasks()') + ' etter sletting for å oppdatere localStorage'
          );
        }
      }
    }

    // ===== STEP 8: Polish =====
    if (step >= 8) {
      await page.evaluate(function() {
        document.getElementById('task-list').innerHTML = '';
        localStorage.clear();
      });
      await page.type('#task-input', 'Enter-test');
      await page.keyboard.press('Enter');
      await new Promise(function(r) { setTimeout(r, 500); });

      const tasksAfterEnter = await page.$$('#task-list li');
      check(
        'Enter-tasten legger til oppgave',
        tasksAfterEnter.length > 0,
        'Ingen respons på Enter',
        'Bruk ' + code('input.addEventListener("keydown", function(e) { if (e.key === "Enter") ... })')
      );

      const pageText = await page.evaluate(function() { return document.body.innerText; });
      const hasCounter = /\d+\s*(oppgave|tasks?|gjøremål|fullført|igjen)/i.test(pageText) ||
        /\d+\s*(av|of)\s*\d+/i.test(pageText);
      check(
        'Oppgaveteller vises',
        hasCounter,
        'Ikke funnet',
        'Vis f.eks. "3 oppgaver" eller "2 av 5 fullført" et sted på siden'
      );

      const consoleErrors = [];
      page.on('pageerror', function(err) { consoleErrors.push(err.message); });
      await page.reload({ waitUntil: 'networkidle0' });
      await new Promise(function(r) { setTimeout(r, 500); });
      check(
        'Ingen konsoll-feil',
        consoleErrors.length === 0,
        'Feil i konsollen',
        'Åpne DevTools (F12) → Console for å feilsøke: ' + consoleErrors.map(function(e) { return code(e); }).join(', ')
      );
    }

    await browser.close();
  } catch (err) {
    if (browser) await browser.close();
    console.error('Browser check error:', err.message);
    check('Nettlesertesting', false, 'Feil', 'Kunne ikke kjøre nettlesertester: ' + code(err.message));
  }
}

// Run everything
(async function() {
  await runBrowserChecks();

  // Write results
  fs.writeFileSync('results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));

  // Exit with appropriate code
  process.exit(results.passed ? 0 : 1);
})();
