const express = require("express");
const app = express();
const port = process.env.PORT || 8090;

app.use(express.static("public"));

app.use('/scripts', express.static(`${__dirname}/node_modules/`))

app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`));

app.listen(port, () => {
    console.log(`listening on ${port}`)
});