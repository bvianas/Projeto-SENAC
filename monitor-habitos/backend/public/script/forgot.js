document.getElementById("forgotForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();

  if (!email) {
    alert("Por favor, informe seu e-mail.");
    return;
  }

  // Simulação do envio do link
  alert(Um link de redefinição foi enviado para ${email} (simulação).);
  
  // Redireciona para a tela de redefinição
  window.location.href = "reset.html";
});