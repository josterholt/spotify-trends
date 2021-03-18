export function getHash() {
    return window.location.hash
    .substring(1)
    .split('&')
    .reduce(function (initial: any, item: any) {
        if (item) {
            var parts = item.split('=')
            initial[parts[0]] = decodeURIComponent(parts[1])
        }
        return initial
    }, {})
}
