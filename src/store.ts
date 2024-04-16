import { NewsFeed } from "./types";

export default class Store {
    private _feeds: NewsFeed[]
    private _currentPage: number
    constructor() {
        this._feeds = []
        this._currentPage = 1
    }

    get currentPage() {
        return this._currentPage
    }

    set currentPage(page: number) {
        this._currentPage = page
    }

    get feeds() {
        return this._feeds
    }

    get getNextPage(): number {
        return this._currentPage  * 10 >= this.numberOfFeed ? this._currentPage : this._currentPage + 1
    }

    get getPrevPage(): number {
        return this.currentPage > 1 ? this.currentPage -1 : 1
    }

    get numberOfFeed(): number {
        return this.feeds.length
    }

    get hasFeeds(): boolean {
        return this.feeds.length > 0
    }

    getAllFeeds(): NewsFeed[] {
        return this.feeds
    }

    getFeed(position: number): NewsFeed {
        return this.feeds[position]
    }

    setFeeds(feeds: NewsFeed[]) {
        this._feeds = feeds.map(feed => ({
            ...feed,
            read: false
        }))
    }

    makeRead(id: number) {
        const feed: NewsFeed | undefined = this.feeds.find((feed: NewsFeed) => feed.id === id)
        if(feed) {
            feed.read = true;
        }
    }
}
