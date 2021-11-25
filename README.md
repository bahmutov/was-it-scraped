# was-it-scraped
> Tracking scraped resources using an external database

## Install

```shell
$ npm i was-it-scraped
```

## Use

Requires `SUPABASE_URL` and `SUPABASE_KEY` to connect to a [Supabase](https://supabase.com/) instance.

```js
const {markScraped, wasScraped} = require('was-it-scraped')
// once you scrape a resource, mark it in the database
// it inserts a new record or updates the existing record for the URL
await markScraped(url)
// check if the resource has been previously scraped
const scraped = await wasScraped(url)
```

Marking the scraped resource always updates the timestamp. Later you can ask if the resource was scraped at all or after the given date

```js
const {markScraped, wasScrapedAfter} = require('was-it-scraped')
const needsScraping = !wasScrapedAfter(url, modifiedDate)
if (needsScraping) {
  // scrape the URL
  await markScraped(url)
}
```
