document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('verifyForm');
    const emailInput = document.getElementById('email');
    const codeInput = document.getElementById('code');
  
    if (!form || !emailInput || !codeInput) {
      console.error("Form or input fields not found");
      return;
    }
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const email = emailInput.value.trim();
      const code = codeInput.value.trim();
  
      try {
        const res = await fetch('/api/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code }),
        });
  
        const data = await res.json();
  
        if (data.success) {
          window.location.href = '/help.html';
        } else {
          alert(data.message || "Verification failed.");
        }
      } catch (err) {
        console.error("Verification error:", err);
      }
    });
  });
  




