let currentChatItem = null;
let chats = {};

// Завантаження чатів з локального сховища при завантаженні сторінки
window.onload = function() {
  const storedChats = localStorage.getItem('chats');
  if (storedChats) {
    chats = JSON.parse(storedChats);
    for (const chatName in chats) {
      addChat(chatName, chats[chatName].photo, false);
    }
  }
};

// Функція для входу
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "admin") {
    document.getElementById("loginForm").style.display = "none";
    document.querySelector(".header").style.display = "block";
    document.querySelector(".search-bar").style.display = "block";
    document.getElementById("chatList").style.display = "block";
    document.querySelector(".add-chat-button").style.display = "block";
  } else {
    alert("Неправильне ім'я користувача або пароль");
  }
}

// Функція для відкриття/закриття форми додавання нового чату
function toggleNewChatBox() {
  document.getElementById("newChatBox").style.display =
    document.getElementById("newChatBox").style.display === "none" ? "block" : "none";
}

// Функція для створення нового чату
function createChat() {
  const name = document.getElementById("chatName").value.trim();
  const photo = document.getElementById("iconSelect").value;

  if (!name) return alert("Будь ласка, введіть ім'я");
  if (chats[name]) return alert("Чат з таким ім'ям вже існує.");

  addChat(name, photo);
  document.getElementById("newChatBox").style.display = "none";
  document.getElementById("chatName").value = "";
}

// Функція для додавання чату до списку
function addChat(name, photo, saveToLocal = true) {
  const li = document.createElement("li");
  li.className = "chat-item";
  li.innerHTML = `
    <img src="${photo}" alt="Profile">
    <div class="chat-details">
      <div class="chat-name">${name}</div>
      <div class="chat-message">Новий чат</div>
    </div>
    <button class="delete-chat-button" onclick="deleteChat(event, '${name}')">
      🗑️
    </button>
  `;

  li.onclick = (event) => {
    event.stopPropagation();
    currentChatItem = li;
    openChat(name);
  };

  document.getElementById("chatList").appendChild(li);
  chats[name] = { messages: [], photo: photo }; // Зберігаємо фото чату
  if (saveToLocal) saveChatsToLocal();
}

// Функція для видалення чату
function deleteChat(event, chatName) {
  event.stopPropagation(); // Запобігаємо подальшій обробці події
  if (confirm("Ви впевнені, що хочете видалити цей чат?")) {
    const chatItems = document.querySelectorAll('.chat-item');
    chatItems.forEach(chatItem => {
      const chatNameElement = chatItem.querySelector('.chat-name');
      if (chatNameElement && chatNameElement.innerText === chatName) {
        chatItem.remove();
        delete chats[chatName];
        saveChatsToLocal(); // Оновлюємо локальне сховище
      }
    });
  }
}

// Функція для відкриття вікна чату
function openChat(chatName) {
  const chatWindow = document.getElementById("chatWindow");
  const chatMessages = document.getElementById("chatMessages");
  chatMessages.innerHTML = chats[chatName].messages.map(msg => `<div>${msg}</div>`).join('');
  document.getElementById("chatWindowHeader").innerText = chatName;
  chatWindow.style.display = "block";
}

// Функція для закриття вікна чату
function closeChatWindow() {
  document.getElementById("chatWindow").style.display = "none";
}

// Функція для відправлення повідомлення
function sendMessage() {
  const messageInput = document.getElementById("messageInput");
  const messageText = messageInput.value.trim();

  if (!messageText) return alert("Будь ласка, введіть повідомлення");
  if (currentChatItem) {
    const chatName = currentChatItem.querySelector('.chat-name').innerText;
    chats[chatName].messages.push(messageText); // Додаємо повідомлення до чату
    document.getElementById("chatMessages").innerHTML += `<div>${messageText}</div>`;
    messageInput.value = "";
    saveChatsToLocal(); // Оновлюємо локальне сховище
  }
}

// Функція для збереження чатів у локальному сховищі
function saveChatsToLocal() {
  localStorage.setItem('chats', JSON.stringify(chats));
}
