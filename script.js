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

    // Add event listener for 'Escape' key to close open viewers
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const openViewers = document.querySelectorAll('.content-viewer.visible');
            openViewers.forEach(closeViewer);
        }
    });

    // Function to load blog posts from markdown files
    function loadBlogPosts() {
        const blogContainer = document.getElementById('blog-posts-container');
        if (!blogContainer) return;

        // Show loading indicator
        blogContainer.innerHTML = '<p class="loading-indicator">[fetching blog posts...]</p>';

        // Try PHP API first, then fall back to JS version
        fetch('blog_api.php')
            .then(response => {
                if (!response.ok) {
                    // PHP failed, use JavaScript fallback
                    console.log('PHP API failed, using JavaScript fallback');
                    return getBlogPosts(); // This is from blog_api.js
                }
                return response.json();
            })
            .catch(error => {
                // Network error or PHP not available, use JavaScript fallback
                console.log('Using JavaScript fallback due to error:', error);
                return getBlogPosts(); // This is from blog_api.js
            })
            .then(data => {
                if (!data || !data.success || !data.posts || data.posts.length === 0) {
                    blogContainer.innerHTML = '<p class="error-message">no blog posts found.</p>';
                    return;
                }

                // Clear container
                blogContainer.innerHTML = '';

                // Process each post
                data.posts.forEach((post, index) => {
                    // Create article element
                    const article = document.createElement('article');
                    article.className = 'blog-post';

                    // Convert markdown to HTML using marked library
                    const postHtml = marked.parse(post.content);
                    
                    // Add the HTML to the article
                    article.innerHTML = postHtml;

                    // Add to container
                    blogContainer.appendChild(article);

                    // Add separator if not the last post
                    if (index < data.posts.length - 1) {
                        const separator = document.createElement('hr');
                        separator.className = 'post-separator';
                        blogContainer.appendChild(separator);
                    }
                });
            })
            .catch(error => {
                console.error('Error loading blog posts from both sources:', error);
                blogContainer.innerHTML = '<p class="error-message">error fetching blog posts.</p>';
            });
    }

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

            // Special handling for blog section
            if (section === 'blog') {
                // Fetch blog content HTML structure (without posts)
                fetch(`${section}_content.html`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.text();
                    })
                    .then(html => {
                        placeholder.innerHTML = html;
                        
                        // Attach close button listener
                        const closeButton = placeholder.querySelector('.close-btn');
                        if (closeButton) {
                            closeButton.addEventListener('click', (event) => {
                                event.stopPropagation();
                                closeViewer(viewer);
                            });
                        }

                        // Make viewer visible
                        viewer.classList.add('visible');
                        document.body.classList.add('viewer-open');
                        
                        // Load blog posts dynamically
                        loadBlogPosts();
                    })
                    .catch(error => {
                        console.error('Error loading viewer content:', error);
                        placeholder.innerHTML = '<p class="error-message">error fetching bits.</p>';
                        viewer.classList.add('visible');
                        document.body.classList.add('viewer-open');
                    });
            } else {
                // Fetch content if the placeholder is showing the loader (or is empty)
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
                            viewer.classList.add('visible');
                            document.body.classList.add('viewer-open');
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
    let driftAnimationId = null;
    const itemData = new Map(); // Store data like initial pos, current transform
    const introContent = document.querySelector('.intro-content'); // Cache title block

    function startDrifting() {
        if (driftAnimationId) cancelAnimationFrame(driftAnimationId); // Clear existing if any

        function driftLoop() {
            const titleRect = introContent.getBoundingClientRect(); // Get title bounds

            items.forEach(item => {
                // Don't drift if hovered or glitching
                if (item.matches(':hover') || item.classList.contains('glitching')) return;

                const data = itemData.get(item);
                if (!data) return; // Skip if data not initialized

                // Get current *styled* position for smooth continuation, default to base if unset
                let currentTranslateX = data.currentTranslateX;
                let currentTranslateY = data.currentTranslateY;

                // Calculate small random drift (within bounds)
                // Use pixel values for drift, adjusted for smoother visual speed
                let driftXpx = (Math.random() - 0.5) * 1.5; 
                let driftYpx = (Math.random() - 0.5) * 1.5;

                let nextTranslateX = currentTranslateX + driftXpx;
                let nextTranslateY = currentTranslateY + driftYpx;

                // --- Collision Avoidance with Title Block --- 
                const itemRect = item.getBoundingClientRect(); // Get item dimensions once
                // Calculate potential next position in pixels for collision check
                // Position is initial + current translation
                const nextLeftPx = data.initialPixelLeft + nextTranslateX;
                const nextTopPx = data.initialPixelTop + nextTranslateY;

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
                    // Use pixel-based wander limits
                    const maxWanderHPx = window.innerWidth * 0.10; // Max 10% viewport width wander
                    const maxWanderVPx = window.innerHeight * 0.10; // Max 10% viewport height wander

                    nextTranslateX = Math.max(-maxWanderHPx, Math.min(nextTranslateX, maxWanderHPx));
                    nextTranslateY = Math.max(-maxWanderVPx, Math.min(nextTranslateY, maxWanderVPx));

                    // Recalculate pixel positions after wander clamping
                    let finalLeftPx = data.initialPixelLeft + nextTranslateX;
                    let finalTopPx = data.initialPixelTop + nextTranslateY;

                    // Calculate final translate based on clamped pixel positions
                    data.currentTranslateX = finalLeftPx - data.initialPixelLeft;
                    data.currentTranslateY = finalTopPx - data.initialPixelTop;

                    // Apply BOTH initial rotation and current translation
                    item.style.transform = `${data.initialRotateTransform} translate(${data.currentTranslateX}px, ${data.currentTranslateY}px)`;
                    // No JS transition needed with requestAnimationFrame
                    // item.style.transition = 'transform 0.1s linear'; // Optionally add short CSS transition if needed
                }
                // --- End Collision Avoidance ---
            });

            // Request the next frame
            driftAnimationId = requestAnimationFrame(driftLoop);
        }

        // Start the drift loop
        driftAnimationId = requestAnimationFrame(driftLoop);
    }

    function stopDrifting() {
        if (driftAnimationId) cancelAnimationFrame(driftAnimationId);
        driftAnimationId = null;
        // Reset transform? Optional. Items will just stop drifting.
        // items.forEach(item => item.style.transform = 'translate(0, 0)');
    }

    // Set initial positions from data attributes & initialize itemData
    items.forEach(item => {
        const initialTopPercent = parseFloat(item.dataset.initialTop);
        const initialLeftPercent = parseFloat(item.dataset.initialLeft);
        item.style.top = `${initialTopPercent}%`;
        item.style.left = `${initialLeftPercent}%`;

        // Get initial rotation/transform from computed style
        const computedStyle = window.getComputedStyle(item);
        const initialTransform = computedStyle.transform;
        // Store the initial transform only if it's not 'none' (default)
        const initialRotateTransform = (initialTransform !== 'none') ? initialTransform : '';

        // Store initial pixel positions and current transform state
        itemData.set(item, {
            initialPixelTop: (initialTopPercent / 100) * window.innerHeight,
            initialPixelLeft: (initialLeftPercent / 100) * window.innerWidth,
            currentTranslateX: 0,
            currentTranslateY: 0,
            initialRotateTransform: initialRotateTransform // Store the initial transform string
        });
    });

    // Start drifting if the screen is wide enough (or adjust logic as needed)
    if (window.innerWidth > 768) { // Example breakpoint
        startDrifting();
    }

    // Optional: Adjust drift on window resize
    window.addEventListener('resize', () => {
        // Recalculate initial pixel positions and restart drift if needed
        items.forEach(item => {
            const data = itemData.get(item);
            if (data) {
                const initialTopPercent = parseFloat(item.dataset.initialTop);
                const initialLeftPercent = parseFloat(item.dataset.initialLeft);
                data.initialPixelTop = (initialTopPercent / 100) * window.innerHeight;
                data.initialPixelLeft = (initialLeftPercent / 100) * window.innerWidth;
                // Reset translation? Or let it continue from current offset?
                // data.currentTranslateX = 0;
                // data.currentTranslateY = 0;
            }
        });
        // Optionally restart drifting based on new size
        if (window.innerWidth > 768) {
             if (!driftAnimationId) startDrifting(); // Start if stopped
        } else {
            stopDrifting();
            // Reset transforms if stopping drift?
            items.forEach(item => {
                const data = itemData.get(item);
                 item.style.transform = data ? data.initialRotateTransform : ''; // Reset to initial rotation
             });
        }
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
        // Use requestAnimationFrame for smoother, more performant animation
        function animationLoop() {
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

            // Request the next frame
            requestAnimationFrame(animationLoop);
        }

        // Start the loop
        requestAnimationFrame(animationLoop);
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

// --- Helper: Debounce function (optional, useful for resize)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}; 