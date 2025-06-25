
document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.getElementById('navbar');
    const body = document.body;
    const header = document.querySelector('header');

    // ==== MENU TOGGLE ====
    menuToggle.addEventListener('click', function () {
        this.classList.toggle('active');
        navbar.classList.toggle('active');
        body.classList.toggle('no-scroll');

        if (navbar.classList.contains('active')) {
            const navItems = document.querySelectorAll('nav ul li');
            navItems.forEach((item, index) => {
                item.style.animation = `navItemFade 0.5s ease forwards ${index * 0.1}s`;
            });
        } else {
            document.querySelectorAll('nav ul li').forEach(item => {
                item.style.animation = '';
            });
        }
    });

    // ==== MENU LINK CLICK CLOSE ====
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navbar.classList.remove('active');
            body.classList.remove('no-scroll');
        });
    });

    // ==== HEADER SCROLL EFFECT ====
    window.addEventListener('scroll', function () {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ==== GALLERY PROJECT TOGGLE ====
    function openProject(id) {
        document.body.classList.add('project-open', 'no-scroll');
        document.getElementById('projectGallery').style.display = 'none';
        const projectElement = document.getElementById(id);
        projectElement.style.display = 'block';
        document.getElementById('toolbar').style.display = 'flex';
        currentProject = id;
        projectElement.scrollTop = 0;

        images = document.querySelectorAll(`#${id} .project-image`);
        images.forEach((img, index) => {
            img.setAttribute('data-index', index);
            img.addEventListener('click', function () {
                openImageViewer(parseInt(this.getAttribute('data-index')));
            });
        });
    }

    function closeProject() {
        document.body.classList.remove('project-open', 'no-scroll');
        if (currentProject) {
            document.getElementById('projectGallery').style.display = 'flex';
            document.getElementById(currentProject).style.display = 'none';
            document.getElementById('toolbar').style.display = 'none';
            currentProject = null;
            closeViewer();
        }
    }

    // Close button event listeners
    document.querySelectorAll('.project-close').forEach(btn => {
        btn.addEventListener('click', closeProject);
    });

    // Escape key to close project
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && document.body.classList.contains('project-open')) {
            closeProject();
        }
    });
});

// Smooth video loading
document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('hero-video');

    // Ensure video plays smoothly
    video.load();
    video.play().catch(e => {
        console.log("Autoplay prevented, showing fallback");
        document.querySelector('.video-fallback').style.display = 'block';
    });

    // Preload video for smoother playback
    video.setAttribute('preload', 'auto');
});

// Enhanced text animation
const phrases = [
    "WELCOME TO SALAMVIZ",
    "ARCHITECTURAL VISUALIZATION",
    "3D ARTISTRY & INNOVATION",
    "ELEVATING SPACES DIGITALLY"
];

const textElement = document.getElementById("changing-text");
let phraseIndex = 0;

function changeText() {
    // Fade out current text
    textElement.style.animation = 'none';
    textElement.style.opacity = '0';

    setTimeout(() => {
        textElement.textContent = phrases[phraseIndex];
        phraseIndex = (phraseIndex + 1) % phrases.length;

        // Fade in new text
        void textElement.offsetWidth; // Trigger reflow
        textElement.style.animation = 'fadeInOut 4s infinite';
    }, 500); // Match this with your animation timing
}

// Start the sequence
changeText();
setInterval(changeText, 4000); // Change text every 4 seconds

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
// Update the existing JavaScript to work with the new structure
document.querySelectorAll('.project-thumbnail').forEach(thumbnail => {
    thumbnail.addEventListener('click', function () {
        const projectId = this.getAttribute('data-project');
        openProject(projectId);
    });
});

// Global variables
let currentImageIndex = 0;
let images = [];
let currentProject = null;
let isFullscreen = false;

// Image titles data
const imageTitles = {
    0: "Modern Villa",
    1: "Urban Loft",
    2: "Luxury Penthouse",
    3: "Mountain Retreat"
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    initGallery();
    initComments();
    initToolbar();
    initImageViewer();

    // Close button for projects
    document.querySelectorAll('.project-close').forEach(btn => {
        btn.addEventListener('click', closeProject);
    });

    // Close button for image viewer
    document.querySelector('.viewer-close').addEventListener('click', closeViewer);
});

function initGallery() {
    document.querySelectorAll('.thumbnail').forEach(thumbnail => {
        thumbnail.addEventListener('click', function () {
            const projectId = this.getAttribute('data-project');
            openProject(projectId);
        });
    });
}

