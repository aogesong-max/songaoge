(() => {
  "use strict";

  const recipient = "1516733963@qq.com";
  const form = document.getElementById("contact-info-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const name = form.elements.visitorName.value.trim();
    const message = form.elements.visitorMessage.value.trim();
    const subject = `网站留言 - ${name}`;
    const body = `姓名：${name}\n\n留言：\n${message}`;

    window.location.href =
      `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();
