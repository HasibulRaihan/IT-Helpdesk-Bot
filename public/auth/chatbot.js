document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById("send");
    const input = document.getElementById("input");
    const chat = document.getElementById("messages");
  
    if (!sendBtn || !input || !chat) {
      console.error("Chatbot elements not found!");
      return;
    }
  
    sendBtn.addEventListener("click", async () => {
      const message = input.value.trim();
      if (!message) return;
  
      chat.innerHTML += `<div class="user">You: ${message}</div>`;
      input.value = "";
  
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        });
  
        const data = await res.json();
        chat.innerHTML += `<div class="bot">Bot: ${data.reply}</div>`;
      } catch (err) {
        chat.innerHTML += `<div class="bot">Bot: Error contacting server.</div>`;
        console.error("Chat error:", err);
      }
    });
  });
  
