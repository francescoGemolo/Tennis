# Salandra Tennis

App web per la gestione delle prenotazioni del campo da tennis. Permette ai soci di prenotare il campo, gestire il proprio account e le proprie prenotazioni, e all'amministrazione di vedere e gestire tutte le prenotazioni da un pannello dedicato.

## Stack

- React 19 + TypeScript
- Vite (build e dev server)
- Firebase (Authentication, Firestore)
- Vite PWA plugin (installabile su smartphone)
- Hosting su GitHub Pages, dominio custom `salandratennis.it`

## Requisiti

- Node.js 20+
- Un progetto Firebase con Authentication (Email/Password + Google) e Firestore attivi

## Setup locale

1. Clona il repo e installa le dipendenze:

   ```
   npm install
   ```

2. Copia `.env.example` in `.env` e compila i valori con quelli del tuo progetto Firebase (Project Settings > General > Your apps > Web app):

   ```
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=
   VITE_FIREBASE_MEASUREMENT_ID=
   ```

3. Avvia il dev server:

   ```
   npm run dev
   ```

L'app gira sia in modalità utente normale sia in modalità admin (vedi sotto), ognuna con il proprio entry point.

## Struttura del progetto

```
src/
  auth/          login, registrazione, recupero password, contesto auth
  admin/         pannello di amministrazione (entry point separato, vedi admin/index.html)
  components/    componenti riusabili (modali, campi form, ecc.)
  views/         schermate principali (calendario, prenotazione, account, contatti)
  services/      chiamate a Firebase (auth.ts, bookings.ts, users.ts, firebase.ts)
  hooks/         hook custom
  styles/        css condiviso e design tokens
  config.ts      costanti dell'app (nome, prezzo orario, ecc.)
  types.ts       tipi condivisi
firestore.rules  regole di sicurezza Firestore
firebase.json    config Firebase CLI (hosting per il dominio auth, deploy delle rules)
```

## Pannello amministrazione

Il pannello admin è una seconda single-page app, con il proprio HTML (`admin/index.html`) e il proprio entry point (`src/admin/main.tsx`), buildata insieme al resto da Vite (vedi `vite.config.ts`, sezione `build.rollupOptions.input`).

Per rendere un utente amministratore serve creare manualmente un documento in Firestore nella collezione `admins`, con ID uguale allo `uid` dell'utente Firebase Auth (il contenuto del documento non conta, basta che esista). Senza quel documento, l'app rifiuta l'accesso al pannello anche se le credenziali sono corrette.

## Firebase

Le regole di sicurezza Firestore sono in `firestore.rules`. Per pubblicarle dopo una modifica:

```
firebase deploy --only firestore:rules
```

Il dominio usato per il login (`authDomain`) è un dominio personalizzato (`auth.salandratennis.it`), collegato tramite Firebase Hosting per evitare il branding di default `*.firebaseapp.com` e per compatibilità con Safari/iOS. Per pubblicare modifiche a quella parte (il placeholder in `firebase-hosting/public/`):

```
firebase deploy --only hosting
```

## Build e deploy dell'app

```
npm run build      # compila TypeScript e builda con Vite
npm run deploy     # builda e pubblica su GitHub Pages (branch gh-pages)
```

## Script disponibili

| Script | Cosa fa |
|---|---|
| `npm run dev` | Avvia il dev server Vite |
| `npm run build` | Type-check + build di produzione |
| `npm run lint` | Lint con oxlint |
| `npm run preview` | Serve la build di produzione in locale |
| `npm run deploy` | Build + pubblicazione su GitHub Pages |