import Article from "../Article.js";

const RootRoute = (req, res) => {
    res.jsonp({ message: "Hello World!" });
};

const MainRoute = async (req, res) => {
    const article = new Article(req.params.id);
    await article.ajax_article_info();
    if (article.success) {
        article.set_file_date().finally(() => {
            res.jsonp(article.metainfo);
        });
        return;
    }
    res.statusCode = 404;
    res.jsonp({ message: "Article not found", id: article.id });
    return;
};

export { RootRoute, MainRoute };
