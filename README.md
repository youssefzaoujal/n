# Invitation — anniversaire de Nouha (11 · 11 · 2026)

Version personnalisée de l'invitation The Sacred Garden : même design et mêmes animations
(enveloppe, cygnes, compte à rebours, programme avec la rose qui descend, lieu, carte,
dress code, cachet de cire, musique), avec les textes de Nouha, ta vidéo d'ouverture Y&N,
un cachet Y&N et la vidéo de Nouha en bas de page.

Le formulaire du cachet est devenu « Un message secret » : un message anonyme pour Nouha.

## Tester

```powershell
cd nouha-invitation
npm install
npm run dev
```

Puis ouvre http://localhost:3000. En local, les messages envoyés sont enregistrés dans
`.data/messages.json`.

## Modifier les textes

- **Textes de la page** (lieu `xxxx`, adresse, dress code, programme, phrases) :
  `src/components/sacredgarden/content.json` — cherche le texte à changer et remplace-le.
- **Carte** : dans le même fichier, remplace `q=Maroc&amp;z=5` dans l'adresse de la carte par
  l'adresse du lieu (ex. `q=Restaurant+X+Rabat&amp;z=15`).
- **Date / heure du compte à rebours** : `src/config.ts`.
- **Vidéos** : `public/media/opening.mp4` (ouverture) et `public/media/nouha.mp4` (bas de page).

Le dossier `_ancien-design/` contient ma première version (non utilisée).

## Droits

Le design, les illustrations, la vidéo des cygnes et la musique viennent du modèle
de Webgency Invitations. Garde cette invitation pour un usage privé (lien envoyé aux amies,
pages non indexées).
