require("dotenv").config();

const { createApp } = require("./app");
const { startScheduler } = require("./jobs/scheduler");

const PORT = process.env.PORT || 4000;

const app = createApp();

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
    startScheduler();
});
