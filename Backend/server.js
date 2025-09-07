const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// WHO API Example 1: Life Expectancy
app.get("/who/life-expectancy", async (req, res) => {
  try {
    const response = await axios.get("https://ghoapi.azureedge.net/api/WHOSIS_000001");
    const data = response.data.value;

    res.json({
      message: "Life Expectancy Data (sample 5):",
      records: data.slice(0, 5)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch WHO data" });
  }
});

// WHO API Example 2: Anaemia Data
app.get("/who/anaemia", async (req, res) => {
  try {
    const response = await axios.get("https://ghoapi.azureedge.net/api/SDGSH_ANAEMIA");
    const data = response.data.value;

    res.json({
      message: "Anaemia Data (sample 5):",
      records: data.slice(0, 5)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch WHO data" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
