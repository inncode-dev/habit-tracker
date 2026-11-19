# Brief 02 — Habit Tracker

**Stack:** React + Vite + TypeScript + Tailwind + Zustand

Sei un senior frontend developer e un mentor. Crea questo progetto portfolio per un frontend developer che lo presenterà ai colloqui: deve saperne spiegare ogni scelta, quindi il codice e la guida devono essere chiari prima che sofisticati.

## Il progetto

**Campo d'uso:** Tracciare le abitudini quotidiane (es. leggere, allenarsi, bere acqua) e vedere i progressi nel tempo.

**Dati:** Salvati in localStorage tramite il middleware `persist` di Zustand, con alcune abitudini demo al primo avvio.

### Funzionalità
- **CRUD completa delle abitudini**: crea, visualizza, modifica (nome, colore, obiettivo di giorni a settimana, note) ed elimina con conferma; in più archivia / ripristina.
- Vista settimanale: spunta le abitudini completate giorno per giorno.
- Serie attuale e serie record (giorni consecutivi), percentuale di completamento.
- Calendario a griglia degli ultimi 3 mesi per ogni abitudine (stile "heatmap"), fatto con Tailwind.
- Navigazione tra le settimane (precedente, successiva, oggi).
- Filtro abitudini attive / archiviate.

### Gestione dello stato
- **Zustand** per abitudini e completamenti: store unico con azioni, selettori e middleware `persist`. È il primo progetto con Zustand: la guida deve confrontarlo con useReducer + Context del Kanban e spiegare quando conviene l'uno o l'altro.
- **useContext** solo per le impostazioni dell'interfaccia (tema, primo giorno della settimana).
- `useState` per lo stato locale (form, settimana visualizzata).

### Hook e concetti da usare
- Store Zustand tipizzato, con selettori per leggere solo i dati necessari (meno render)
- `useMemo` per calcolare serie e statistiche
- `useEffect` + `useRef` per aggiornare il "giorno di oggi" se l'app resta aperta oltre la mezzanotte
- `useId` per i form
- custom hook `useWeek` per la logica delle date della settimana

### Nota
Gestire le date senza librerie o con una sola libreria leggera (es. date-fns). La guida deve spiegare come vengono calcolate le serie.

## Regole comuni

### Codice
- TypeScript in modalità strict. Codice, nomi e commenti nel codice in **inglese**.
- Livello: né banale né complesso. Codice pulito, leggibile, da professionista.
- Gestione dello stato: **useContext, useReducer e Zustand**, ciascuno dove ha senso (vedi la sezione "Gestione dello stato" del progetto). Niente Redux, niente UI kit, niente librerie di drag and drop: devono emergere React e gli hook.
- Commenti utili: spiegano il *perché* di una scelta, non ripetono il codice.
- Struttura cartelle chiara: `components/`, `hooks/`, `store/` o `state/`, `lib/`, `types.ts`.
- Accessibilità: label collegate agli input, attributi aria dove servono, focus visibile, controlli usabili da tastiera.
- Responsive fino a 375px di larghezza.

### Stile
- **Tailwind CSS (v4)**, niente file CSS custom se non per i design tokens.
- La grafica non è il focus, ma deve essere curata e **discreta**: pulita, ordinata, coerente, con buona spaziatura e gerarchia tipografica. Niente effetti vistosi, gradienti o animazioni superflue.
- Design tokens di inncode.dev definiti come tema Tailwind (`@theme`):

  | Token | Colore |
  | --- | --- |
  | paper | `#ededea` |
  | surface | `#f7f7f5` |
  | ink | `#111111` |
  | muted | `#62625e` |
  | line | `#d2d2cc` |
  | accent | `#4f6b78` |
  | mint | `#dcf2d2` |

- Font (identità propria di questa app): **Outfit 800** per i titoli (maiuscolo), **Figtree** per il testo, **DM Mono** per etichette e dettagli. Self-hosted con Fontsource.
- Tema chiaro e scuro con la variante `dark:` di Tailwind.
- Classi leggibili: se un elemento ne accumula troppe, estrailo in un componente invece di ripetere le stesse classi.
- Header con l'etichetta **"InnCode Lab · Project 02"**.

### Pubblicazione
- Pronto per GitHub pubblico e Vercel: `.gitignore`, favicon, meta description.

## Documentazione da produrre

1. **README.md in inglese**: descrizione, funzionalità, tabella "concetto → file", stack, comandi, struttura delle cartelle, riga "Live demo" da compilare.
2. **GUIDA.md in italiano**, dettagliata e didattica, con queste sezioni:
   1. Cosa fa l'app
   2. Come avviarla (comandi spiegati)
   3. Dove sono le cose (albero dei file con una riga per file)
   4. Il percorso dei dati: un'azione seguita passo passo dal click al risultato
   5. La gestione dello stato: cosa sta dove e perché (Context, Reducer, Zustand o stato locale)
   6. Ogni hook spiegato nel punto esatto in cui è usato: a cosa serve, perché qui e non un'alternativa, errori comuni
   7. I concetti TypeScript usati
   8. Le parti specifiche del progetto
   9. Lo stile: come è configurato Tailwind e dove sono i token
   10. Pubblicazione su GitHub e Vercel passo passo
   11. 8–10 domande da colloquio su questo progetto
   12. 5 esercizi in ordine di difficoltà per verificare di aver capito

## Verifica obbligatoria prima di consegnare
- `npm run build` senza errori TypeScript.
- Prova nel browser di tutte le funzionalità, anche su mobile e in tema scuro.
- Nessun errore in console.

Alla fine riassumi cosa hai fatto e aspetta la mia conferma.
