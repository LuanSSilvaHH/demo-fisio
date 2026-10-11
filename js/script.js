const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const menuButton = document.querySelector(".menu-button");
const mainNav = document.querySelector("#main-navigation");

function closeMenu() {
  mainNav?.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", "Abrir menu");
}
menuButton?.addEventListener("click", () => {
  const isOpen = mainNav?.classList.toggle("open") || false;
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});
mainNav?.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });
document.addEventListener("click", event => {
  if (mainNav?.classList.contains("open") && !event.target.closest(".site-header")) closeMenu();
});

const reveals = document.querySelectorAll(".reveal");
if (reduceMotion || !("IntersectionObserver" in window)) {
  reveals.forEach(element => element.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: "0px 0px -12px 0px" });
  reveals.forEach(element => observer.observe(element));
}

const appointmentForm = document.querySelector("#appointment-form");
const serviceSelect = document.querySelector("#appointment-service");

document.querySelectorAll(".service-card[data-service]").forEach(card => {
  card.addEventListener("click", () => {
    if (serviceSelect) serviceSelect.value = card.dataset.service;
  });
});

const messageDialog = document.querySelector("#message-dialog");
const messagePreview = document.querySelector("#message-preview");
const dialogStatus = document.querySelector(".dialog-status");

appointmentForm?.addEventListener("submit", event => {
  event.preventDefault();
  if (!appointmentForm.reportValidity()) return;
  const data = new FormData(appointmentForm);
  const name = String(data.get("name") || "").trim();
  if (!name) return;
  const treatment = String(data.get("service") || "Orientação");
  const note = String(data.get("notes") || "").trim();

  const message = [
    "Olá! Conheci a VittaFisio pelo site e gostaria de conversar sobre uma avaliação.",
    "",
    `Nome: ${name}`,
    `Área de interesse: ${treatment}`,
    `Observações: ${note || "Gostaria de receber mais informações."}`,
  ].join("\n");
  if (messagePreview) messagePreview.value = message;
  if (dialogStatus) dialogStatus.textContent = "";
  if (messageDialog?.showModal) messageDialog.showModal();
});

document.querySelector(".dialog-close")?.addEventListener("click", () => messageDialog?.close());
messageDialog?.addEventListener("click", event => {
  if (event.target === messageDialog) messageDialog.close();
});
document.querySelector(".dialog-copy")?.addEventListener("click", async () => {
  const message = messagePreview?.value || "";
  if (!message) return;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(message);
    } else {
      messagePreview.focus();
      messagePreview.select();
      if (!document.execCommand("copy")) throw new Error("Cópia não disponível");
    }
    if (dialogStatus) dialogStatus.textContent = "Mensagem copiada! O número comercial será configurado quando a demonstração for personalizada.";
  } catch {
    messagePreview.focus();
    messagePreview.select();
    if (dialogStatus) dialogStatus.textContent = "Selecione o texto acima para copiar manualmente.";
  }
});
