
export default abstract class View {
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



