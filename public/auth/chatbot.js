document.addEventListener('DOMContentLoaded', () => {
  const sendBtn = document.getElementById("send");
  const input = document.getElementById("input");
  const chat = document.getElementById("messages");

  if (!sendBtn || !input || !chat) {
    console.error("❌ Chatbot elements not found!");
    return;
  }

  sendBtn.addEventListener("click", async () => {
    const message = input.value.trim();
    if (!message) return;

    // Show user message
    chat.innerHTML += `<div class="user">You: ${message}</div>`;
    input.value = "";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const data = await res.json();

      // Show bot reply or fallback
      chat.innerHTML += `<div class="bot">Bot: ${data.reply || "Sorry, no response."}</div>`;
    } catch (err) {
      console.error("Chat request failed:", err);
      chat.innerHTML += `<div class="bot">Bot: Error contacting server.</div>`;
    }
  });
});

