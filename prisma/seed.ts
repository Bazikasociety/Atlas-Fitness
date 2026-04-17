/**
 * Seed Atlas Fitness — 12 articles du journal + données démo
 * Exécuter : pnpm prisma db seed
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// Prisma v7 + LibSQL : connexion locale ou Turso selon les env vars
const rawUrl = process.env.DATABASE_URL ?? "file:./dev.db";
// Normalise libsql:// → https:// pour compatibilité HTTP (serverless + seed)
const url = rawUrl.startsWith("libsql://") ? rawUrl.replace("libsql://", "https://") : rawUrl;
const authToken = process.env.TURSO_AUTH_TOKEN;
const adapter = new PrismaLibSql({ url, authToken });
const prisma = new PrismaClient({ adapter });

const ARTICLES = [
  {
    slug: "proteines-combien-en-faut-il",
    title: "Protéines : combien en faut-il vraiment ?",
    excerpt:
      "La confusion autour des apports protéiques est totale. Voici ce que la science dit — sans filtre.",
    category: "NUTRITION",
    coverImage:
      "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&q=80",
    readingTime: 4,
    featured: true,
    content: `## La vérité sur les protéines

La question revient à chaque repas, dans chaque salle de sport : *combien de protéines dois-je manger ?* Les réponses varient de 0,8g à 3g par kilogramme de poids corporel selon les sources. Voici ce que la science établit réellement.

## Ce que l'OMS recommande

L'OMS fixe le minimum à **0,83g/kg/jour** pour un adulte sédentaire. Mais cette valeur correspond au minimum pour éviter la carence — pas à l'optimum pour la performance ou la composition corporelle.

## Pour la pratique sportive

Les recherches les plus robustes (méta-analyses de Morton et al., 2018) convergent vers **1,6 à 2,2g/kg/jour** pour maximiser la synthèse protéique musculaire chez un sportif actif. Au-delà de 2,2g/kg, les bénéfices supplémentaires sont marginaux.

## La répartition compte autant que la quantité

Un détail souvent ignoré : **la distribution des apports au cours de la journée** est aussi importante que la quantité totale. 4 prises de 20-40g de protéines sont plus efficaces qu'une seule prise de 160g.

- **Matin** : œufs, fromage blanc, yaourt grec
- **Midi** : viande maigre, légumineuses, tofu
- **Post-training** : protéines à absorption rapide (whey, blanc d'œuf)
- **Soir** : caséine (fromage blanc, fromage) pour la récupération nocturne

## Conclusion

Pour un sportif visant une amélioration de sa composition corporelle : **visez 1,8 à 2g/kg/jour**, répartis en 3 à 4 repas. Simple. Pas besoin de suppléments si l'alimentation est solide.`,
  },
  {
    slug: "sommeil-et-croissance-musculaire",
    title: "Sommeil et croissance musculaire : le lien que personne ne veut entendre",
    excerpt:
      "Vous pouvez vous entraîner deux fois par jour et manger parfaitement. Sans sommeil, c'est perdu.",
    category: "RECHERCHE",
    coverImage:
      "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80",
    readingTime: 5,
    featured: false,
    content: `## Le muscle se construit la nuit

C'est un fait que beaucoup préfèrent ignorer : **70% de la production d'hormone de croissance (GH) se produit pendant le sommeil profond**. Sans sommeil réparateur, vous limiter biologiquement votre progression.

## Ce que la restriction de sommeil fait à votre corps

Une étude publiée dans *Annals of Internal Medicine* a démontré que réduire le sommeil de 8h à 5h30 pendant 14 jours entraîne :

- **60% de réduction des gains musculaires** sur un régime hypocalorique
- Augmentation du catabolisme (destruction musculaire)
- Hausse du cortisol de 15% — l'hormone du stress qui détruit le muscle
- Diminution de la testostérone de 10 à 15%

## Les mécanismes biologiques

Pendant le sommeil lent profond :
- L'axe hypothalamo-hypophysaire libère la GH
- Les cellules satellites musculaires prolifèrent et fusionnent
- La synthèse protéique atteint son pic
- La récupération du système nerveux central s'effectue

## La stratégie pratique

**7 à 9 heures** par nuit — l'OMS ne laisse aucune ambiguïté là-dessus. Pour un athlète en période de construction musculaire : 8h minimum.

Quelques règles non-négociables :
1. Température de chambre entre 17 et 19°C
2. Obscurité totale (blackout)
3. Pas d'écran dans les 60 minutes avant le coucher
4. Horaire de lever constant — même le week-end

## Le message difficile

Si vous dormez 6h par nuit et que vous vous demandez pourquoi vous ne progressez pas malgré vos efforts à la salle : vous avez votre réponse. Le sommeil n'est pas une option. C'est **la variable de performance la plus sous-estimée qui existe**.`,
  },
  {
    slug: "cardio-ne-fait-pas-maigrir",
    title: "Le cardio ne fait pas maigrir. Voici ce qui fonctionne.",
    excerpt:
      "Courir des heures sur un tapis ne vous mènera nulle part si le reste n'est pas en ordre. La vérité sur la perte de poids.",
    category: "MUSCULATION",
    coverImage:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    readingTime: 5,
    featured: false,
    content: `## Le mythe du cardio amincissant

Des millions de personnes passent des heures sur des tapis roulants chaque semaine. Résultat ? Elles ne maigrissent pas. Pourquoi ? Parce que **la perte de masse grasse est principalement déterminée par l'alimentation, pas par le cardio**.

## L'équation réelle

Une heure de course à 10 km/h brûle environ 600 kcal pour un individu de 75kg. Un repas de restauration rapide peut en contenir 1500. La compensation alimentaire post-cardio est un phénomène biologiquement documenté : votre corps augmente votre appétit pour contrebalancer la dépense.

## Ce qui fonctionne vraiment

### 1. Le déficit calorique contrôlé
Pas de secrets : vous devez consommer moins que vous ne dépensez. Un déficit de **300 à 500 kcal/jour** permet une perte de 300 à 500g de masse grasse par semaine — sans catabolisme musculaire excessif.

### 2. La musculation
Contrairement au cardio, la musculation augmente le **taux métabolique de repos** sur 24 à 48h post-séance (effet EPOC). Chaque kilo de muscle supplémentaire brûle 13 kcal/jour au repos. À long terme, c'est transformateur.

### 3. Le cardio comme outil complémentaire
Le cardio a sa place — mais comme complément, pas comme outil principal. Le HIIT (High Intensity Interval Training) de 20 minutes est plus efficace qu'1h de cardio modéré pour préserver le muscle tout en brûlant des graisses.

## Le protocole efficace

1. **Priorité : déficit calorique** (alimentation)
2. **3 séances de musculation / semaine** (maintien et développement musculaire)
3. **2 sessions de marche rapide ou HIIT** (NEAT + dépense supplémentaire)
4. **Sommeil 7-8h** (régulation des hormones de faim)

Le cardio ne fait pas maigrir. La cohérence fait maigrir.`,
  },
  {
    slug: "sucre-cache-decoder-etiquette",
    title: "Le sucre caché : décoder une étiquette en 10 secondes",
    excerpt:
      "Le sucre se cache derrière 56 noms différents sur les étiquettes. Voici comment le débusquer en quelques secondes.",
    category: "NUTRITION",
    coverImage:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    readingTime: 3,
    featured: false,
    content: `## 56 visages du sucre

Les industriels ont compris que le mot "sucre" en première position de la liste d'ingrédients fait peur. Solution : le fragmenter en plusieurs formes pour le noyer dans la liste. Voici les alias les plus courants.

## Les 10 noms à reconnaître immédiatement

1. **Sirop de glucose-fructose** (le pire — perturbateur métabolique avéré)
2. **Sirop de maïs à haute teneur en fructose**
3. **Dextrose, maltose, lactose**
4. **Saccharose** (le sucre blanc classique)
5. **Miel, agave, sirop d'érable** (naturels mais identiques métaboliquement)
6. **Concentré de jus de fruit**
7. **Maltodextrine**
8. **Inuline** (fibre mais souvent utilisée comme substitut sucrant)
9. **Amidon modifié**
10. **Caramel**

## La règle des 5 secondes

En supermarché, appliquez cette méthode :

1. Regardez les **glucides dont sucres** sur le tableau nutritionnel (pour 100g)
2. Si > **10g de sucres pour 100g** : produit sucré
3. Si > **20g** : produit très sucré, à éviter en dehors des occasions spéciales

## Les produits les plus traîtres

- **Sauces et condiments** : une cuillère de ketchup = 4g de sucre
- **Yaourts aux fruits** : jusqu'à 15g de sucres/100g
- **Pain de mie "complet"** : souvent autant de sucre que le blanc
- **Céréales "sport"** : les plus sucrées du rayon

## L'alternative simple

Mangez des aliments avec le moins d'ingrédients possible. Un avocat a un ingrédient. Un œuf a un ingrédient. Plus la liste est courte, mieux c'est.`,
  },
  {
    slug: "hydratation-3-erreurs",
    title: "Hydratation : les 3 erreurs que vous faites probablement",
    excerpt:
      "La déshydratation commence bien avant que la soif apparaisse. Voici ce que vous faites mal — et comment corriger.",
    category: "NUTRITION",
    coverImage:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80",
    readingTime: 3,
    featured: false,
    content: `## Vous attendez d'avoir soif

C'est l'erreur n°1. La sensation de soif se déclenche quand vous êtes **déjà déshydraté à 1-2%**. À ce stade, vos capacités cognitives ont déjà baissé de 10%, votre endurance physique de 15 à 20%.

**La règle** : boire régulièrement sans attendre la soif. 250ml toutes les heures en journée.

## Vous comptez le café comme hydratation

Le café a un léger effet diurétique — pas aussi fort qu'on le croit, mais il ne compte pas comme hydratation neutre. Même chose pour les sodas, les jus et les boissons sucrées.

**La règle** : votre quota quotidien (1,5 à 2L selon l'ANSES) s'entend en **eau pure**. Le reste est en supplément.

## Vous buvez trop en une seule fois

Absorber 1L d'eau en 10 minutes n'est pas plus efficace que de boire 250ml 4 fois en 4 heures. Les reins éliminent l'excès. La clé est la **régularité**.

**Le système pratique** :
- Une grande gourde de 750ml à côté de vous au bureau
- Vidée avant midi
- Rechargée → vidée avant 18h
- Un verre au réveil, un avant dormir

## Et pendant l'effort ?

Au-delà de 60 minutes d'effort intense, l'eau seule ne suffit plus : vous perdez aussi du sodium, du potassium et du magnésium par la sueur. Une boisson isotonique maison (eau + pincée de sel + jus de citron + miel) fait l'affaire sans les additifs des boissons commerciales.`,
  },
  {
    slug: "discipline-vs-motivation-90-jours",
    title: "Discipline > Motivation. Comment tenir 90 jours.",
    excerpt:
      "La motivation est une émotion. La discipline est une compétence. Voici comment la développer méthodiquement.",
    category: "MENTAL",
    coverImage:
      "https://images.unsplash.com/photo-1434596922112-19c563067271?w=800&q=80",
    readingTime: 5,
    featured: false,
    content: `## La motivation vous a menti

En janvier, vous étiez motivé. En mars, plus rien. Ce n'est pas un défaut de caractère : c'est de la biologie. La motivation est une réponse émotionnelle à un stimulus — elle monte, elle redescend. Elle ne peut pas être le fondement d'un changement durable.

La discipline, elle, est une **compétence cognitive** que vous pouvez entraîner comme un muscle.

## Les 3 mécanismes de la discipline durable

### 1. L'identité avant le comportement
Ne vous dites pas "je vais faire du sport". Dites-vous "**je suis quelqu'un qui fait du sport**". La recherche de James Clear (*Atomic Habits*) démontre que les personnes qui modifient leur identité maintiennent leurs comportements 3x plus longtemps que celles qui fixent des objectifs de résultats.

### 2. La réduction des décisions
Chaque décision coûte de l'énergie cognitive. Si vous devez décider chaque matin si vous allez vous entraîner, vous perdez avant d'avoir commencé. **Programmez irrévocablement** : Lundi, Mercredi, Vendredi, 7h00. Sans discussion.

### 3. L'environnement plutôt que la volonté
Préparez vos affaires de sport la veille. Dormez avec votre tenue posée à côté. Rendez le comportement souhaité **le chemin de moindre résistance**.

## Le protocole 90 jours

**Semaine 1-2** : Réduire l'objectif au minimum. 20 minutes, pas plus. L'objectif n'est pas la performance — c'est la présence.

**Semaine 3-6** : Augmenter progressivement. La régularité crée des voies neuronales. Votre cerveau commence à associer l'heure à l'action.

**Semaine 7-12** : Le comportement devient automatique. Vous n'avez plus besoin de motivation — vous avez un système.

À 90 jours, regardez en arrière. La personne que vous étiez en semaine 1 ne vous reconnaîtrait pas.`,
  },
  {
    slug: "etirements-post-training-verite",
    title: "Étirements post-training : l'arnaque et ce qui marche vraiment",
    excerpt:
      "On vous a menti sur les étirements depuis des décennies. Voici ce que la science établit réellement sur la récupération.",
    category: "MUSCULATION",
    coverImage:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    readingTime: 4,
    featured: false,
    content: `## Ce que la science dit des étirements statiques

Pendant 40 ans, on a prescrit des étirements statiques post-entraînement comme standard de récupération. Problème : **les méta-analyses des 20 dernières années ne confirment pas leur efficacité** pour réduire les courbatures (DOMS).

Une revue systématique de Herbert et al. (2011) analysant 12 études conclut que les étirements réduisent les courbatures de seulement **0,5 sur 100** — cliniquement insignifiant.

## Ce qui réduit réellement les courbatures

### 1. La récupération active
Une marche légère ou du vélo à faible intensité pendant 15-20 minutes post-séance active le système lymphatique et accélère l'élimination des déchets métaboliques. **Efficacité prouvée.**

### 2. Le sommeil (encore)
Les DOMS atteignent leur pic 24 à 48h après l'effort. La quasi-totalité de la réparation tissulaire se produit pendant le sommeil profond. 8h > 20 minutes d'étirements.

### 3. La nutrition post-entraînement
Une fenêtre de 30 à 60 minutes après l'effort pour consommer 20-40g de protéines et des glucides à index glycémique modéré accélère significativement la réparation musculaire.

### 4. Les étirements dynamiques — avant, pas après
Les étirements dynamiques (leg swings, bras croisés, rotations) ont leur place **en échauffement** pour préparer les articulations et améliorer l'amplitude de mouvement. Les statiques post-effort n'ont pas démontré de bénéfice significatif.

## Ce que vous devriez faire

**Après l'entraînement :**
1. 10-15 minutes de marche ou vélo léger
2. Repas de récupération dans la heure
3. Hydratation (vous avez perdu entre 0,5L et 2L selon l'intensité)
4. 8h de sommeil

Les étirements restent utiles pour la flexibilité à long terme — mais dans une séance dédiée, pas en récupération post-effort.`,
  },
  {
    slug: "meditation-10-minutes-performance",
    title: "10 minutes de méditation par jour : l'effet sur la performance",
    excerpt:
      "La méditation n'est pas de la spiritualité — c'est de la neuroscience appliquée. Et les données sont sans ambiguïté.",
    category: "MENTAL",
    coverImage:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    readingTime: 4,
    featured: false,
    content: `## Ce que la méditation fait à votre cerveau

L'imagerie par résonance magnétique (IRM) a transformé notre compréhension de la méditation. Ce n'est plus de la spiritualité — c'est de la neurobiologie.

Après **8 semaines de méditation à 10 minutes/jour**, Sara Lazar (Harvard, 2011) a documenté :

- Épaississement de 5% du cortex préfrontal (attention, prise de décision)
- Réduction de 10% du volume de l'amygdale (réponse au stress)
- Renforcement des connexions entre cortex préfrontal et amygdale

## L'impact sur la performance sportive

### Gestion du stress compétitif
Le cortisol chronique détruit le muscle et bloque la synthèse protéique. La méditation régulière réduit le cortisol de **20 à 30%** (études de Davidson et al., Wisconsin).

### Récupération entre les séries
Lors d'une étude sur des grimpeurs d'élite, ceux pratiquant la respiration consciente entre les voies récupéraient **40% plus vite** leur fréquence cardiaque.

### Focus à l'entraînement
La connexion mentale au muscle travaillé (mind-muscle connection) augmente l'activation des fibres musculaires de 20 à 35%. La méditation entraîne précisément cette capacité attentionnelle.

## Le protocole simple

Pas d'application, pas de cours. Juste ça :

1. Réveil → posez-vous 10 minutes avant de regarder votre téléphone
2. Respirez : 4 secondes d'inspiration, 4 de rétention, 6 d'expiration
3. Quand une pensée arrive, observez-la sans la suivre. Revenez à la respiration.
4. 10 minutes. Chaque jour.

Les résultats apparaissent après **21 jours de pratique régulière**. Pas avant. La patience est la première chose que vous entraînez.`,
  },
  {
    slug: "magnesium-zinc-vitamine-d",
    title: "Magnésium, zinc, vitamine D : les 3 micronutriments à surveiller",
    excerpt:
      "80% des Français manquent de vitamine D. 75% sont déficients en magnésium. Ces carences sabotent votre progression en silence.",
    category: "NUTRITION",
    coverImage:
      "https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&q=80",
    readingTime: 4,
    featured: false,
    content: `## La carence silencieuse qui plombe tout

Vous pouvez avoir une alimentation parfaite en macronutriments et souffrir de carences micronutritionnelles qui sabotent votre sommeil, votre récupération et votre production hormonale. Les trois suspects principaux chez les sportifs actifs.

## Magnésium — La déficience la plus répandue

**Pourquoi vous en manquez :** les sols agricoles modernes sont appauvris en magnésium. Suer intensément en fait perdre. Le stress chronique en consomme massivement.

**Ce que ça fait :** crampes musculaires, troubles du sommeil, anxiété, constipation, fatigue persistante.

**Sources alimentaires :** amandes (270mg/100g), graines de courge (540mg/100g), chocolat noir >70% (150mg/100g), épinards cuits (80mg/100g).

**Dosage supplémentation si nécessaire :** 300 à 400mg/jour de malate ou bisglycinate de magnésium (mieux absorbés que l'oxyde).

## Zinc — L'hormone booster oublié

**Pourquoi vous en manquez :** alimentation faible en protéines animales, transpiration intense, alimentation riche en phytates (légumineuses non trempées).

**Ce que ça fait :** testostérone basse, immunité défaillante, cicatrisation lente, chute de cheveux.

**Sources alimentaires :** huîtres (75mg/100g — de loin la meilleure source), viande rouge (5-7mg/100g), graines de courge (7mg/100g).

## Vitamine D — L'épidémie nationale

En France, **80% de la population est déficiente en hiver**. La synthèse cutanée est quasi-nulle entre octobre et mars sous nos latitudes.

**Ce que ça fait :** fatigue profonde, immunité basse, humeur dépressive, force musculaire réduite, santé osseuse compromise.

**Supplémentation recommandée :** 2000 à 4000 UI/jour en automne-hiver. Avec de la vitamine K2 pour orienter le calcium vers les os (pas les artères).

## Avant de supplémenter

Idéalement : bilan sanguin. Votre médecin peut prescrire un dosage de 25-OH-D3 (vitamine D), magnésium érythrocytaire et zinc plasmatique. Cela prend 10 minutes et évite de supplémenter à l'aveugle.`,
  },
  {
    slug: "alcool-et-performance-sportive",
    title: "Alcool et performance sportive : le verre de trop",
    excerpt:
      "Un verre de vin avec le repas. Une bière après le match. Quel impact réel sur votre récupération et vos gains ? La réponse est pire que vous ne pensez.",
    category: "RECHERCHE",
    coverImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    readingTime: 4,
    featured: false,
    content: `## Ce qu'un verre fait réellement

L'OMS est catégorique depuis 2023 : **il n'existe pas de niveau de consommation d'alcool sans risque pour la santé**. Pour la performance sportive, les données sont encore plus claires.

## Les mécanismes de destruction

### Inhibition de la synthèse protéique
L'alcool bloque directement la voie mTOR — le mécanisme central de construction musculaire. Une étude de Parr et al. (2014) démontre qu'une consommation modérée (1,5g/kg — environ 4 verres) **réduit la synthèse protéique de 24%** dans les heures suivant l'exercice.

Autrement dit : votre séance de muscu du samedi soir est partiellement annulée si vous buvez après.

### Perturbation du sommeil
L'alcool aide à s'endormir mais fragmente le sommeil profond (stade 3 et 4) — précisément là où la GH est sécrétée et où le muscle se reconstruit. Même 2 verres réduisent le sommeil réparateur de **25 à 40%**.

### Déshydratation
L'alcool est diurétique : il inhibe l'hormone antidiurétique (ADH). Pour chaque gramme d'alcool consommé, votre corps élimine environ 10ml d'eau supplémentaires. 3 bières = 300ml de déshydratation nette au-delà de la normale.

### Impact hormonal
Chez l'homme, une consommation régulière (>14 unités/semaine) réduit la testostérone de **10 à 15%** et augmente les œstrogènes par aromatisation. Chez la femme, l'alcool perturbe les cycles et l'équilibre hormonal.

## Ce que ça signifie concrètement

- Un verre dans les 24h suivant un entraînement : récupération compromise
- 2-3 verres par semaine régulièrement : progression ralentie de manière mesurable
- Soirée alcoolisée : 48-72h de récupération dégradée

## La position raisonnable

Pas d'abstinence totale obligatoire — mais une conscience claire. **Évitez toute consommation dans les 24h suivant une séance intense**. Si vous buvez, compensez avec 500ml d'eau supplémentaires et considérez l'impact sur votre sommeil de la nuit.`,
  },
  {
    slug: "petit-dejeuner-proteine-non-negociable",
    title: "Petit-déjeuner protéiné : pourquoi c'est non négociable",
    excerpt:
      "Commencer la journée avec des protéines transforme votre appétit, votre concentration et votre composition corporelle. Les données sont sans appel.",
    category: "NUTRITION",
    coverImage:
      "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&q=80",
    readingTime: 3,
    featured: false,
    content: `## Le petit-déjeuner français est une catastrophe

Baguette + beurre + confiture + jus d'orange = 60-70% de glucides, 20% de lipides, moins de 10% de protéines. C'est la recette parfaite pour un pic glycémique à 9h, un crash à 11h et une faim insatiable à midi.

## Ce que les protéines font le matin

Une étude de l'Université du Missouri (Leidy et al., 2013) a comparé trois groupes :
- Groupe A : petit-déjeuner protéiné (35g de protéines)
- Groupe B : petit-déjeuner standard (10g de protéines)
- Groupe C : pas de petit-déjeuner

Résultat : **le groupe A a réduit ses fringales de 60%** dans la journée, consommé 400 kcal de moins au dîner, et présenté des niveaux de ghréline (hormone de la faim) significativement plus bas.

## Les mécanismes

Les protéines stimulent la sécrétion de **peptide YY et GLP-1** — hormones de satiété — et inhibent la ghréline pendant 3 à 4 heures. Elles requièrent aussi plus d'énergie à digérer (effet thermique de 20-30% contre 5-10% pour les glucides).

## Des exemples concrets

**Rapide (5 min) :**
- Skyr nature + graines de chia + amandes = 25g de protéines
- 3 œufs brouillés + pain complet grillé = 22g de protéines

**Préparé la veille :**
- Overnight oats (avoine + protéine en poudre + lait) = 30-35g de protéines

**Objectif :** **25 à 40g de protéines au petit-déjeuner**. Ça change le reste de la journée.`,
  },
  {
    slug: "mindset-un-jour-de-plus",
    title: "Le mindset du « un jour de plus » : la règle des pros",
    excerpt:
      "Les champions ne sont pas plus motivés que vous. Ils ont simplement intégré une règle mentale que personne ne vous a enseignée.",
    category: "MENTAL",
    coverImage:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80",
    readingTime: 4,
    featured: false,
    content: `## La différence invisible

Regardez deux personnes qui s'entraînent. L'une abandonne ses objectifs en mars. L'autre est toujours là en décembre. De l'extérieur, elles semblent avoir le même niveau. La différence est mentale — et elle tient à une règle que les pros appellent le "un jour de plus".

## Le principe

Quand vous avez envie d'arrêter, de sauter une séance, de manger n'importe quoi — la règle est simple : **faites juste un jour de plus**. Pas toujours. Pas à vie. Juste aujourd'hui.

Ce n'est pas de la motivation. C'est une stratégie de négociation avec vous-même.

## La neurologie derrière

Le cerveau évalue les coûts et bénéfices en temps réel. Quand l'objectif semble lointain et le coût immédiat élevé, le système limbique prend le dessus sur le cortex préfrontal. Résultat : abandon.

Le "un jour de plus" réduit la durée perçue à **24 heures**. Votre cerveau peut supporter presque n'importe quoi pendant 24 heures.

## Les champions en parlent

Michael Jordan n'a pas décidé de devenir le meilleur joueur de basket de l'histoire. Il a décidé chaque matin de s'entraîner ce jour-là — un jour de plus que la veille.

Kobe Bryant's "Mamba Mentality" : se présenter chaque jour, quelle que soit la forme, et donner 100% de ce que vous avez ce jour-là — pas ce que vous aviez hier.

## La pratique concrète

Quand vous voulez arrêter :
1. Ne pensez pas à la semaine prochaine
2. Demandez-vous : *"Puis-je faire ça juste aujourd'hui ?"*
3. La réponse est presque toujours oui
4. Faites-le
5. Demain, répétez la question

## Le paradoxe

En visant juste "un jour de plus", vous finissez par tenir des années. Parce que la régularité bat l'intensité. Toujours. Le champion n'est pas celui qui s'entraîne le mieux — c'est celui qui s'entraîne **le plus longtemps**.`,
  },
];

async function main() {
  console.log("🌱 Seed Atlas Fitness — démarrage...\n");

  // Nettoyage (optionnel — commentez si vous voulez conserver les données existantes)
  await prisma.article.deleteMany();
  await prisma.quizResponse.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.client.deleteMany();

  // ─── Articles ──────────────────────────────────────────────────────────────
  console.log("📰 Création des 12 articles...");
  for (const article of ARTICLES) {
    await prisma.article.create({ data: article });
    process.stdout.write(".");
  }
  console.log("\n✅ 12 articles créés.\n");

  // ─── Clients démo ──────────────────────────────────────────────────────────
  console.log("👤 Création des clients démo...");
  const client1 = await prisma.client.create({
    data: {
      name: "Marie Dupont",
      email: "marie.dupont@demo.fr",
      phone: "0612345678",
      subscriptionStatus: "active",
      totalPaid: 30000, // 300€ = 2 mois (en centimes)
      notes: "Objectif : perte de poids + tonification. Séances le mardi et jeudi.",
    },
  });

  const client2 = await prisma.client.create({
    data: {
      name: "Thomas Bernard",
      email: "thomas.bernard@demo.fr",
      phone: "0687654321",
      subscriptionStatus: "active",
      totalPaid: 15000, // 150€ = 1 mois
      notes: "Prise de masse. Vient de reprendre le sport après 3 ans d'arrêt.",
    },
  });

  const client3 = await prisma.client.create({
    data: {
      name: "Sophie Martin",
      email: "sophie.martin@demo.fr",
      phone: "0698765432",
      subscriptionStatus: null, // Prospect — séance découverte
      notes: "",
    },
  });
  console.log("✅ 3 clients créés.\n");

  // ─── Réservations démo ─────────────────────────────────────────────────────
  console.log("📅 Création des réservations démo...");
  await prisma.booking.create({
    data: {
      clientId: client1.id,
      name: client1.name,
      email: client1.email,
      phone: client1.phone,
      date: new Date("2026-04-18T09:00:00"),
      timeSlot: "09H00",
      type: "subscription",
      status: "confirmed",
      comment: "Séance musculation upper body",
    },
  });

  await prisma.booking.create({
    data: {
      clientId: client2.id,
      name: client2.name,
      email: client2.email,
      phone: client2.phone,
      date: new Date("2026-04-20T11:00:00"),
      timeSlot: "11H00",
      type: "subscription",
      status: "confirmed",
    },
  });

  await prisma.booking.create({
    data: {
      clientId: client3.id,
      name: client3.name,
      email: client3.email,
      phone: client3.phone,
      date: new Date("2026-04-22T14:00:00"),
      timeSlot: "14H00",
      type: "discovery",
      status: "pending",
      comment: "Veut perdre du poids avant l'été",
    },
  });
  console.log("✅ 3 réservations créées.\n");

  // ─── Quiz démo ─────────────────────────────────────────────────────────────
  console.log("🧠 Création des quiz démo...");
  // Note : SQLite ne supporte pas le type Json — on sérialise en JSON string
  await prisma.quizResponse.create({
    data: {
      clientId: client1.id,
      email: client1.email,
      answers: JSON.stringify({
        activity: 1.75,
        sleep: 2.5,
        fruits_vegetables: 1.25,
        water: 1.75,
        sedentary: 1,
        stress: 1,
        smoking_alcohol: 2.5,
        processed_food: 1.75,
      }),
      totalScore: 13.5,
    },
  });

  await prisma.quizResponse.create({
    data: {
      email: "prospect.quiz@demo.fr",
      answers: JSON.stringify({
        activity: 0,
        sleep: 1,
        fruits_vegetables: 0,
        water: 1,
        sedentary: 0,
        stress: 0,
        smoking_alcohol: 1,
        processed_food: 0,
      }),
      totalScore: 3.0,
    },
  });
  console.log("✅ 2 réponses quiz créées.\n");

  console.log("🎉 Seed terminé avec succès !");
  console.log("\n📊 Résumé :");
  console.log(`  - ${ARTICLES.length} articles`);
  console.log("  - 3 clients (2 actifs + 1 prospect)");
  console.log("  - 3 réservations");
  console.log("  - 2 quiz");
  console.log("\n🚀 Lancez le serveur : pnpm dev");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error("❌ Erreur seed:", e);
    prisma.$disconnect();
    process.exit(1);
  });
