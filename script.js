document.addEventListener('DOMContentLoaded', function() {
    // Navigation for mobile
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });
    
    // Chatbot functionality
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const chatInput = document.querySelector('.chatbot-input input');
    const chatSendBtn = document.querySelector('.chatbot-input button');
    const chatMessages = document.querySelector('.chatbot-messages');
    
    // Initialize chatbot state
    chatbotContainer.classList.remove('active');
    chatbotToggle.textContent = 'Chat';
    
    // Toggle chatbot visibility
    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.classList.toggle('active');
        chatbotToggle.textContent = chatbotContainer.classList.contains('active') ? 'Close' : 'Chat';
    });
    
    // Resume data for the chatbot to access
    const resumeData = {
        name: "Manish Saharan",
        title: "Electrical Engineering Undergraduate at IIT Roorkee",
        skills: [
            "Programming: Python, C/C++, JavaScript",
            "Web Development: React, FastAPI, Node.js, MongoDB, Firebase",
            "AI/ML: TensorFlow, scikit-learn, NumPy, OpenCV, Matplotlib",
            "Version Control & Deployment: Git, GitHub, Netlify, Render",
            "Others: VS Code Extension Dev, REST APIs, Responsive UI, Bash"
        ],
        experience: [
            {
                company: "WorldQuant BRAIN",
                position: "Research Consultant Intern",
                duration: "Jan 2025 – Present",
                responsibilities: [
                    "Developed predictive alphas by analyzing global equity market data.",
                    "Applied statistical research and financial modeling techniques to optimize alpha performance."
                ]
            },
            {
                company: "Biogenith Pharmaceuticals Pvt. Ltd.",
                position: "Web Developer Intern",
                duration: "May 2024 – Jun 2024",
                responsibilities: [
                    "Created the company’s internal task manager using React and Firebase.",
                    "Streamlined team collaboration and boosted workflow efficiency through custom-built tools."
                ]
            }
        ],
        education: [
            {
                degree: "B.Tech in Electrical Engineering",
                institution: "Indian Institute of Technology (IIT), Roorkee",
                year: "Aug 2022 – May 2026",
                details: [
                    "CGPA: 8.01 / 10",
                    "Relevant Courses: Data Structures, Algorithms, Machine Learning, Neural Networks"
                ]
            },
            {
                degree: "Senior Secondary (Class XII)",
                institution: "Saraswati Vidya Mandir, Sikar, Rajasthan",
                year: "2022",
                details: [
                    "Score: 95.40% (RBSE Board)"
                ]
            },
            {
                degree: "Secondary (Class X)",
                institution: "Saraswati Vidya Mandir, Sikar, Rajasthan",
                year: "2020",
                details: [
                    "Score: 94.83% (RBSE Board)"
                ]
            }
        ],
        achievements: [
            "AIR 4229 in JEE Advanced 2022 (among ~160,000 candidates)",
            "AIR 3800 in JEE Mains 2022 (among ~8,00,000 candidates)",
            "Secured 90.00% in Class XII(CBSE) and 94.00% in Class X (CBSE)",
            "Selected as Research Intern at WorldQuant BRAIN with strong alpha submissions",
            "Led a team project shortlisted for tech showcase at IIT Roorkee"
        ],
        certifications: [
            "Crash Course on Python – Google (Coursera)",
            "Neural Networks and Deep Learning – DeepLearning.AI (Coursera)",
            "The Bits and Bytes of Computer Networking – Google (Coursera)",
            "Front-End Development Libraries – freeCodeCamp"
        ],
        projects: [
            {
                name: "Grocery Recommendation System",
                description: "Built a recommendation engine using item-based collaborative filtering. Enabled personalized grocery suggestions to enhance user experience and retention."
            },
            {
                name: "LeetCode VS Code Extension",
                description: "Developed a VS Code extension integrating LeetCode problem solving and code submission directly within the editor to codeforces. Improved practice workflow and user engagement."
            },
            {
                name: "AI for Age-Related Condition Detection",
                description: "Designed a deep learning pipeline using CNNs to detect macular degeneration from retinal images. Achieved high accuracy through optimized preprocessing and training."
            }
        ]
    };
    
    // Function to add messages to the chat interface
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        
        // Scroll to the bottom of the chat
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function for chatbot to process messages using Gemini API
    async function processChatMessage() {
        const userMessage = chatInput.value.trim();
        if (userMessage === '') return;
        
        // Add user message to chat
        addMessage(userMessage, true);
        chatInput.value = '';
        
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('message', 'bot-message', 'typing');
        typingIndicator.textContent = "...";
        chatMessages.appendChild(typingIndicator);
        
        try {
            // Call Gemini API (or use local handling if API isn't set up yet)
            const response = await callGeminiAPI(userMessage);
            
            // Remove typing indicator
            chatMessages.removeChild(typingIndicator);
            
            // Add bot response
            addMessage(response);
            
        } catch (error) {
            // If API fails, use local fallback
            console.error("Gemini API error:", error);
            chatMessages.removeChild(typingIndicator);
            addMessage("I'm having trouble connecting to my brain right now. Let me use my backup system.");
            
            // Fallback to local response generation
            const fallbackResponse = generateLocalResponse(userMessage);
            addMessage(fallbackResponse);
        }
    }

    // ------------------------------------------------
    // Gemini API Integration
    // ------------------------------------------------
    
    // Your Gemini API key would go here - Get one from https://makersuite.google.com/app/apikey
    const GEMINI_API_KEY = "AIzaSyDBJu2ov8S0XlVQx2lSHWu5yU5qUHuDT48"; // Replace with your actual API key
    const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    
    async function callGeminiAPI(userMessage) {
        // If API key isn't set, use local response
        if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
            return generateLocalResponse(userMessage);
        }
        
        // Prepare resume data as context
        const resumeContext = JSON.stringify(resumeData);
        
        // Prepare the prompt for Gemini
        const prompt = `
            You are a helpful chatbot assistant for a personal portfolio website.
            You have access to the following resume data:
            ${resumeContext}
            
            When answering questions, use the information from the resume data.
            Be concise and friendly in your responses.
            If you don't know something specific from the resume, say you don't have that information.
            
            The user asks: ${userMessage}
        `;
        
        // Make API request to Gemini
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });
        
        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }
        
        const responseData = await response.json();
        return responseData.candidates[0].content.parts[0].text;
    }
    
    // Local fallback function for when API isn't available
    function generateLocalResponse(message) {
        const lowercaseMsg = message.toLowerCase();
        
        // Check for greetings
        if (lowercaseMsg.includes('hi') || lowercaseMsg.includes('hello') || lowercaseMsg.includes('hey')) {
            return `Hello! I'm a chatbot assistant for ${resumeData.name}. How can I help you today?`;
        }
        
        // Skills related queries
        if (lowercaseMsg.includes('skill') || lowercaseMsg.includes('know') || lowercaseMsg.includes('able to')) {
            return `${resumeData.name} has the following skills:\n- ${resumeData.skills.join('\n- ')}`;
        }
        
        // Experience related queries
        if (lowercaseMsg.includes('experience') || lowercaseMsg.includes('work') || lowercaseMsg.includes('job')) {
            let response = `${resumeData.name}'s work experience includes:\n`;
            resumeData.experience.forEach(exp => {
                response += `\n• ${exp.position} at ${exp.company} (${exp.duration})`;
            });
            return response;
        }
        
        // Education related queries
        if (lowercaseMsg.includes('education') || lowercaseMsg.includes('study') || lowercaseMsg.includes('degree')) {
            let response = `Regarding education, ${resumeData.name} has:\n`;
            resumeData.education.forEach(edu => {
                response += `\n• ${edu.degree} from ${edu.institution} (${edu.year})`;
            });
            return response;
        }
        
        // Project related queries
        if (lowercaseMsg.includes('project') || lowercaseMsg.includes('portfolio') || lowercaseMsg.includes('build')) {
            let response = `Here are some key projects:\n`;
            resumeData.projects.forEach(project => {
                response += `\n• ${project.name}: ${project.description}`;
            });
            return response;
        }
        
        // Default response
        return `I'm here to help answer questions about ${resumeData.name}'s professional background. You can ask about skills, work experience, education, certifications, or projects.`;
    }

    // Event listeners for sending messages
    chatSendBtn.addEventListener('click', processChatMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            processChatMessage();
        }
    });
});