// CROPLAND MESSAGING SYSTEM
// Frontend demo only. Real cross-user messaging needs a backend.

document.addEventListener("DOMContentLoaded", function () {

    const STORAGE_KEY = "croplandMessagesDemo";
    const CURRENT_USER = "You";

    const conversationList = document.getElementById("conversationList");
    const emptyConversations = document.getElementById("emptyConversations");

    const chatPlaceholder = document.getElementById("chatPlaceholder");
    const activeChat = document.getElementById("activeChat");

    const messageList = document.getElementById("messageList");
    const messageForm = document.getElementById("messageForm");
    const messageInput = document.getElementById("messageInput");

    const searchInput = document.getElementById("searchConversations");

    const newChatModal = document.getElementById("newChatModal");
    const infoModal = document.getElementById("infoModal");

    const newChatForm = document.getElementById("newChatForm");
    const modalError = document.getElementById("modalError");

    let conversations = loadConversations();
    let activeConversationId = null;
    let activeFilter = "all";

    // Demo conversations are created only on the first visit.
    // The other person cannot actually receive these messages.

    if (conversations.length === 0) {

        conversations = [
            {
                id: createId(),
                name: "Rajesh Patil",
                role: "Shopkeeper",
                location: "Nanded",
                product: "Tomato order",
                unread: 1,
                messages: [
                    {
                        id: createId(),
                        sender: "other",
                        text: "Namaste! I am interested in your fresh tomatoes. What quantity is available?",
                        time: Date.now() - 3600000
                    },
                    {
                        id: createId(),
                        sender: "you",
                        text: "Namaste! I can discuss the available quantity and price with you.",
                        time: Date.now() - 3300000
                    }
                ]
            },
            {
                id: createId(),
                name: "Sunita Deshmukh",
                role: "Farmer",
                location: "Nanded",
                product: "Wheat",
                unread: 0,
                messages: [
                    {
                        id: createId(),
                        sender: "other",
                        text: "Hello! I have wheat available for sale. Please let me know your requirement.",
                        time: Date.now() - 86400000
                    }
                ]
            }
        ];

        saveConversations();
    }

    // UNIQUE ID

    function createId() {

        if (window.crypto && typeof window.crypto.randomUUID === "function") {
            return window.crypto.randomUUID();
        }

        return Date.now().toString(36) +
            Math.random().toString(36).slice(2);
    }

    // SAFE LOCAL STORAGE READ

    function loadConversations() {

        try {

            const stored = localStorage.getItem(STORAGE_KEY);

            if (!stored) {
                return [];
            }

            const parsed = JSON.parse(stored);

            if (!Array.isArray(parsed)) {
                return [];
            }

            return parsed.filter(function (conversation) {

                return conversation &&
                    typeof conversation.id === "string" &&
                    typeof conversation.name === "string" &&
                    Array.isArray(conversation.messages);

            });

        } catch (error) {

            console.error("Unable to load conversations:", error);
            return [];
        }
    }

    // SAVE CONVERSATIONS

    function saveConversations() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(conversations)
            );

            return true;

        } catch (error) {

            console.error("Unable to save conversations:", error);

            alert(
                "Messages could not be saved. Check your browser storage."
            );

            return false;
        }
    }

    // SAFE TEXT HELPERS

    function makeElement(tag, className, text) {

        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== undefined) {
            element.textContent = text;
        }

        return element;
    }

    function getInitial(name) {

        return name.trim().charAt(0).toUpperCase() || "?";
    }

    function getLastMessage(conversation) {

        if (!conversation.messages.length) {
            return "Start a conversation";
        }

        return conversation.messages[
            conversation.messages.length - 1
        ].text;
    }

    function formatTime(timestamp) {

        const date = new Date(timestamp);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        const now = new Date();

        const sameDay =
            date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear();

        if (sameDay) {

            return date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });
        }

        return date.toLocaleDateString([], {
            day: "numeric",
            month: "short"
        });
    }

    // RENDER CONVERSATION LIST

    function renderConversations() {

        conversationList.replaceChildren();

        const query = searchInput.value.trim().toLowerCase();

        const filtered = conversations
            .filter(function (conversation) {

                const matchesSearch =
                    conversation.name.toLowerCase().includes(query) ||
                    conversation.role.toLowerCase().includes(query) ||
                    (conversation.product || "").toLowerCase().includes(query);

                const matchesFilter =
                    activeFilter === "all" ||
                    Number(conversation.unread || 0) > 0;

                return matchesSearch && matchesFilter;

            })
            .sort(function (a, b) {

                const aTime = a.messages.length
                    ? Number(a.messages[a.messages.length - 1].time) || 0
                    : 0;

                const bTime = b.messages.length
                    ? Number(b.messages[b.messages.length - 1].time) || 0
                    : 0;

                return bTime - aTime;
            });

        emptyConversations.classList.toggle(
            "hidden",
            filtered.length > 0
        );

        filtered.forEach(function (conversation) {

            const button = makeElement(
                "button",
                "conversation-item" +
                (conversation.id === activeConversationId ? " selected" : "")
            );

            button.type = "button";

            const avatar = makeElement(
                "div",
                "person-avatar",
                getInitial(conversation.name)
            );

            const details = makeElement("div", "conversation-details");

            const topLine = makeElement("div", "conversation-topline");

            const name = makeElement(
                "strong",
                "",
                conversation.name
            );

            const time = makeElement(
                "small",
                "",
                conversation.messages.length
                    ? formatTime(
                        conversation.messages[
                            conversation.messages.length - 1
                        ].time
                    )
                    : ""
            );

            topLine.append(name, time);

            if (Number(conversation.unread || 0) > 0) {

                name.append(
                    makeElement("span", "unread-dot")
                );
            }

            const preview = makeElement(
                "p",
                "conversation-preview",
                getLastMessage(conversation)
            );

            details.append(topLine, preview);
            button.append(avatar, details);

            button.addEventListener("click", function () {
                openConversation(conversation.id);
            });

            conversationList.append(button);
        });
    }

    // OPEN CHAT

    function openConversation(id) {

        const conversation = conversations.find(function (item) {
            return item.id === id;
        });

        if (!conversation) {
            return;
        }

        activeConversationId = id;

        conversation.unread = 0;

        if (!saveConversations()) {
            return;
        }

        chatPlaceholder.classList.add("hidden");
        activeChat.classList.remove("hidden");

        document.getElementById("activeAvatar").textContent =
            getInitial(conversation.name);

        document.getElementById("activeName").textContent =
            conversation.name;

        document.getElementById("activeRole").textContent =
            conversation.role +
            (conversation.location ? " · " + conversation.location : "");

        const productContext = document.getElementById("productContext");

        if (conversation.product) {

            productContext.classList.remove("hidden");

            document.getElementById("contextText").textContent =
                conversation.product;

        } else {

            productContext.classList.add("hidden");
        }

        renderMessages(conversation);
        renderConversations();

        messageInput.focus();
    }

    // RENDER MESSAGES

    function renderMessages(conversation) {

        messageList.replaceChildren();

        messageList.append(
            makeElement(
                "div",
                "date-divider",
                "Conversation with " + conversation.name
            )
        );

        conversation.messages.forEach(function (message) {

            const own = message.sender === "you";

            const row = makeElement(
                "div",
                "message-row" + (own ? " own" : "")
            );

            const bubble = makeElement(
                "div",
                "message-bubble",
                message.text
            );

            const meta = makeElement(
                "div",
                "message-meta",
                (own ? "You" : conversation.name) +
                " · " +
                formatTime(message.time)
            );

            row.append(bubble, meta);

            messageList.append(row);
        });

        messageList.scrollTop = messageList.scrollHeight;
    }

    // SEND MESSAGE

    messageForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const text = messageInput.value.trim();

        if (!text || !activeConversationId) {
            return;
        }

        const conversation = conversations.find(function (item) {
            return item.id === activeConversationId;
        });

        if (!conversation) {
            return;
        }

        const message = {
            id: createId(),
            sender: "you",
            text: text,
            time: Date.now()
        };

        conversation.messages.push(message);

        if (!saveConversations()) {

            conversation.messages.pop();
            return;
        }

        messageInput.value = "";
        messageInput.style.height = "auto";

        renderMessages(conversation);
        renderConversations();
    });

    // AUTO-RESIZE MESSAGE BOX

    messageInput.addEventListener("input", function () {

        messageInput.style.height = "auto";

        messageInput.style.height =
            Math.min(messageInput.scrollHeight, 120) + "px";
    });

    // SEARCH

    searchInput.addEventListener("input", renderConversations);

    // FILTER BUTTONS

    document.querySelectorAll(".filter-btn").forEach(function (button) {

        button.addEventListener("click", function () {

            activeFilter = button.dataset.filter;

            document.querySelectorAll(".filter-btn").forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");

            renderConversations();
        });
    });

    // OPEN NEW CHAT MODAL

    function openNewChatModal() {

        modalError.classList.add("hidden");

        newChatForm.reset();

        newChatModal.classList.remove("hidden");

        document.getElementById("contactName").focus();
    }

    document.getElementById("newChatBtn")
        .addEventListener("click", openNewChatModal);

    document.getElementById("startChatBtn")
        .addEventListener("click", openNewChatModal);

    document.getElementById("closeModalBtn")
        .addEventListener("click", function () {
            newChatModal.classList.add("hidden");
        });

    // CREATE CONVERSATION

    newChatForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document.getElementById("contactName").value.trim();

        const role = document.getElementById("contactRole").value;

        const location = document.getElementById("contactLocation")
            .value.trim();

        const product = document.getElementById("contactProduct")
            .value.trim();

        if (!name) {
            showModalError("Please enter the contact name.");
            return;
        }

        const duplicate = conversations.find(function (conversation) {

            return conversation.name.toLowerCase() === name.toLowerCase() &&
                conversation.role === role;
        });

        if (duplicate) {

            newChatModal.classList.add("hidden");
            openConversation(duplicate.id);

            return;
        }

        const conversation = {
            id: createId(),
            name: name,
            role: role,
            location: location,
            product: product,
            unread: 0,
            messages: []
        };

        conversations.unshift(conversation);

        if (!saveConversations()) {

            conversations.shift();
            return;
        }

        newChatModal.classList.add("hidden");

        renderConversations();

        openConversation(conversation.id);
    });

    function showModalError(message) {

        modalError.textContent = message;
        modalError.classList.remove("hidden");
    }

    // CONTACT INFO MODAL

    document.getElementById("chatInfoBtn")
        .addEventListener("click", function () {

            const conversation = conversations.find(function (item) {
                return item.id === activeConversationId;
            });

            if (!conversation) {
                return;
            }

            document.getElementById("infoAvatar").textContent =
                getInitial(conversation.name);

            document.getElementById("infoName").textContent =
                conversation.name;

            document.getElementById("infoRole").textContent =
                conversation.role;

            document.getElementById("infoLocation").textContent =
                "📍 " + (conversation.location || "Location not provided");

            document.getElementById("infoProduct").textContent =
                "🛒 " + (conversation.product || "No product linked");

            infoModal.classList.remove("hidden");
        });

    document.getElementById("closeInfoBtn")
        .addEventListener("click", function () {
            infoModal.classList.add("hidden");
        });

    // CLOSE MODALS WHEN CLICKING OUTSIDE

    [newChatModal, infoModal].forEach(function (modal) {

        modal.addEventListener("click", function (event) {

            if (event.target === modal) {
                modal.classList.add("hidden");
            }
        });
    });

    // ESCAPE KEY CLOSES MODALS

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            newChatModal.classList.add("hidden");
            infoModal.classList.add("hidden");
        }
    });

    // INITIALIZE

    renderConversations();

    if (conversations.length > 0) {
        openConversation(conversations[0].id);
    }

});