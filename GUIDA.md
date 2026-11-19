# GUIDA — Habit Tracker

Guida didattica al progetto. L'obiettivo: saper spiegare ogni scelta a un colloquio. È il primo progetto con **Zustand**.

## 1. Cosa fa l'app

Tieni traccia delle abitudini quotidiane. Crei un'abitudine (nome, colore, obiettivo di giorni a settimana, note), la spunti giorno per giorno nella vista settimanale e vedi: i giorni fatti questa settimana rispetto all'obiettivo, la **serie attuale**, la **serie record**, la **percentuale di completamento** degli ultimi 30 giorni e una **heatmap** degli ultimi 3 mesi. Puoi modificare, archiviare/ripristinare ed eliminare (con conferma) le abitudini, cambiare settimana e scegliere se la settimana inizia di lunedì o di domenica. Dati e tema restano salvati in `localStorage`; al primo avvio ci sono 5 abitudini demo con circa 100 giorni di storia.

## 2. Come avviarla

```bash
npm install     # scarica le dipendenze elencate in package.json (compreso zustand)
npm run dev     # avvia Vite in sviluppo, con hot reload (http://localhost:5173)
npm run build   # `tsc -b` controlla i tipi, poi `vite build` crea la cartella dist/
npm run preview # serve dist/ in locale per provare la versione di produzione
```

## 3. Dove sono le cose

```
index.html                     Entry HTML: meta description, favicon, script anti-flash del tema
vite.config.ts                 Plugin React e Tailwind
tsconfig.app.json              TypeScript strict per il codice in src/
src/
├── main.tsx                   Monta <App/>, importa font e CSS
├── App.tsx                    Provider + <Tracker/>: filtro, abitudine in modifica, settimana
├── index.css                  Import Tailwind, variante dark, design tokens (@theme)
├── types.ts                   Habit, HabitInput, DoneDays, HabitColor, Streaks...
├── store/
│   └── habitStore.ts          Lo store Zustand: stato, azioni, persist
├── state/
│   ├── uiSettingsContext.ts   L'oggetto Context (tema, primo giorno della settimana)
│   └── UiSettingsProvider.tsx Stato persistito + useMemo + Provider
├── hooks/
│   ├── useUiSettings.ts       Legge il context, errore se manca il Provider
│   ├── useToday.ts            "Oggi" sempre corretto, anche oltre la mezzanotte
│   ├── useWeek.ts             La settimana visualizzata e i controlli per spostarsi
│   └── useLocalStorage.ts     useState generico persistito
├── lib/
│   ├── dates.ts               Calcoli sulle date (stringhe YYYY-MM-DD, base UTC)
│   ├── streaks.ts             Serie attuale e serie record
│   ├── stats.ts               Giorni fatti nella settimana, % di completamento
│   ├── colors.ts              Palette dei colori delle abitudini
│   ├── validation.ts          Regole di validazione del form
│   ├── demoData.ts            Abitudini e completamenti demo (deterministici)
│   └── storage.ts             read/write localStorage sicuri (try/catch)
└── components/
    ├── Header.tsx             Etichetta "InnCode Lab", primo giorno settimana, reset demo, tema
    ├── ThemeToggle.tsx        Pulsante tema
    ├── HabitForm.tsx          Form di creazione e modifica
    ├── ColorPicker.tsx        Scelta del colore con radio nativi
    ├── Toolbar.tsx            Filtro attive/archiviate e navigazione tra settimane
    ├── HabitList.tsx          Elenco, stato vuoto
    ├── HabitCard.tsx          Una abitudine: giorni, statistiche, heatmap, azioni
    ├── DayToggle.tsx          Il pulsante di un giorno (aria-pressed)
    ├── Heatmap.tsx            Griglia degli ultimi 3 mesi
    ├── Button.tsx, TextField.tsx, TextAreaField.tsx, Select.tsx, fieldStyles.ts   Componenti condivisi
```

## 4. Il percorso dei dati: spuntare un giorno

