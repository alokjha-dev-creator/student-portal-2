document.addEventListener('DOMContentLoaded', () => {

    // --- Global State / Config ---
    const appState = {
        tasks: [
            { id: 1, text: "Submit DBMS Project Report", priority: "High", deadline: "Tomorrow, 11:59 PM", completed: false },
            { id: 2, text: "Prepare for Physics Lab", priority: "Medium", deadline: "Friday", completed: false },
            { id: 3, text: "Settle Cafe Bill", priority: "Low", deadline: "No Deadline", completed: false }
        ]
    };

    // --- 1. Mobile Sidebar Logic ---
    function initMobileSidebar() {
        // Create Mobile Toggle Button
        const mobileBtn = document.createElement('button');
        mobileBtn.className = 'mobile-menu-btn';
        mobileBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';

        const topBar = document.querySelector('.top-bar');
        if (topBar) {
            topBar.insertBefore(mobileBtn, topBar.firstChild);
        }

        const sidebar = document.querySelector('.sidebar');

        // Create Overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 40; display: none;
            backdrop-filter: blur(4px);
        `;
        document.body.appendChild(overlay);

        function toggleSidebar() {
            if (!sidebar) return;
            sidebar.classList.toggle('open');
            overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
        }

        mobileBtn.addEventListener('click', toggleSidebar);
        overlay.addEventListener('click', toggleSidebar);

        // Close sidebar on link click (mobile)
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) toggleSidebar();
            });
        });
    }

    // --- 2. Navigation Active State ---
    function initNavigation() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (currentPath === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // --- 3. AI Assistant Logic ---
    function initAIAssistant() {
        const aiToggle = document.getElementById('ai-toggle');
        const aiClose = document.getElementById('ai-close');
        const aiChat = document.getElementById('ai-chat');
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');
        const chatMessages = document.getElementById('chat-messages');

        if (!aiChat) return;

        function toggleChat() {
            aiChat.classList.toggle('open');
        }

        if (aiToggle) aiToggle.addEventListener('click', toggleChat);
        if (aiClose) aiClose.addEventListener('click', toggleChat);

        function addMessage(text, type) {
            const div = document.createElement('div');
            div.classList.add('message', type);
            div.innerHTML = text; // Allow HTML for links
            chatMessages.appendChild(div);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function handleUserMessage() {
            if (!chatInput) return;
            const text = chatInput.value.trim();
            if (!text) return;

            addMessage(text, 'user');
            chatInput.value = '';

            // AI Logic
            setTimeout(() => {
                let response = "I'm still learning, but I can help with basic queries!";
                const lowerText = text.toLowerCase();

                if (lowerText.includes('attendance')) {
                    response = "Your overall attendance is <strong>85%</strong>. <br>✅ DBMS: 90% <br>⚠️ Physics: Need Attention.";
                } else if (lowerText.includes('marks') || lowerText.includes('cgpa')) {
                    response = "Your complete CGPA is <strong>9.2</strong>. You are ranked #5 in the class! 🌟";
                } else if (lowerText.includes('task') || lowerText.includes('todo')) {
                    const taskCount = appState.tasks.filter(t => !t.completed).length;
                    response = `You have <strong>${taskCount} pending tasks</strong>. The highest priority is "Submit DBMS Project".`;
                } else if (lowerText.includes('schedule') || lowerText.includes('lecture')) {
                    response = "📅 <strong>Current:</strong> Web Tech (Lab 2)<br>🕒 <strong>Next:</strong> Algorithm Design (02:00 PM)";
                } else if (lowerText.includes('pyq') || lowerText.includes('book') || lowerText.includes('library')) {
                    response = "Head over to the <a href='library.html' style='color: var(--color-primary-light)'>Library Page</a> for E-Books and PYQs.";
                } else if (lowerText.includes('teacher') || lowerText.includes('faculty')) {
                    response = "You can view all faculty profiles in the <a href='teachers.html' style='color: var(--color-primary-light)'>Teachers Section</a>.";
                } else if (lowerText.includes('placement') || lowerText.includes('job')) {
                    response = "🔥 <strong>Hiring Alert:</strong> Google & Microsoft are accepting applications. Check <a href='placements.html' style='color: var(--color-primary-light)'>Placements</a>.";
                }

                addMessage(response, 'bot');
            }, 800);
        }

        if (chatSend) chatSend.addEventListener('click', handleUserMessage);
        if (chatInput) chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleUserMessage();
        });
    }

    // --- 4. Task Management Logic (For tasks.html) ---
    function initTaskManager() {
        const taskListContainer = document.querySelector('.task-list');
        const addTaskBtn = document.querySelector('.section-header .btn-primary'); // Assuming "New Task" button

        if (!taskListContainer || !addTaskBtn) return;

        // Render Initial Tasks (if list is empty, though HTML has static ones, we could clear and render dynamic ones)
        // For now, we will just add functionality to the static ones + new ones

        // Toggle Completion
        taskListContainer.addEventListener('click', (e) => {
            const checkbox = e.target.closest('.checkbox-custom');
            if (checkbox) {
                const item = checkbox.closest('.task-item');
                item.classList.toggle('completed');
                // Optional: Update state
            }
        });

        // Add Task (Simple Prompt for demo)
        addTaskBtn.addEventListener('click', () => {
            const taskTitle = prompt("Enter Task Title:");
            if (taskTitle) {
                const newItem = document.createElement('div');
                newItem.className = 'task-item glass-panel';
                newItem.innerHTML = `
                    <div class="checkbox-custom"><i class="fa-solid fa-check"></i></div>
                    <div style="flex: 1;">
                        <h4 style="margin-bottom: 4px;">${taskTitle}</h4>
                        <p style="font-size: 0.85rem; color: var(--text-muted);">Just Added</p>
                    </div>
                    <span class="status-badge">New</span>
                 `;

                // Insert after title
                taskListContainer.insertBefore(newItem, taskListContainer.firstChild);
            }
        });
    }

    // --- 5. Notifications Logic ---
    function initNotifications() {
        const notifBtn = document.querySelector('.notification-btn');
        if (!notifBtn) return;

        notifBtn.addEventListener('click', () => {
            alert("🔔 Notifications:\n1. DBMS Project Deadline Tomorrow\n2. Library Book 'Clean Code' due in 2 days.");
        });
    }

    // --- Initialize All ---
    initMobileSidebar();
    initNavigation();
    initAIAssistant();
    initTaskManager();
    initNotifications();

});
