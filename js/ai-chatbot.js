// ===== GAURIX AI CHATBOT: FRONTEND DEMO =====

document.addEventListener("DOMContentLoaded", function () {
    const chatForm = document.getElementById("chatForm");
    const chatInput = document.getElementById("chatInput");
    const chatMessages = document.getElementById("chatMessages");
    const typingIndicator = document.getElementById("typingIndicator");
    const sendButton = document.getElementById("sendMessageBtn");
    const languageSelector = document.getElementById("chatLanguage");
    const suggestionButtons = document.querySelectorAll(".suggestion-btn");

    if (!chatForm || !chatInput || !chatMessages) return;

    const demoReplies = {
        en: [
            {
                keywords: ["crop", "grow", "plant", "season"],
                reply: "To choose a crop, consider your local climate, soil type, water availability, growing season and nearby buyer requirements. Check local agricultural guidance before making a final decision."
            },
            {
                keywords: ["soil", "fertilizer", "fertiliser"],
                reply: "Good soil management starts with a soil test. Use nutrients according to the test results, maintain organic matter and avoid applying fertilizers without understanding the crop's needs."
            },
            {
                keywords: ["transport", "route", "fuel", "delivery"],
                reply: "To reduce transport costs, group deliveries by nearby locations, compare vehicle capacity with total produce weight and plan the delivery sequence before departure."
            },
            {
                keywords: ["sell", "market", "trader", "price", "bulk"],
                reply: "Before selling, check current local market prices, buyer requirements, crop quality, quantity, packaging and transport costs. Confirm the terms directly with the buyer."
            }
        ],
        hi: [
            {
                keywords: ["crop", "फसल", "उग", "बोना", "पीक"],
                reply: "अगली फसल चुनने से पहले स्थानीय मौसम, मिट्टी, पानी की उपलब्धता, फसल का मौसम और खरीदारों की मांग देखें। अंतिम निर्णय से पहले स्थानीय कृषि विशेषज्ञ की सलाह लें।"
            },
            {
                keywords: ["soil", "मिट्टी", "खाद", "fertilizer"],
                reply: "मिट्टी की जांच करवाकर ही खाद का चुनाव करें। फसल की जरूरत के अनुसार पोषक तत्व दें और बिना जांच के जरूरत से ज्यादा खाद न डालें।"
            },
            {
                keywords: ["transport", "route", "गाड़ी", "परिवहन", "delivery"],
                reply: "परिवहन खर्च कम करने के लिए नजदीकी खरीदारों की डिलीवरी एक साथ रखें, वाहन की क्षमता देखें और जाने से पहले डिलीवरी का क्रम तय करें।"
            },
            {
                keywords: ["sell", "market", "बाजार", "बेचना", "मंडी", "trader"],
                reply: "फसल बेचने से पहले स्थानीय बाजार भाव, खरीदार की जरूरत, गुणवत्ता, मात्रा और परिवहन खर्च की तुलना करें। खरीदार से शर्तें स्पष्ट करें।"
            }
        ],
        mr: [
            {
                keywords: ["crop", "पीक", "लागवड", "पेरणी", "उगव"],
                reply: "पुढील पीक निवडताना स्थानिक हवामान, माती, पाण्याची उपलब्धता, हंगाम आणि व्यापाऱ्यांची मागणी विचारात घ्या. अंतिम निर्णयापूर्वी स्थानिक कृषी तज्ज्ञांचा सल्ला घ्या."
            },
            {
                keywords: ["soil", "माती", "खत", "fertilizer"],
                reply: "मातीची तपासणी करून खतांचा वापर करा. पिकाच्या गरजेनुसार पोषक तत्त्वे द्या आणि गरजेपेक्षा जास्त खत वापरणे टाळा."
            },
            {
                keywords: ["transport", "route", "वाहतूक", "गाडी", "delivery"],
                reply: "वाहतूक खर्च कमी करण्यासाठी जवळच्या व्यापाऱ्यांच्या डिलिव्हरी एकत्र करा, वाहनाची क्षमता तपासा आणि प्रवासापूर्वी डिलिव्हरीचा क्रम ठरवा."
            },
            {
                keywords: ["sell", "market", "बाजार", "विक्री", "व्यापारी", "trader"],
                reply: "पीक विकण्यापूर्वी स्थानिक बाजारभाव, व्यापाऱ्यांची गरज, गुणवत्ता, प्रमाण आणि वाहतूक खर्च तपासा. खरेदीदारासोबत अटी स्पष्ट करा."
            }
        ]
    };

    function addMessage(text, sender) {
        const message = document.createElement("div");
        message.className = "message " +
            (sender === "user" ? "user-message" : "assistant-message");

        const avatar = document.createElement("div");
        avatar.className = "message-avatar";
        avatar.textContent = sender === "user" ? "👨‍🌾" : "🌾";

        const content = document.createElement("div");
        content.className = "message-content";

        const senderLabel = document.createElement("span");
        senderLabel.className = "message-sender";
        senderLabel.textContent =
            sender === "user" ? "You" : "GAURIX Assistant";

        const paragraph = document.createElement("p");
        paragraph.textContent = text;

        content.appendChild(senderLabel);
        content.appendChild(paragraph);
        message.appendChild(avatar);
        message.appendChild(content);
        chatMessages.appendChild(message);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getDemoReply(message, language) {
        const normalizedMessage = message.toLowerCase();
        const replies = demoReplies[language] || demoReplies.en;

        for (const item of replies) {
            if (item.keywords.some(function (keyword) {
                return normalizedMessage.includes(keyword.toLowerCase());
            })) {
                return item.reply;
            }
        }

        const fallback = {
            en: "I am currently running in demo mode. Try asking about crop selection, soil health, market selling or transportation. Real AI answers will be connected through the backend later.",
            hi: "मैं अभी डेमो मोड में हूँ। फसल चयन, मिट्टी की सेहत, बाजार में बिक्री या परिवहन के बारे में पूछें। वास्तविक AI जवाब बाद में बैकएंड से जोड़े जाएंगे।",
            mr: "मी सध्या डेमो मोडमध्ये आहे. पीक निवड, मातीचे आरोग्य, बाजारातील विक्री किंवा वाहतुकीबद्दल विचारा. खरे AI उत्तर नंतर बॅकएंडद्वारे जोडले जाईल."
        };

        return fallback[language] || fallback.en;
    }

    function sendMessage(text) {
        const cleanText = text.trim();

        if (!cleanText) return;

        addMessage(cleanText, "user");

        chatInput.value = "";
        sendButton.disabled = true;
        typingIndicator.hidden = false;

        const language = languageSelector.value;

        window.setTimeout(function () {
            typingIndicator.hidden = true;
            addMessage(getDemoReply(cleanText, language), "assistant");
            sendButton.disabled = false;
            chatInput.focus();
        }, 700);
    }

    chatForm.addEventListener("submit", function (event) {
        event.preventDefault();
        sendMessage(chatInput.value);
    });

    suggestionButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const question = button.dataset.question;

            if (question) {
                sendMessage(question);
            }
        });
    });
});