1. Clic sul pulsante "Wed 18" in `DayToggle`: chiama `onToggle(date)`.
2. `HabitCard` lo inoltra a `toggleCompletion(habit.id, date)`, un'azione dello store Zustand.
3. L'azione usa `set((state) => ...)`: copia l'oggetto dei giorni di *quella* abitudine, aggiunge o toglie la data e restituisce `completions` con una nuova voce solo per quell'abitudine. Le altre mantengono lo stesso riferimento.
4. Zustand confronta ogni selettore attivo con il valore di prima: il selettore `state.completions[habit.id]` di *questa* card è cambiato, quelli delle altre card no. Solo questa card si ri-renderizza.
5. Dentro la card, `useMemo` vede un nuovo `done` e ricalcola serie e percentuale; `Heatmap` aggiorna la cella.
6. Il middleware `persist` scrive lo stato in `localStorage` (chiave `inncode-habits:store`) senza che tu scriva un `useEffect`.

## 5. La gestione dello stato: cosa sta dove e perché

| Dato | Dove | Perché |
| --- | --- | --- |
| Abitudini e completamenti | Store **Zustand** | Dati dell'applicazione, usati da molti componenti, con tante azioni. |
| Tema e primo giorno della settimana | **Context** | Due preferenze minuscole, lette da pochi componenti, cambiate di rado. |
| Filtro attive/archiviate, abitudine in modifica | `useState` in `Tracker` | Servono solo ai figli diretti. |
| Settimana visualizzata | `useState` dentro `useWeek` | Dettaglio interno dell'hook. |
| Campi del form, errori, conferma eliminazione | `useState` nel componente | Interessano un solo componente. |
| "Oggi" | `useState` dentro `useToday` | Cambia da solo a mezzanotte. |

### Zustand vs `useReducer` + Context (il confronto con il Kanban)

| | `useReducer` + Context (Kanban, Expense Tracker) | Zustand (qui) |
| --- | --- | --- |
| Dove vive lo stato | Dentro un componente Provider | In uno store fuori da React |
| Provider necessario | Sì | No |
| Chi si ri-renderizza | Tutti i consumatori del context quando il value cambia | Solo chi ha un **selettore** il cui risultato è cambiato |
| Azioni | `dispatch({ type, ... })` + reducer | Funzioni nello store, chiamate direttamente |
| Persistenza | Un `useEffect` scritto a mano | Middleware `persist` |
| Dipendenze | Nessuna (è React) | Una libreria (~1 KB) |
| Dev tools | Nessuno incluso | Middleware opzionale |

**Quando conviene Context + Reducer:** stato locale a una zona dell'app, pochi consumatori, nessuna dipendenza extra, logica che vuoi esprimere come azioni tipizzate. **Quando conviene Zustand:** stato globale letto da molti componenti con esigenze diverse (i selettori evitano i render inutili senza dover spezzare i context a mano), persistenza, o azioni chiamate anche da fuori dai componenti. Per un progetto così piccolo entrambi funzionerebbero: la scelta si giustifica con i selettori (ogni card legge solo i suoi completamenti) e con `persist`.

## 6. Ogni hook, nel punto in cui è usato

### Lo store e i selettori — `habitStore.ts`, `HabitCard.tsx`
`create<HabitState>()(persist(...))` crea l'hook `useHabitStore`. Usarlo con un selettore, `useHabitStore((state) => state.habits)`, sottoscrive il componente **solo** a quel pezzo. *Errore comune:* `useHabitStore()` senza selettore, che ti iscrive a tutto lo store (si ridisegna a ogni cambiamento). Un secondo errore: selettori che restituiscono un oggetto nuovo a ogni chiamata (`state => ({ a: state.a })`): sembrano sempre cambiati, quindi causano render infiniti o inutili (in quel caso serve `useShallow`). Le funzioni dello store (`toggleCompletion`, `resetDemo`...) non cambiano mai: selezionarle non causa re-render.

### `persist` — `habitStore.ts`
Salva e rilegge lo stato da `localStorage`. Tre opzioni usate: `name` (chiave), `partialize` (salva solo dati, non le funzioni) e `merge`, dove validiamo ciò che arriva dallo storage: se è corrotto o modificato a mano si torna ai dati demo invece di mandare in crash l'app. `version` permette di scrivere migrazioni se un giorno cambia la forma dei dati.

### `useContext` (via `use`) — `useUiSettings.ts`
Legge il context e lancia un errore chiaro se manca il Provider. Il `value` del Provider è avvolto in `useMemo` (vedi sotto), altrimenti sarebbe un oggetto nuovo a ogni render.

