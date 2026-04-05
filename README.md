# BDG Motor Show - Application Mobile Officielle

![BDG Motor Show](https://img.shields.io/badge/BDG-Motor%20Show-FF3B1D?style=for-the-badge)
![React Native](https://img.shields.io/badge/React%20Native-Expo-000?style=for-the-badge&logo=expo)
![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-blue?style=for-the-badge)

> Application mobile officielle du **BDG Motor Show** — Le plus grand événement Supercars de Belgique au Circuit de Spa-Francorchamps.

## 🏁 Fonctionnalités

### 📱 Pour les participants
- **Billetterie sécurisée** — QR codes uniques anti-fraude, fin des faux billets
- **Carte interactive** — GPS des paddocks, stands, zones baptêmes, food court
- **Programme live** — Horaires en temps réel avec notifications push
- **Cashless (BDG Coins)** — Monnaie événement intégrée via partenaire cashless
- **Réservation baptêmes** — Booking in-app pour les tours de piste
- **Vote Best Car** — Élisez la plus belle voiture du BDG
- **Galerie communautaire** — Photos/vidéos partagées par les participants
- **Mode offline** — Programme, carte et billet accessibles sans connexion

### 📊 Pour les organisateurs
- **Dashboard temps réel** — Statistiques de fréquentation et ventes
- **Scan QR anti-fraude** — Validation des billets à l'entrée
- **Gestion des flux** — Données de mouvement et affluence par zone
- **Communication directe** — Notifications push ciblées

## 🛠 Stack Technique

| Couche | Technologie |
|--------|------------|
| Frontend | React Native (Expo) |
| Navigation | Expo Router |
| Backend | Supabase (PostgreSQL + Auth + Realtime) |
| Paiement cashless | API Weezevent / Billetweb (partenaire) |
| Notifications | Expo Notifications |
| Carte | React Native Maps |
| Stockage offline | AsyncStorage + SQLite |
| Hébergement | Supabase + Vercel (API) |
| CI/CD | EAS Build + EAS Submit |

## 📁 Structure du projet

```
bdg-app/
├── app/                    # Expo Router (file-based routing)
│   ├── (tabs)/             # Tab navigation
│   │   ├── index.tsx       # Accueil
│   │   ├── map.tsx         # Carte interactive
│   │   ├── program.tsx     # Programme
│   │   ├── tickets.tsx     # Billetterie
│   │   └── coins.tsx       # BDG Coins
│   ├── _layout.tsx         # Root layout
│   └── +not-found.tsx      # 404
├── src/
│   ├── components/         # Composants réutilisables
│   ├── constants/          # Couleurs, config, données
│   ├── utils/              # Helpers, API calls
│   └── assets/             # Images, fonts, icônes
├── supabase/               # Migrations & config DB
├── app.json                # Config Expo
└── package.json
```

## 🚀 Installation

```bash
# Cloner le repo
git clone https://github.com/YOUR_USERNAME/bdg-app.git
cd bdg-app

# Installer les dépendances
npm install

# Lancer en développement
npx expo start

# Lancer sur iOS
npx expo run:ios

# Lancer sur Android
npx expo run:android
```

## 📐 Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  App Mobile  │────▶│   Supabase   │────▶│   PostgreSQL    │
│  (Expo/RN)   │     │  (Backend)   │     │   (Database)    │
└──────┬───────┘     └──────┬───────┘     └─────────────────┘
       │                    │
       │              ┌─────┴──────┐
       │              │  Realtime  │  ← Live updates
       │              └────────────┘
       │
       ├──▶ Weezevent API (Cashless)
       ├──▶ Expo Notifications (Push)
       ├──▶ AsyncStorage (Offline)
       └──▶ React Native Maps (GPS)
```

## 💰 Business Model

| Source de revenu | Montant estimé |
|------------------|----------------|
| Développement initial | 25 000 - 35 000€ |
| Maintenance annuelle | 5 000 - 8 000€/an |
| Commission billetterie (1-1.5%) | 12 000 - 18 000€/an |

## 📋 Roadmap

- [x] Maquette UI/UX
- [ ] Setup Expo + navigation
- [ ] Écran d'accueil
- [ ] Carte interactive
- [ ] Programme & horaires
- [ ] Billetterie QR anti-fraude
- [ ] Intégration cashless API
- [ ] Notifications push
- [ ] Système de votes
- [ ] Mode offline
- [ ] Tests de charge (25 000+ users)
- [ ] Publication App Store & Play Store

## 📄 Licence

Propriétaire — © 2026 Biancola Studio. Tous droits réservés.

---

Développé par **[Biancola Studio](https://biancola.be)** 🇧🇪
