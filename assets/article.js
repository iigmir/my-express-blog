const categories_panel_dom = document.getElementById("categories-panel");

const get_categories = () => {
    return new Promise( (resolve, reject) => {
        const ajax = fetch("https://raw.githubusercontent.com/iigmir/blog-source/master/info-files/categories.json").then( r => r.json() );
        ajax.then( (data) => resolve(data) ).catch( (error) => reject(error) );
    });
};

get_categories().then( (categories = []) => {
    const render_html = ({ id, tag_name }) => `<span class="ts-badge" data-tag-id=${id}>${tag_name}</span>`;
    const category_id = categories_panel_dom.dataset.categoryId.split(",").map( id => parseInt(id, 10) );
    const id_included = ({ id }) => category_id.includes(id);
    const article_categories = categories.filter( id_included );
    const html = article_categories.map( render_html ).join(" ");
    categories_panel_dom.innerHTML = html;
});
