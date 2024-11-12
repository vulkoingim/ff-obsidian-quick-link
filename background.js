browser.browserAction.onClicked.addListener(async (tab) => {
  // Get user preferences
  const prefs = await browser.storage.sync.get({
    vault: "Obsidian",
    heading: "Links",
    template: "* [ ] [{title}]({url})",
    uriTemplate: "",
  });

  browser.tabs.executeScript({
    code: `
      (function() {
        const pageTitle = document.title;
        const pageUrl = window.location.href;
        
        // Create the markdown link content
        const content = "${prefs.template}"
          .replace("{title}", pageTitle)
          .replace("{url}", pageUrl);

        // Determine which URI template to use
        let obsidianUri;
        if ("${prefs.uriTemplate}") {
          // Use custom URI template
          obsidianUri = "${prefs.uriTemplate}"
            .replace("{vault}", encodeURIComponent("${prefs.vault}"))
            .replace("{heading}", encodeURIComponent("${prefs.heading}"))
            .replace("{content}", encodeURIComponent(content))
            .replace("{title}", encodeURIComponent(pageTitle))
            .replace("{url}", encodeURIComponent(pageUrl));
        } else {
          // Use default URI template
          obsidianUri = \`obsidian://advanced-uri?vault=\${encodeURIComponent('${prefs.vault}')}&daily=true&heading=\${encodeURIComponent('${prefs.heading}')}&data=\${encodeURIComponent(content)}&mode=append\`;
        }
        
        window.location.href = obsidianUri;
      })();
    `,
  });
});