function openProject(id) {
    document.querySelector('.gallery-container').style.display = 'none';
    const projectElement = document.getElementById(id);
    projectElement.style.display = 'block';
    document.getElementById('toolbar').style.display = 'flex';
    currentProject = id;

    // Reset scroll position
    projectElement.scrollTop = 0;

    // Add class to body to prevent scrolling
    document.body.classList.add('project-open');

    // Reinitialize images for the viewer
    images = document.querySelectorAll(`#${id} .project-image`);
    images.forEach((img, index) => {
        img.setAttribute('data-index', index);
        img.addEventListener('click', function () {
            openImageViewer(parseInt(this.getAttribute('data-index')));
        });
    });

    // Focus on the project element for keyboard navigation
    projectElement.focus();
}

function closeProject() {
    if (currentProject) {
        document.querySelector('.gallery-container').style.display = 'block';
        const projectElement = document.getElementById(currentProject);
        projectElement.style.display = 'none';
        document.body.classList.remove('project-open');
        document.getElementById('toolbar').style.display = 'none';
        currentProject = null;
        closeViewer();
    }
}

// Image Viewer functions
function initImageViewer() {
    const viewer = document.getElementById('imageViewer');
    const viewerImage = document.getElementById('viewerImage');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const viewerTitle = document.getElementById('viewerTitle');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    // Close when clicking outside image
    viewer.addEventListener('click', function (e) {
        if (e.target === this) {
            closeViewer();
        }
    });

    // Navigation buttons
    prevBtn.addEventListener('click', function () {
        navigateImage(-1);
    });

    nextBtn.addEventListener('click', function () {
        navigateImage(1);
    });

    // Double-click zoom
    viewerImage.addEventListener('dblclick', function () {
        toggleZoom();
    });

    // Fullscreen button
    fullscreenBtn.addEventListener('click', toggleFullscreen);

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (viewer.classList.contains('active')) {
            if (e.key === 'Escape') {
                if (viewerImage.classList.contains('zoomed')) {
                    toggleZoom();
                } else if (isFullscreen) {
                    toggleFullscreen();
                } else {
                    closeViewer();
                }
            } else if (e.key === 'ArrowLeft') {
                navigateImage(-1);
            } else if (e.key === 'ArrowRight') {
                navigateImage(1);
            }
        }
    });
}

function toggleZoom() {
    const viewerImage = document.getElementById('viewerImage');
    viewerImage.classList.toggle('zoomed');
}

function openImageViewer(index) {
    currentImageIndex = index;
    updateViewerImage();
    document.getElementById('imageViewer').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeViewer() {
    document.getElementById('imageViewer').classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('viewerImage').classList.remove('zoomed');
}

function navigateImage(direction) {
    currentImageIndex += direction;

    // Wrap around if at ends
    if (currentImageIndex < 0) {
        currentImageIndex = images.length - 1;
    } else if (currentImageIndex >= images.length) {
        currentImageIndex = 0;
    }

    updateViewerImage();
}

function updateViewerImage() {
    const viewerImage = document.getElementById('viewerImage');
    const imageCounter = document.getElementById('imageCounter');
    const viewerTitle = document.getElementById('viewerTitle');

    viewerImage.src = images[currentImageIndex].src;
    viewerImage.alt = images[currentImageIndex].alt;
    viewerImage.classList.remove('zoomed');

    // Set image title
    viewerTitle.textContent = imageTitles[currentImageIndex] || images[currentImageIndex].alt;
    imageCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
}

// Fullscreen functionality
function toggleFullscreen() {
    const viewer = document.getElementById('imageViewer');
    const fullscreenBtn = document.getElementById('fullscreenBtn');

    if (!document.fullscreenElement) {
        if (viewer.requestFullscreen) {
            viewer.requestFullscreen();
        }
        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        isFullscreen = true;
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        isFullscreen = false;
    }
}

// Toolbar functions
function initToolbar() {
    // Follow button
    document.querySelector('.tool-btn[title="Follow"]').addEventListener('click', function () {
        const icon = this.querySelector('i');
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            this.querySelector('.tool-tip').textContent = 'Following';
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            this.querySelector('.tool-tip').textContent = 'Follow Creator';
        }
    });

    // Save button
    document.querySelector('.tool-btn[title="Save"]').addEventListener('click', function () {
        const icon = this.querySelector('i');
        this.classList.toggle('save-active');

        if (this.classList.contains('save-active')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            this.querySelector('.tool-tip').textContent = 'Saved to collection';
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            this.querySelector('.tool-tip').textContent = 'Save to collection';
        }
    });

    // Like button
    document.querySelector('.tool-btn[title="Like"]').addEventListener('click', function () {
        const icon = this.querySelector('i');
        this.classList.toggle('like-active');

        if (this.classList.contains('like-active')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            this.querySelector('.tool-tip').textContent = 'Liked!';
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            this.querySelector('.tool-tip').textContent = 'Appreciate this work';
        }
    });
}

