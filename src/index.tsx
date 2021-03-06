import React from 'react'
import ReactDOM from 'react-dom'
import {createHook, Provider} from 'overmind-react'
import {createOvermind} from 'overmind'
import Homepage from './pages/homepage'
import {QueryClient, QueryClientProvider} from 'react-query'
import {persistQueryClient} from 'react-query/persistQueryClient-experimental'
import {createLocalStoragePersistor} from 'react-query/createLocalStoragePersistor-experimental'
import {ReactQueryDevtools} from 'react-query/devtools'
import {BrowserRouter} from 'react-router-dom'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            cacheTime: 1000 * 60 * 60 * 24, // 24 hours
        },
    },
})

const localStoragePersistor = createLocalStoragePersistor()
persistQueryClient({
    queryClient,
    persistor: localStoragePersistor,
})
const config = {
    state: {
        title: 'Spotify Trends',
    },
}

const overmind = createOvermind(config, {
    devtools: true,
})

ReactDOM.render(
    <Provider value={overmind}>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Homepage />
            </BrowserRouter>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </Provider>,
    document.getElementById('app'),
)
