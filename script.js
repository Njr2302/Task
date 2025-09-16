
let portfolioData = {
    startDate: new Date('2025-09-12'),
    currentDay: 5,
    days: [
        {
            id: 1,
            title: "Introduction to HTML",
            image: "1.png",
            objectives: [
                "Creating forms with form, input, textarea, select",
                "Document structure - DOCTYPE, head, meta tags",
                "Forms and validation - Input types, labels, accessibility",
                "Web accessibility - ARIA roles, alt attributes"
            ],
            description: "Built a complete website structure using semantic HTML5. Created forms, navigation, and accessibility features.",
            skills: ["HTML5", "Forms", "Accessibility", "Validation"],
            links: { doc: "#", demo: "#" }
        },
        {
            id: 2,
            title: "Introduction to CSS",
            image: "2.png",
            objectives: [
                "CSS syntax and selectors",
                "Inline, internal, and external styles",
                "Understanding margins, borders, and padding",
                "Fonts, colors, and text alignment"
            ],
            description: "Learned CSS syntax, selectors, box model, and styling techniques to design attractive web pages.",
            skills: ["CSS3", "Selectors", "Box Model", "Typography"],
            links: { doc: "#", demo: "#" }
        },
        {
            id: 3,
            title: "CSS Layouts",
            image: "3.png",
            objectives: [
                "Positioning: static, relative, absolute, fixed",
                "Floating elements and clearing",
                "Understanding display properties",
                "Box model adjustments and troubleshooting"
            ],
            description: "Implemented various CSS layouts including floats and positioning for flexible page designs.",
            skills: ["CSS Layout", "Positioning", "Floating", "Display"],
            links: { doc: "#", demo: "#" }
        },
        {
            id: 4,
            title: "Flexbox and Grid",
            image: "Task/4.png",
            objectives: [
                "Introduction to Flexbox - flex container and items",
                "Properties: flex-direction, justify-content, align-items",
                "Introduction to CSS Grid - grid templates and placement", 
                "Responsive design with modern layout techniques"
            ],
            description: "Mastered modern CSS layout techniques using Flexbox and Grid to build responsive web layouts.",
            skills: ["Flexbox", "CSS Grid", "Responsive Design", "Modern CSS"],
            links: { doc: "#", demo: "#" }
        },
        {
            id: 5,
            title: "Bootstrap Basics",
            image: "5.png",
            objectives: [
                "Bootstrap setup and grid system - containers, rows, columns",
                "Typography, forms, buttons, alerts, and cards",
                "Navigation components and responsive utilities",
                "Understanding Bootstrap's responsive breakpoints"
            ],
            description: "Gained proficiency in Bootstrap framework for rapid responsive UI development and component usage.",
            skills: ["Bootstrap", "Grid System", "Components", "Responsive Framework"],
            links: { doc: "#", demo: "#" }
        }

    ]
};
document.addEventListener('DOMContentLoaded', () => {
    loadFromStorage();
    renderNavigation();
    renderTaskLinks();
    renderContent();
    renderCalendar();
    updateProgress();
    setupEventListeners();
    setupAddProjectForm();
});

function saveToStorage() {
    localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
}

