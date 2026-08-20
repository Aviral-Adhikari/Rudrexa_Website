(function () {
  const form = document.querySelector("[data-start-project-form]");

  if (!form) {
    return;
  }

  const steps = Array.from(form.querySelectorAll(".form-step"));
  const stepPills = Array.from(document.querySelectorAll(".step-pill"));
  const nextButton = form.querySelector("[data-next-step]");
  const backButton = form.querySelector("[data-prev-step]");
  const submitButton = form.querySelector("[data-submit]");
  const status = form.querySelector("[data-form-status]");
  let currentStep = 0;

  const fieldsByStep = [
    ["name", "businessName", "email", "phone", "country"],
    ["service", "website", "projectDescription", "businessObjective"],
    ["budget", "startingTime", "discoverySource"],
    ["consent"],
  ];

  function showStep(index) {
    steps.forEach((step, stepIndex) => {
      step.classList.toggle("active", stepIndex === index);
    });
    stepPills.forEach((pill, pillIndex) => {
      pill.classList.toggle("active", pillIndex === index);
    });
    backButton.classList.toggle("hidden", index === 0);
    nextButton.classList.toggle("hidden", index === steps.length - 1);
    submitButton.classList.toggle("hidden", index !== steps.length - 1);
  }

  function setError(input, message) {
    const error = input.parentElement.querySelector(".error-text");

    if (error) {
      error.textContent = message || "";
    }

    input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function clearStatus() {
    status.textContent = "";
    status.className = "field-note";
  }

  function validateField(name) {
    const input = form.elements[name];

    if (!input) {
      return true;
    }

    let message = "";
    const value = input.type === "checkbox" ? input.checked : input.value.trim();

    if (name === "website" && value && !/^https?:\/\/|^[\w.-]+\.[a-z]{2,}$/i.test(value)) {
      message = "Use a valid website URL or leave this field blank.";
    }

    if (["name", "businessName", "email", "phone", "country", "service", "projectDescription", "businessObjective", "budget", "startingTime", "discoverySource"].includes(name) && !value) {
      message = "This field is required.";
    }

    if (name === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      message = "Enter a valid email address.";
    }

    if (name === "consent" && !value) {
      message = "Please confirm you agree to the privacy policy.";
    }

    if (name === "projectDescription" && typeof value === "string" && value.length < 30) {
      message = "Please share a bit more detail so Rudrexa can understand the project.";
    }

    setError(input, message);
    return !message;
  }

  function validateStep(index) {
    return fieldsByStep[index].every(validateField);
  }

  nextButton.addEventListener("click", () => {
    clearStatus();
    if (validateStep(currentStep)) {
      currentStep += 1;
      showStep(currentStep);
    }
  });

  backButton.addEventListener("click", () => {
    clearStatus();
    currentStep = Math.max(0, currentStep - 1);
    showStep(currentStep);
  });

  form.addEventListener("input", (event) => {
    if (event.target.name) {
      validateField(event.target.name);
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearStatus();

    const allValid = fieldsByStep.every((_, index) => validateStep(index));

    if (!allValid) {
      status.textContent = "Please fix the highlighted fields before submitting.";
      status.className = "error-text";
      return;
    }

    const honeypot = form.elements.companyWebsiteTrap.value.trim();

    if (honeypot) {
      status.textContent = "Submission blocked.";
      status.className = "error-text";
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/start-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("The enquiry endpoint is not configured yet.");
      }

      form.reset();
      currentStep = 0;
      showStep(currentStep);
      status.textContent = "Thanks. Your project enquiry has been sent to Rudrexa.";
      status.className = "success-text";
    } catch (error) {
      status.textContent =
        "This static version is ready for deployment, but a backend endpoint is still needed for live submission. The form validation is working and the integration hook is prepared.";
      status.className = "field-note";
      console.error(error);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Submit project enquiry";
    }
  });

  showStep(currentStep);
})();
