const fs = require('fs')
const path = require('path')

const GRAPH_ROOT = 'https://graph.microsoft.com/v1.0'
const DEFAULT_PAGE_SIZE = 200
const BATCH_SIZE = 20
const ORDER_COLUMN = 'DevHubOrder'
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const requiredEnv = (name) => {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable ${name}`)
  return value
}

const parseResponse = async (response) => {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch (_) {
    return text
  }
}

const graphError = (method, url, response, payload) => {
  const message = payload && payload.error && payload.error.message
  const detail = message || (typeof payload === 'string' ? payload : '')
  return new Error(
    `${method} ${url} failed (${response.status})${detail ? `: ${detail}` : ''}`,
  )
}

const createGraphClient = () => {
  let token
  let tokenExpiresAt = 0

  const getToken = async () => {
    if (token && Date.now() < tokenExpiresAt - 60_000) return token

    const tenantId = requiredEnv('MICROSOFT_GRAPH_TENANT_ID')
    const body = new URLSearchParams({
      client_id: requiredEnv('MICROSOFT_GRAPH_CLIENT_ID'),
      client_secret: requiredEnv('MICROSOFT_GRAPH_CLIENT_SECRET'),
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials',
    })
    const response = await fetch(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      { method: 'POST', body },
    )
    const payload = await parseResponse(response)
    if (!response.ok || !(payload && payload.access_token)) {
      throw graphError('POST', 'Microsoft identity token endpoint', response, payload)
    }

    token = payload.access_token
    tokenExpiresAt = Date.now() + Number(payload.expires_in || 3600) * 1000
    return token
  }

  const request = async (url, options = {}, attempt = 0) => {
    const absoluteUrl = /^https:\/\//i.test(url) ? url : `${GRAPH_ROOT}${url}`
    const accessToken = await getToken()
    const response = await fetch(absoluteUrl, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {}),
      },
    })
    const payload = await parseResponse(response)

    if ([429, 503, 504].includes(response.status) && attempt < 5) {
      const retryAfter = Number(response.headers.get('retry-after'))
      await sleep((retryAfter > 0 ? retryAfter * 1000 : 1000 * 2 ** attempt))
      return request(url, options, attempt + 1)
    }
    if (!response.ok) throw graphError(options.method || 'GET', absoluteUrl, response, payload)
    return payload
  }

  const allPages = async (url) => {
    const results = []
    let nextUrl = url
    while (nextUrl) {
      const page = await request(nextUrl)
      results.push(...(page.value || []))
      nextUrl = page['@odata.nextLink'] || null
    }
    return results
  }

  return { request, allPages }
}

const getSiteId = (project) =>
  project.SHAREPOINT_SITE_ID || process.env.MICROSOFT_GRAPH_SITE_ID

const requireSiteId = (project) => {
  const siteId = getSiteId(project)
  if (!siteId) {
    throw new Error(
      'Set SHAREPOINT_SITE_ID in project-config.json (or MICROSOFT_GRAPH_SITE_ID in the environment).',
    )
  }
  return siteId
}

const getGoogleSheetDefinitions = async (project, options = {}) => {
  const { google } = require('googleapis')
  const authObj = require('sfc-utils/copy/googleauth')
  const auth = await authObj.authenticate()
  const sheetsApi = google.sheets({ version: 'v4', auth })
  const configuredIds = Array.isArray(project.GOOGLE_SHEETS)
    ? project.GOOGLE_SHEETS
    : [project.GOOGLE_SHEETS || project.sheets].filter(Boolean)
  if (!configuredIds.length) {
    throw new Error('No Google spreadsheet ID is configured for this project.')
  }

  const requestedNames = Array.isArray(options.sheetNames)
    ? new Set(options.sheetNames)
    : null
  const definitions = []

  for (const spreadsheetId of configuredIds) {
    const workbook = await sheetsApi.spreadsheets.get({ spreadsheetId })
    for (const sheet of workbook.data.sheets || []) {
      const title = sheet.properties && sheet.properties.title
      if (!title || title.startsWith('_')) continue
      if (requestedNames && !requestedNames.has(title)) continue

      const quotedTitle = `'${title.replace(/'/g, "''")}'`
      const headerResponse = await sheetsApi.spreadsheets.values.get({
        spreadsheetId,
        range: `${quotedTitle}!1:1`,
        majorDimension: 'ROWS',
      })
      const headers = (headerResponse.data.values && headerResponse.data.values[0]) || []
      if (!headers.length) continue

      definitions.push({ spreadsheetId, title, headers: headers.map(String) })
    }
  }
  return definitions
}

