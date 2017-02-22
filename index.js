const getTocElements = require('./lib/get_toc_elements')
const serializeElements = require('./lib/serialize_elements')
const { green } = require('chalk')
const log = (label, obj) => {
  const args = [ green(label) ]
  if (obj) args.push(obj)
  console.log.apply(null, args)
}

const pkg = require('./package.json')
const port = 5432

const feeds = {
  'project-chat': {
    title: 'Wikidata Project chat',
    site_url: 'https://www.wikidata.org/wiki/Wikidata:Project_chat'
  },
  'books-project': {
    title: 'Books WikiProject',
    site_url: 'https://www.wikidata.org/wiki/Wikidata_talk:WikiProject_Books'
  }
}

const app = require('express')()

app.get('/', function (req, res) {
  log('query', req.query)
  const { feed } = req.query
  const data = feeds[feed]
  if (!data) return res.status(400).send('unknown feed')
  getTocElements(data.site_url)
  .then(serializeElements(data))
  .then(res.send.bind(res))
  .catch(err => res.status(500).send(err.stack))
})

app.listen(port, () => log(`${pkg.name} started on port ${port}!`))