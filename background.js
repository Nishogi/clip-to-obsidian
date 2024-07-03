chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      files: ["libs/readability.js", "libs/turndown.js"],
    },
    () => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: clipToObsidian,
        args: [{ vault: "", folder: "" }],
      });
    }
  );
});

function clipToObsidian({ vault, folder }) {
  ////////////FUNCTIONS////////////

  // Function to generate a filename that works with Obsidian
  function getFileName(fileName) {
    return fileName.replace(":", "").replace(/[/\?%*|"<>]/g);
  }

  // Utility function to get meta content by name or property
  function getMetaContent(attr, value) {
    return (
      document
        .querySelector(`meta[${attr}='${value}']`)
        ?.getAttribute("content")
        .trim() || ""
    );
  }
  ////////////////////////////////////

  const { title, byline, content } = new Readability(
    document.cloneNode(true)
  ).parse();

  const fileName = getFileName(title); // Get the title of the article and remove special characters

  const locationLink = `[${fileName}](${document.location.href})`; // Create a link to the source

  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  const author =
    byline ||
    getMetaContent("name", "author") ||
    getMetaContent("property", "author") ||
    getMetaContent("property", "og:site_name") ||
    "";

  // Try to get published date
  const scrappedDate = document.querySelector("time")?.getAttribute("datetime");

  const publishedDate = scrappedDate
    ? new Date(scrappedDate).toISOString().split("T")[0]
    : "";

  // Convert HTML content to Markdown using Turndown
  const turndownService = new TurndownService({
    headingStyle: "atx",
    hr: "---",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    emDelimiter: "*",
  });

  const markdownBody = turndownService.turndown(content);

  // Combine content and metadata into the final Markdown body and don't forget to URL encode it
  const fileContent = encodeURIComponent(
    `Clipped from ${locationLink} on ${today}\n` +
      (author ? `\nAuthor: ${author}\n` : "") +
      (publishedDate ? `Date: ${publishedDate}\n` : "") +
      `\n${markdownBody}`
  );

  const vaultName = `&vault=${encodeURIComponent(vault)}`; // In case that the vault name contains special characters

  const obsidianLocation = `${encodeURIComponent(folder + fileName)}`;

  // Create a new note in Obsidian with the file content
  document.location.href = `obsidian://new?file=${obsidianLocation}&content=${fileContent}&vault=${vaultName}`;
}
