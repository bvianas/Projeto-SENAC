const API = 'http://localhost:3001';
const form = document.getElementById('regForm');
const msg  = document.getElementById('regMsg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.textContent = '';

  const emailInput = document.getElementById('regEmail');
  const senhaInput = document.getElementById('regPass');

  const email = emailInput.value.trim();
  const senha = senhaInput.value.trim();

  try {
    // 1. Cadastro
    const res = await fetch(`${API}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, senha })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || 'Erro no cadastro');
    }

    // 2. Login automático
    const loginRes = await fetch(`${API}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, senha })
    });

    if (!loginRes.ok) {
      const errText = await loginRes.text();
      throw new Error(errText || 'Erro no login');
    }

    const data = await loginRes.json();
    localStorage.setItem('token', data.token);
    location.href = 'dashboard.html';
  } catch (err) {
    msg.textContent = err.message || 'Falha no cadastro';
  }
});
