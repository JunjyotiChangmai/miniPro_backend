const express = require("express");
const cors = require("cors")

const app = express();
const PORT = 3000;
app.use(cors());

app.get("/", (req, res)=> {
  res.status(200).json("Hello world");
})

app.get('/home', (req, res) => {
  res.status(200).json('Welcome, your app is working well');
});

// Endpoint to fetch data from CodeChef user profile
app.get("/codechef/:username", async (req, res) => {
  const { username } = req.params; // Get the username from the request URL
  const targetUrl = `https://www.codechef.com/users/${username}`;

  try {
    // Fetch the user's profile page from CodeChef
    const response = await fetch(targetUrl);
    if (response.ok) {
      const html = await response.text(); // Get the HTML content
      res.status(200).send(html); // Send the HTML back to the client
    } else {
      res.status(response.status).send("Error fetching data from CodeChef");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
