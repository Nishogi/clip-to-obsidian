// Import required libraries
Promise.all([
    import('https://unpkg.com/turndown@6.0.0?module'),
    import('https://unpkg.com/@tehshrike/readability@0.2.0'),
]).then(async ([{ default: Turndown }, { default: Readability }]) => {

    /* Optional vault name */
    const vault = ""; // Name of the Obsidian vault

    /* Optional folder name */
    const folder = ""; // Folder path within the vault

    /* Optional tags */
    let tags = ""; // Tags for the note

    // Parse the site's meta keywords content into tags, if present
    if (document.querySelector('meta[name="keywords" i]')) {
        var keywords = document.querySelector('meta[name="keywords" i]').getAttribute('content').split(',');

        keywords.forEach(function (keyword) {
            let tag = ' ' + keyword.split(' ').join('');
            tags += tag;
        });
    }

    // Function to get selected HTML content or the whole page if no selection
    function getSelectionHtml() {
        var html = "";
        if (typeof window.getSelection != "undefined") {
            var sel = window.getSelection();
            if (sel.rangeCount) {
                var container = document.createElement("div");
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                    container.appendChild(sel.getRangeAt(i).cloneContents());
                }
                html = container.innerHTML;
            }
        } else if (typeof document.selection != "undefined") {
            if (document.selection.type == "Text") {
                html = document.selection.createRange().htmlText;
            }
        }
        return html;
    }

    const selection = getSelectionHtml(); // Get selected content

    // Parse the webpage content using Readability
    const { title, byline, content } = new Readability(document.cloneNode(true)).parse();

    // Function to generate a safe filename
    function getFileName(fileName) {
        var platform = window.navigator.platform;
        var windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

        if (windowsPlatforms.indexOf(platform) !== -1) {
            fileName = fileName.replace(':', '').replace(/[/\?%*|"<>]/g, '-');
        } else {
            fileName = fileName.replace(':', '').replace(/[/]/g, '-');
        }
        return fileName;
    }

    const fileName = getFileName(title); // Generate a safe filename

    var markdownify = selection || content; // Use selected content or main content

    if (vault) {
        var vaultName = '&vault=' + encodeURIComponent(`${vault}`);
    } else {
        var vaultName = '';
    }

    // Convert HTML content to Markdown using Turndown
    const markdownBody = new Turndown({
        headingStyle: 'atx',
        hr: '---',
        bulletListMarker: '-',
        codeBlockStyle: 'fenced',
        emDelimiter: '*',
    }).turndown(markdownify);

    var date = new Date();

    // Function to convert date to YYYY-MM-DD format
    function convertDate(date) {
        var yyyy = date.getFullYear().toString();
        var mm = (date.getMonth() + 1).toString();
        var dd = date.getDate().toString();
        var mmChars = mm.split('');
        var ddChars = dd.split('');
        return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
    }

    const today = convertDate(date); // Get today's date in YYYY-MM-DD format

    // Utility function to get meta content by name or property
    function getMetaContent(attr, value) {
        var element = document.querySelector(`meta[${attr}='${value}']`);
        return element ? element.getAttribute("content").trim() : "";
    }

    // Fetch byline, meta author, property author, or site name
    var author = byline || getMetaContent("name", "author") || getMetaContent("property", "author") || getMetaContent("property", "og:site_name");

    // Check if there's an author and add brackets
    var authorBrackets = author ? `[[${author}]]` : "";

    var locationLink = `[${fileName}](${document.location.href})`; // Create a link to the source

    // Try to get published date
    var timeElement = document.querySelector("time");
    var publishedDate = timeElement ? timeElement.getAttribute("datetime") : "";

    if (publishedDate && publishedDate.trim() !== "") {
        var date = new Date(publishedDate);
        var year = date.getFullYear();
        var month = date.getMonth() + 1; // Months are 0-based in JavaScript
        var day = date.getDate();

        // Pad month and day with leading zeros if necessary
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        var published = year + '-' + month + '-' + day;
    } else {
        var published = '';
    }

    // Combine content and metadata into the final Markdown body
    const fileContent = markdownBody
        + "\n\nSource: " + document.location.href
        + "\nAuthor: " + authorBrackets
        + "\nDate: " + published + "\n";

    // Create a new note in Obsidian with the file content
    document.location.href = "obsidian://new?"
        + "file=" + encodeURIComponent(folder + fileName)
        + "&content=" + encodeURIComponent(fileContent)
        + vaultName;

});