// Comments functions
function initComments() {
    // Reply button functionality
    document.querySelectorAll('.reply-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const commentId = this.closest('.comment').getAttribute('data-comment-id');
            const replyForm = document.createElement('div');
            replyForm.className = 'reply-form-container';
            replyForm.innerHTML = `
                                <div class="comment-form-container">
                                    <form class="comment-form reply-form">
                                        <div class="comment-input-container">
                                            <textarea class="comment-input" placeholder="Write your reply..." rows="2"></textarea>
                                        </div>
                                        <button type="submit" class="comment-submit">
                                            <i class="fas fa-paper-plane"></i> Post Reply
                                        </button>
                                    </form>
                                </div>
                            `;

            this.closest('.comment').appendChild(replyForm);
            replyForm.style.display = 'block';

            // Focus on the textarea
            replyForm.querySelector('textarea').focus();

            // Handle form submission
            replyForm.querySelector('form').addEventListener('submit', function (e) {
                e.preventDefault();
                const replyText = this.querySelector('textarea').value.trim();
                if (replyText) {
                    addReply(commentId, replyText);
                    replyForm.remove();
                }
            });
        });
    });

    // Like button functionality
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const commentId = this.getAttribute('data-comment-id');
            const countElement = this.querySelector('.comment-action-count');
            let count = parseInt(countElement.textContent);

            if (this.classList.contains('liked')) {
                this.classList.remove('liked');
                this.querySelector('i').classList.remove('fas');
                this.querySelector('i').classList.add('far');
                countElement.textContent = count - 1;
            } else {
                this.classList.add('liked');
                this.querySelector('i').classList.remove('far');
                this.querySelector('i').classList.add('fas');
                countElement.textContent = count + 1;
            }
        });
    });

    // Main comment form submission
    document.getElementById('mainCommentForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const commentText = document.getElementById('mainCommentInput').value.trim();
        if (commentText) {
            addComment(commentText);
            document.getElementById('mainCommentInput').value = '';
        }
    });
}

function addComment(text) {
    const commentsList = document.getElementById('commentsList');
    const commentCount = document.querySelector('.comments-count');
    const newCount = parseInt(commentCount.textContent) + 1;
    commentCount.textContent = newCount;

    const newComment = document.createElement('div');
    newComment.className = 'comment';
    newComment.setAttribute('data-comment-id', Date.now());
    newComment.innerHTML = `
                        <div class="comment-content">
                            <div class="comment-header">
                                <div class="comment-author">You</div>
                                <div class="comment-time">just now</div>
                            </div>
                            <div class="comment-text">${text}</div>
                            <div class="comment-actions">
                                <div class="comment-action like-btn" data-comment-id="${newComment.getAttribute('data-comment-id')}">
                                    <i class="far fa-thumbs-up"></i>
                                    <span class="comment-action-count">0</span>
                                </div>
                                <div class="comment-action reply-btn">
                                    <i class="far fa-comment-dots"></i> Reply
                                </div>
                            </div>
                        </div>
                    `;

    commentsList.appendChild(newComment);

    // Reinitialize event listeners for the new comment
    newComment.querySelector('.reply-btn').addEventListener('click', function () {
        const commentId = this.closest('.comment').getAttribute('data-comment-id');
        const replyForm = document.createElement('div');
        replyForm.className = 'reply-form-container';
        replyForm.innerHTML = `
                            <div class="comment-form-container">
                                <form class="comment-form reply-form">
                                    <div class="comment-input-container">
                                        <textarea class="comment-input" placeholder="Write your reply..." rows="2"></textarea>
                                    </div>
                                    <button type="submit" class="comment-submit">
                                        <i class="fas fa-paper-plane"></i> Post Reply
                                    </button>
                                </form>
                            </div>
                        `;

        this.closest('.comment').appendChild(replyForm);
        replyForm.style.display = 'block';

        // Focus on the textarea
        replyForm.querySelector('textarea').focus();

        // Handle form submission
        replyForm.querySelector('form').addEventListener('submit', function (e) {
            e.preventDefault();
            const replyText = this.querySelector('textarea').value.trim();
            if (replyText) {
                addReply(commentId, replyText);
                replyForm.remove();
            }
        });
    });

    newComment.querySelector('.like-btn').addEventListener('click', function () {
        const commentId = this.getAttribute('data-comment-id');
        const countElement = this.querySelector('.comment-action-count');
        let count = parseInt(countElement.textContent);

        if (this.classList.contains('liked')) {
            this.classList.remove('liked');
            this.querySelector('i').classList.remove('fas');
            this.querySelector('i').classList.add('far');
            countElement.textContent = count - 1;
        } else {
            this.classList.add('liked');
            this.querySelector('i').classList.remove('far');
            this.querySelector('i').classList.add('fas');
            countElement.textContent = count + 1;
        }
    });
}

