import * as React from 'react'
import {QueryClient, QueryClientProvider} from 'react-query'
import {persistQueryClient} from 'react-query/persistQueryClient-experimental'
import {createLocalStoragePersistor} from 'react-query/createLocalStoragePersistor-experimental'
import {useLocation} from 'react-router-dom'
import Homepage from '../pages/homepage'
import {render} from '@testing-library/react'
import {mocked} from 'ts-jest/utils'

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        hash: 'example.com/api/test?a=b&hash=12345',
    }),
}))

describe('Spotify App', () => {
    it('displays login button for anonymous users', () => {
        const hash = useLocation()
        expect(window.localStorage['access_token']).toBeUndefined() // Localstorage access_token will be undefined by default

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

        // Component will render with log in button
        const {getByText} = render(
            <QueryClientProvider client={queryClient}>
                <Homepage />
            </QueryClientProvider>,
        )
    })
    it.todo('displayed name for logged in user')

    it.todo('displays log out link for logged in user')
    it.todo('navigates to second page on click of right pagination arrow')
    it.todo('navigates from second to first page on click of left pagination')

    it.todo('will list tracks')
    it.todo('gracefully displays no tracks')

    it.todo('plays track on click of album image')

    it.todo(
        'displays appropriate tracks in correct order when short range is selected',
    )
    it.todo('will play on appropriate device after change of selected device')

    it.todo('logs user out when log out link is clicked')

    it.todo(
        'only calls Spotify API once when tracks are queried multiple times',
    )
})
