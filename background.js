browser.browserAction.onClicked.addListener((tab) => {
  browser.tabs.executeScript({
    code: `
      (function() {
        const pageTitle = document.title;
        const pageUrl = window.location.href;
        
        const markdownLink = \`* [ ] [\${pageTitle}](\${pageUrl})\`;
        
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        
        const obsidianUri = \`obsidian://advanced-uri?vault=\${encodeURIComponent('Obsidian')}&daily=true&heading=Links&data=\${encodeURIComponent(markdownLink)}&mode=append\`;
        
        window.location.href = obsidianUri;
      })();
    `,
  });
});
