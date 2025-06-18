# ITS Verifica Frontend

Frontend React per l'applicazione di autenticazione e gestione utenti con ruoli. Questo progetto implementa un'interfaccia utente completa per la gestione dell'autenticazione, con supporto per utenti normali e amministratori.

## Caratteristiche

- **Autenticazione completa**: Login e registrazione con validazione dei form tramite Formik e Yup
- **Gestione stato**: Context API per la gestione dello stato di autenticazione
- **Protezione delle rotte**: Accesso condizionale alle pagine in base al ruolo utente
- **UI moderna**: Interfaccia utente responsive con Material UI
- **Gestione token JWT**: Intercettori Axios per la gestione automatica dei token

## Struttura del progetto

- `/src/components`: Componenti riutilizzabili dell'applicazione
  - `/auth`: Componenti per l'autenticazione (LoginForm, RegisterForm, ProtectedRoute)
  - `/layout`: Componenti di layout (MainLayout con header, menu laterale e footer)
- `/src/context`: Context API per la gestione dello stato globale
- `/src/pages`: Pagine dell'applicazione (Home, Login, Register, Dashboard)
- `/src/services`: Servizi per le chiamate API
- `/src/theme.js`: Configurazione del tema Material UI

## Installazione

```bash
# Installazione delle dipendenze
npm install

# Avvio del server di sviluppo
npm run dev
```

## Configurazione

Crea un file `.env` nella root del progetto con le seguenti variabili:

```
VITE_API_URL=http://localhost:3000/api
```

## Dipendenze principali

- React con Vite
- Material UI per i componenti dell'interfaccia
- Axios per le chiamate API
- Formik e Yup per la gestione e validazione dei form
- React Router DOM per la gestione delle rotte

## Integrazione con il backend

Questo frontend si integra con un backend Express.js che fornisce API per l'autenticazione e la gestione degli utenti. Assicurati che il backend sia in esecuzione prima di utilizzare l'applicazione.

## Licenza

ISC
