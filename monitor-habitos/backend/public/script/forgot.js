document.getElementById("forgotForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();

  if (!email) {
    alert("Por favor, informe seu e-mail.");
    return;
  }

  alert(`Um link de redefinição foi enviado para ${email} (simulação).`);

  window.location.href = "script/reset.html";
});
