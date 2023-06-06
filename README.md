# was-it-scraped

> Tracking scraped resources using an external database

## Install

```shell
$ npm i was-it-scraped
```

## Use

Requires `SUPABASE_URL` and `SUPABASE_KEY` to connect to a [Supabase](https://supabase.com/) instance.

```js
const { markScraped, wasScraped } = require('was-it-scraped')
// once you scrape a resource, mark it in the database
// it inserts a new record or updates the existing record for the URL
await markScraped(url)
// check if the resource has been previously scraped
const scraped = await wasScraped(url)
```

Marking the scraped resource always updates the timestamp. Later you can ask if the resource was scraped at all or after the given date

```js
const { markScraped, wasScrapedAfter } = require('was-it-scraped')
const needsScraping = !wasScrapedAfter(url, modifiedDate)
if (needsScraping) {
  // scrape the URL
  await markScraped(url)
}
```

### filterToScrape

Checks the list of items if some need scraping. Each item needs to have a property with the modified timestamp and URL to scrape. Yields the list of items that need to be scraped.

```js
const toScrape = await filterToScrape(items, 'updatedAt', 'url')
```

**Tip:** the property could be nested

```js
const toScrape = await filterToScrape(items, 'meta.updatedAt', 'meta.web.url')
```

## Small print

Author: Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt; &copy; 2022

- [@bahmutov](https://twitter.com/bahmutov)
- [glebbahmutov.com](https://glebbahmutov.com)
- [blog](https://glebbahmutov.com/blog)
- [videos](https://www.youtube.com/glebbahmutov)
- [presentations](https://slides.com/bahmutov)
- [cypress.tips](https://cypress.tips)
- [Cypress Advent 2021](https://cypresstips.substack.com/)

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/was-it-scraped/issues) on Github

## MIT License

Copyright (c) 2022 Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt;

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
