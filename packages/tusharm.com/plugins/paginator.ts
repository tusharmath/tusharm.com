import * as R from 'remeda'

interface IOptions {
  articles: string
  filename: string
  first: string
  perPage: number
  template: string
}

const DEFAULT_OPTIONS: IOptions = {
  template: 'index.pug', // Template that renders pages
  articles: 'articles', // Directory containing contents to paginate
  first: 'index.html', // Filename/url for first page
  filename: 'page/%d/index.html', // Filename for rest of pages
  perPage: 2, // Number of articles per page
}

const matchesCategory = (category?: string) => (i: MarkdownPage) =>
  typeof category === 'string' ? category === i.metadata.category : true

/**
 * Helper that returns a list of articles found in *contents*
 * note that each article is assumed to have its own directory in the articles directory
 */

const getArticles = (options: IOptions) => (
  contents: ContentGroup,
  category?: string
) => {
  const r = contents[options.articles]._.directories
    .map((item) => item.index)
    .filter(matchesCategory(category))
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
      private readonly articles: MarkdownPage[]
    ) {
      super()
    }

    public getFilename(): string {
      if (this.pageNum === 1) {
        return options.first
      }

      return options.filename.replace('%d', this.pageNum.toString())
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
          callback(
            new Error(`unknown paginator template '${options.template}'`)
          )
        } else {
          // Setup the template context
          // Extend the template context with the environment locals
          const ctx = R.merge(
            {
              contents,
              articles: this.articles,
              prevPage: this.prevPage,
              nextPage: this.nextPage,
            },
            locals
          )

          // Finally render the template
          template.render(ctx, callback)
        }
      }
    }
  }

  return (pageNum: number, articles: MarkdownPage[]) =>
    new PaginatorPage(pageNum, articles)
}

const createRV = (pages: IMyPaginator[]) => {
  const rv = pages.reduce<{[k: string]: IMyPaginator}>(
    (acc, page) => ({
      ...acc,
      [`${page.pageNum}.page`]: page,
    }),
    {}
  )

  return R.merge(rv, {'index.page': pages[0]})
}

const isVisible = (i: MarkdownPage) =>
  typeof i.metadata.hide === 'boolean' ? !i.metadata.hide : true

export = (env: Wintersmith, callback: CB) => {
  // Assign defaults any option not set in the config file
  const options: IOptions = R.mergeAll([DEFAULT_OPTIONS, env.config.paginator])

  const paginator = createPage(env, options)

  // Register a generator, 'paginator' here is the content group generated content will belong to
  // I.e. contents._.paginator
  env.registerGenerator('paginator', (contents, cb) => {
    // Find all articles
    const articles = getArticles(options)(contents).filter(isVisible)

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

    cb(null, rv)
  })
  // Add the article helper to the environment so we can use it later
  env.helpers.getArticles = getArticles(options)
  callback()
}
