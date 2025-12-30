// Configuración optimizada para rendimiento
        const MAX_FLASHES = 15;
        const MAX_CONFETTI = 80;

        // Configurar el canvas para el confeti
        const canvas = document.getElementById('confetti-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Elementos de la interfaz
        const shareButton = document.getElementById('share-button');
        const modalOverlay = document.getElementById('modal-overlay');
        const modalClose = document.getElementById('modal-close');
        const modalUrl = document.getElementById('modal-url');

        // Array para almacenar las partículas de confeti
        let confettiParticles = [];
        const confettiColors = [
            '#ff0000', '#00ff00', '#0000ff', '#ffff00',
            '#ff00ff', '#00ffff', '#ff8000', '#ff0080'
        ];

        // Clase para partículas de confeti optimizada
        class ConfettiParticle {
            constructor(isBurst = false) {
                this.x = Math.random() * canvas.width;
                if (isBurst) {
                    this.x = canvas.width / 2 + (Math.random() - 0.5) * 300;
                    this.y = canvas.height / 2;
                } else {
                    this.y = Math.random() * canvas.height - canvas.height;
                }

                this.size = Math.random() * 8 + 4;
                this.speedX = (Math.random() * 6 - 3) * (isBurst ? 2 : 1);
                this.speedY = Math.random() * 4 + 2;
                this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
                this.shape = Math.random() > 0.5 ? 'circle' : 'rectangle';
                this.rotation = Math.random() * 360;
                this.rotationSpeed = Math.random() * 8 - 4;
                this.life = 1.0;
                this.decay = isBurst ? 0.05 : 0.02;
                this.gravity = 0.1;
                this.wind = Math.random() * 0.1 - 0.05;
            }

            update() {
                this.x += this.speedX + this.wind;
                this.y += this.speedY;
                this.speedY += this.gravity;
                this.rotation += this.rotationSpeed;
                this.life -= this.decay;
                return this.y < canvas.height + 50 && this.life > 0;
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation * Math.PI / 180);
                ctx.globalAlpha = this.life;
                ctx.fillStyle = this.color;
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 15;

                if (this.shape === 'circle') {
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
                }
                ctx.restore();
            }
        }

        // Crear destellos rápidos
        function createFlash() {
            const effectsContainer = document.getElementById('background-effects');
            const currentFlashes = effectsContainer.children.length;

            if (currentFlashes >= MAX_FLASHES && effectsContainer.firstChild) {
                effectsContainer.removeChild(effectsContainer.firstChild);
            }

            const flash = document.createElement('div');
            flash.classList.add('flash');
            const size = Math.random() * 150 + 50;
            flash.style.width = `${size}px`;
            flash.style.height = `${size}px`;
            flash.style.left = `${Math.random() * 100}%`;
            flash.style.top = `${Math.random() * 100}%`;

            const colors = [
                'rgba(255, 0, 128, 0.7)',
                'rgba(0, 204, 255, 0.7)',
                'rgba(255, 255, 0, 0.7)',
                'rgba(255, 255, 255, 0.7)'
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];
            flash.style.background = `radial-gradient(circle, ${color} 0%, rgba(255,255,255,0) 70%)`;

            effectsContainer.appendChild(flash);
            setTimeout(() => {
                if (flash.parentNode) {
                    flash.parentNode.removeChild(flash);
                }
            }, 800);
        }

        // Crear explosión de confeti optimizada
        function createConfettiBurst() {
            if (confettiParticles.length > MAX_CONFETTI * 0.7) {
                confettiParticles.splice(0, Math.floor(confettiParticles.length * 0.3));
            }

            const burstCount = 40;
            for (let i = 0; i < burstCount; i++) {
                confettiParticles.push(new ConfettiParticle(true));
            }

            confetti({
                particleCount: 50,
                spread: 90,
                origin: {
                    x: Math.random() * 0.8 + 0.1,
                    y: Math.random() * 0.5 + 0.2
                },
                colors: confettiColors,
                gravity: 0.5,
                ticks: 100,
                decay: 0.94
            });

            for (let i = 0; i < 5; i++) {
                setTimeout(createFlash, i * 100);
            }
        }

        // Crear confeti normal
        function createNormalConfetti() {
            if (confettiParticles.length > MAX_CONFETTI) {
                confettiParticles.splice(0, confettiParticles.length - MAX_CONFETTI);
            }

            const newCount = Math.random() > 0.5 ? 2 : 1;
            for (let i = 0; i < newCount; i++) {
                confettiParticles.push(new ConfettiParticle(false));
            }
        }

        // Animación del confeti
        function animateConfetti() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(10, 10, 26, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            confettiParticles = confettiParticles.filter(particle => {
                const isAlive = particle.update();
                if (isAlive) particle.draw();
                return isAlive;
            });

            requestAnimationFrame(animateConfetti);
        }

        // Copiar enlace al portapapeles
        function copyLinkToClipboard() {
            const currentUrl = window.location.href;
            modalUrl.textContent = currentUrl;

            navigator.clipboard.writeText(currentUrl)
                .then(() => {
                    showModal();
                    createConfettiBurst();

                    const originalText = shareButton.innerHTML;
                    shareButton.innerHTML = '<i class="fas fa-check"></i> ¡Copiado!';
                    shareButton.style.background = 'linear-gradient(135deg, #00cc00, #00ff00)';

                    setTimeout(() => {
                        shareButton.innerHTML = originalText;
                        shareButton.style.background = 'linear-gradient(135deg, #64195aff, #d374cbff)';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Error al copiar: ', err);
                    const textArea = document.createElement('textarea');
                    textArea.value = currentUrl;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);

                    showModal();
                    createConfettiBurst();
                });
        }

        // Mostrar modal de confirmación
        function showModal() {
            modalOverlay.classList.add('active');

            for (let i = 0; i < 8; i++) {
                setTimeout(createFlash, i * 150);
            }

            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: confettiColors,
                gravity: 0.4
            });
        }

        // Ocultar modal
        function hideModal() {
            modalOverlay.classList.remove('active');
            createConfettiBurst();
        }

        // Inicializar efectos
        function initEffects() {
            for (let i = 0; i < 5; i++) {
                setTimeout(createFlash, i * 900);
            }

            for (let i = 0; i < 30; i++) {
                confettiParticles.push(new ConfettiParticle(false));
            }

            setInterval(createConfettiBurst, 1500);
            setInterval(createNormalConfetti, 300);
            setInterval(createFlash, 800);
            animateConfetti();
        }

        // Ajustar canvas al cambiar tamaño de ventana
        function handleResize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        // Inicializar todo cuando la página cargue
        window.addEventListener('load', function () {
            handleResize();
            initEffects();

            // Mostrar la URL actual en el modal
            modalUrl.textContent = window.location.href;

            // Event listeners
            shareButton.addEventListener('click', copyLinkToClipboard);
            modalClose.addEventListener('click', hideModal);

            modalOverlay.addEventListener('click', function (e) {
                if (e.target === modalOverlay) hideModal();
            });

            // Explosión inicial
            setTimeout(() => {
                confetti({
                    particleCount: 150,
                    spread: 100,
                    origin: { y: 0.4 },
                    colors: confettiColors,
                    gravity: 0.4,
                    ticks: 200,
                    decay: 0.92
                });

                for (let i = 0; i < 8; i++) {
                    setTimeout(createFlash, i * 120);
                }
            }, 500);
        });

        window.addEventListener('resize', handleResize);
