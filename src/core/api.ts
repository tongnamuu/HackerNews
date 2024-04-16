import { NEWS_FEED_URL, CONTENT_URL } from "../config";
import { NewsFeed, NewsDetail } from "../types";

export class Api {
    getRequest<AjaxResponse>(url: string): AjaxResponse {
        const ajax = new XMLHttpRequest()
        ajax.open('GET', url, false)
        ajax.send()
        return JSON.parse(ajax.response)
    }
}

export class NewsFeedApi {
    getData(): NewsFeed[] {
        return this.getRequest<NewsFeed[]>(NEWS_FEED_URL);
    }
}

export class NewsDetailApi {
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

export interface NewsFeedApi extends Api { }
export interface NewsDetailApi extends Api { }

applyMixin(NewsFeedApi, [Api])
applyMixin(NewsDetailApi, [Api])