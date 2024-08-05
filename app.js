const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get("/api/generate-og-image", async (req, res) => {
  const { title, description, imageUrl, background, template } = req.query;
  console.log(req.query);

  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    const html = `
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
            }
            .container {
              width: 1200px;
              height: 630px;
              display: flex;
              flex-direction: ${template !== "template2" ? "column" : "row"};
              align-items: center;
              justify-content: center;
              background-color: ${getBackgroundColor(background)};
              padding: 40px;
              box-sizing: border-box;
            }
            .content {
              padding: 20px;
            }
            h1 {
              font-size: 48px;
              font-weight: bold;
              margin: 0;
            }
            p {
              font-size: 24px;
              margin-top: 20px;
            }
            img {
              max-width: 100%;
              max-height: 100%;
              object-fit: cover;
              border-radius: 8px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <h1>${truncate(decodeURIComponent(title || ""), 100)}</h1>
              <p>${truncate(
                decodeURIComponent(description || ""),
                imageUrl ? 70 : 200
              )}</p>
            </div>
            ${
              imageUrl
                ? `<img src="${decodeURIComponent(imageUrl)}" alt="Preview" />`
                : ""
            }
          </div>
        </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.setViewport({ width: 1200, height: 630 });

    const imageBuffer = await page.screenshot({ type: "png" });

    await browser.close();

    res.setHeader("Content-Type", "image/png");

    res.send(imageBuffer);
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

function getBackgroundColor(background) {
  const colors = {
    "bg-red-200": "#FED7D7",
    "bg-blue-200": "#BEE3F8",
    "bg-green-200": "#C6F6D5",
    "bg-white": "#FFFFFF",
    "bg-purple-200": "#E9D8FD",
  };
  return colors[background] || "#FFFFFF";
}

function truncate(str, maxLength) {
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
}
