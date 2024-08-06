# Dynamic Meta Backend

This is the backend for the Dynamic Meta project, a Node.js application that generates custom Open Graph images based on user input.

## Live API

The API is live at: [https://dynamic-meta-backend.onrender.com](https://dynamic-meta-backend.onrender.com)

## Features

- Generate custom Open Graph images
- Support for multiple color schemes and design templates
- RESTful API for integration with frontend applications

## Technologies Used

- Node.js
- Express.js
- Puppeteer (for image generation)
- Docker (for deployment)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Docker (for deployment)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/dynamic-meta-backend.git
   cd dynamic-meta-backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

   or

   ```
   yarn install
   ```

3. Start the server:

   ```
   node index.js
   ```

   or

   ```
   yarn index.js
   ```

4. The server will start on `http://localhost:3000` by default.

## API Endpoints

- `POST /api/generate-og-image`
  - Generates a custom Open Graph image
  - Request body should include:
    ```json
    {
      "title": "Your Title",
      "content": "Your content...",
      "image": "https://example.com/image.jpg" (optional),
      "colorScheme": "light",
      "designTemplate": "modern"
    }
    ```
  - Returns: A PNG image directly in the response body
  - Response Content-Type: `image/png`

## Deployment

This project is deployed on Render.com using a Docker container. To deploy your own version:

1. Fork this repository
2. Sign up for a Render account
3. Create a new Web Service on Render
4. Choose "Deploy from a Docker Image"
5. Connect your GitHub account and select the forked repository
6. Configure the build:
   - Docker Image Name: `your-docker-username/dynamic-meta-backend:latest`
   - Dockerfile Path: `Dockerfile`
7. Add any necessary environment variables
8. Deploy!

## Docker

To build and run the Docker image locally:

1. Build the image:

   ```
   docker build -t dynamic-meta-backend .
   ```

2. Run the container:
   ```
   docker run -p 3001:3001 dynamic-meta-backend
   ```

## How It's Made

The Dynamic Meta backend is built with a focus on performance, scalability, and ease of deployment:

1. **Node.js and Express**: The server is built using Node.js with the Express framework, providing a robust and efficient foundation for our API. Express allows for easy routing and middleware integration.

2. **Image Generation**: We use the `@vercel/og` library, which is specifically designed for creating dynamic Open Graph images. This library allows us to generate images directly from HTML and CSS templates, providing great flexibility in design while maintaining high performance.

3. **Direct Image Response**: Instead of saving the generated image to disk and returning a URL, our API generates the image on-the-fly and returns it directly in the response body as a PNG. This approach reduces latency and eliminates the need for additional storage management.

4. **Dynamic HTML Templates**: We create dynamic HTML templates based on user input, which are then converted into images. This allows for highly customizable OG images.

5. **Asynchronous Processing**: The image generation process is handled asynchronously, ensuring that the server can handle multiple requests efficiently without blocking.

6. **Environment Configuration**: The server uses environment variables for configuration, making it easy to deploy in different environments without changing the code.

7. **Docker Containerization**: The entire application is containerized using Docker, ensuring consistency across different development and deployment environments. This also simplifies the deployment process.

8. **RESTful API Design**: The API follows RESTful principles, making it intuitive and easy to integrate with frontend applications.

9. **Error Handling**: Comprehensive error handling is implemented to ensure the API provides meaningful feedback in case of issues.

The backend is designed with scalability in mind, allowing for easy addition of new features or modifications to the image generation process. The use of Docker also ensures that the deployment process is streamlined and consistent across different environments.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
