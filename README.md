# Guide d'installation

Ce guide vous aidera à installer Minetest, à télécharger et installer des mods, ainsi qu'à configurer votre environnement pour profiter pleinement de votre expérience de jeu.

## Installation de Minetest

- Téléchargez et installez Minetest depuis [le site officiel](https://www.minetest.net/).

- Pour lancer l'application, décompressez tout le dossier .zip et rendez vous en bas du dossier bin.

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

- Renseignez les informations demandées en sélectionnant bien le jeu Minetest puis cliquez sur « Générez votre carte ».

- Téléchargez le dossier qui vous sera envoyé par mail (l’envoi du mail peut être long).

- Dans les dossiers du jeu, rendez-vous dans le répertoire `Worlds`.

- Collez le dossier obtenu et décompressez-le.

- Sortez le dossier `minetest_alac` du dossier parent afin que Minetest détecte la carte.

## Configuration de iTowns

- Installez iTowns en clonant le git suivant : [itowns-starter-webpack](https://github.com/Desplandis/itowns-starter-webpack).

- Placez le fichier contenant le code du serveur dans un endroit quelconque.

- Téléchargez les bibliothèques Node et Three.

## Lancement du service

- Lancez le serveur à l’aide d’un invite de commande (ex: invite de commande Windows, rendez-vous à l’emplacement du fichier puis exécutez « node serveur.cjs »).
  
- Lancez le jeu Minetest.

- Dans l’onglet « Sélectionner les mods », activez le mod que vous avez créé et sauvegardez.

- Ouvrez le fichier index.HTML correspondant à la fenêtre iTowns dans le dossier `public`.

- Sélectionnez une carte sur Minetest et cliquer sur `jouer`.

- Raffraichissez la page internet `iTowns` pour afficher la vue.

# Guide d'utilisation

- Par défaut, vous pouvez vous déplacer sur Minetest.

- Récupérez l'objet iTowns en le cherchant dans l'inventaire (appuyez sur la touche `i` pour ouvrir l'inventaire).

- L’objet nommé « iTowns » dans le jeu Minetest change le sens de déplacement autorisé par le mod. Faites un clic gauche avec l'objet en main pour changer le sens de déplacement.

- Lorsque le déplacement de Minetest est désactivé, vous pouvez vous déplacer dans iTowns.

- Si vous désirez changer de carte, assurez vous d'activer le déplacement sur Minetest. Quittez le monde et lancez celui que vous souhaitez comme précédemment. Raffraichissez la page internet `iTowns` pour afficher la vue.
