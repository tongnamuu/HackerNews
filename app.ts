const NEWS_FEED_URL: string = 'https://api.hnpwa.com/v0/news/1.json'
const CONTENT_URL: string = 'https://api.hnpwa.com/v0/item/@id.json'
const content: HTMLElement = document.createElement("div")
const container: HTMLElement = document.getElementById("root")!

const ul = document.createElement('ul');
container!.appendChild(ul)
container!.appendChild(content)


interface NewsCommon {
    readonly id: number;
    time_ago: string;
    readonly title: string;
    url: string;
    readonly user: string;
    content: string
}

interface NewsDetail extends NewsCommon {
    comments: NewsComment[];
}

interface NewsComment extends NewsCommon {
    comments: NewsComment[];
    level: number;
}

interface NewsFeed extends NewsCommon {
    comments_count: number;
    points: number;
    read?: boolean
}

interface Store {
    currentPage: number;
    feeds: NewsFeed[];
}

const store: Store = {
    currentPage: 1,
    feeds: [],
}

class Api {
    getRequest<AjaxResponse>(url: string): AjaxResponse {
        const ajax = new XMLHttpRequest()
        ajax.open('GET', url, false)
        ajax.send()
        return JSON.parse(ajax.response)
    }
}

class NewsFeedApi {
    getData(): NewsFeed[] {
        return this.getRequest<NewsFeed[]>(NEWS_FEED_URL);
    }
}

class NewsDetailApi {
    getData(id: string): NewsDetail {
        return this.getRequest<NewsDetail>(CONTENT_URL.replace('@id', id));
    }
}

function applyMixin(targetClass: any, baseClasses: any[]): void {
    baseClasses.forEach(baseClass => {
        Object.getOwnPropertyNames(baseClass.prototype).forEach(name => {
            const descriptor = Object.getOwnPropertyDescriptor(baseClass.prototype, name)
            if (descriptor) {
                Object.defineProperty(targetClass.prototype, name, descriptor)
            }
        })
    })
}

interface NewsFeedApi extends Api { }
interface NewsDetailApi extends Api { }

applyMixin(NewsFeedApi, [Api])
applyMixin(NewsDetailApi, [Api])



abstract class View {
    private container: HTMLElement
    private template: string
    private renderTemplate: string
    private htmlList: string[]
    constructor(containerId: string, template: string) {
        this.container = document.getElementById(containerId)!
        this.template = template
        this.renderTemplate = template
        this.htmlList = []
    }
    protected updateView() {
        this.container.innerHTML = this.renderTemplate
        this.renderTemplate = this.template
    }

    protected addHtml(html: string) {
        this.htmlList.push(html)
    }

    protected getHtml() {
        const result = this.htmlList.join('')
        this.clearHtmlList()
        return result
    }

    protected setTemplateData(key: string, value: string) {
        this.renderTemplate = this.renderTemplate.replace(key, value)
    }

    private clearHtmlList() {
        this.htmlList = []
    }

    abstract render(): void
}


class NewsFeedView extends View {
    api: NewsFeedApi
    newsFeed: NewsFeed[]
    constructor(containerId: string) {
        let template = `
            <div class="container mx-auto p-4">
                <h1>Hacker News</h1>
                <ul>
                    {{__news_feed__}}
                </ul>
                <div>
                    <a href='#/page/{{__prev_page__}}'>이전페이지</a>
                    <a href='#/page/{{__next_page__}}'>다음페이지</a>
                </div>
            </div>
        `
        super(containerId, template)
        this.api = new NewsFeedApi()
        this.newsFeed = store.feeds
        if (this.newsFeed.length === 0) {
            this.newsFeed = store.feeds = this.api.getData()
            this.makeFeeds();
        }
    }


    render() {
        store.currentPage = Number(location.hash.substring(7) || 1)
        for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
            this.addHtml(
                `
                <li class="${this.newsFeed[i].read ? 'bg-green-100' : 'bg-white'}">
                <a href="#/show/${this.newsFeed[i].id}">
                ${this.newsFeed[i].title}  ${this.newsFeed[i].comments_count}
                </a
                </li>
            `
            )
        }
        this.setTemplateData('{{__news_feed__}}', this.getHtml())
        this.setTemplateData('{{__prev_page__}}', store.currentPage > 1 ? String(store.currentPage - 1) : String(1))
        this.setTemplateData('{{__next_page__}}', store.currentPage * 10 >= this.newsFeed.length ? String(store.currentPage) : String(store.currentPage + 1))
        this.updateView()
    }

    private makeFeeds() {
        for (let i = 0; i < this.newsFeed.length; i++) {
            this.newsFeed[i].read = false
        }
    }
}


class NewsDetailView extends View {
    constructor(containerId: string) {
        let template =
            `
    <h1 class="text-red-400">{{__newsContent__title__}}</h1>
    <div>
        {{__newsContent__content__}}
    </div>
    {{__comments__}}

    <div>
      <a href="#/page/{{__store__currentPage__}}">목록으로</a>
    </div>

  `
        super(containerId, template)
    }

    render() {
        const id = location.hash.substring(7)
        const api = new NewsDetailApi()
        const newsContent = api.getData(id);
        for (let i = 0; i < store.feeds.length; i++) {
            if (store.feeds[i].id === Number(id)) {
                store.feeds[i].read = true;
                break
            }
        }
        this.setTemplateData('{{__comments__}}', this.makeComment(newsContent.comments, 1))
        this.setTemplateData('{{__newsContent__title__}}', newsContent.title)
        this.setTemplateData('{{__newsContent__content__}}', newsContent.content)
        this.setTemplateData('{{__store__currentPage__}}', String(store.currentPage))
        this.updateView();
    }

    private makeComment(comments: NewsComment[], depth: number): string {
        for (let i = 0; i < comments.length; i++) {
            this.addHtml(`
        <div style="padding-left:${depth * 40}px;">
        <div class="text-gray-400">
          <strong>${comments[i].user}</strong>${comments[i].time_ago}
        </div>
        ${comments[i].content}
        </div>
        `)
            if (comments[i].comments.length > 0) {
                this.addHtml(this.makeComment(comments[i].comments, depth + 1))
            }
        }
        return this.getHtml()
    }
}

interface RouterInfo {
    path: string;
    page: View;
}

class Router {
    routeTable: RouterInfo[]
    defaultRoute: RouterInfo | null
    constructor() {
        const routePath = location.hash;
        window.addEventListener('hashchange', this.route.bind(this))
        this.routeTable = []
        this.defaultRoute = null
    }

    setDefaultPage(page: View) {
        this.defaultRoute = {path: '', page}
    }

    addRouterPath(path: string, view: View) {
        this.routeTable.push({path, page: view})
    }

    route() {
        const routePath = location.hash;
        if(routePath === '') {
            if(this.defaultRoute) {
                this.defaultRoute.page.render()
            }
        }

        for(const routeInfo of this.routeTable) {
            if(routePath.indexOf(routeInfo.path) >= 0) {
                routeInfo.page.render();
                break;
            }
        }
    }
}

const router: Router = new Router()
const newsFeedView = new NewsFeedView('root')
const newsDetailView = new NewsDetailView('root')

router.addRouterPath('/page/', newsFeedView)
router.addRouterPath('/show/', newsDetailView)
router.setDefaultPage(newsFeedView)
router.route()
