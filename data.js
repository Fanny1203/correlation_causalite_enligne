const scenarios = [
    {
        id: 1,
        titre: "Noyades et glaces",
        source: "fictif",
        description: "On observe que plus les ventes de glaces augmentent (A), plus le nombre de noyades augmente (B).",
        xLabel: "Ventes de glaces (en milliers)",
        yLabel: "Nombre de noyades",
        points: [
            [2, 3], [3, 5], [4, 6], [5, 8], [6, 9], [7, 11], [8, 12]
        ],
        hasGraph: true,
        correctAnswer: ["facteur_tiers"],
        feedbacks: {
            causalite_A_B: "Ce n'est pas la vente de glaces qui provoque des noyades même si on pourrait imaginer qu'on se sent plus lourd !",
            causalite_B_A: "Les noyades n'incitent pas à acheter des glaces !",
            facteur_tiers: "Correct !",
            hasard: "Ce n'est pas dû au hasard."
        },
        feedback_general: "Ce scénario illustre parfaitement le concept de facteur de confusion : la température est une cause commune qui influence à la fois les ventes de glaces (les gens en mangent plus quand il fait chaud) et les noyades (plus de baignades en été). Il n'y a pas de lien causal direct entre les deux !",
        illustration: "images/glace.png"
    },
    {
        id: 2,
        titre: "Natalité et cigognes",
        source: "fictif",
        description: "Plus le nombre de cigognes diminue dans une région (A), plus le taux de natalité baisse (B).",
        xLabel: "Nombre de cigognes",
        yLabel: "Taux de natalité",
        points: [
            [10, 15], [8, 12], [6, 9], [4, 7], [2, 4]
        ],
        hasGraph: true,
        correctAnswer: ["facteur_tiers"],
        feedbacks: {
            causalite_A_B: "Les cigognes n'apportent pas les bébés !",
            causalite_B_A: "Les bébés n'attirent pas les cigognes.",
            facteur_tiers: "Correct !",
            hasard: "Ce n'est pas dû au hasard."
        },
        feedback_general: "Cette corrélation est un exemple historique célèbre : on parle d'ailleurs d'\"effet cygogne\". Ici, il y a un facteur de confusion : plus la ville est grande, plus il y a de cigognes car il y a plus de toîts ET plus il y aura de bébés puisqu'il y aura plus d'habitants.",
        illustration: "images/cigogne_bebe.png"
    },
    {
        id: 3,
        titre: "Livres et télé",
        source: "fictif",
        description: "On observe que plus une personne possède de livres chez elle (A), moins elle regarde la télévision (B).",
        hasGraph: false,
        correctAnswer: ["facteur_tiers"],
        feedbacks: {
            causalite_A_B: "Possible mais ce n'est pas l'explication la plus probable.",
            causalite_B_A: "Possible mais ce n'est pas l'explication la plus probable.",
            facteur_tiers: "Correct !",
            hasard: "Ce n'est pas dû au hasard."
        },
        feedback_general: "On pourrait être tenté de penser qu'il y a un lien direct, dans un sens ou dans l'autre mais les facteurs de confusions possibles sont importants : le niveau d'éducation ou les habitudes familiales ou le milieu culturel peuvent expliquer simultanément les deux variables mieux qu'une causalité directe.",
        illustration: "images/livres.png"
    },
    {
        id: 4,
        titre: "Sommeil et fatigue",
        source: "fictif",
        description: "Plus on dort longtemps (A), plus on se sent fatigué (B).",
        hasGraph: false,
        correctAnswer: ["causalite_B_A"],
        feedbacks: {
            causalite_A_B: "Ce n'est pas le fait de dormir plus qui cause la fatigue !",
            causalite_B_A: "Correct !",
            facteur_tiers: "Non, il y a bien une relation directe entre fatigue et durée de sommeil... mais dans quel sens ?",
            hasard: "Ce n'est pas dû au hasard."
        },
        feedback_general: "Ce cas illustre l'importance de bien identifier le sens de la causalité. Il existe une relation causale, mais dans le sens inverse de ce qu'on pourrait penser initialement : c'est la fatigue qui pousse à dormir plus, et non l'inverse :-)",
        illustration: "images/dormir.png"
    },
    {
        id: 5,
        titre: "Églises et bars",
        source: "fictif",
        description: "En Bordurie, plus il y a d'églises dans une ville (A), plus il y a de bars (B).",
        xLabel: "Nombre d'églises",
        yLabel: "Nombre de bars",
        points: [[2, 5], [4, 10], [6, 15], [8, 19], [10, 25]],
        hasGraph: true,
        correctAnswer: ["facteur_tiers"],
        feedbacks: {
            causalite_A_B: "Les églises ne créent pas des bars, même si un petit apéro en sortant de la messe, ça peut faire plaisir.",
            causalite_B_A: "Les bars ne génèrent pas d'églises, même si une petite messe après l'apéro, ça peut faire plaisir.",
            facteur_tiers: "Correct ! ",
            hasard: "Ce n'est pas dû au hasard."
        },
        feedback_general: "Il y a un facteur de confusion : les villes plus grandes ont plus de tout.",
        illustration: "images/eglise_bar.png"
    },
    {
        id: 6,
        titre: "Divorces et margarine",
        source: "Cet exemple réel est tiré de https://www.tylervigen.com/",
        description: "On observe que les années où les gens mangent plus de margarine, le taux de divorces est plus élevé dans le Maine (États-Unis).",
        hasGraph: false,
        correctAnswer: ["hasard"],
        feedbacks: {
            causalite_A_B: "Absurde, la margarine ne détruit pas les couples.",
            causalite_B_A: "Absurde : les divorces ne poussent pas à consommer de la margarine.",
            facteur_tiers: "Il n'y a pas de facteur tiers évident ici.",
            hasard: "Exact."
        },
        feedback_general: "C'est une corrélation fortuite — une coïncidence statistique sans lien. Notez que c'est un exemple réel :  il est facile de trouver de tels exemples quand on a un grand nombre de données à disposition. N'hésitez pas à vous amuser à en trouver sur le site https://www.tylervigen.com/spurious-correlations ",
        illustration: "images/divorce_margarine.png"
    },
    {
        id: 7,
        titre: "Notes et TV",
        source: "On trouve des publications qui vont dans ce sens mais les résultats sont très variés et parfois négligeables. Ici, on a mis des données fictives pour illustrer le concept.",
        description: "On observe que plus les élèves passent de temps devant la télévision (A), moins ils obtiennent de bonnes notes à l'école (B).",
        xLabel: "Temps passé devant la TV (heures/jour)",
        yLabel: "Moyenne scolaire",
        points: [[1, 16], [2, 15], [3, 13], [4, 11], [5, 9]],
        hasGraph: true,
        correctAnswer: ["facteur_tiers"],
        feedbacks: {
            causalite_A_B: "Cela peut sembler plausible, mais ce serait un raccourci : il faut distinguer cause directe et effets indirects.",
            causalite_B_A: "Ce serait étrange : avoir de mauvaises notes n'incite pas à regarder plus la TV.",
            facteur_tiers: "Correct !",
            hasard: "Ce n'est pas dû au hasard."
        },
        feedback_general: "Il est tentant de penser que la télévision nuit directement à la réussite scolaire, mais d'autres facteurs sont possibles : un encadrement familial moins présent, des inégalités sociales ou un manque d'accès à d'autres formes d'aide aux devoirs.",
        illustration: "images/eleve_tele.png"
    },
    {
        id: 8,  
        titre: "Température et mercure",
        source: "fictif",
        description: "On observe que plus on augmente la température dans une pièce (A), plus le mercure monte dans le thermomètre (B).",
        xLabel: "Température ambiante (°C)",
        yLabel: "Niveau du mercure (mm)",
        points: [[10, 100], [15, 110], [20, 120], [25, 130], [30, 140]],
        hasGraph: true,
        correctAnswer: ["causalite_A_B"],
        feedbacks: {
            causalite_A_B: "Correct !",
            causalite_B_A: "Non, ce n’est pas le mercure qui fait monter la température.",
            facteur_tiers: "Il n'y a pas de facteur tiers ici : c’est un lien direct.",
            hasard: "Non, c’est un phénomène physique bien connu."
        },
        feedback_general: "Ce scénario est un cas clair de causalité : la température extérieure cause directement la dilatation du mercure. Il est utile comme contrepoint aux exemples plus flous ou trompeurs.",
        illustration: "images/chaud2.png"
    },
    {
        id: 9,
        titre: "Vélo électrique et santé",
        source: "fictif",
        description: "On observe que plus on utilise un vélo électrique (A), plus on est en bonne santé (B).",
        xLabel: "Utilisation du vélo électrique (heures/semaine)",
        yLabel: "Score santé global",
        points: [[1, 60], [2, 65], [3, 62], [4, 66], [5, 68], [6, 71]],
        hasGraph: true,
        correctAnswer: ["facteur_tiers", "causalite_A_B"],
        feedbacks: {
          causalite_A_B: "Il est possible que faire du vélo soit directement la cause d'une amélioration de la santé, mais il est probable qu'il y ait des facteurs de confusion dont il faut tenir compte.",
          causalite_B_A: "C'est vrai que si on n'est pas en bonne santé, on n'aura probablement pas envie de faire du vélo. Mais la réciproque est plus hasardeuse : être bonne santé ne pousse pas directement à prendre un vélo.",
          facteur_tiers: "Correct!",
          hasard: "Ce n'est pas dû au hasard."
        },
        feedback_general: "On peut supposer que faire du vélo améliore directement la santé mais il y a au moins un facteur de confusion important : des personnes plus éduquées auront à la fois une meilleure santé et une tendance à se déplacer à vélo (électrique), pour des raisons écologiques par exemple. Elles sont plus susceptibles également d'être dans des conditions permetant l'utilisation du vélo pour se rendre à leur travail (centre ville)",
        illustration: "images/velo.png"
    },
    {
        id: 10,
        titre: "Café et sommeil",
        source: "fictif",
        description: "On observe que plus on consomme de café (A), plus on dort mal (B).",
        hasGraph: false,
        correctAnswer: ["causalite_B_A", "causalite_A_B", "facteur_tiers"],
        feedbacks: {
            causalite_A_B: "Plausible.",
            causalite_B_A: "Plausible",
            facteur_tiers: "Plausible.",
            hasard: "Ce n'est pas dû au hasard."
        },
        feedback_general: "Dans la plupart des cas, il est très difficile de savoir s'il y a causalité, et dans quel sens. Ici, certaines recherches suggèrent que le café peut perturber le sommeil s'il est consommé moins de 6 heures avant le coucher. Mais d'autres études montrent que l'on boit parfois du café pour compenser un manque de sommeil. Et, certainement, des facteurs de confusion existent comme le stress qui pourrait conduire à boire du café et à moins bien dormir. Bref... c'est compliqué !",
        illustration: "images/cafe.png"
    }
];
