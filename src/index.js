// @ts-check
const { createClient } = require('@supabase/supabase-js')
// @ts-ignore
const _ = require('lodash')

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Please set SUPABASE_URL and SUPABASE_KEY environment variables',
  )
}
const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * @type {'post'|'video'|'presentation'|'lesson'} Scraped resource type
 */
const scrapedType = 'post'

const TABLE_NAME = 'scraped'

function checkForErrors(response) {
  const { data, error } = response
  if (error) {
    console.error(error)
    throw error
  }
  return data
}

function printData(response) {
  const { data, error } = response
  if (error) {
    console.error(error)
    throw error
  }
  console.table(data)
  return data
}

function getAllItems() {
  return supabase.from(TABLE_NAME).select('*').then(printData)
}

function getOneItem(url) {
  return supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('url', url)
    .then(checkForErrors)
    .then((data) => data[0])
}

/**
 * Marks a given URL scraped and entered into the search index.
 * @param {string} url
 */
function markScraped(url, type = scrapedType) {
  const row = { url, type }
  return getOneItem(url).then((item) => {
    if (item) {
      row.id = item.id
      row.type = item.type
    }

    // we turned the MODDATETIME extension to automatically update the scraped at field
    return supabase.from(TABLE_NAME).upsert(row).then(printData)
  })
}

function wasScraped(url) {
  return getOneItem(url)
    .then(Boolean)
    .then((scraped) => {
      console.log('%s %s', scraped ? '✅ scraped' : '⭕️ not scraped', url)
      return scraped
    })
}

/**
 * Checks if the given URL was scraped after the given date
 * @param {String} url Scraped resource url
 * @param {Date} date Date to check against
 * @returns Promise<Boolean>
 */
function wasScrapedAfter(url, date) {
  return getOneItem(url).then((item) => {
    if (!item) {
      console.log('⏳ not scraped at all %s', url)
      return false
    }
    console.log('scraped at %s', item.scraped_at)
    const scrapedAt = new Date(item.scraped_at)
    console.log('scraped at %s against %s', scrapedAt, date)
    const scrapedAfter = scrapedAt > date
    console.log('%s %s', scrapedAfter ? '✅ scraped' : '⭕️ not scraped', url)
    return scrapedAfter
  })
}

/**
 * Goes through the list of items. For each one, gets the modified date
 * and asks the "wasScrapedAfter" if the item should be scraped.
 * Returns a list of items to be scraped.
 * @param {any[]} items List of items to check
 * @param {string} modifiedProperty Property name inside each item that is a timestamp or a string date
 * @param {string} urlProperty URL of the item to be scraped
 */
async function filterToScrape(items, modifiedProperty, urlProperty) {
  const results = []
  for (const item of items) {
    const modifiedValue = _.get(item, modifiedProperty)
    const modified = _.isDate(modifiedValue)
      ? modifiedValue
      : new Date(modifiedValue)
    const itemUrl = _.get(item, urlProperty)
    const scraped = await wasScrapedAfter(itemUrl, modified)
    if (!scraped) {
      results.push(item)
    }
  }

  // return the list of items to be scraped
  return results
}

module.exports = { markScraped, wasScraped, wasScrapedAfter, filterToScrape }
