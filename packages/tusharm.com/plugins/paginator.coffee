request = require 'request'
_ = require 'underscore'
module.exports = (env, callback) ->
  ### Paginator plugin. Defaults can be overridden in config.json
      e.g. "paginator": {"perPage": 10} ###

  defaults =
    template: 'index.jade' # template that renders pages
    articles: 'articles' # directory containing contents to paginate
    first: 'index.html' # filename/url for first page
    filename: 'page/%d/index.html' # filename for rest of pages
    perPage: 2 # number of articles per page

  # assign defaults any option not set in the config file
  options = env.config.paginator or {}
  for key, value of defaults
    options[key] ?= defaults[key]

  getGitHubData = (username, callback) ->
    #Fetches data from github
    opt =
      url: "https://api.github.com/users/#{username}/repos"

      # Github Api requires a User-Agent header
      headers: 'User-Agent': username

    #Need to add a timeout
    request opt, (e,r,b) ->
      if e
        callback e
      else if r.statusCode is 200
        repos = JSON.parse b
        popular = _.filter repos, (i) -> i.watchers_count + i.stargazers_count > 0
        callback null, {popular, repos}
      else
        console.log r
        callback new Error "An unknown error occured inside tusharm.com!"


  getArticles = (contents ,type) ->
    # helper that returns a list of articles found in *contents*
    # note that each article is assumed to have its own directory in the articles directory
    articles = contents[options.articles]._.directories.map (item) -> item.index
    (articles = articles.filter (article) -> article.metadata.category is type) if type
    articles.sort (a, b) -> b.date - a.date
    return articles

  class PaginatorPage extends env.plugins.Page
    ### A page has a number and a list of articles ###

    constructor: (@pageNum, @articles) ->

    getFilename: ->
      if @pageNum is 1
        options.first
      else
        options.filename.replace '%d', @pageNum

    getView: -> (env, locals, contents, templates, callback) ->
      # simple view to pass articles and pagenum to the paginator template
      # note that this function returns a funciton

      # get the pagination template
      template = templates[options.template]
      if not template?
        return callback new Error "unknown paginator template '#{ options.template }'"

      # setup the template context
      ctx = {contents, @articles, @prevPage, @nextPage}

      # extend the template context with the enviroment locals
      env.utils.extend ctx, locals

      # finally render the template
      template.render ctx, callback

  # register a generator, 'paginator' here is the content group generated content will belong to
  # i.e. contents._.paginator
  env.registerGenerator 'paginator', (contents, callback) ->

    # find all articles
    articles = getArticles contents

    # populate pages
    numPages = Math.ceil articles.length / options.perPage
    pages = []
    for i in [0...numPages]
      pageArticles = articles.slice i * options.perPage, (i + 1) * options.perPage
      pages.push new PaginatorPage i + 1, pageArticles

    # add references to prev/next to each page
    for page, i in pages
      page.prevPage = pages[i - 1]
      page.nextPage = pages[i + 1]

    # create the object that will be merged with the content tree (contents)
    # do _not_ modify the tree directly inside a generator, consider it read-only
    rv = {pages:{}}
    for page in pages
      rv.pages["#{ page.pageNum }.page"] = page # file extension is arbitrary
    rv['index.page'] = pages[0] # alias for first page

    # callback with the generated contents
    callback null, rv

  # add the article helper to the environment so we can use it later
  env.helpers.getArticles = getArticles

  #Setup Github Data
  getGitHubData env.config.github, (data)->
    env.helpers.github = data
    # tell the plugin manager we are done
    callback()