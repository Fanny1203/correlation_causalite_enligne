# Corrélation n'est pas causalité

Une application web interactive pour apprendre à distinguer corrélation et causalité à travers des exemples concrets.

## Description

Cette application propose un quiz interactif où l'utilisateur doit analyser différents scénarios présentant des corrélations entre deux variables. Pour chaque scénario, l'utilisateur doit déterminer la nature de la relation :
- A cause B
- B cause A
- Un facteur tiers influence A et B (facteur de confusion)
- Simple coïncidence

Certains scénarios sont accompagnés de graphiques interactifs permettant de visualiser la corrélation.

## Fonctionnalités

- Interface responsive
- Visualisation des données par graphiques avec axes gradués
- Feedback immédiat sur les réponses
- Affichage du score en temps réel
- Option pour afficher la droite de régression
- Page de conclusion avec bilan personnalisé
- Indication de la source des données (fictive, réelle, ou référencée)

## Structure du projet

- `index.html` - Page d'accueil
- `activite.html` - Page principale du quiz
- `conclusion.html` - Page de résultats
- `script.js` - Logique principale de l'application
- `data.js` - Scénarios et données du quiz
- `tooltips.js` - Définitions et infobulles
- `styles.css` - Styles de l'application

## Technologies utilisées

- HTML5 (avec Canvas pour les graphiques)
- CSS3 (design responsive, notamment graphiques)
- JavaScript simple

## Installation

1. Clonez le dépôt
2. Ouvrez `index.html` dans un navigateur web moderne

## Utilisation pédagogique

Cette application est conçue pour être utilisée dans un contexte éducatif pour :
- Développer l'esprit critique
- Comprendre la différence entre corrélation et causalité
- Apprendre à identifier les facteurs de confusion

## Contribution

Les scénarios peuvent être facilement étendus en modifiant le fichier `data.js`. Chaque scénario doit inclure :
- Une description
- La ou les bonnes réponses possibles
- Les feedbacks pour chaque réponse
- Une source (fictif, reel, ou une référence spécifique)
- Optionnellement, des données pour le graphique avec labels des axes
