document.getElementById("resetForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const newPassword = document.getElementById("newPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const email = localStorage.getItem("resetEmail");

  if (!email) {
    alert("Email não encontrado. Volte e refaça o processo.");
    window.location.href = "/forgot.html";
    return;
  }

  if (!newPassword || !confirmPassword) {
    alert("Preencha todos os campos.");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("As senhas não coincidem.");
    return;
  }

  try {
    const res = await fetch("/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.erro || "Erro ao redefinir senha.");
      return;
    }

    alert(data.mensagem || "Senha redefinida com sucesso!");

    localStorage.removeItem("resetEmail");
    window.location.href = "/login.html";
  } catch (err) {
    alert("Erro de conexão com o servidor.");
  }
});