function loadFromStorage() {
    const saved = localStorage.getItem('portfolioData');
    if (saved) {
        portfolioData = JSON.parse(saved);
    }
}
function setupAddProjectForm() {
    const addBtn = document.getElementById('add-project-btn');
    const form = document.getElementById('add-project-form');
    const cancelBtn = document.getElementById('cancel-project');

    addBtn.addEventListener('click', () => {
        form.style.display = 'block';
        addBtn.style.display = 'none';
        form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    cancelBtn.addEventListener('click', () => {
        form.style.display = 'none';
        addBtn.style.display = 'block';
        form.reset();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        addNewProject();
    });
}
function addNewProject() {
    const title = document.getElementById('project-title').value.trim();
    const objectives = document.getElementById('project-objectives').value.trim().split('\n').filter(obj => obj.trim());
    const description = document.getElementById('project-description').value.trim();
    const skills = document.getElementById('project-skills').value.trim().split(',').map(skill => skill.trim());
    const image = document.getElementById('project-image').value.trim();
    const docLink = document.getElementById('project-doc').value.trim();
    const demoLink = document.getElementById('project-demo').value.trim();

    if (!title || objectives.length === 0 || !description || skills.length === 0) {
        alert('Please fill in all required fields!');
        return;
    }

    const newProject = {
        id: portfolioData.days.length + 1,
        title: title,
        objectives: objectives,
        description: description,
        skills: skills
    };

    if (image) newProject.image = image;
    if (docLink || demoLink) {
        newProject.links = {};
        if (docLink) newProject.links.doc = docLink;
        if (demoLink) newProject.links.demo = demoLink;
    }

    portfolioData.days.push(newProject);
    portfolioData.currentDay = portfolioData.days.length;

    saveToStorage();
    renderTaskLinks();
    renderContent();
    renderCalendar();
    updateProgress();

    document.getElementById('add-project-form').style.display = 'none';
    document.getElementById('add-project-btn').style.display = 'block';
    document.getElementById('add-project-form').reset();

    showSuccessMessage('🎉 Project added successfully!');

    setTimeout(() => {
        const newProjectLink = document.querySelector(`[data-day="${newProject.id}"].task-link`);
        if (newProjectLink) {
            newProjectLink.click();
            newProjectLink.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, 500);
}
function showSuccessMessage(message) {
    const existingMsg = document.querySelector('.success-message');
    if (existingMsg) existingMsg.remove();

    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;

    const addBtn = document.getElementById('add-project-btn');
    addBtn.parentNode.insertBefore(successDiv, addBtn);

    setTimeout(() => {
        successDiv.remove();
    }, 4000);
}

function renderCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    document.getElementById('calendar-month').textContent = 
        now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendarHTML = [];
    
    for (let i = 0; i < firstDay; i++) {
        calendarHTML.push('<div class="empty"></div>');
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month, day);
        const daysSinceStart = Math.ceil((currentDate - portfolioData.startDate) / (1000 * 60 * 60 * 24)) + 1;
        
        let className = '';
        let dataDay = '';
        let title = '';
        
        if (daysSinceStart > 0 && daysSinceStart <= portfolioData.days.length) {
            dataDay = ` data-day="${daysSinceStart}"`;
            
            if (daysSinceStart < portfolioData.currentDay) {
                className = 'done';
                title = ` title="Day ${daysSinceStart}: ${portfolioData.days[daysSinceStart-1].title} - Completed ✓"`;
            } else if (daysSinceStart === portfolioData.currentDay) {
                className = 'current';
                title = ` title="Day ${daysSinceStart}: ${portfolioData.days[daysSinceStart-1].title} - Today 🎯"`;
            } else {
                className = 'next';
                title = ` title="Day ${daysSinceStart}: ${portfolioData.days[daysSinceStart-1].title} - Upcoming ⏳"`;
            }
        }
        
        calendarHTML.push(`<div class="${className}"${dataDay}${title}>${day}</div>`);
    }
    
    document.getElementById('calendar-days').innerHTML = calendarHTML.join('');
}
function renderNavigation() {
    const navLinks = ['Home', 'Projects', 'Contact'];
    document.getElementById('nav-links').innerHTML = navLinks.map(link => 
        `<a href="#${link.toLowerCase()}">${link}</a>`
    ).join('');
}
function renderTaskLinks() {
    const taskLinksHTML = portfolioData.days.map((day, index) => 
        `<a href="#" class="task-link ${index === 0 ? 'active' : ''}" data-day="${day.id}">
            Day ${day.id} - ${day.title}
        </a>`
    ).join('');
    
    document.getElementById('task-nav').innerHTML = taskLinksHTML;
}
function renderContent() {
    const contentHTML = portfolioData.days.map((day, index) => `
        <div class="card" id="day${day.id}" style="display: ${index === 0 ? 'block' : 'none'}">
            <h2>Day ${day.id} - ${day.title}</h2>
            ${day.image ? `
                <div class="task-image">
                    <img src="${day.image}" alt="Day ${day.id} Project Screenshot" class="screenshot">
                    <div class="image-caption">Day ${day.id} Project - ${day.title}</div>
                </div>
            ` : ''}
            <h3>Learning Objectives</h3>
            <ul>
                ${day.objectives.map(obj => {
                    const parts = obj.split(' - ');
                    return `<li><strong>${parts[0]}</strong>${parts.length > 1 ? ' - ' + parts.slice(1).join(' - ') : ''}</li>`;
                }).join('')}
            </ul>
            <p>${day.description}</p>
            <div class="skills">
                ${day.skills.map(skill => `<span>${skill}</span>`).join('')}
            </div>
            ${day.links ? `
                <div class="links">
                    <a href="${day.links.doc || '#'}" class="btn-doc" ${day.links.doc && day.links.doc !== '#' ? 'target="_blank"' : ''}>
                        📖 View Documentation
                    </a>
                    <a href="${day.links.demo || '#'}" class="btn-demo" ${day.links.demo && day.links.demo !== '#' ? 'target="_blank"' : ''}>
                        🚀 Live Demo
                    </a>
                </div>
            ` : ''}
        </div>
    `).join('');
    
    document.getElementById('content-area').innerHTML = contentHTML;
}
function updateProgress() {
    const completed = portfolioData.currentDay - 1;
    const total = portfolioData.days.length;
    const percentage = Math.round((completed / total) * 100);
    
    document.getElementById('completed').textContent = completed;
    document.getElementById('total').textContent = total;
    
    setTimeout(() => {
        document.getElementById('progress-bar').style.width = `${percentage}%`;
    }, 300);
    
    setTimeout(() => {
        document.getElementById('progress-text').textContent = `${percentage}% Complete`;
    }, 800);
}
function setupEventListeners() {
    document.getElementById('task-nav').addEventListener('click', (e) => {
        if (e.target.classList.contains('task-link')) {
            e.preventDefault();
            const dayId = e.target.dataset.day;
            
            document.querySelectorAll('.task-link').forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
            
            const currentCard = document.querySelector('.card[style*="block"]');
            const targetCard = document.getElementById(`day${dayId}`);
            
            if (currentCard && currentCard !== targetCard) {
                currentCard.style.opacity = '0';
                currentCard.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    currentCard.style.display = 'none';
                    targetCard.style.display = 'block';
                    targetCard.style.opacity = '0';
                    targetCard.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        targetCard.style.opacity = '1';
                        targetCard.style.transform = 'translateY(0)';
                    }, 50);
                }, 200);
            } else if (targetCard) {
                targetCard.style.display = 'block';
                targetCard.style.opacity = '1';
                targetCard.style.transform = 'translateY(0)';
            }
        }
    });
    
    document.getElementById('calendar-days').addEventListener('click', (e) => {
        if (e.target.dataset.day) {
            const dayId = e.target.dataset.day;
            const taskLink = document.querySelector(`[data-day="${dayId}"].task-link`);
            if (taskLink) {
                taskLink.click();
                setTimeout(() => {
                    document.getElementById('projects').scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }
        }
    });
    
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('screenshot')) {
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightbox-img');
            
            lightbox.style.display = 'block';
            lightboxImg.src = e.target.src;
            lightboxImg.alt = e.target.alt;
            document.body.style.overflow = 'hidden';
            
            lightbox.style.opacity = '0';
            setTimeout(() => {
                lightbox.style.opacity = '1';
            }, 10);
        }
        
        if (e.target.classList.contains('close') || e.target.id === 'lightbox') {
            const lightbox = document.getElementById('lightbox');
            lightbox.style.opacity = '0';
            setTimeout(() => {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        }
    });
    document.addEventListener('click', (e) => {
        if (e.target.matches('.header a[href^="#"]')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
    
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
        
        const opacity = Math.min(scrollTop / 100, 0.98);
        header.style.background = `rgba(255, 255, 255, ${opacity})`;
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const lightbox = document.getElementById('lightbox');
            if (lightbox.style.display === 'block') {
                lightbox.querySelector('.close').click();
            }
        }
        
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const activeLink = document.querySelector('.task-link.active');
            if (activeLink) {
                const allLinks = Array.from(document.querySelectorAll('.task-link'));
                const currentIndex = allLinks.indexOf(activeLink);
                
                let nextIndex;
                if (e.key === 'ArrowLeft') {
                    nextIndex = currentIndex > 0 ? currentIndex - 1 : allLinks.length - 1;
                } else {
                    nextIndex = currentIndex < allLinks.length - 1 ? currentIndex + 1 : 0;
                }
                
                allLinks[nextIndex].click();
            }
        }
    });
}
function scrollToProjects() {
    const projectsSection = document.getElementById('projects');
    const headerHeight = document.querySelector('.header').offsetHeight;
    const targetPosition = projectsSection.offsetTop - headerHeight - 20;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}
window.portfolio = { 
    data: portfolioData, 
    addProject: addNewProject,
    saveToStorage,
    loadFromStorage,
    scrollToProjects
};



