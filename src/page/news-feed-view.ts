import { NewsFeedApi } from "../core/api"
import View from "../core/view"
import { NewsFeed } from "../types"

export default class NewsFeedView extends View {
    private api: NewsFeedApi
    private newsFeed: NewsFeed[]
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
        this.newsFeed = window.store.feeds
        if (this.newsFeed.length === 0) {
            this.newsFeed = window.store.feeds = this.api.getData()
            this.makeFeeds();
        }
    }


    render() {
        window.store.currentPage = Number(location.hash.substring(7) || 1)
        for (let i = (window.store.currentPage - 1) * 10; i < window.store.currentPage * 10; i++) {
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
        this.setTemplateData('{{__prev_page__}}', window.store.currentPage > 1 ? String(window.store.currentPage - 1) : String(1))
        this.setTemplateData('{{__next_page__}}', window.store.currentPage * 10 >= this.newsFeed.length ? String(window.store.currentPage) : String(window.store.currentPage + 1))
        this.updateView()
    }

    private makeFeeds() {
        for (let i = 0; i < this.newsFeed.length; i++) {
            this.newsFeed[i].read = false
        }
    }
}
