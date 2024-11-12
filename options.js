// Validate URI template
function validateUriTemplate(template) {
  if (!template) return true; // Empty template is valid (uses default)

  // Must start with obsidian://
  if (!template.startsWith("obsidian://")) {
    return 'URI template must start with "obsidian://"';
  }

  // Must contain at least one placeholder
  const placeholders = [
    "{vault}",
    "{heading}",
    "{content}",
    "{title}",
    "{url}",
  ];
  if (!placeholders.some((p) => template.includes(p))) {
    return "URI template must contain at least one placeholder";
  }

  return true;
}

// Generate preview URI with sample data
function generatePreviewUri() {
  const template = document.querySelector("#uriTemplate").value;
  const vault = document.querySelector("#vault").value;
  const heading = document.querySelector("#heading").value;
  const linkTemplate = document.querySelector("#template").value;

  const sampleData = {
    title: "Sample Page Title",
    url: "https://example.com",
    vault: vault || "Obsidian",
    heading: heading || "Links",
    content: linkTemplate
      .replace("{title}", "Sample Page Title")
      .replace("{url}", "https://example.com"),
  };

  let previewUri;
  if (template) {
    previewUri = template
      .replace("{vault}", encodeURIComponent(sampleData.vault))
      .replace("{heading}", encodeURIComponent(sampleData.heading))
      .replace("{content}", encodeURIComponent(sampleData.content))
      .replace("{title}", encodeURIComponent(sampleData.title))
      .replace("{url}", encodeURIComponent(sampleData.url));
  } else {
    previewUri = `obsidian://advanced-uri?vault=${encodeURIComponent(
      sampleData.vault
    )}&daily=true&heading=${encodeURIComponent(
      sampleData.heading
    )}&data=${encodeURIComponent(sampleData.content)}&mode=append`;
  }

  return previewUri;
}

// Show status message
function showStatus(message, isError = false) {
  const status = document.querySelector("#status");
  status.textContent = message;
  status.style.display = "block";
  status.className = isError ? "error" : "success";
  setTimeout(() => {
    status.style.display = "none";
  }, 3000);
}

// Saves options to browser.storage
function saveOptions(e) {
  e.preventDefault();

  const uriTemplate = document.querySelector("#uriTemplate").value;
  const validationResult = validateUriTemplate(uriTemplate);

  if (validationResult !== true) {
    showStatus(validationResult, true);
    return;
  }

  browser.storage.sync
    .set({
      vault: document.querySelector("#vault").value,
      heading: document.querySelector("#heading").value,
      template: document.querySelector("#template").value,
      uriTemplate: uriTemplate,
    })
    .then(() => {
      showStatus("Options saved successfully!");
    });
}

// Preview URI
function previewUri() {
  const validationResult = validateUriTemplate(
    document.querySelector("#uriTemplate").value
  );
  const preview = document.querySelector("#uriPreview");

  if (validationResult !== true) {
    preview.textContent = `Error: ${validationResult}`;
    preview.style.display = "block";
    return;
  }

  preview.textContent = generatePreviewUri();
  preview.style.display = "block";
}

// Restores preferences stored in browser.storage
function restoreOptions() {
  browser.storage.sync
    .get({
      vault: "Obsidian",
      heading: "Links",
      template: "* [ ] [{title}]({url})",
      uriTemplate: "",
    })
    .then((items) => {
      document.querySelector("#vault").value = items.vault;
      document.querySelector("#heading").value = items.heading;
      document.querySelector("#template").value = items.template;
      document.querySelector("#uriTemplate").value = items.uriTemplate;
    });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
document.querySelector("#testUri").addEventListener("click", previewUri);

// Live preview updates when URI template changes
document.querySelector("#uriTemplate").addEventListener("input", () => {
  const preview = document.querySelector("#uriPreview");
  if (preview.style.display === "block") {
    previewUri();
  }
});
