import View from "../core/view";

export interface NewsCommon {
    readonly id: number;
    time_ago: string;
    readonly title: string;
    url: string;
    readonly user: string;
    content: string
}

export interface NewsDetail extends NewsCommon {
    comments: NewsComment[];
}

export interface NewsComment extends NewsCommon {
    comments: NewsComment[];
    level: number;
}

export interface NewsFeed extends NewsCommon {
    comments_count: number;
    points: number;
    read?: boolean
}

export interface Store {
    currentPage: number;
    feeds: NewsFeed[];
}


export interface RouterInfo {
    path: string;
    page: View;
}
