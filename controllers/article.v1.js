import Article from "../Article.js";
import MarkdownIt from "markdown-it";
import axios from "axios";

const RootRoute =  (req, res) => {
    res.render( "hello", {});
};

const MainRoute = async (req, res) => {
    const article = new Article(req.params.id);
    await article.ajax_article_info();
    if( article.success ) {
        article.set_file_date().finally( () => {
            const metainfo = article.metainfo;
            const render_article = ( url = "" ) =>
            {
                const MDParser = new MarkdownIt();
                return new Promise( (resolve, reject) =>
                {
                    axios.get( url ).then( ({ data }) => {
                        try  { resolve( MDParser.render(data) ); }
                        catch (error)  { reject( error ); }
                    }).catch( ( error ) => reject( error ) );
                });
                // axios.get( metainfo.file ).then( ({ data }) => {
                //     const content = data;
                //     res.render( "article", { metainfo, content });
                // })
            };
            render_article( metainfo.file ).then( ( content ) => {
                res.render( "article", { metainfo, content });
            }).catch( (content) => res.render( "article", { metainfo, content }) );
        });
        return;
    }
    res.render( "404", {});
    return;
};

export { RootRoute, MainRoute };
