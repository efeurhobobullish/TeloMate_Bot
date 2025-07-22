const axios = require('axios');

// Function to calculate and format uptime
const runtime = (seconds) => {
    seconds = Math.floor(seconds);
    const d = Math.floor(seconds / (24 * 60 * 60));
    seconds %= 24 * 60 * 60;
    const h = Math.floor(seconds / (60 * 60));
    seconds %= 60 * 60;
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);

    if (d > 0) return `${d}d ${h}h ${m}m ${s}s`;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
};
// Delay execution for a specified time
const sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

// Fetch JSON from a URL
const fetchJson = async (url, options) => {
    try {
        options = options || {};
        const res = await axios({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
            },
            ...options
        });
        return res.data;
    } catch (err) {
        console.error(err);
        return null;
    }
};

module.exports = { 
    runtime,
    fetchJson,
    sleep
};
