(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-navigation");
  const navigationLinks = navigation ? [...navigation.querySelectorAll('a[href^="#"]')] : [];

  const closeMenu = () => {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      navigation.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    navigationLinks.forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    document.addEventListener("click", (event) => {
      if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 800) closeMenu();
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("js-motion");
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const sectionLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
  const sections = sectionLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${entry.target.id}`) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  const serviceSelect = document.querySelector("#service");
  document.querySelectorAll("[data-service]").forEach((link) => {
    link.addEventListener("click", () => {
      const requestedService = link.getAttribute("data-service");
      if (!serviceSelect || !requestedService) return;
      const matchingOption = [...serviceSelect.options].find((option) => option.textContent.trim() === requestedService);
      if (matchingOption) serviceSelect.value = matchingOption.value;
    });
  });

  const form = document.querySelector("#enquiry-form");
  const status = document.querySelector("#form-status");
  if (form && status) {
    form.addEventListener("invalid", () => {
      status.dataset.state = "error";
      status.textContent = "Please complete the required fields and check that your email address is valid.";
    }, true);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const formData = new FormData(form);
      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const company = String(formData.get("company") || "").trim();
      const service = String(formData.get("service") || "").trim();
      const message = String(formData.get("message") || "").trim();
      const subject = `Website enquiry: ${service}`;
      const body = [
        `Name: ${name}`,
        `Business email: ${email}`,
        `Company: ${company || "Not provided"}`,
        `Service of interest: ${service}`,
        "",
        message
      ].join("\n");

      status.dataset.state = "info";
      status.textContent = "Your email application should open with the enquiry drafted. If it does not, email partners@lesedi.co.za directly.";
      window.location.href = `mailto:partners@lesedi.co.za?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
})();
