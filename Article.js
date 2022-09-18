import axios from "axios";

class Article {
    id = 0;
    article_info = {};
    success = false;
    constructor(id)
    {
        this.init_article(id);
    }
    /**
     * Is the Article ID invalid?
     * @return {Boolean} true if invalid
     */
    get id_invalid()
    {
        return this.id < 1 || isNaN( this.id );
    }
    get markdown_file_path()
    {
        const article_id = String(this.id).padStart(3, "0");
        return `/articles/${article_id}.md`;
    }
    /**
     * Article URL
     */
    get markdown_file()
    {
        return `https://raw.githubusercontent.com/iigmir/blog-source/master${this.markdown_file_path}`;
    }
    /**
     * @return {Object}
     */
    get metainfo()
    {
        return {
            file: this.markdown_file,
            ...this.article_info
        };
    }
    /**
     * Set article number
     * @param {String} id 
     */
    init_article(id = "0")
    {
        const i = parseInt(id, 10);
        this.id = isNaN(i) ? 0 : i;
    }
    async ajax_article_info()
    {
        const api = await axios.get("https://github.com/iigmir/blog-source/raw/master/info-files/articles.json");
        this.set_article_info_by_array( api.data );
    }
    set_article_info_by_array(input = [])
    {
        const result = input.filter( its => its.id === this.id );
        this.success = result.length > 0;
        if( this.success )
        {
            this.article_info = result[0];
        }
    }
    /**
     * Set date if date inexisted in article_info
     * @returns {void}
     */
    async set_file_date()
    {   // Info detect
        const ajax_date = async (path) => {
            const has_date_info = "updated_at" in this.article_info && "created_at" in this.article_info;
            if( has_date_info )
            {
                return Promise.resolve({
                    created_at: this.article_info.created_at,
                    updated_at: this.article_info.updated_at,
                });
            }
            const { data } = await axios.get(`https://api.github.com/repos/iigmir/blog-source/commits?path=${path}`);
            const first_item = data[0];
            const last_item = data[data.length - 1];
            // For error handling
            const api_error = typeof (first_item) === "undefined" || typeof (last_item) === "undefined";
            if (api_error)
            {
                return Promise.reject({
                    created_at: last_item,
                    updated_at: first_item,
                });
            }
            return Promise.resolve({
                created_at: last_item.commit.author.date,
                updated_at: first_item.commit.author.date,
            });
        };
        /**
         * The AJAX call
         * @param {Promise.resolve} resolve 
         * @param {Promise.reject} reject 
         */
        const ajax = async (resolve, reject) => {
            const ajax = await ajax_date(this.markdown_file_path);
            this.article_info.created_at = ajax.created_at;
            this.article_info.updated_at = ajax.updated_at;
            resolve();
        }
        return new Promise( ajax );
    }
}

export default Article;
