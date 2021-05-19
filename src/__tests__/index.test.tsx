import React from 'react'
import {useLocation} from 'react-router-dom'
import Homepage from '../pages/homepage'
import {render} from '@testing-library/react'
import {mocked} from 'ts-jest/utils'

jest.mock('react-router-dom', () => ({
    __esModule: true,
    useLocation: jest.fn(),
}))
const mockedUseLocation = mocked(useLocation, true)

describe('Spotify App', () => {
    it('displays login button for anonymous users', () => {
        mockedUseLocation.mockReturnValue(
            'https://example.com/api/test?a=b&hash=12345',
        )
        const hash = useLocation()
        expect(window.localStorage['access_token']).toBeUndefined() // Localstorage access_token will be undefined by default

        // Component will render with log in button
        const {getByText} = render(<Homepage />)
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
