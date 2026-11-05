// Barra de aviso, menu do celular, link ativo no menu, animações de entrada, filtro de projetos e copiar e-mail.
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch { /* sem armazenamento */ } };
  const ler = (k) => { try { return localStorage.getItem(k); } catch { return null; } };

  // Barra de aviso: fecha e lembra
  const aviso = $("#announce");
  if (ler("aviso-fechado") === "1") aviso.hidden = true;
  $("#announceClose").addEventListener("click", () => { aviso.hidden = true; guardar("aviso-fechado", "1"); });

  // Menu do celular
  const burger = $("#burger"), links = $("#navLinks");
  const fechar = () => { links.classList.remove("open"); burger.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); };
  burger.addEventListener("click", () => {
    const abrir = !links.classList.contains("open");
    links.classList.toggle("open", abrir); burger.classList.toggle("open", abrir); burger.setAttribute("aria-expanded", String(abrir));
  });
  $$("a", links).forEach((a) => a.addEventListener("click", fechar));

  // Link ativo conforme a seção na tela
  const secoes = $$("main > section[id], main[id]").filter((s) => $(`.nav__links a[href="#${s.id}"]`));
  const marcar = () => {
    let atual = "inicio";
    for (const s of secoes) if (s.id !== "inicio" && s.getBoundingClientRect().top < 140) atual = s.id;
    $$(".nav__links a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${atual}` && !a.classList.contains("nav__cta")));
  };
  addEventListener("scroll", marcar, { passive: true }); marcar();

  // Animações de entrada
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver((itens) => itens.forEach((i) => { if (i.isIntersecting) { i.target.classList.add("visible"); obs.unobserve(i.target); } }), { threshold: 0.12 });
    $$(".reveal").forEach((el) => obs.observe(el));
  } else $$(".reveal").forEach((el) => el.classList.add("visible"));

  // Filtro de projetos (com a quantidade em cada botão)
  const projetos = $$("#listaProjetos .projeto");
  $$(".filtro").forEach((b) => {
    const f = b.dataset.filtro;
    const n = f === "todos" ? projetos.length : projetos.filter((p) => p.dataset.cat.split(" ").includes(f)).length;
    b.insertAdjacentHTML("beforeend", ` <small>${n}</small>`);
    b.addEventListener("click", () => {
      $$(".filtro").forEach((x) => x.classList.toggle("filtro--on", x === b));
      projetos.forEach((p) => {
        p.hidden = f !== "todos" && !p.dataset.cat.split(" ").includes(f);
        if (!p.hidden) p.classList.add("visible");
      });
    });
  });

  // Copiar e-mail
  $$("[data-copiar]").forEach((b) => b.addEventListener("click", async () => {
    const msg = $("#copiado");
    try { await navigator.clipboard.writeText(b.dataset.copiar); msg.textContent = `✓ ${b.dataset.copiar} copiado`; }
    catch { msg.textContent = b.dataset.copiar; }
    setTimeout(() => { msg.textContent = ""; }, 4000);
  }));

  $("#ano").textContent = new Date().getFullYear();
})();
