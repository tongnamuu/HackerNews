import { NEWS_FEED_URL } from "../config"
import { NewsFeedApi } from "../core/api"
import View from "../core/view"
import Store from "../store"
import { NewsFeed } from "../types"

export default class NewsFeedView extends View {
    private api: NewsFeedApi
    private store: Store
    constructor(containerId: string, store: Store) {
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
        this.api = new NewsFeedApi(NEWS_FEED_URL)
        this.store = store
    }


    async render(): Promise<void> {
       
        if (this.store.feeds.length === 0) {
            const feeds = await this.api.getData()
            this.store.setFeeds(feeds) 
            this.renderView()
        }
        this.renderView()
    }

    renderView = () => {
        console.log("renderview " + this.store.feeds)
        this.store.currentPage = Number(location.hash.substring(7) || 1)
        for (let i = (this.store.currentPage - 1) * 10; i < this.store.currentPage * 10; i++) {
            const feed = this.store.feeds[i];
            this.addHtml(
                `
                <li class="${feed.read ? 'bg-green-100' : 'bg-white'}">
                <a href="#/show/${feed.id}">
                ${feed.title}  ${feed.comments_count}
                </a
                </li>
            `
            )
        }
        this.setTemplateData('{{__news_feed__}}', this.getHtml())
        this.setTemplateData('{{__prev_page__}}', String(this.store.getPrevPage))
        this.setTemplateData('{{__next_page__}}', String(this.store.getNextPage))
        this.updateView()
    }
}
