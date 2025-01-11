const express = require("express");
const cors = require("cors");
const jsdom = require("jsdom");
const dotenv = require("dotenv");

const app = express();
const { JSDOM } = jsdom;
dotenv.config();
app.use(cors());

app.get("/", (req, res)=> {
  res.status(200).json("6th Sem MiniPro...");
})

// CodeChef user profile
app.get("/codechef/:username", async (req, res) => {
  const { username } = req.params;
  const targetUrl = `https://www.codechef.com/users/${username}`;
  const codechefAPI = `https://codechef-api.vercel.app/handle/${username}`;

  try {
    const response = await fetch(targetUrl);
    const CCProfile = await fetch(codechefAPI).then(response => response.json()).then(data => data);
    
    if (response.ok) {
      const d = await response.text(); 
      const data = { data: d };
      const dom = new JSDOM(data.data);
      const document = dom.window.document;

      const problemSolvedElement = document.querySelector('.rating-data-section.problems-solved').lastElementChild;
      const totalProb = problemSolvedElement.innerHTML.split(" ")[3];
      
      const newData = {
          problemSolve: parseInt(totalProb),
      };

      const codeChefUserData = { ...newData, ...CCProfile };

      res.status(200).json(codeChefUserData);
    } 
    else {
      res.status(response.status).send("Error fetching data from CodeChef");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
