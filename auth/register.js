document.getElementById('registerForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: name, email, password })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Registration successful! You may now log in.');
      window.location.href = 'login.html';
    } else {
      alert(data.message || 'Registration failed.');
    }
  } catch (err) {
    console.error('Fetch error:', err.message);
    alert('Registration request failed.');
  }
});


