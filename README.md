# Guide d'installation et d'utilisation

Ce guide vous aidera à installer Minetest, à télécharger et installer des mods, ainsi qu'à configurer votre environnement pour profiter pleinement de votre expérience de jeu.

## Installation de Minetest

- Téléchargez et installez Minetest depuis [le site officiel](https://www.minetest.net/).

- Au lancement du jeu, chercher "Minetest Game" puis l'installer.

- Fermer le jeu.

## Configuration des mods

- Dans les dossiers du jeu, rendez-vous dans le répertoire `mods`.

- Collez le fichier `moditownsv0` dans ce répertoire.

- Dans le dossier `textures`, puis `base`, puis `pack`, collez le fichier image de l’objet iTowns.

- Lancez le jeu Minetest.

- Ouvrez les paramètres du jeu avec l’icône d’engrenages en haut à droite du menu.

- Cochez la fonctionnalité « Afficher les paramètres avancés ».

- Sélectionnez l’onglet « Options de développeur » en bas du menu déroulant.

- Dans la case « Mods de confiance », remplissez avec le nom du dossier que vous avez créé à l’étape précédente puis cliquez sur « Définir ».

- Depuis le menu principal, créez un monde quelconque.

- Fermez le jeu.

## Génération de la carte

- Sur [ce lien](https://minecraft.ign.fr), sélectionnez la zone que vous souhaitez visiter.

- Renseignez les informations demandées puis cliquez sur « Générez votre carte ».

- Téléchargez le dossier qui vous sera envoyé par mail (l’envoi du mail peut être long).

- Dans les dossiers du jeu, rendez-vous dans le répertoire `Worlds`.

- Collez le dossier obtenu et décompressez-le.

- Sortez le dossier du dossier parent afin que Minetest détecte la carte.

## Configuration de iTowns

- Installez iTowns en clonant le git suivant : [itowns-starter-webpack](https://github.com/Desplandis/itowns-starter-webpack).

- Placez le fichier contenant le code du serveur dans un endroit quelconque.

- Téléchargez les bibliothèques Node et Three.

## Lancement du serveur

- Lancez le jeu Minetest.

- Dans l’onglet « Sélectionner les mods », activez le mod que vous avez créé.

- Lancez le serveur à l’aide d’un invite de commande (ex: invite de commande Windows, rendez-vous à l’emplacement du fichier puis exécutez « node serveur.js »).

## Utilisation de iTowns

- Ouvrez le fichier HTML correspondant à la fenêtre iTowns.

- L’objet nommé « iTowns » dans le jeu Minetest correspond au sens de déplacement autorisé par le mod. En fonction de quel sens est activé, il est possible de se déplacer dans Minetest ou dans iTowns.

- Vous pouvez vous déplacer comme bon vous semble dans un sens ou dans l’autre afin de découvrir au mieux la zone que vous souhaitez.

