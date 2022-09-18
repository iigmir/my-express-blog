import Article from "../Article.js";
import { strictEqual, deepStrictEqual } from "assert";

describe( "Article", () =>
{
    describe( "ID", () =>
    {
        it( "should get 0 if ID invalid", () =>
        {
            const article = new Article("foobar2000");
            strictEqual( article.id, 0 );
        });
    });
    describe( "ID#1", () =>
    {
        it( "should has a viild ID", () =>
        {
            const article = new Article("1");
            strictEqual( article.id, 1 );
        });
        it( "should has a metadata", (done) =>
        {
            const article = new Article("1");
            article.ajax_article_info().then( () => {
                deepStrictEqual( article.metainfo, {
                    "file": "https://raw.githubusercontent.com/iigmir/blog-source/master/articles/001.md",
                    "id": 1,
                    "title": "Hello World",
                    "created_at": "2017-12-19T10:45:49Z",
                    "updated_at": "2017-12-19T10:45:49Z",
                    "category_id": [54],
                    "language": "en-GB"
                });
                done();
            });
        });
    });
});
