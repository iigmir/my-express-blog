import express from "express";
import ApiRoutes from "./routes/api.v1.js";
import ArticleRoutes from "./routes/article.v1.js";

const app = express();
// const VERSION = "v1";
const port = 9874;

app.set( "view engine", "ejs" );

app.use( "/api", ApiRoutes );
app.use( "/article", ArticleRoutes );
app.use( "/assets", express.static("assets") );
app.use( "/favicon.ico", express.static("assets/favicon.ico") );

app.get( `/categories`, async (req, res) => {
    res.render( "categories", {});
    return;
});

app.use( "/", (req, res) => { res.redirect(`/article`) } );

app.listen(port, () => {
    console.log(`Example app listening on port http://127.0.0.1:${port}`);
});

export default app;
