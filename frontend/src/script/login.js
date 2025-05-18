const API = 'http://localhost:3001'; // ajuste se o back estiver em outra URL

const form = document.getElementById('loginForm');
const msg  = document.getElementById('msg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.textContent = '';

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('password').value.trim();

  try {
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    if (!res.ok) throw new Error('Credenciais inválidas');

    const data = await res.json();
    localStorage.setItem('token', data.token);   // salva JWT
    location.href = 'dashboard.html';            // redireciona
  } catch {
    msg.textContent = 'Email ou senha incorretos';
  }
});
