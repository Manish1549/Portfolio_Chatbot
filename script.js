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
        name: "Your Name",
        title: "Data Engineer & DevOps Specialist",
        skills: [
            "Data Engineering: ETL/ELT pipelines, SQL & NoSQL databases, data modeling, Apache Spark",
            "DevOps: CI/CD, Docker, Kubernetes, Infrastructure as Code (Terraform, CloudFormation), monitoring",
            "Programming: Python, Java, JavaScript, Bash scripting",
            "Cloud: AWS (S3, EC2, Lambda, RDS), Azure, GCP, serverless architecture"
        ],
        experience: [
            {
                company: "Company A",
                position: "Senior Data Engineer",
                duration: "2023 - Present",
                responsibilities: [
                    "Design and implement data pipelines processing 5TB+ daily",
                    "Lead a team of 3 engineers to modernize legacy data systems",
                    "Reduce processing costs by 40% through optimization"
                ]
            },
            {
                company: "Company B",
                position: "DevOps Engineer",
                duration: "2020 - 2023",
                responsibilities: [
                    "Implement CI/CD pipelines reducing deployment time by 70%",
                    "Containerize applications using Docker and orchestrate with Kubernetes",
                    "Manage cloud infrastructure on AWS using Terraform"
                ]
            }
        ],
        education: [
            {
                degree: "Master's in Computer Science",
                institution: "University Name",
                year: "2020"
            },
            {
                degree: "Bachelor's in Information Technology",
                institution: "University Name",
                year: "2018"
            }
        ],
        certifications: [
            "AWS Certified Solutions Architect",
            "Google Cloud Professional Data Engineer",
            "Microsoft Certified: Azure Data Engineer Associate",
            "Certified Kubernetes Administrator (CKA)"
        ],
        projects: [
            {
                name: "Data Lake Implementation",
                description: "Designed and implemented a data lake solution on AWS S3 with proper access control and data cataloging"
            },
            {
                name: "CI/CD Pipeline Modernization",
                description: "Led migration from Jenkins to GitHub Actions, reducing build times by 50%"
            },
            {
                name: "Real-time Analytics Platform",
                description: "Built streaming data pipeline using Kafka and Spark Streaming for real-time insights"
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