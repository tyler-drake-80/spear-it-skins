// src/jobs/scheduler.js
//Schedules item refresh from Skinport every 10 minutes server is running
const cron = require("node-cron");
const { refreshItems } = require("./refreshItems.job");

function startScheduler() {
    //run once on startup
    refreshItems();

    //then every 10 minutes
    cron.schedule("*/10 * * * *", () => {
        refreshItems();
    });

    console.log("[scheduler] started: refresh every 10 minutes");
}

module.exports = { startScheduler };
