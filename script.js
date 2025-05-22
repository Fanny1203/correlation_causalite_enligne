class CorrelationGame {
    constructor() {
        this.currentScenarioIndex = 0;
        this.score = 0;
        this.initElements();
        this.initEventListeners();
        this.initTooltips();
        this.loadScenario();
    }

    initElements() {
        this.descriptionEl = document.getElementById('description');
        this.graphSection = document.getElementById('graph-section');
        this.graphContainer = document.getElementById('graph-container');
        this.canvas = document.getElementById('graph');
        this.nextBtn = document.getElementById('next');
        this.endBtn = document.getElementById('end');
        this.feedbackEl = document.getElementById('feedback');
        this.feedbackGeneralEl = document.getElementById('feedback-general');
        this.scoreEl = document.getElementById('score-value');
        this.showRegressionCheckbox = document.getElementById('show-regression');
        this.validateBtn = document.getElementById('validate');
        this.radioInputs = document.querySelectorAll('input[name="answer"]');
        this.sourceEl = document.getElementById('source');
        this.illustrationEl = document.getElementById('illustration');
        
        // Observer pour le redimensionnement du conteneur
        this.resizeObserver = new ResizeObserver(() => {
            if (scenarios[this.currentScenarioIndex].hasGraph) {
                this.resizeCanvas();
                this.drawGraph(scenarios[this.currentScenarioIndex]);
            }
        });
        this.resizeObserver.observe(this.graphContainer);
    }

    resizeCanvas() {
        const containerWidth = this.graphContainer.clientWidth - 40; // -40 pour le padding
        this.canvas.width = containerWidth;
        this.canvas.height = containerWidth;
    }

    initEventListeners() {
        this.nextBtn.addEventListener('click', () => this.nextScenario());
        this.endBtn.addEventListener('click', () => this.endScenario());
        this.showRegressionCheckbox.addEventListener('change', () => {
            if (scenarios[this.currentScenarioIndex].hasGraph) {
                this.drawGraph(scenarios[this.currentScenarioIndex]);
            }
        });

        // Gestion du bouton Valider
        this.validateBtn.addEventListener('click', () => {
            const selectedRadio = document.querySelector('input[name="answer"]:checked');
            if (selectedRadio) {
                this.validateAnswer(selectedRadio.value);
            }
        });
    }

    endScenario() {
        window.location.href = "conclusion.html?score=" + this.score;
    }

    initTooltips() {
        document.querySelectorAll('.info-icon').forEach(icon => {
            const tooltipKey = icon.getAttribute('data-tooltip');
            if (tooltips[tooltipKey]) {
                icon.setAttribute('data-content', tooltips[tooltipKey]);
            }
        });
    }

    loadScenario() {
        const scenario = scenarios[this.currentScenarioIndex];
        this.descriptionEl.innerHTML = "<u>Question " + scenario.id + " : </u><br/>" + scenario.description;
        
        // Reset UI state
        this.feedbackEl.classList.add('hidden');
        this.feedbackEl.classList.remove('correct', 'incorrect');
        this.feedbackGeneralEl.classList.add('hidden');
        this.nextBtn.classList.add('hidden');
        this.endBtn.classList.add('hidden');
        
        // Reset radio buttons
        this.radioInputs.forEach(radio => {
            radio.checked = false;
            radio.disabled = false;
        });
        this.validateBtn.disabled = false;

        // Afficher l'illustration
        if (scenario.illustration) {
            this.illustrationEl.innerHTML = `<img src="${scenario.illustration}" alt="Illustration du scénario ${scenario.id}" class="scenario-img">`;
            this.illustrationEl.style.display = 'block';
        } else {
            this.illustrationEl.style.display = 'none';
        }

        // Reset graph if needed
        if (scenario.hasGraph) {
            this.graphSection.style.display = 'block';
            this.resizeCanvas();
            this.drawGraph(scenario);
        } else {
            this.graphSection.style.display = 'none';
        }

        // Afficher la source
        let sourceText = '';
        if (scenario.source === 'fictif') {
            sourceText = 'exemple fictif, données inventées';
        } else if (scenario.source === 'reel') {
            sourceText = 'exemple inspiré d\'une situation réelle';
        } else {
            sourceText = scenario.source;
        }
        this.sourceEl.textContent = sourceText;

        // Scroll to score
        this.scoreEl.parentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    calculateRegressionLine(points) {
        // Calcul des moyennes
        const n = points.length;
        const meanX = points.reduce((sum, p) => sum + p[0], 0) / n;
        const meanY = points.reduce((sum, p) => sum + p[1], 0) / n;

        // Calcul des coefficients de la droite de régression (y = ax + b)
        let numerator = 0;
        let denominator = 0;

        for (let i = 0; i < n; i++) {
            const x = points[i][0];
            const y = points[i][1];
            numerator += (x - meanX) * (y - meanY);
            denominator += (x - meanX) * (x - meanX);
        }

        const slope = numerator / denominator;
        const intercept = meanY - slope * meanX;

        return { slope, intercept };
    }

    drawGraph(scenario) {
        if (!scenario.hasGraph) return;

        const canvas = this.canvas;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const padding = { top: 40, right: 40, bottom: 40, left: 60 };  
        const graphWidth = width - (padding.left + padding.right);
        const graphHeight = height - (padding.top + padding.bottom);

        // Effacer le canvas
        ctx.clearRect(0, 0, width, height);

        // Trouver les limites des données
        const points = scenario.points;
        const xValues = points.map(p => p[0]);
        const yValues = points.map(p => p[1]);
        const xMin = Math.min(...xValues);
        const xMax = Math.max(...xValues);
        const yMin = Math.min(...yValues);
        const yMax = Math.max(...yValues);
        const xRange = xMax - xMin;
        const yRange = yMax - yMin;

        // Fonction pour convertir les coordonnées
        const toCanvasX = x => padding.left + (x - xMin) * graphWidth / xRange;
        const toCanvasY = y => height - (padding.bottom + (y - yMin) * graphHeight / yRange);

        // Calculer le pas pour avoir entre 2 et 10 repères
        const calculateStep = (min, max) => {
            const range = max - min;
            const rawStep = range / 5; 
            const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
            const steps = [1, 2, 5, 10];
            return steps.map(s => s * magnitude)
                       .find(step => range / step >= 2 && range / step <= 10) || magnitude;
        };

        const xStep = calculateStep(xMin, xMax);
        const yStep = calculateStep(yMin, yMax);

        // Dessiner les axes
        ctx.beginPath();
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        
        // Axe X
        ctx.moveTo(padding.left, height - padding.bottom);
        ctx.lineTo(width - padding.right, height - padding.bottom);
        
        // Axe Y
        ctx.moveTo(padding.left, padding.top);
        ctx.lineTo(padding.left, height - padding.bottom);
        ctx.stroke();

        // Dessiner les repères sur l'axe X
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = '12px Arial';
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
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(scenario.xLabel, width / 2, height - padding.bottom / 2);
        
        // Label Y (rotation)
        ctx.save();
        ctx.translate(padding.left / 4, height / 2);  
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(scenario.yLabel, 0, 0);
        ctx.restore();

        // Dessiner la droite de régression si demandé
        if (this.showRegressionCheckbox.checked) {
            const regression = this.calculateRegressionLine(points);
            const startX = xMin;
            const endX = xMax;
            const startY = regression.slope * startX + regression.intercept;
            const endY = regression.slope * endX + regression.intercept;

            ctx.beginPath();
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.moveTo(toCanvasX(startX), toCanvasY(startY));
            ctx.lineTo(toCanvasX(endX), toCanvasY(endY));
            ctx.stroke();
        }

        // Dessiner les points
        points.forEach(([x, y]) => {
            ctx.beginPath();
            ctx.fillStyle = '#007bff';
            ctx.arc(toCanvasX(x), toCanvasY(y), 6, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    validateAnswer(userAnswer) {
        const scenario = scenarios[this.currentScenarioIndex];
        const isCorrect = scenario.correctAnswer.includes(userAnswer);

        // Afficher le feedback
        this.feedbackEl.classList.remove('correct', 'incorrect');
        this.feedbackEl.classList.add(isCorrect ? 'correct' : 'incorrect');
        this.feedbackEl.textContent = scenario.feedbacks[userAnswer];
        this.feedbackEl.classList.remove('hidden');
        this.feedbackGeneralEl.textContent = scenario.feedback_general;
        this.feedbackGeneralEl.classList.remove('hidden');

        // Mettre à jour le score
        if (isCorrect) {
            this.score++;
        }
        this.scoreEl.textContent = this.score + "/" + (this.currentScenarioIndex+1);

        // Désactiver les choix et afficher le bouton suivant
        this.radioInputs.forEach(radio => radio.disabled = true);
        this.validateBtn.disabled = true;
        this.nextBtn.classList.remove('hidden');

        // Si on arrive à la dernière question, afficher la page de fin
        if (this.currentScenarioIndex === scenarios.length - 1) {
            this.nextBtn.classList.add('hidden');
            this.endBtn.classList.remove('hidden');
        }

        // Scroll jusqu'au feedback
        this.feedbackEl.scrollIntoView({ behavior: 'smooth', block: 'start' });        
    }

    nextScenario() {
        this.currentScenarioIndex = (this.currentScenarioIndex + 1) % scenarios.length;
        this.loadScenario();
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new CorrelationGame();
});
