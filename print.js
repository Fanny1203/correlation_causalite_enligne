class PrintableCards {
    constructor() {
        this.container = document.getElementById('cards-container');
        this.template = document.getElementById('card-template');
        this.textSize = 16; // Valeur par défaut
        this.initSizeControls();
        this.init();
    }

    initSizeControls() {
        const widthInput = document.getElementById('card-width');
        const heightInput = document.getElementById('card-height');
        const textSizeInput = document.getElementById('text-size');
        const applyButton = document.getElementById('update-size');

        // Initialiser la taille du texte
        this.textSize = textSizeInput.value;
        document.documentElement.style.setProperty('--text-size', `${this.textSize}px`);

        applyButton.addEventListener('click', () => {
            const width = widthInput.value;
            const height = heightInput.value;
            this.textSize = textSizeInput.value;
            document.documentElement.style.setProperty('--card-width', `${width}mm`);
            document.documentElement.style.setProperty('--card-height', `${height}mm`);
            document.documentElement.style.setProperty('--text-size', `${this.textSize}px`);
            
            // Redessiner les graphiques avec la nouvelle taille de texte
            scenarios.forEach(scenario => {
                if (scenario.hasGraph) {
                    this.drawGraph(scenario);
                }
            });
        });
    }

    init() {
        scenarios.forEach(scenario => {
            this.createCard(scenario);
        });
    }

    createCard(scenario) {
        // Cloner le template
        const card = this.template.content.cloneNode(true);
        
        // Remplir le recto
        this.fillCardFront(card, scenario);
        
        // Remplir le verso
        this.fillCardBack(card, scenario);

        // Ajouter la carte au conteneur
        this.container.appendChild(card);

        // Si le scénario a un graphique, le dessiner
        if (scenario.hasGraph) {
            this.drawGraph(scenario);
        }
    }

    fillCardFront(card, scenario) {
        // Titre
        card.querySelector('.card-title').textContent = scenario.titre;

        // Description
        card.querySelector('.card-description').textContent = scenario.description;
        
        // Illustration
        if (scenario.illustration) {
            const img = document.createElement('img');
            img.src = scenario.illustration;
            img.alt = `Illustration pour le scénario ${scenario.id}`;
            card.querySelector('.card-illustration').appendChild(img);
        }

        // Graphique
        if (scenario.hasGraph) {
            const canvas = document.createElement('canvas');
            canvas.id = `graph-${scenario.id}`;
            card.querySelector('.card-graph').appendChild(canvas);
        } else {
            card.querySelector('.card-graph').style.display = 'none';
        }
    }

    fillCardBack(card, scenario) {
        // Type d'exemple et source
        card.querySelector('.card-source').textContent = scenario.source === 'fictif' ? 'Exemple fictif' : `Source : ${scenario.source}`;

        // Réponse correcte
        const answers = {
            causalite_A_B: "A cause B",
            causalite_B_A: "B cause A",
            facteur_tiers: "Facteur de confusion",
            hasard: "Hasard"
        };
        
        const correctAnswers = scenario.correctAnswer.map(key => answers[key]).join(" ou ");
        card.querySelector('.card-answer').textContent = `Réponse : ${correctAnswers}`;
        
        // Feedback général
        card.querySelector('.card-feedback').textContent = scenario.feedback_general;
    }

    calculateStep(min, max) {
        const range = max - min;
        const rawStep = range / 5; // On vise environ 5 graduations
        const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
        const steps = [1, 2, 5, 10];
        return steps.map(x => x * magnitude)
                    .find(step => step >= rawStep);
    }

    drawGraph(scenario) {
        // Attendre que le DOM soit complètement chargé
        setTimeout(() => {
            const canvas = document.getElementById(`graph-${scenario.id}`);
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            const width = canvas.parentElement.clientWidth;
            const height = canvas.parentElement.clientHeight;
            
            // Définir la taille du canvas
            canvas.width = width;
            canvas.height = height;
            
            // Configuration du graphique
            const padding = { left: 40, right: 20, top: 10, bottom: 60 };
            const points = scenario.points;
            
            // Calculer les limites
            const xValues = points.map(p => p[0]);
            const yValues = points.map(p => p[1]);
            const xMin = Math.min(0, Math.min(...xValues));
            const xMax = Math.max(Math.max(...xValues), xMin + 1);
            const yMin = Math.min(0, Math.min(...yValues));
            const yMax = Math.max(Math.max(...yValues), yMin + 1);

            // Calculer les pas pour les graduations
            const xStep = this.calculateStep(xMin, xMax);
            const yStep = this.calculateStep(yMin, yMax);
            
            // Fonctions de conversion coordonnées
            const toCanvasX = x => padding.left + (x - xMin) * (width - padding.left - padding.right) / (xMax - xMin);
            const toCanvasY = y => height - padding.bottom - (y - yMin) * (height - padding.top - padding.bottom) / (yMax - yMin);
            
            // Dessiner les axes
            ctx.beginPath();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            
            // Axe X
            ctx.moveTo(padding.left, height - padding.bottom);
            ctx.lineTo(width - padding.right, height - padding.bottom);
            
            // Axe Y
            ctx.moveTo(padding.left, height - padding.bottom);
            ctx.lineTo(padding.left, padding.top);
            ctx.stroke();

            // Utiliser 0.8*la taille du texte stockée dans la classe
            const textSizeGraph = 0.8 * this.textSize;

            
            // Dessiner les repères sur l'axe X
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.font = `${textSizeGraph}px Arial`;
            for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
                const xPos = toCanvasX(x);
                ctx.beginPath();
                ctx.moveTo(xPos, height - padding.bottom);
                ctx.lineTo(xPos, height - padding.bottom + 5);
                ctx.stroke();
                ctx.fillText(x.toFixed(1), xPos, height - padding.bottom + 8);
            }

            // Dessiner les repères sur l'axe Y
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.font = `${textSizeGraph}px Arial`;
            for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
                const yPos = toCanvasY(y);
                ctx.beginPath();
                ctx.moveTo(padding.left - 5, yPos);
                ctx.lineTo(padding.left, yPos);
                ctx.stroke();
                ctx.fillText(y.toFixed(1), padding.left - 8, yPos);
            }
            
            // Labels des axes
            ctx.fillStyle = '#666';
            ctx.font = `${textSizeGraph}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText(scenario.xLabel, width / 2, height - padding.bottom / 2);
            
            // Label Y (rotation)
            ctx.save();
            ctx.translate(5, height / 2.5);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText(scenario.yLabel, 0, 0);
            ctx.restore();
            
            // Dessiner les points
            points.forEach(([x, y]) => {
                ctx.beginPath();
                ctx.fillStyle = '#007bff';
                ctx.arc(toCanvasX(x), toCanvasY(y), 4, 0, Math.PI * 2);
                ctx.fill();
            });
        }, 0);
    }
}

// Initialiser quand la page est chargée
window.addEventListener('load', () => {
    new PrintableCards();
});