function addReply(commentId, text) {
    const comment = document.querySelector(`.comment[data-comment-id="${commentId}"]`);
    const commentReplies = comment.querySelector('.comment-replies') || document.createElement('div');
    if (!comment.querySelector('.comment-replies')) {
        commentReplies.className = 'comment-replies';
        comment.appendChild(commentReplies);
    }

    const commentCount = document.querySelector('.comments-count');
    const newCount = parseInt(commentCount.textContent) + 1;
    commentCount.textContent = newCount;

    const newReply = document.createElement('div');
    newReply.className = 'comment reply';
    newReply.setAttribute('data-comment-id', Date.now());
    newReply.innerHTML = `
                        <div class="comment-content">
                            <div class="comment-header">
                                <div class="comment-author">You</div>
                                <div class="comment-time">just now</div>
                            </div>
                            <div class="comment-text">${text}</div>
                            <div class="comment-actions">
                                <div class="comment-action like-btn" data-comment-id="${newReply.getAttribute('data-comment-id')}">
                                    <i class="far fa-thumbs-up"></i>
                                    <span class="comment-action-count">0</span>
                                </div>
                                <div class="comment-action reply-btn">
                                    <i class="far fa-comment-dots"></i> Reply
                                </div>
                            </div>
                        </div>
                    `;

    commentReplies.appendChild(newReply);

    // Reinitialize event listeners for the new reply
    newReply.querySelector('.like-btn').addEventListener('click', function () {
        const countElement = this.querySelector('.comment-action-count');
        let count = parseInt(countElement.textContent);

        if (this.classList.contains('liked')) {
            this.classList.remove('liked');
            this.querySelector('i').classList.remove('fas');
            this.querySelector('i').classList.add('far');
            countElement.textContent = count - 1;
        } else {
            this.classList.add('liked');
            this.querySelector('i').classList.remove('far');
            this.querySelector('i').classList.add('fas');
            countElement.textContent = count + 1;
        }
    });
}
document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.salamviz-video-card');
    const lightbox = document.getElementById('salamviz-lightbox');
    const videoFrame = document.getElementById('salamviz-video-frame');
    const videoTitle = document.querySelector('.salamviz-video-title');
    const closeBtn = document.querySelector('.salamviz-close-btn');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const videoURL = card.getAttribute('data-video');
            const title = card.getAttribute('data-title');

            // Set the iframe source with autoplay
            videoFrame.src = videoURL + '?autoplay=1&rel=0';
            videoTitle.textContent = title;

            // Show the lightbox
            lightbox.classList.add('active');

            // Pause all YouTube videos when lightbox is opened
            document.querySelectorAll('iframe').forEach(iframe => {
                if (iframe !== videoFrame) {
                    iframe.src = iframe.src.replace('autoplay=1', 'autoplay=0');
                }
            });
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        videoFrame.src = ''; // Stop the video when closing
    }

    closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
});

//footer//
document.addEventListener('DOMContentLoaded', function () {
    // Update copyright year automatically
    const yearElement = document.querySelector('.year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Add animation class to footer elements on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.footer-col, .footer-bottom').forEach(el => {
        footerObserver.observe(el);
    });

    // Enhanced email and WhatsApp link functionality
    document.addEventListener('DOMContentLoaded', function () {
        const emailLinks = document.querySelectorAll('.email-link');
        emailLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                const email = this.querySelector('.contact-text').textContent.trim();
                const href = this.getAttribute('href');

                // ✅ If using Gmail HTTPS link, let it work as-is
                if (href.startsWith('https://mail.google.com')) {
                    // Allow default behavior (opens Gmail in new tab)
                    return;
                }

                // Optional: If you use mailto links on small screens, etc.
                if (window.innerWidth > 768) {
                    e.preventDefault();
                    window.location.href = 'mailto:' + email;
                }
            });
        });

        const whatsappLinks = document.querySelectorAll('.whatsapp-link');
        whatsappLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                if (window.innerWidth > 768) {
                    e.preventDefault();
                    window.open(this.href, '_blank');
                }
            });
        });
    });

});


