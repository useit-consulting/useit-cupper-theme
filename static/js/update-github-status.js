document.addEventListener("DOMContentLoaded", function () {
  const user = netlifyIdentity.currentUser();
  const container = document.getElementById("updateStatusButtonContainer");
  const formContainer = document.getElementById("formContainer");

  // If user is not logged in, just show the status without a form
  if (!user) {
    const statusDisplay = document.createElement("div");
    statusDisplay.className = "status-display";
    statusDisplay.style.display = "flex";
    statusDisplay.style.alignItems = "center";
    statusDisplay.style.gap = "0.5rem";

    const statusLabel = document.createElement("strong");
    statusLabel.setAttribute("aria-hidden", "true");
    statusLabel.textContent = "Status: ";

    const statusValue = document.createElement("span");
    statusValue.classList.add("status");
    statusValue.textContent = hugoParams.status || translations.new;

    const loginButton = document.createElement("button");
    loginButton.type = "button";
    loginButton.textContent = "Log in to update status";
    loginButton.onclick = function () {
      netlifyIdentity?.open();
    };

    statusDisplay.appendChild(statusLabel);
    statusDisplay.appendChild(statusValue);
    statusDisplay.appendChild(loginButton);
    formContainer.appendChild(statusDisplay);
    return;
  }

  // Create form only for logged-in users
  const form = document.createElement("form");
  form.id = "statusForm";
  form.setAttribute("aria-label", "Update issue status");
  form.style.display = "flex";
  form.style.alignItems = "center";
  form.style.gap = "0.5rem";

  const statusLabel = document.createElement("strong");
  statusLabel.setAttribute("aria-hidden", "true");
  statusLabel.textContent = "Status: ";

  const select = document.createElement("select");
  select.id = "statusSelect";
  select.name = "status";
  select.setAttribute("aria-label", "Select status");

  const statusTranslations = {
    new: translations.new,
    in_progress: translations.in_progress,
    completed: translations.completed,
    tested_not_ok: translations.tested_not_ok,
    tested_ok: translations.tested_ok,
    rejected: translations.rejected,
  };

  Object.entries(statusTranslations).forEach(([value, text]) => {
    const option = document.createElement("option");
    option.value = value;
    option.text = text || statusTranslations.new;
    if (value === (hugoParams.status || "new")) {
      option.selected = true;
    }
    select.appendChild(option);
  });

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Update status";

  form.appendChild(statusLabel);
  form.appendChild(select);
  form.appendChild(submitButton);
  formContainer.appendChild(form);

  const statusParagraph = document.createElement("p");
  statusParagraph.role = "status";
  statusParagraph.classList.add("status-message");
  statusParagraph.setAttribute("aria-live", "polite");

  const url = window.location.href;
  let repoName;
  if (url.includes("reports.useit.se")) {
    repoName = url.split("/")[3];
  } else if (url.includes(".netlify.app")) {
    repoName = url.split("//")[1].split(".")[0];
  }

  form.onsubmit = async function (event) {
    event.preventDefault();

    const status = select.value;
    const pageId = window.location.pathname.slice(0, -1) + ".md";
    console.log("Saving status...", status, pageId);
    submitButton.disabled = true;
    select.disabled = true;

    try {
      const response = await fetch(
        hugoParams.absURL + ".netlify/functions/update-status",
        {
          method: "POST",
          body: JSON.stringify({
            pageId,
            status,
            language: hugoParams.siteLanguage,
            repo: repoName,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        statusParagraph.innerHTML =
          'Rebuilding page, may take 60 seconds... <div class="spinner"></div>';
        container.appendChild(statusParagraph);
        setTimeout(() => {
          window.location.reload();
        }, 60000);
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      statusParagraph.innerHTML = "Update Failed - Retry?";
      container.appendChild(statusParagraph);
      console.error("Error updating the page:", error);
      submitButton.disabled = false;
      select.disabled = false;
    }
  };
});
