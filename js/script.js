const whatsappButton = document.querySelector("#whatsapp-demo");

whatsappButton.addEventListener("click", (event) => {
  event.preventDefault();

  alert(
    "Demonstração: aqui será conectado o WhatsApp da clínica."
  );
});
