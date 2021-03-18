export function rendererHtml(html: string, rootElement: HTMLElement) {
    console.log("Hello Tiny React.")
    rootElement.innerHTML = html;
}