// src/jobs/scheduler.js

const cron = require("node-cron");
const { refreshItems } = require("./refreshItems.job");

function startScheduler() {
    console.log("[scheduler] starting...");

    // run once on startup
    refreshItems().catch((err) => {
        console.error("[scheduler] initial refresh failed:", err.message);
    });

    // then every 10 minutes
    cron.schedule("*/10 * * * *", async () => {
        try {
            await refreshItems();
        } catch (err) {
            console.error("[scheduler] scheduled refresh failed:", err.message);
        }
    });

    console.log("[scheduler] started: refresh every 10 minutes");
}

module.exports = { startScheduler };