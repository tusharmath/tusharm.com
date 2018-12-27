import axios, {AxiosRequestConfig, AxiosResponse} from 'axios'
import * as R from 'remeda'

interface IOptions {
  articles: string
  filename: string
  first: string
  perPage: number
  template: string
}
const MAX_PER_PAGE = 100
const baseURL = (username: string) => `http://api.github.com/users/${username}`
const requestParams = (): AxiosRequestConfig =>
  process.env.GH_TOKEN
    ? {
        headers: {
          authorization: `bearer ${process.env.GH_TOKEN}`
        }
      }
    : {}
const requestPage = (username: string, page: number) =>
  axios.get<GithubRepos>(
    `${baseURL(username)}/repos?per_page=${MAX_PER_PAGE}&page=${page + 1}`,
    requestParams()
  )
const getGitHubData = async (username: string) => {
  const response = await axios.get<GithubUsers>(
    `${baseURL(username)}`,
    requestParams()
  )
  const pageCount = Math.ceil(response.data.public_repos / MAX_PER_PAGE)

  const pages = await Promise.all<AxiosResponse<GithubRepos>>(
    Array.from({length: pageCount}, (_, i) => requestPage(username, i))
  )

  const repos = R.pipe(
    pages,
    R.flatMap(R.prop('data')),
    R.filter(i => !i.fork && i.description !== null),
    R.sortBy(R.prop('created_at'))
  ).reverse()

  const popular = repos.filter(i => i.watchers_count + i.stargazers_count > 0)

  return {repos, popular}
}

const DEFAULT_OPTIONS: IOptions = {
  template: 'index.pug', // Template that renders pages
  articles: 'articles', // Directory containing contents to paginate
  first: 'index.html', // Filename/url for first page
  filename: 'page/%d/index.html', // Filename for rest of pages
  perPage: 2 // Number of articles per page
}

/**
 * Helper that returns a list of articles found in *contents*
 * note that each article is assumed to have its own directory in the articles directory
 */
const getArticles = (
  contents: ContentGroup,
  options: IOptions,
  category?: string
) => {
  const r = contents[options.articles]._.directories
    .map(item => item.index)
    .filter(i => (category ? category === i.metadata.category : true))
    .sort((a, b) => b.date - a.date)

  return r
}
interface IMyPaginator {
  nextPage?: IMyPaginator
  readonly pageNum: number
  prevPage?: IMyPaginator
}

const createPage = (env: Wintersmith, options: IOptions) => {
  class PaginatorPage extends env.plugins.Page implements IMyPaginator {
    public nextPage?: IMyPaginator
    public prevPage?: IMyPaginator

    /* A page has a number and a list of articles */
    public constructor(
      public readonly pageNum: number,
      private articles: Article[]
    ) {
      super()
    }

    public getFilename(): string {
      if (this.pageNum === 1) {
        return options.first
      } else {
        return options.filename.replace('%d', this.pageNum.toString())
      }
    }

    public getView(): ViewFunction {
      return <L>(
        env0: Wintersmith,
        locals: L,
        contents: ContentGroup,
        templates: Templates,
        callback: CB
      ) => {
        // Simple view to pass articles and pageNum to the paginator template
        // Note that this function returns a function

        // Get the pagination template
        const template = templates[options.template]
        if (template === undefined) {
          return callback(
            new Error(`unknown paginator template '${options.template}'`)
          )
        }

        // Setup the template context
        // Extend the template context with the environment locals
        const ctx = R.merge(
          {
            contents,
            articles: this.articles,
            prevPage: this.prevPage,
            nextPage: this.nextPage
          },
          locals
        )

        // Finally render the template
        return template.render(ctx, callback)
      }
    }
  }

  return (pageNum: number, articles: Article[]) =>
    new PaginatorPage(pageNum, articles)
}

export = (env: Wintersmith, callback: CB) => {
  // Assign defaults any option not set in the config file
  const options: IOptions = R.mergeAll([
    DEFAULT_OPTIONS,
    env.config.paginator || {}
  ])

  const paginator = createPage(env, options)

  // Register a generator, 'paginator' here is the content group generated content will belong to
  // I.e. contents._.paginator
  env.registerGenerator('paginator', (contents, cb) => {
    // Find all articles
    const articles = getArticles(contents, options)

    // Populate pages
    const numPages = Math.ceil(articles.length / options.perPage)

    const pages: IMyPaginator[] = []
    for (let i = 0; i < numPages; i += 1) {
      const start = i * options.perPage
      const end = (i + 1) * options.perPage
      const pageArticles = articles.slice(start, end)
      pages.push(paginator(i + 1, pageArticles))
    }

    pages.forEach((page, i) => {
      page.prevPage = pages[i - 1]
      page.nextPage = pages[i + 1]
    })

    // Console.log({pages: pages.length, numPages, articles: articles.length})

    // Create the object that will be merged with the content tree (contents)
    // Do _not_ modify the tree directly inside a generator, consider it read-only
    const rv = createRV(pages)

    // Callback with the generated contents

    return cb(null, rv)
  })
  // Add the article helper to the environment so we can use it later
  env.helpers.getArticles = getArticles
  callback()
  // Setup Github Data

  // GetGitHubData(env.config.github)
  //   .then(data => {
  //     Env.helpers.github = data
  //     Callback()
  //   })
  //   .catch(callback)
}

const createRV = (pages: IMyPaginator[]) => {
  const rv = pages.reduce(
    (acc, page) => ({
      ...acc,
      [`${page.pageNum}.page`]: page
    }),
    {}
  )

  return R.merge(rv, {'index.page': pages[0]})
}
