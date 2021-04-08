[![Build Status](https://travis-ci.com/josterholt/spotify-trends.svg?branch=main)](https://travis-ci.com/josterholt/spotify-trends)
[![Netlify Status](https://api.netlify.com/api/v1/badges/75edf018-f74c-4d99-919a-6a584c5f1089/deploy-status)](https://app.netlify.com/sites/josterholt-spotify-trends/deploys)

# Spotify Trends

Static site that uses the Spotify Web API to pull a Spotify user's most listened
songs.

This is all client side (in the browser).

Spotify supports three time ranges (roughly): 4 weeks, 6 months, and several
years.

# Usage

## Logging In

1. Click on login button
2. Click "Agree" to Spotify access page

After this the user will be back to the React app and should see tracks they've
listened to.

## Time Range Selection

There is a dropdown to select the time ranges.

**Note:** This app uses [react-query](https://react-query.tanstack.com/) to
cache AJAX requests so the Spotify API isn't getting hammered.