### `useMemo` — `HabitCard.tsx`, `Heatmap.tsx`, `UiSettingsProvider.tsx`, `App.tsx`, `useWeek.ts`
- `computeStreaks(done, today)` e `completionRate(...)` nella card: dipendono solo da `done`, `habit` e `today`. Se cambia un'altra abitudine non si rifanno.
- Heatmap: costruisce i 91 giorni una volta per cambio di dati.
- `UiSettingsProvider`: stabilizza il `value` del context.
- `App.tsx`: lista filtrata e contatori.
- `useWeek`: l'array dei 7 giorni, così resta lo stesso riferimento finché non cambia la settimana.

**Quando `useMemo` NON serve:** calcoli banali (`countDone` su 7 giorni lo faccio direttamente nel render) e valori usati solo come stringhe/numeri. Con 5 abitudini la differenza di prestazioni sarebbe invisibile: lo usiamo perché le serie scorrono centinaia di giorni per card e perché mostra il pattern; in un colloquio dì chiaramente che si misura prima di ottimizzare.

### `useEffect` + `useRef` — `useToday.ts`
Se lasci l'app aperta oltre la mezzanotte, "oggi" non deve restare quello del caricamento. L'effect pianifica un `setTimeout` fino alla prossima mezzanotte, aggiorna `today` e ripianifica. Il `useRef` conserva l'id del timer: serve in due punti diversi (per cancellarlo nella cleanup e prima di ripianificare) ma non va mostrato a schermo, quindi non è stato. Aggiungiamo anche un listener su `visibilitychange`: i timer vengono sospesi mentre il portatile dorme o la scheda è in background, quindi appena torni sulla pagina ricontrolliamo la data. La **cleanup** (clearTimeout + removeEventListener) evita timer duplicati, per esempio in StrictMode che monta due volte. `setToday` con la stessa stringa non provoca un nuovo render. *Errore comune:* usare `setInterval` ogni secondo, sprecando lavoro.

### Custom hook `useWeek` — `useWeek.ts`
Incapsula la logica delle date: tiene solo un `offset` (quante settimane da quella corrente) e ricava i 7 giorni, l'etichetta e le azioni (`goToPrevious`, `goToNext`, `goToToday`). Salvare l'offset invece di una data fa sì che la settimana visualizzata segua `today` e `weekStartsOn` senza sincronizzazioni.

### `useId` — `TextField.tsx`, `TextAreaField.tsx`, `Select.tsx`, `ColorPicker.tsx`
Id unici e stabili per `label htmlFor`, `aria-describedby` e per il `name` del gruppo di radio. Niente id scritti a mano: il form compare più volte e i duplicati romperebbero l'accessibilità.

### `useState`
Stato locale: campi del form, errori, conferme, filtro, abitudine in modifica.

### Il trucco della `key` — `App.tsx`
`<HabitForm key={editing?.id ?? 'new'} />`: cambiando la `key` React rimonta il form e rilegge i valori iniziali, senza un effect che copia props nello stato.

## 7. I concetti TypeScript usati

- **Union di stringhe** per `HabitColor`, `HabitFilter`, `Theme`, `WeekStart` (`0 | 1`): valori ammessi controllati dal compilatore.
- **Utility types**: `Pick<Habit, ...>` per `HabitInput`, `Record<string, DoneDays>` per i completamenti, `Partial<Record<...>>` per gli errori.
- **Type guard** (`isHabit`, `isPersistedState`): validano dati `unknown` letti dallo storage.
- **Interfaccia dello store** (`HabitState`) che unisce dati e azioni: `create<HabitState>()(...)` tipizza tutto, selettori compresi.
- **`extends` su props HTML** (`TextFieldProps extends InputHTMLAttributes<...>`).
- **Destructuring con rest** per rimuovere una chiave senza mutare (`const { [id]: _removed, ...rest } = ...`).
- **`strict: true`**, `noUnusedLocals`, `noUnusedParameters`.

## 8. Le parti specifiche del progetto

