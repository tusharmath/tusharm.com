import Axios, {AxiosRequestConfig, AxiosResponse} from 'axios'
import * as debug from 'debug'
import * as R from 'remeda'

const L = debug('github')

const MAX_PER_PAGE = 100
const baseURL = (username: string) => `http://api.github.com/users/${username}`
const fetch = async <T = unknown>(
  url: string,
  params: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  const response = await Axios.get<T>(url, params)
  L('HTTP', url, response.status)

  return response
}
const DEFAULT_PARAMS: AxiosRequestConfig = {
  timeout: process.env.GH_TOKEN === undefined ? 1e2 : 1e4
}
const requestParams = (): AxiosRequestConfig =>
  typeof process.env.GH_TOKEN === 'string'
    ? {
        ...DEFAULT_PARAMS,
        headers: {
          authorization: `bearer ${process.env.GH_TOKEN}`
        }
      }
    : {
        ...DEFAULT_PARAMS
      }
const requestPage = async (username: string, page: number) =>
  fetch<GithubRepos>(
    `${baseURL(username)}/repos?per_page=${MAX_PER_PAGE}&page=${page + 1}`,
    requestParams()
  )
const getGitHubData = async (username: string) => {
  const url = `${baseURL(username)}`
  const response = await fetch<GithubUsers>(url, requestParams())
  L('HTTP', url, response.status)
  const pageCount = Math.ceil(response.data.public_repos / MAX_PER_PAGE)
  const pages = await Promise.all<AxiosResponse<GithubRepos>>(
    Array.from({length: pageCount}, async (_, i) => requestPage(username, i))
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

export = (env: Wintersmith, callback: CB) => {
  if (process.env.GH_TOKEN === undefined) {
    env.helpers.github = {repos: [], popular: []}
    callback()
  } else {
    getGitHubData(env.config.github)
      .then(data => {
        env.helpers.github = data
        callback()
      })
      .catch(callback)
  }
}
