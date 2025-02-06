import ngrok from "ngrok";
import { exec } from "child_process";

// Start the local Node.js server
const startServer = exec("node server.js"); // Make sure this matches your server file name

startServer.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

startServer.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
});

startServer.on("close", (code) => {
  console.log(`Server process exited with code ${code}`);
});

// Start ngrok to expose your local server
(async function () {
  const url = await ngrok.connect(8000); // Connect ngrok to the local port
  console.log(`Server is publicly accessible at: ${url}`);
})();
