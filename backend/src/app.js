// src/app.js
//Express app 
//Keeps app wiring (middleware + routes + error handling) seperate from server boot.
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const healthRoutes = require("./routes/health.routes");
const itemsRoutes = require("./routes/items.routes");

function createApp() {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(morgan("dev"));

    app.get("/", (req, res) => {
        res.json({ ok: true, service: "spear-it-skins-backend" });
    });

    app.use("/api/v1", healthRoutes);
    app.use("/api/v1", itemsRoutes);

    //basic error handler
    //eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    });

    return app;
}

module.exports = { createApp };
