type CB = <T>(err?: Error | null, data?: T) => void

type MarkdownPage = {
  filepath: {}
  metadata: {
    title: string
    data: string
    template: string
    hide?: boolean
    category?: string
  }
  markdown: string
  date: number
}

type ContentTree = {
  [k: string]: MarkdownPage
}
type ContentGroup = {
  [key: string]: {
    _: {
      directories: [ContentTree]
    }
  }
}
type Pattern = {}
declare class ContentPlugin {}
declare class TemplatePlugin {}
declare class PagePlugin {}
type ViewFunction = {
  <T>(
    env: Wintersmith,
    locals: T,
    contents: ContentGroup,
    templates: {
      [K: string]: Template
    },
    callback: CB
  ): void
}

type Wintersmith = {
  registerGenerator(
    name: string,
    cb: (content: ContentGroup, cb: CB) => void
  ): void
  registerContentPlugin(
    contentGroup: ContentGroup,
    pattern: Pattern,
    contentPlugin: ContentPlugin
  ): void
  registerTemplatePlugin(pattern: Pattern, templatePlugin: TemplatePlugin): void
  registerGenerator(
    contentGroup: ContentGroup,
    generatorFn: GeneratorFunction
  ): void
  registerView(name: string, viewFn: ViewFunction): void
  helpers: {[K: string]: any}
  plugins: {
    Page: typeof PagePlugin
  }
  config: {
    paginator: unknown
    github: string
  } // TODO: unknown
  utils: {
    extend<A, B>(a: A, b: B): void
  }
}

type GithubUsers = {
  public_repos: number
}

type GithubRepos = Array<{
  fork: boolean
  description: string | null
  created_at: string
  watchers_count: number
  stargazers_count: number
}>

type Locals = {}
type Template = {
  render<T>(ctx: T, cb: CB): void
}
type Templates = {
  [K: string]: Template | undefined
}
