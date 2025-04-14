// Placeholder for JavaScript interactions

document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio experience loaded.');
    // Easter Egg Log
    console.log(`
 K   K  OOO  RRRR   ZZZZZ EEEEE
 K  K  O   O R   R     Z  E
 K K   O   O RRRR     Z   EEE
 K  K  O   O R   R   Z    E
 K   K  OOO  R   R  ZZZZZ EEEEE
 \n > shake out the bits...`);

    const interactiveSpace = document.getElementById('interactive-space');
    // interactiveSpace.innerHTML = ''; // Remove this - HTML is now static

    // Add event listeners to workbench items
    const items = document.querySelectorAll('.workbench-item');
    items.forEach(item => {
        item.addEventListener('click', (event) => {
            // Prevent closing if the click is on the item itself
            event.stopPropagation(); 
            // Trigger intense glitch on the clicked item
            item.classList.add('glitching');
            // Remove glitch class after animation finishes
            setTimeout(() => item.classList.remove('glitching'), 500); // Match animation duration

            const section = item.dataset.section;
            console.log(`Clicked on section: ${section}`);
            openViewer(section);
        });
    });

    // Add event listeners to close buttons
    const closeButtons = document.querySelectorAll('.close-btn');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Find the parent viewer and close it
            const viewer = btn.closest('.content-viewer');
            if (viewer) {
                closeViewer(viewer);
            }
        });
    });

    // Add event listener for clicking outside the viewer to close it
    document.addEventListener('click', (event) => {
        const openViewer = document.querySelector('.content-viewer.visible');
        // If a viewer is open and the click is not inside the viewer or on a workbench item
        if (openViewer && !openViewer.contains(event.target) && !event.target.closest('.workbench-item')) {
            closeViewer(openViewer);
        }
    });

    function openViewer(section) {
        // Close any currently open viewer first
        const openViewers = document.querySelectorAll('.content-viewer.visible');
        openViewers.forEach(closeViewer);

        const viewer = document.getElementById(`viewer-${section}`);
        const placeholder = viewer.querySelector('.viewer-content-placeholder');

        if (viewer && placeholder) {
            // Show loading indicator only if content isn't loaded
            if (!placeholder.innerHTML.trim()) {
                placeholder.innerHTML = '<p class="loading-indicator">[fetching bits...]</p>';
                // Start transition immediately, showing the loader
                viewer.classList.add('visible');
                document.body.classList.add('viewer-open');
            }

            // Fetch content if the placeholder is showing the loader (or is empty)
            // (The trim check is technically redundant now but harmless)
            if (!placeholder.querySelector(':not(.loading-indicator)') || !placeholder.innerHTML.trim()) {
                fetch(`${section}_content.html`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.text();
                    })
                    .then(html => {
                        // Ensure placeholder is cleared before adding new content if loader was present
                        const loader = placeholder.querySelector('.loading-indicator');
                        if (loader) {
                            placeholder.innerHTML = html; // Replace loader
                        } else {
                            // If somehow content loaded without loader (e.g., error state cleared?), just set it
                            placeholder.innerHTML = html;
                        }

                        // Re-attach close button listener if it's part of the loaded content
                        const closeButton = placeholder.querySelector('.close-btn');
                        if (closeButton && viewer) { // Ensure viewer is valid
                             closeButton.addEventListener('click', (event) => {
                                event.stopPropagation(); // Prevent outside click listener from firing
                                closeViewer(viewer);
                             });
                        }
                        // Content loaded, remove loading indicator (if it was there)
                        const loadingIndicator = placeholder.querySelector('.loading-indicator');
                        if (loadingIndicator) loadingIndicator.remove();

                        // Make viewer visible *after* content is loaded
                        // viewer.classList.add('visible'); // Moved earlier
                        // document.body.classList.add('viewer-open'); // Moved earlier
                    })
                    .catch(error => {
                        console.error('Error loading viewer content:', error);
                        placeholder.innerHTML = '<p class="error-message">error fetching bits.</p>'; // Use error class
                         // Still show the viewer with the error message
                         viewer.classList.add('visible');
                        document.body.classList.add('viewer-open');
                        // Ensure no loader is visible if content was already there
                        const existingLoader = placeholder.querySelector('.loading-indicator');
                        if(existingLoader) existingLoader.remove();
                    });
            } else {
                 // If content is already loaded, just make it visible
                viewer.classList.add('visible');
                document.body.classList.add('viewer-open'); // Dim background
                // Ensure no loader is visible if content was already there
                const existingLoader = placeholder.querySelector('.loading-indicator');
                if(existingLoader) existingLoader.remove();
            }
        }
    }

    function closeViewer(viewer) {
        if (viewer) {
            viewer.classList.remove('visible');
            // Clear content when closing? Optional - keeps it loaded for faster reopening
            // const placeholder = viewer.querySelector('.viewer-content-placeholder');
            // if(placeholder) placeholder.innerHTML = '';

            // Check if any other viewers are open before removing the body class
            // Use timeout to allow the fade-out animation to complete
            setTimeout(() => {
                 const stillOpenViewers = document.querySelectorAll('.content-viewer.visible');
                 if (stillOpenViewers.length === 0) {
                    document.body.classList.remove('viewer-open');
                 }
             }, 400); // Match CSS transition duration
        }
    }

    // --- Item Drifting Logic --- 
    let driftInterval = null; 
    const introContent = document.querySelector('.intro-content'); // Cache title block

    function startDrifting() {
        if (driftInterval) clearInterval(driftInterval);

        driftInterval = setInterval(() => {
            const titleRect = introContent.getBoundingClientRect(); // Get title bounds

            items.forEach(item => {
                // Don't drift if hovered or glitching
                if (item.matches(':hover') || item.classList.contains('glitching')) return;

                // Read current position or initial data attribute
                const baseTop = parseFloat(item.dataset.initialTop);
                const baseLeft = parseFloat(item.dataset.initialLeft);
                // Get current *styled* position for smooth continuation, default to base if unset
                const currentTop = parseFloat(item.style.top || baseTop);
                const currentLeft = parseFloat(item.style.left || baseLeft);

                // Calculate small random drift (within bounds)
                let driftX = (Math.random() - 0.5) * 2; // Increased max drift H
                let driftY = (Math.random() - 0.5) * 2; // Increased max drift V

                let newLeft = currentLeft + driftX;
                let newTop = currentTop + driftY;

                // --- Collision Avoidance with Title Block --- 
                const itemRect = item.getBoundingClientRect(); // Get item dimensions once
                // Calculate potential next position in pixels for collision check
                const nextLeftPx = (newLeft / 100) * window.innerWidth;
                const nextTopPx = (newTop / 100) * window.innerHeight;

                const nextItemRect = {
                    left: nextLeftPx,
                    top: nextTopPx,
                    right: nextLeftPx + itemRect.width,
                    bottom: nextTopPx + itemRect.height
                };

                const overlaps = (
                    nextItemRect.left < titleRect.right &&
                    nextItemRect.right > titleRect.left &&
                    nextItemRect.top < titleRect.bottom &&
                    nextItemRect.bottom > titleRect.top
                );

                // Only apply drift if the next position does NOT overlap title
                if (!overlaps) {
                    // Bounds checking relative to the initial position to prevent excessive wandering
                    const maxWanderH = 10; // Max 10% horizontal wander from initial
                    const maxWanderV = 10; // Max 10% vertical wander from initial

                    newLeft = Math.max(baseLeft - maxWanderH, Math.min(newLeft, baseLeft + maxWanderH));
                    newTop = Math.max(baseTop - maxWanderV, Math.min(newTop, baseTop + maxWanderV));

                    // Additional absolute bounds (prevent going off-screen if initial is near edge)
                    const absMaxLeft = 100 - (itemRect.width / window.innerWidth * 100) - 2;
                    const absMaxTop = 100 - (itemRect.height / window.innerHeight * 100) - 2;
                    const absMin = 2;
                    newLeft = Math.max(absMin, Math.min(newLeft, absMaxLeft));
                    newTop = Math.max(absMin, Math.min(newTop, absMaxTop));

                    item.style.transition = 'top 4s ease-in-out, left 4s ease-in-out'; // Smoother timing function
                    item.style.top = `${newTop}%`;
                    item.style.left = `${newLeft}%`;
                }
                // --- End Collision Avoidance ---
            });
        }, 3000); // Update drift slightly less often
    }

    function stopDrifting() {
        if (driftInterval) clearInterval(driftInterval);
        driftInterval = null;
        items.forEach(item => item.style.transition = ''); // Remove drift transition
    }

    // Start drifting initially
    startDrifting();

    // Optional: Stop drifting when a viewer is open?
    // You might want to modify openViewer and closeViewer to call stopDrifting() and startDrifting()

    // Set initial positions from data attributes
    items.forEach(item => {
        item.style.top = `${item.dataset.initialTop}%`;
        item.style.left = `${item.dataset.initialLeft}%`;
    });

    // --- Animated Background Grid Logic --- 
    const gridContainer = document.getElementById('background-grid');
    const characters = ['k', 'o', 'r', 'z', 'e', '◇', '□', '>_', '*'];
    let gridSpans = [];

    function createGrid() {
        gridContainer.innerHTML = ''; // Clear existing grid
        gridSpans = [];
        const spanWidth = 12;
        const spanHeight = 12;
        const cols = Math.floor(window.innerWidth / spanWidth);
        const rows = Math.floor(window.innerHeight / spanHeight);
        const numSpans = cols * rows;

        for (let i = 0; i < numSpans; i++) {
            const span = document.createElement('span');
            span.textContent = characters[Math.floor(Math.random() * characters.length)];
            gridContainer.appendChild(span);
            gridSpans.push(span);
        }
    }

    let gridAnimationInterval = null;

    function animateGrid() {
        if (gridAnimationInterval) clearInterval(gridAnimationInterval);

        gridAnimationInterval = setInterval(() => {
            if (gridSpans.length === 0) return;

            // Update more spans for better visibility
            const updatesPerInterval = Math.max(20, Math.floor(gridSpans.length * 0.01)); // Update 1% or at least 20
            for (let i = 0; i < updatesPerInterval; i++) { 
                const randomIndex = Math.floor(Math.random() * gridSpans.length);
                const randomSpan = gridSpans[randomIndex];
                if (randomSpan) {
                    randomSpan.textContent = characters[Math.floor(Math.random() * characters.length)];
                    // Randomly flicker opacity slightly
                    randomSpan.style.opacity = 0.3 + Math.random() * 0.4; // More noticeable range (0.3 to 0.7)
                }
            }
        }, 100); // Update interval
    }

    // Initial setup
    createGrid();
    animateGrid();

    // Recreate grid on resize (debounced)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            createGrid();
            // No need to restart animateGrid, it uses the new gridSpans array
        }, 250);
    });
}); 