// @ts-check
const { createClient } = require('@supabase/supabase-js')

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
 * @type {'post'|'video'|'presentation'} Scraped resource type
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

module.exports = { markScraped, wasScraped, wasScrapedAfter }
