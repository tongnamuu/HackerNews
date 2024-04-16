import { NEWS_FEED_URL, CONTENT_URL } from "../config";
import { NewsFeed, NewsDetail } from "../types";

export class Api {
    ajax: XMLHttpRequest
    url: string

    constructor(url: string) {
        this.ajax = new XMLHttpRequest()
        this.url = url
    }

    async request<AjaxResponse>(): Promise<AjaxResponse> {
        const response = await fetch(this.url)
        return await response.json() as AjaxResponse
    }
}

export class NewsFeedApi extends Api {
    constructor(url: string) {
        super(url)
    }
    async getData(): Promise<NewsFeed[]> {
        return this.request<NewsFeed[]>();
    }
}

export class NewsDetailApi extends Api {
    constructor(url: string) {
        super(url)
    }
    async getData(): Promise<NewsDetail>  {
        return this.request<NewsDetail>();
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

export interface NewsFeedApi extends Api { }
export interface NewsDetailApi extends Api { }

applyMixin(NewsFeedApi, [Api])
applyMixin(NewsDetailApi, [Api])