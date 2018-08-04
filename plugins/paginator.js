const request = require('request')
const R = require('ramda')
const axios = require('axios').default

module.exports = function(env, callback) {
  var PaginatorPage, defaults, getArticles, key, options, value
  defaults = {
    template: 'index.jade', // template that renders pages
    articles: 'articles', // directory containing contents to paginate
    first: 'index.html', // filename/url for first page
    filename: 'page/%d/index.html', // filename for rest of pages
    perPage: 2 // number of articles per page
  }

  // assign defaults any option not set in the config file
  options = env.config.paginator || {}
  for (key in defaults) {
    value = defaults[key]
    if (options[key] == null) {
      options[key] = defaults[key]
    }
  }
  const getGitHubData = async function(username, callback) {
    const MAX_PER_PAGE = 100
    const baseURL = `http://api.github.com/users/${username}`
    const params = process.env.GH_TOKEN
      ? {
          headers: {
            authorization: `bearer ${process.env.GH_TOKEN}`
          }
        }
      : {}
    const {
      data: { public_repos }
    } = await axios.get(`${baseURL}`, params)

    const pageCount = Math.ceil(public_repos / MAX_PER_PAGE)

    const requestPage = page =>
      axios.get(
        `${baseURL}/repos?per_page=${MAX_PER_PAGE}&page=${page + 1}`,
        params
      )
    const pages = await Promise.all(R.times(requestPage, pageCount))
    const repos = R.compose(
      R.reverse,
      R.sortBy(R.prop('created_at')),
      R.filter(
        R.allPass([
          R.propEq('fork', false),
          R.complement(R.propEq('description', null))
        ])
      ),
      R.chain(R.prop('data'))
    )(pages)
    const popular = R.filter(
      i => i.watchers_count + i.stargazers_count > 0,
      repos
    )
    return { repos, popular }
  }
  getArticles = function(contents, type) {
    var articles
    // helper that returns a list of articles found in *contents*
    // note that each article is assumed to have its own directory in the articles directory
    articles = contents[options.articles]._.directories.map(function(item) {
      return item.index
    })
    if (type) {
      articles = articles.filter(function(article) {
        return article.metadata.category === type
      })
    }
    articles.sort(function(a, b) {
      return b.date - a.date
    })
    return articles
  }
  PaginatorPage = class PaginatorPage extends env.plugins.Page {
    /* A page has a number and a list of articles */
    constructor(pageNum, articles1) {
      super()
      this.pageNum = pageNum
      this.articles = articles1
    }

    getFilename() {
      if (this.pageNum === 1) {
        return options.first
      } else {
        return options.filename.replace('%d', this.pageNum)
      }
    }

    getView() {
      return function(env, locals, contents, templates, callback) {
        var ctx, template
        // simple view to pass articles and pagenum to the paginator template
        // note that this function returns a funciton

        // get the pagination template
        template = templates[options.template]
        if (template == null) {
          return callback(
            new Error(`unknown paginator template '${options.template}'`)
          )
        }
        // setup the template context
        ctx = {
          contents,
          articles: this.articles,
          prevPage: this.prevPage,
          nextPage: this.nextPage
        }
        // extend the template context with the enviroment locals
        env.utils.extend(ctx, locals)
        // finally render the template
        return template.render(ctx, callback)
      }
    }
  }
  // register a generator, 'paginator' here is the content group generated content will belong to
  // i.e. contents._.paginator
  env.registerGenerator('paginator', function(contents, callback) {
    var articles,
      i,
      j,
      k,
      l,
      len,
      len1,
      numPages,
      page,
      pageArticles,
      pages,
      ref,
      rv
    // find all articles
    articles = getArticles(contents)
    // populate pages
    numPages = Math.ceil(articles.length / options.perPage)
    pages = []
    for (
      i = j = 0, ref = numPages;
      0 <= ref ? j < ref : j > ref;
      i = 0 <= ref ? ++j : --j
    ) {
      pageArticles = articles.slice(
        i * options.perPage,
        (i + 1) * options.perPage
      )
      pages.push(new PaginatorPage(i + 1, pageArticles))
    }
    // add references to prev/next to each page
    for (i = k = 0, len = pages.length; k < len; i = ++k) {
      page = pages[i]
      page.prevPage = pages[i - 1]
      page.nextPage = pages[i + 1]
    }
    // create the object that will be merged with the content tree (contents)
    // do _not_ modify the tree directly inside a generator, consider it read-only
    rv = {
      pages: {}
    }
    for (l = 0, len1 = pages.length; l < len1; l++) {
      page = pages[l]
      rv.pages[`${page.pageNum}.page`] = page // file extension is arbitrary
    }
    rv['index.page'] = pages[0]

    // callback with the generated contents
    return callback(null, rv)
  })
  // add the article helper to the environment so we can use it later
  env.helpers.getArticles = getArticles
  //Setup Github Data
  return getGitHubData(env.config.github).then(function(data) {
    env.helpers.github = data
    // tell the plugin manager we are done
    callback()
  }).catch(callback)
}
