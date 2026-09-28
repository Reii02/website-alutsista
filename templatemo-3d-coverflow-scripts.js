/*

TemplateMo 595 3d coverflow

https://templatemo.com/tm-595-3d-coverflow

*/

// JavaScript Document

        // Coverflow functionality
        const items = document.querySelectorAll('.coverflow-item');
        const dotsContainer = document.getElementById('dots');
        const currentTitle = document.getElementById('current-title');
        const currentDescription = document.getElementById('current-description');
        const container = document.querySelector('.coverflow-container');
        const menuToggle = document.getElementById('menuToggle');
        const mainMenu = document.getElementById('mainMenu');
        let currentIndex = 3;
        let isAnimating = false;

        // Mobile menu toggle
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mainMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on menu items (except external links)
        document.querySelectorAll('.menu-item:not(.external)').forEach(item => {
            item.addEventListener('click', (e) => {
                menuToggle.classList.remove('active');
                mainMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !mainMenu.contains(e.target)) {
                menuToggle.classList.remove('active');
                mainMenu.classList.remove('active');
            }
        });

        // Image data with titles and descriptions
        const imageData = [
            {
                title: "Elektrik Trail",
                description: "Rendah Emisi dan Tangguh"
            },
            {
                title: "Drone Pemantau",
                description: "Mengawasi medan dari udara dengan presisi tinggi"
            },
            {
                title: "Drone FPV",
                description: "Drone dengan kamera FPV"
            },
            {
                title: "Pesawat Angkut",
                description: "Mengangkut logistik dan pasukan ke medan tempur"
            },
            {
                title: "Mobil Jammer",
                description: "Mobil dengan kemampuan mengganggu sinyal komunikasi musuh"
            },
            {
                title: "Mobil Repeater",
                description: "Mobil dengan kemampuan memperkuat sinyal komunikasi"
            },
            {
                title: "Drone Jammer",
                description: "Senjata anti drone untuk melindungi wilayah dari ancaman udara"
            }
        ];

        // Create dots
        items.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'dot';
            dot.onclick = () => goToIndex(index);
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');
        let autoplayInterval = null;
        let isPlaying = true;
        const playIcon = document.querySelector('.play-icon');
        const pauseIcon = document.querySelector('.pause-icon');

        function updateCoverflow() {
            if (isAnimating) return;
            isAnimating = true;

            items.forEach((item, index) => {
                let offset = index - currentIndex;
                
                if (offset > items.length / 2) {
                    offset = offset - items.length;
                }
                else if (offset < -items.length / 2) {
                    offset = offset + items.length;
                }
                
                const absOffset = Math.abs(offset);
                const sign = Math.sign(offset);
                
                let translateX = offset * 220;
                let translateZ = -absOffset * 200;
                let rotateY = -sign * Math.min(absOffset * 60, 60);
                let opacity = 1 - (absOffset * 0.2);
                let scale = 1 - (absOffset * 0.1);

                if (absOffset > 3) {
                    opacity = 0;

                    translateX = sign * 800;
                }

                item.style.transform = `
                    translateX(${translateX}px) 
                    translateZ(${translateZ}px) 
                    rotateY(${rotateY}deg)
                    scale(${scale})
                `;
                item.style.opacity = opacity;
                item.style.zIndex = 100 - absOffset;

                item.classList.toggle('active', index === currentIndex);
            });

            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });

            const currentData = imageData[currentIndex];
            currentTitle.textContent = currentData.title;
            currentDescription.textContent = currentData.description;
            
            currentTitle.style.animation = 'none';
            currentDescription.style.animation = 'none';
            setTimeout(() => {
                currentTitle.style.animation = 'fadeIn 0.6s forwards';
                currentDescription.style.animation = 'fadeIn 0.6s forwards';
            }, 10);

            setTimeout(() => {
                isAnimating = false;
            }, 600);
        }

        function navigate(direction) {
            if (isAnimating) return;
            
            currentIndex = currentIndex + direction;
            
            if (currentIndex < 0) {
                currentIndex = items.length - 1;
            } else if (currentIndex >= items.length) {
                currentIndex = 0;
            }
            
            updateCoverflow();
        }

        function goToIndex(index) {
            if (isAnimating || index === currentIndex) return;
            currentIndex = index;
            updateCoverflow();
        }

        // Keyboard navigation
        container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') navigate(-1);
            if (e.key === 'ArrowRight') navigate(1);
        });

        // Click on items to select
        items.forEach((item, index) => {
            item.addEventListener('click', () => goToIndex(index));
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;
        let isSwiping = false;

        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            isSwiping = true;
        }, { passive: true });

        container.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
            
            const currentX = e.changedTouches[0].screenX;
            const diff = currentX - touchStartX;
            
            if (Math.abs(diff) > 10) {
                e.preventDefault();
            }
        }, { passive: false });

        container.addEventListener('touchend', (e) => {
            if (!isSwiping) return;
            
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
            isSwiping = false;
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 30;
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;
            
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
                handleUserInteraction();
                
                if (diffX > 0) {
                    navigate(1);
                } else {
                    navigate(-1);
                }
            }
        }

        // Initialize images and reflections
        items.forEach((item, index) => {
            const img = item.querySelector('img');
            const reflection = item.querySelector('.reflection');
            
            img.onload = function() {

                this.parentElement.classList.remove('image-loading');
                reflection.style.setProperty('--bg-image', `url(${this.src})`);
                reflection.style.backgroundImage = `url(${this.src})`;
                reflection.style.backgroundSize = 'cover';
                reflection.style.backgroundPosition = 'center';
            };
            
            img.onerror = function() {
                this.parentElement.classList.add('image-loading');
            };
        });

        // Autoplay functionality
        function startAutoplay() {
            autoplayInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % items.length;
                updateCoverflow();
            }, 4000);
            isPlaying = true;
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        }

        function stopAutoplay() {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
                autoplayInterval = null;
            }
            isPlaying = false;
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }

        function toggleAutoplay() {
            if (isPlaying) {
                stopAutoplay();
            } else {
                startAutoplay();
            }
        }

        function handleUserInteraction() {
            stopAutoplay();
        }

        // Add event listeners to stop autoplay on manual navigation
        items.forEach((item) => {
            item.addEventListener('click', handleUserInteraction);
        });

        document.querySelector('.nav-button.prev').addEventListener('click', handleUserInteraction);
        document.querySelector('.nav-button.next').addEventListener('click', handleUserInteraction);
        
        dots.forEach((dot) => {
            dot.addEventListener('click', handleUserInteraction);
        });

        container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                handleUserInteraction();
            }
        });

        // Smooth scrolling and active menu item
        const sections = document.querySelectorAll('.section');
        const menuItems = document.querySelectorAll('.menu-item');
        const header = document.getElementById('header');
        const scrollToTopBtn = document.getElementById('scrollToTop');

        // Update active menu item on scroll
        function updateActiveMenuItem() {
            const scrollPosition = window.scrollY + 100;

            sections.forEach((section, index) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    menuItems.forEach(item => {
                        if (!item.classList.contains('external')) {
                            item.classList.remove('active');
                        }
                    });
                    if (menuItems[index] && !menuItems[index].classList.contains('external')) {
                        menuItems[index].classList.add('active');
                    }
                }
            });

            // Header background on scroll
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Show/hide scroll to top button
            if (window.scrollY > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }

        window.addEventListener('scroll', updateActiveMenuItem);

        // Smooth scroll to section
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const targetId = item.getAttribute('href');
                
                // Check if it's an internal link (starts with #)
                if (targetId && targetId.startsWith('#')) {
                    e.preventDefault();
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
                // External links will open normally in new tab
            });
        });

        // Logo click to scroll to top
        document.querySelector('.logo-container').addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Scroll to top button
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Form submission
        function handleSubmit(event) {
            event.preventDefault();
            alert('Thank you for your message! We\'ll get back to you soon.');
            event.target.reset();
        }

        // Initialize
        updateCoverflow();
        container.focus();
        startAutoplay();

        // ===== Alutsista TNI AD Gallery =====

         const alutsistaData = [
            {
                id: 1,
                name: "Tank Leopard 2A4",
                category: "Kavaleri",
                unit: "Batalyon Kavaleri Kostrad",
                desc: "Tank tempur utama berat yang menjadi andalan daya gempur Kavaleri TNI AD. Diadopsi untuk memperkuat kemampuan pertempuran lapis baja jarak jauh dengan proteksi dan daya hancur tinggi.",
                image: "images/asset-alutsista/1.jpg",
                specs: [
                    ["Jenis / Peran", "Tank Tempur Utama (MBT)"],
                    ["Negara Asal", "Jerman"],
                    ["Kaliber / Persenjataan", "Meriam smoothbore 120 mm"],
                    ["Kecepatan Maksimum", "± 68 km/jam"],
                    ["Jarak Jelajah", "± 550 km"],
                    ["Kapasitas Kru", "4 orang"]
                ]
            },
            {
                id: 2,
                name: "Panser Anoa 6x6",
                category: "Kavaleri",
                unit: "Batalyon Kavaleri / Zeni Tempur",
                desc: "Panser angkut personel lapis baja produksi dalam negeri, digunakan untuk mobilitas pasukan di medan tempur maupun operasi penjagaan perdamaian.",
                image: "images/asset-alutsista/2.jpg",
                specs: [
                    ["Jenis / Peran", "Angkut Personel Lapis Baja (APC)"],
                    ["Negara Asal", "Indonesia (PT Pindad)"],
                    ["Kaliber / Persenjataan", "SMB 12,7 mm"],
                    ["Kecepatan Maksimum", "± 90 km/jam"],
                    ["Jarak Jelajah", "± 600 km"],
                    ["Kapasitas Kru", "3 awak + 10 pasukan"]
                ]
            },
            {
                id: 3,
                name: "Meriam Caesar 155mm",
                category: "Artileri Medan",
                unit: "Batalyon Artileri Medan (Yon Armed)",
                desc: "Howitzer swagerak kaliber 155 mm yang memberikan daya tembak jarak jauh dengan mobilitas tinggi bagi satuan artileri medan.",
                image: "images/asset-alutsista/3.jpg",
                specs: [
                    ["Jenis / Peran", "Howitzer Swagerak"],
                    ["Negara Asal", "Prancis"],
                    ["Kaliber / Persenjataan", "155 mm / 52 kaliber"],
                    ["Kecepatan Maksimum", "± 80 km/jam"],
                    ["Jarak Jangkauan Tembak", "hingga ± 40 km"],
                    ["Kapasitas Kru", "5 orang"]
                ]
            },
            {
                id: 4,
                name: "MLRS Astros II",
                category: "Artileri Medan",
                unit: "Batalyon Artileri Medan (Yon Armed)",
                desc: "Sistem peluncur roket ganda yang mampu melepaskan tembakan salvo dengan jangkauan sangat jauh untuk mendukung operasi artileri medan.",
                image: "images/asset-alutsista/4.jpg",
                specs: [
                    ["Jenis / Peran", "Multiple Launch Rocket System"],
                    ["Negara Asal", "Brasil"],
                    ["Kaliber / Persenjataan", "Roket 300 mm"],
                    ["Kecepatan Maksimum", "± 90 km/jam"],
                    ["Jarak Jangkauan Tembak", "hingga ± 90 km"],
                    ["Kapasitas Kru", "3 orang"]
                ]
            },
            {
                id: 5,
                name: "Helikopter Apache AH-64E",
                category: "Penerbad",
                unit: "Puspenerbad TNI AD",
                desc: "Helikopter serang generasi terbaru yang memperkuat kemampuan penerbangan Angkatan Darat dalam mendukung operasi tempur udara ke darat.",
                image: "images/asset-alutsista/5.jpg",
                specs: [
                    ["Jenis / Peran", "Helikopter Serang"],
                    ["Negara Asal", "Amerika Serikat"],
                    ["Kaliber / Persenjataan", "Kanon 30 mm, rudal Hellfire"],
                    ["Kecepatan Maksimum", "± 293 km/jam"],
                    ["Jarak Jelajah", "± 480 km"],
                    ["Kapasitas Kru", "2 orang"]
                ]
            },
            {
                id: 6,
                name: "Tank Harimau (Kaplan MT)",
                category: "Kavaleri",
                unit: "Batalyon Kavaleri Kostrad",
                desc: "Tank medium hasil kerja sama Indonesia dan Turki, dirancang untuk memberi mobilitas dan daya tembak seimbang di berbagai jenis medan.",
                image: "images/asset-alutsista/6.jpg",
                specs: [
                    ["Jenis / Peran", "Tank Medium"],
                    ["Negara Asal", "Indonesia - Turki"],
                    ["Kaliber / Persenjataan", "Meriam 105 mm"],
                    ["Kecepatan Maksimum", "± 70 km/jam"],
                    ["Jarak Jelajah", "± 450 km"],
                    ["Kapasitas Kru", "3 orang"]
                ]
            }
        ];

        const alutsistaGrid = document.getElementById('alutsistaGrid');
        const alutsistaFilters = document.getElementById('alutsistaFilters');
        const alutsistaCategories = ["Semua", ...new Set(alutsistaData.map(i => i.category))];
        let alutsistaActiveCategory = "Semua";

        function renderAlutsistaFilters() {
            alutsistaFilters.innerHTML = alutsistaCategories.map(c =>
                `<button class="alutsista-filter-btn ${c === alutsistaActiveCategory ? 'active' : ''}" data-cat="${c}">${c}</button>`
            ).join('');

            alutsistaFilters.querySelectorAll('.alutsista-filter-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    alutsistaActiveCategory = btn.dataset.cat;
                    renderAlutsistaFilters();
                    renderAlutsistaGrid();
                });
            });
        }

        function renderAlutsistaGrid() {
            const list = alutsistaActiveCategory === "Semua"
                ? alutsistaData
                : alutsistaData.filter(i => i.category === alutsistaActiveCategory);

            alutsistaGrid.innerHTML = list.map(item => `
                <div class="alutsista-card" data-id="${item.id}" tabindex="0" role="button" aria-label="Lihat detail ${item.name}">
                    <div class="alutsista-card-media">
                        <img src="${item.image}" alt="${item.name}" loading="lazy">
                    </div>
                    <div class="alutsista-card-body">
                        <span class="alutsista-tag">${item.category}</span>
                        <h3>${item.name}</h3>
                        <div class="alutsista-card-hint">
                            Lihat Spesifikasi
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                                <path d="M5 12h14M13 6l6 6-6 6"/>
                            </svg>
                        </div>
                    </div>
                </div>
            `).join('');

            alutsistaGrid.querySelectorAll('.alutsista-card').forEach(card => {
                const open = () => openAlutsistaModal(Number(card.dataset.id));
                card.addEventListener('click', open);
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        open();
                    }
                });
            });
        }

        const alutsistaModalOverlay = document.getElementById('alutsistaModalOverlay');
        const alutsistaModalMedia = document.getElementById('alutsistaModalMedia');
        const alutsistaModalTag = document.getElementById('alutsistaModalTag');
        const alutsistaModalTitle = document.getElementById('alutsistaModalTitle');
        const alutsistaModalUnit = document.getElementById('alutsistaModalUnit');
        const alutsistaModalDesc = document.getElementById('alutsistaModalDesc');
        const alutsistaModalSpecs = document.getElementById('alutsistaModalSpecs');
        const alutsistaModalClose = document.getElementById('alutsistaModalClose');
        let alutsistaLastFocused = null;

        function openAlutsistaModal(id) {
            const item = alutsistaData.find(i => i.id === id);
            if (!item) return;

            alutsistaLastFocused = document.activeElement;
            alutsistaModalMedia.innerHTML = `<img src="${item.image}" alt="${item.name}" loading="lazy">`;
            alutsistaModalTag.textContent = item.category;
            alutsistaModalTitle.textContent = item.name;
            alutsistaModalUnit.textContent = item.unit;
            alutsistaModalDesc.textContent = item.desc;
            alutsistaModalSpecs.innerHTML = item.specs.map(([label, value]) => `
                <div class="alutsista-spec-item">
                    <div class="alutsista-spec-label">${label}</div>
                    <div class="alutsista-spec-value">${value}</div>
                </div>
            `).join('');

            alutsistaModalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            alutsistaModalClose.focus();
        }

        function closeAlutsistaModal() {
            alutsistaModalOverlay.classList.remove('active');
            document.body.style.overflow = '';
            if (alutsistaLastFocused) alutsistaLastFocused.focus();
        }

        alutsistaModalClose.addEventListener('click', closeAlutsistaModal);

        alutsistaModalOverlay.addEventListener('click', (e) => {
            if (e.target === alutsistaModalOverlay) closeAlutsistaModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && alutsistaModalOverlay.classList.contains('active')) {
                closeAlutsistaModal();
            }
        });

        renderAlutsistaFilters();
        renderAlutsistaGrid();