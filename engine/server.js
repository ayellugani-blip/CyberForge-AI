const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analyze", (req, res) => {
    const password = req.body.password;
    if (!password) return res.status(400).json({ error: "Password required" });

    // Pass password via stdin for security
    const py = spawn("python", ["analyzer.py"]);

    let data = "";
    let error = "";

    py.stdout.on("data", chunk => data += chunk);
    py.stderr.on("data", chunk => error += chunk);

    py.on("close", (code) => {
        if (code !== 0) {
            console.error(`Python error: ${error}`);
            return res.status(500).json({ error: "Security engine error" });
        }
        try {
            res.json(JSON.parse(data));
        } catch (e) {
            res.status(500).json({ error: "Failed to parse analysis" });
        }
    });

    py.stdin.write(password);
    py.stdin.end();
});

app.listen(5000, () => console.log("Security engine running"));