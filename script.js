const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.querySelector("#contact-form");
const skillCards = document.querySelectorAll(".skill-card");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.18,
  }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${index * 120}ms`;
  observer.observe(item);
});

if (skillCards.length) {
  const animateValue = (element, target) => {
    const duration = 1100;
    const start = performance.now();

    const update = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      element.textContent = `${current}%`;

      if (progress < 1) {
        window.requestAnimationFrame(update);
      }
    };

    window.requestAnimationFrame(update);
  };

  const animateSkillCard = (card) => {
    if (card.dataset.animated === "true") {
      return;
    }

    const bar = card.querySelector(".skill-bar span");
    const percent = card.querySelector("p");

    if (!bar || !percent) {
      return;
    }

    const target = parseInt(bar.style.width || percent.textContent, 10);

    if (Number.isNaN(target)) {
      return;
    }

    card.dataset.animated = "true";
    bar.style.transition = "width 1.1s cubic-bezier(0.22, 1, 0.36, 1)";
    bar.style.width = "0%";
    percent.textContent = "0%";

    window.requestAnimationFrame(() => {
      bar.style.width = `${target}%`;
      animateValue(percent, target);
    });
  };

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        animateSkillCard(entry.target);
        skillObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.3,
    }
  );

  skillCards.forEach((card) => {
    skillObserver.observe(card);
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get("name")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";
    const subject = formData.get("subject")?.toString().trim() || "";
    const message = formData.get("message")?.toString().trim() || "";

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      message,
    ].join("\n");

    const mailtoUrl =
      `mailto:malinitin.jd@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;
  });
}
