const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get("/api/generate-og-image", async (req, res) => {
  const { title, description, imageUrl, background, template } = req.query;
  console.log(req.query);

  try {
    const browser = await puppeteer.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--single-process",
        "--no-zygote",
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXCECUTABLE_PATH
          : puppeteer.executablePath(),
    });
    const page = await browser.newPage();

    const html = `
      <html>
        <head>
          <style>

          body{
          margin: 3px;
          padding: 3px;
          }
            .preview-container {
              width: 1200px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 630px;
            }
            
            .preview {
              width: 100%;
              display: flex;
              align-items: center;
              border-radius: 0.375rem;
              height: 100%;
            }
            
            .preview.template1 {
              flex-direction: column;
              font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
            }
            
            .preview.template2 {
              flex-direction: row;
              justify-content: space-between;
              border: 4px solid #020202;
              font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
            }
            
            .preview.template3 {
              flex-direction: column;
              filter: grayscale(100%);
              border: 2px solid rgb(66, 65, 65);
              font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
            }
            
            .content {
              width: 100%;
              align-items: center;
              justify-content: center;
              display: flex;
              flex-direction: column;
              padding: 10px;
            }
            
            .template2 .content {
              width: 50%;
              height: 100%;
            }
            
            .content h3 {
              font-size: 1.25rem;
              font-weight: bold;
            }
            
            .content p {
              margin-top: 4px;
            }
            
            .image {
              height: 100%;
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
            }
            
            img {
              border-radius: 0.375rem;
              width: 100%;
            }
            
            .bg-red-200 { background-color: #FED7D7; }
            .bg-blue-200 { background-color: #BEE3F8; }
            .bg-green-200 { background-color: #C6F6D5; }
            .bg-white { background-color: #FFFFFF; }
            .bg-purple-200 { background-color: #E9D8FD; }
          </style>
        </head>
        <body>
          <div class="preview-container">
            <div class="preview ${background} ${template}">
              <div class="content">
                <h3>${truncate(decodeURIComponent(title || ""), 100)}</h3>
                <p>${truncate(
                  decodeURIComponent(description || ""),
                  imageUrl ? 70 : 300
                )}</p>
              </div>
              <div class="image">
                ${
                  imageUrl
                    ? `<img src="${decodeURIComponent(
                        imageUrl
                      )}" alt="Preview" />`
                    : ""
                }
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.setViewport({ width: 1215, height: 640 });

    const imageBuffer = await page.screenshot({ type: "png" });

    await browser.close();

    res.setHeader("Content-Type", "image/png");
    res.send(imageBuffer);
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

app.all("*", (req, res) => {
  res.send("all okay");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

function truncate(str, maxLength) {
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
}