const outputFileForSheet = (directory, title) =>
  path.join(directory, `${title.replace(/\s+/g, '_')}.sheet.json`)

const shapeForSheet = (data, headers) => {
  const isKeyed = headers.includes('key')
  const hasValue = headers.includes('value')
  if (isKeyed && hasValue) {
    return {
      shape: 'key-value',
      rows: Object.entries(data || {}).map(([key, value]) => ({ key, value })),
    }
  }
  if (isKeyed) {
    return {
      shape: 'keyed-object',
      rows: Object.values(data || {}).filter(
        (value) => value && typeof value === 'object' && !Array.isArray(value),
      ),
    }
  }
  return { shape: 'array', rows: Array.isArray(data) ? data : [] }
}

const validationFor = (validations, sheetName, header) => {
  const entry = validations && validations[sheetName] && validations[sheetName][header]
  return entry && Array.isArray(entry.options) && entry.options.length ? entry : null
}

const safeDisplayName = (value) =>
  String(value)
    .replace(/["*:<>?\\/|#%{}~&]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 255)

const listMarker = (slug, sheetName) =>
  `Managed by DevHub sheets: ${slug}/${sheetName}`.slice(0, 255)

const fieldNameFor = (index) => `DevHubField${index}`

const columnDefinition = (name, displayName, validation) => {
  if (validation) {
    return {
      name,
      displayName,
      required: false,
      choice: {
        choices: validation.options.map(String),
        allowTextEntry: true,
        displayAs: 'dropDownMenu',
      },
    }
  }
  return {
    name,
    displayName,
    required: false,
    text: { allowMultipleLines: true },
  }
}

const ensureManagedList = async (client, siteId, displayName, marker, columns) => {
  const lists = await client.allPages(
    `/sites/${siteId}/lists?$select=id,displayName,description&$top=${DEFAULT_PAGE_SIZE}`,
  )
  let list = lists.find((entry) => entry.displayName === displayName)

  if (list && list.description !== marker) {
    throw new Error(
      `A SharePoint list named "${displayName}" already exists and is not marked as DevHub-managed. Rename it or choose another project slug.`,
    )
  }

  if (!list) {
    list = await client.request(`/sites/${siteId}/lists`, {
      method: 'POST',
      body: JSON.stringify({
        displayName,
        description: marker,
        columns,
        list: { template: 'genericList' },
      }),
    })
  }

  const existingColumns = await client.allPages(
    `/sites/${siteId}/lists/${list.id}/columns?$select=name&$top=${DEFAULT_PAGE_SIZE}`,
  )
  const existingNames = new Set(existingColumns.map((column) => column.name))
  for (const column of columns) {
    if (existingNames.has(column.name)) continue
    await client.request(`/sites/${siteId}/lists/${list.id}/columns`, {
      method: 'POST',
      body: JSON.stringify(column),
    })
  }
  return list
}

const rowFields = (row, headers, fields, order) => {
  const out = { [ORDER_COLUMN]: order }
  for (const header of headers) {
    const fieldName = fields[header]
    if (!fieldName) continue
    const value = row && Object.prototype.hasOwnProperty.call(row, header)
      ? row[header]
      : ''
    out[fieldName] = value === null || typeof value === 'undefined' ? '' : String(value)
  }
  return out
}

const getExistingRows = async (client, siteId, listId) => {
  const items = await client.allPages(
    `/sites/${siteId}/lists/${listId}/items?expand=fields(select=${ORDER_COLUMN})&$top=${DEFAULT_PAGE_SIZE}`,
  )
  const byOrder = new Map()
  for (const item of items) {
    const order = Number(item.fields && item.fields[ORDER_COLUMN])
    if (Number.isFinite(order)) byOrder.set(order, item.id)
  }
  return byOrder
}

const sendBatch = async (client, requests) => {
  let pending = requests
  for (let attempt = 0; pending.length && attempt <= 5; attempt += 1) {
    const result = await client.request('/$batch', {
      method: 'POST',
      body: JSON.stringify({ requests: pending }),
    })
    const responses = new Map((result.responses || []).map((response) => [response.id, response]))
    const retry = []
    const errors = []

    for (const request of pending) {
      const response = responses.get(request.id)
      if (response && response.status >= 200 && response.status < 300) continue
      if (response && [429, 500, 502, 503, 504].includes(response.status)) {
        retry.push(request)
        continue
      }
      errors.push(
        response
          ? `${request.method} ${request.url} returned ${response.status}: ${JSON.stringify(response.body || {})}`
          : `Graph batch response omitted request ${request.id}`,
      )
    }

    if (errors.length) throw new Error(errors.slice(0, 3).join('\n'))
    if (!retry.length) return
    if (attempt === 5) throw new Error(`Graph batch still had ${retry.length} failed request(s) after retries.`)

    const retryAfter = Math.max(
      0,
      ...retry.map((request) => {
        const response = responses.get(request.id)
        return Number(response && response.headers && response.headers['Retry-After']) || 0
      }),
    )
    await sleep(retryAfter ? retryAfter * 1000 : 1000 * 2 ** attempt)
    pending = retry
  }
}

const syncRows = async (client, siteId, listId, rows, headers, fields) => {
  const existing = await getExistingRows(client, siteId, listId)
  const requests = []
  let requestId = 0

  rows.forEach((row, index) => {
    const existingId = existing.get(index)
    const url = existingId
      ? `/sites/${siteId}/lists/${listId}/items/${existingId}/fields`
      : `/sites/${siteId}/lists/${listId}/items`
    requests.push({
      id: String(requestId++),
      method: existingId ? 'PATCH' : 'POST',
      url,
      headers: { 'Content-Type': 'application/json' },
      body: existingId
        ? rowFields(row, headers, fields, index)
        : { fields: rowFields(row, headers, fields, index) },
    })
  })

  for (const [order, id] of existing.entries()) {
    if (order >= rows.length) {
      requests.push({
        id: String(requestId++),
        method: 'DELETE',
        url: `/sites/${siteId}/lists/${listId}/items/${id}`,
      })
    }
  }

  for (let index = 0; index < requests.length; index += BATCH_SIZE) {
    const batch = requests.slice(index, index + BATCH_SIZE)
    await sendBatch(client, batch)
    const finished = Math.min(index + batch.length, requests.length)
    if (finished % 1000 === 0 || finished === requests.length) {
      console.log(`  Synced ${finished}/${requests.length} SharePoint row operations`)
    }
  }
}

const migrateGoogleSheetsToSharePoint = async (
  project,
  sourceDirectory,
  { sheetNames, validations = {} } = {},
) => {
  const siteId = requireSiteId(project)
  const slug = project.PROJECT && project.PROJECT.SLUG ? project.PROJECT.SLUG : 'project'
  const definitions = await getGoogleSheetDefinitions(project, { sheetNames })
  if (!definitions.length) throw new Error('No non-hidden Google Sheets tabs with headers were found.')

  const client = createGraphClient()
  const mappings = {}

  for (const definition of definitions) {
    const filePath = outputFileForSheet(sourceDirectory, definition.title)
    let sourceData = []
    if (fs.existsSync(filePath)) {
      sourceData = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    }
    const { shape, rows } = shapeForSheet(sourceData, definition.headers)
    const headers = [...new Set(definition.headers.filter(Boolean))]
    const fields = Object.fromEntries(
      headers.map((header, index) => [header, fieldNameFor(index)]),
    )
    const columns = [
      {
        name: ORDER_COLUMN,
        displayName: ORDER_COLUMN,
        hidden: true,
        indexed: true,
        required: false,
        number: { decimalPlaces: 'none', minimum: 0 },
      },
      ...headers.map((header) =>
        columnDefinition(
          fields[header],
          header,
          validationFor(validations, definition.title, header),
        ),
      ),
    ]
    const displayName = safeDisplayName(`${slug}-${definition.title}`)
    const marker = listMarker(slug, definition.title)
    const list = await ensureManagedList(client, siteId, displayName, marker, columns)

    await syncRows(client, siteId, list.id, rows, headers, fields)
    mappings[definition.title] = {
      id: list.id,
      displayName: list.displayName,
      fields,
      shape,
      keyColumn: shape === 'array' ? null : 'key',
      valueColumn: shape === 'key-value' ? 'value' : null,
      orderColumn: ORDER_COLUMN,
    }
    console.log(`Migrated ${definition.title} -> ${displayName} (${rows.length} rows)`)
  }

  return mappings
}

const castListValue = (value) => {
  if (value === null || typeof value === 'undefined') return ''
  return typeof value === 'string' ? value : String(value)
}

const applyLanguageSwap = (row, headers, languageSwap) => {
  if (!languageSwap) return row
  const swapIndexes = []
  headers.forEach((header, index) => {
    const lastIndex = header.lastIndexOf('_')
    if (lastIndex > -1 && header.substring(lastIndex + 1).toLowerCase() === languageSwap) {
      swapIndexes.push(index - 1)
    }
  })
  const result = { ...row }
  for (const index of swapIndexes) {
    const header = headers[index]
    const translatedHeader = headers[index + 1]
    if (header && translatedHeader && row[translatedHeader]) result[header] = row[translatedHeader]
  }
  return result
}

const readListRows = async (client, siteId, listId, mapping) => {
  const orderColumn = mapping.orderColumn
  const selectedFields = [...new Set([orderColumn, ...Object.values(mapping.fields || {})])]
  const items = await client.allPages(
    `/sites/${siteId}/lists/${listId}/items?expand=fields(select=${selectedFields.join(',')})&$top=${DEFAULT_PAGE_SIZE}`,
  )
  if (orderColumn) {
    items.sort((left, right) => {
      const leftValue = Number(left.fields && left.fields[orderColumn])
      const rightValue = Number(right.fields && right.fields[orderColumn])
      const leftOrder = Number.isFinite(leftValue) ? leftValue : Number.MAX_SAFE_INTEGER
      const rightOrder = Number.isFinite(rightValue) ? rightValue : Number.MAX_SAFE_INTEGER
      return leftOrder - rightOrder
    })
  }
  return items
}

const pullSharePointSheets = async (project, directory = null, forceStr = false, options = {}) => {
  const siteId = requireSiteId(project)
  const mappings = project.SHAREPOINT_LISTS || {}
  const requestedNames = Array.isArray(options.sheetNames) ? new Set(options.sheetNames) : null
  const selected = Object.entries(mappings).filter(
    ([name]) => !requestedNames || requestedNames.has(name),
  )
  if (!selected.length) {
    throw new Error(
      'No SharePoint List mappings are configured. Run `npm run migrate:sheets-to-lists -- --apply` first and commit the updated project-config.json.',
    )
  }

  const client = createGraphClient()
  const validations = {}
  const outputDirectory = directory || 'src/data/'
  fs.mkdirSync(outputDirectory, { recursive: true })

  for (const [sheetName, mapping] of selected) {
    const items = await readListRows(client, siteId, mapping.id, mapping)
    const reverseFields = Object.fromEntries(
      Object.entries(mapping.fields || {}).map(([header, fieldName]) => [fieldName, header]),
    )
    const headers = Object.keys(mapping.fields || {})
    const rows = []

    for (const item of items) {
      const fields = item.fields || {}
      const row = {}
      for (const [fieldName, header] of Object.entries(reverseFields)) {
        if (typeof fields[fieldName] !== 'undefined') {
          row[header] = castListValue(fields[fieldName])
        }
      }
      const swapped = applyLanguageSwap(
        row,
        headers,
        project.LANGUAGE_SWAP ? project.LANGUAGE_SWAP.toLowerCase() : null,
      )
      const isBlank = !Object.values(swapped).some((value) => value && value !== 'FALSE')
      if (!isBlank) rows.push(swapped)
    }

    let output
    if (mapping.shape === 'key-value') {
      output = {}
      for (const row of rows) output[row[mapping.keyColumn || 'key']] = row[mapping.valueColumn || 'value']
    } else if (mapping.shape === 'keyed-object') {
      output = {}
      for (const row of rows) output[row[mapping.keyColumn || 'key']] = row
    } else {
      output = rows
    }

    const filePath = outputFileForSheet(outputDirectory, sheetName)
    fs.writeFileSync(filePath, JSON.stringify(output, null, 2))
    console.log(`Saved ${filePath}`)

    const choiceColumns = await client.allPages(
      `/sites/${siteId}/lists/${mapping.id}/columns?$select=name,displayName,choice&$top=${DEFAULT_PAGE_SIZE}`,
    )
    validations[sheetName] = {}
    for (const column of choiceColumns) {
      const header = reverseFields[column.name]
      const choices = column.choice && column.choice.choices
      if (header && Array.isArray(choices) && choices.length) {
        validations[sheetName][header] = { type: 'ONE_OF_LIST', options: choices }
      }
    }
  }

  return { validations, forceStr }
}

module.exports = {
  getGoogleSheetDefinitions,
  migrateGoogleSheetsToSharePoint,
  pullSharePointSheets,
}
