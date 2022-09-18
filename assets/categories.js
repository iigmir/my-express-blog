const { createApp, ref, computed } = Vue;

/**
 * Request articles and categories.
 * @returns {Promise}
 */
const AjaxRequests = () => {
    const get_articles = () => {
        return new Promise((resolve, reject) => {
            const ajax = fetch("https://raw.githubusercontent.com/iigmir/blog-source/master/info-files/articles.json").then(r => r.json());
            ajax.then((data) => resolve(data)).catch((error) => reject(error));
        });
    };
    const get_categories = () => {
        return new Promise((resolve, reject) => {
            const ajax = fetch("https://raw.githubusercontent.com/iigmir/blog-source/master/info-files/categories.json").then(r => r.json());
            ajax.then((data) => resolve(data)).catch((error) => reject(error));
        });
    };
    return Promise.all([get_articles(), get_categories()]);
}

const ArticleLink = {
    template: "#article-link",
    props: [
        "id",
        "title",
        "created_at",
        "updated_at",
        "category_id",
        "language"
    ],
    computed: {
        href() {
            return `/article/${this.id}`;
        }
    },
};

const ArticleModal = {
    template: "#article-modal",
    components: {
        ArticleLink: ArticleLink,
    },
    props: {
        articles: {
            type: Array,
            default: () => ([])
        },
        tagId: {
            type: Number,
            default: -1
        },
        tagName: {
            type: String,
            default: ""
        },
    },
    emits: ["close"],
    setup(props) {
        const modal_class = computed( () => ({
            "ts-modal": true,
            "is-large": true,
            "is-visible": props.tagId > -1,
        }) );
        const current_articles = computed( () => {
            const cb = ({ category_id }) => category_id.includes(props.tagId);
            return props.articles.filter( cb );
        });
        return {
            modal_class,
            current_articles
        };
    },
};

createApp({
    name: "App",
    components: {
        ArticleModal: ArticleModal,
    },
    setup() {
        // Datas
        const tagId = ref(-1);
        const tagName = ref("");
        const articles = ref([]);
        const categories = ref([]);
        // Functions
        const set_tag = (id = -1, name = "") => {
            tagId.value = id;
            tagName.value = name;
        };
        const set_model = (e) => {
            const dom = e.target;
            set_tag( parseInt(dom.dataset.tagId, 10), dom.innerText );
        };
        const close_modal = () => {
            set_tag(-1, "");
        };
        // AJAX
        AjaxRequests().then(([a, c]) => {
            articles.value = a;
            categories.value = c;
        });
        return {
            // Datas
            tagId,
            tagName,
            articles,
            categories,
            // Functions
            set_model,
            close_modal
        };
    },
}).mount("#app");
