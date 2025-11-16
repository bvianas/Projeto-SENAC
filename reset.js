document.getElementById("resetForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (newPassword !== confirmPassword) {
    alert("As senhas não coincidem.");
    return;
  }

  // Simulação da atualização da senha
  alert("Senha redefinida com sucesso! (simulação)");
  window.location.href = "login.html";
});