### Le date senza librerie
Una data è una stringa `YYYY-MM-DD` (`IsoDate`). Per calcolare ("tra 7 giorni", "che giorno della settimana è") la convertiamo in una data **UTC**: l'UTC non ha ora legale, quindi aggiungere 7 giorni dà sempre esattamente 7 giorni (con l'ora locale, a cavallo del cambio d'ora, potresti ottenere 6 o 8 giorni, o la data sbagliata). Solo `todayISO()` guarda il calendario locale, perché "oggi" è ciò che dice l'orologio dell'utente. `dayNumber(iso)` restituisce i giorni da 1970: due date si confrontano con una sottrazione.

### Come si calcolano le serie (`lib/streaks.ts`)
- **Serie attuale:** parti da oggi (o da ieri se oggi non è ancora spuntato) e vai indietro finché trovi giorni completati. La regola "da ieri" evita che una serie di 12 giorni risulti 0 alle 8 di mattina solo perché non hai ancora spuntato oggi: si interrompe solo quando passa un giorno intero senza check.
- **Serie record:** prendi tutti i giorni completati, li converti in numeri di giorno e li ordini. Scorrendoli, se la differenza con il precedente è esattamente 1 la serie continua, altrimenti riparte da 1; il massimo incontrato è il record.
- Le serie contano **giorni consecutivi**, come richiesto, anche se l'obiettivo è "3 giorni a settimana". Per quell'obiettivo la metrica giusta è la percentuale di completamento.

### Percentuale di completamento (`lib/stats.ts`)
Giorni completati negli ultimi 30 (o dalla creazione, per abitudini più recenti) divisi per i check-in attesi: `obiettivo settimanale × giorni della finestra / 7`. Così "3 volte a settimana" fatto 3 volte a settimana vale 100%, non 43%. Massimo 100%.

### Struttura dei dati
`completions` è `Record<idAbitudine, Record<data, true>>`: cercare un giorno è O(1) (`done['2026-11-19']`), attivare/disattivare significa aggiungere o togliere una chiave, e eliminare un'abitudine rimuove anche i suoi completamenti.

### Heatmap
Una CSS grid con 7 righe e `grid-flow-col`: le celle si dispongono per colonna, una colonna per settimana (13 settimane ≈ 3 mesi). Ogni cella è un `div`; il colore dell'abitudine, scelto dall'utente, è l'unico stile inline. Un solo `aria-label` sul contenitore descrive il grafico, e le singole celle hanno un `title` per il mouse.

### Archiviare vs eliminare
Archiviare mantiene tutta la storia ma toglie l'abitudine dalla settimana; i giorni diventano non cliccabili. Eliminare è definitivo e chiede conferma inline.

### Colore e accessibilità
Il selettore di colore usa radio nativi nascosti (`sr-only`) con un cerchio stilizzato tramite `peer-checked`: frecce, focus e lettura vocale funzionano senza codice. Ogni giorno è un `button` con `aria-pressed` e un'etichetta completa ("Read 20 minutes, Wednesday 18 November").

## 9. Lo stile: come è configurato Tailwind e dove sono i token

Tailwind v4 si configura nel CSS. In `src/index.css`:

- `@import 'tailwindcss';` carica il framework (il plugin `@tailwindcss/vite` lo elabora).
- `@theme { --color-paper: #ededea; ... }` definisce i **design token** di inncode.dev: ogni `--color-*` genera utility (`bg-paper`, `text-muted`, `border-line`...), e `--font-*` i font.
- Token paralleli per il tema scuro (`night`, `night-surface`, `night-line`, `night-muted`) usati con `dark:`.
- `@custom-variant dark (&:where(.dark, .dark *));` attiva `dark:` con la classe `.dark` su `<html>`; lo script in `index.html` la applica prima del primo paint (niente lampo bianco).
- Font di questa app: **Outfit 800** per i titoli (`font-display` + `uppercase`), **Figtree** per il testo, **DM Mono** per etichette e dettagli; installati con Fontsource e importati in `main.tsx` (self-hosted).
- I colori delle abitudini sono scelti a runtime dall'utente, quindi usano `style={{ backgroundColor }}`: una classe Tailwind non può esprimere un valore sconosciuto in fase di build.
- Classi ripetute estratte in componenti (`Button`, `TextField`, `Select`, `DayToggle`).

## 10. Pubblicazione su GitHub e Vercel

