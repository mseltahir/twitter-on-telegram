require("dotenv").config();
const axios = require("axios").default;

axios({
    url: "https://api.twitter.com/2/users/by/username/nodejs",
    headers: { Authorization: `Bearer ${process.env.BEARER_TOKEN}` },
}).then((res) => console.log(res));
