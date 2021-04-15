export function extractAndStoreAccessToken(hash: string) {
    let accessToken = null
    const hashPieces = hash
        .substring(1)
        .split('&')
        .reduce(function (initial: any, item: any) {
            if (item) {
                var parts = item.split('=')
                initial[parts[0]] = decodeURIComponent(parts[1])
            }
            return initial
        }, {})

    if ('access_token' in hashPieces) {
        accessToken = hashPieces['access_token']
        localStorage['access_token'] = accessToken
    }
    return accessToken
}

export function clearAccessToken() {
    localStorage.removeItem('access_token')
}

export function clearQueryString() {
    window.history.pushState({}, '', '/')
}

export function getAccessToken() {
    let accessToken = localStorage['access_token'] || null
    return accessToken
}