1. Crea un repository **pubblico** su GitHub (senza README, ce n'è già uno).
2. Nella cartella del progetto:
   ```bash
   git init
   git add .
   git commit -m "Habit Tracker"
   git branch -M main
   git remote add origin https://github.com/TUO-UTENTE/habit-tracker.git
   git push -u origin main
   ```
   `.gitignore` esclude già `node_modules` e `dist`.
3. Su [vercel.com](https://vercel.com) → **Add New… → Project** → importa il repository.
4. Vercel riconosce Vite: *Build Command* `npm run build`, *Output Directory* `dist`. Premi **Deploy**.
5. Copia l'URL nella riga **Live demo** del `README.md`, fai commit e push: Vercel ripubblica a ogni push.

## 11. Domande da colloquio

1. **Perché Zustand per le abitudini e un Context per le impostazioni?** Dati applicativi, tanti consumatori e persistenza → store con selettori. Due preferenze lette di rado → Context, che è già in React.
2. **Come evita Zustand i render inutili?** Ogni componente sottoscrive un selettore e si ri-renderizza solo se il risultato cambia (confronto per riferimento). Per questo `toggleCompletion` crea un nuovo oggetto solo per l'abitudine toccata.
3. **Quando sceglieresti `useReducer` + Context al posto di Zustand?** Stato locale a una zona, pochi consumatori, niente dipendenze, azioni tipizzate come union discriminata.
4. **Cosa fa il middleware `persist` e come gestisci dati corrotti?** Serializza e legge lo stato da `localStorage`; con `partialize` salvo solo i dati e con `merge` valido l'input, tornando ai demo se non è valido. `version` + `migrate` per i cambi di formato.
5. **Come funziona la serie attuale e perché parte da ieri se oggi non è spuntato?** Va all'indietro finché i giorni sono completati; la regola evita di azzerarla prima che la giornata sia finita.
6. **Perché le date sono stringhe e i calcoli usano UTC?** Niente problemi di fuso e di ora legale: aggiungere giorni è sempre esatto e il confronto è una sottrazione.
7. **Come gestisci l'app aperta oltre la mezzanotte?** `useToday`: timeout fino alla mezzanotte, `useRef` per il timer, cleanup, e ricontrollo su `visibilitychange`.
8. **Perché in `useWeek` salvi un offset e non una data?** La settimana segue `today` e il primo giorno della settimana senza sincronizzazioni né effect.
9. **Perché i completamenti sono un `Record<data, true>` e non un array?** Lookup, inserimento e rimozione in O(1) e confronti di riferimento semplici per i selettori.
10. **Come hai reso accessibile la heatmap e il selettore di colore?** Un `aria-label` per l'intera griglia; radio nativi con `sr-only` e `peer-focus-visible`; `aria-pressed` sui giorni.
11. **Il rischio di selettori che restituiscono oggetti nuovi?** Zustand li vede sempre diversi → render inutili o loop; si risolve selezionando valori primitivi/riferimenti stabili o con `useShallow`.

## 12. Esercizi (in ordine di difficoltà)

1. **Nuovo colore.** Aggiungi un colore in `lib/colors.ts` (e al tipo `HabitColor`). Compare nel selettore, nelle card e nella heatmap senza toccare altro: perché?
2. **Contatore nell'header.** Mostra "x / y abitudini completate oggi" leggendo lo store con un selettore. Quale selettore usi per non ri-renderizzare l'header a ogni spunta di un giorno passato?
3. **Obiettivo settimanale raggiunto.** Mostra un segno ✓ nella card quando i giorni fatti nella settimana visualizzata raggiungono l'obiettivo. Dove calcoli il valore e serve `useMemo`?
4. **Heatmap con intensità.** Aggiungi un'opzione "conteggio" per abitudini che si possono ripetere più volte al giorno (`Record<data, number>`): cambia il tipo, l'azione e la tonalità delle celle. Cosa devi migrare in `persist`? (suggerimento: `version` e `migrate`)
5. **Test della serie.** Scrivi test (Vitest) per `computeStreaks`: serie che attraversa un cambio d'ora, un buco di un giorno, oggi non spuntato, abitudine mai spuntata. Perché `computeStreaks` è facile da testare?
