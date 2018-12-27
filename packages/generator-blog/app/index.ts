import * as Generator from 'yeoman-generator'
import * as fs from 'fs-extra'
import * as path from 'path'
import slugify from 'slugify'

type UserInput = {
  title: string
  type: 'Article' | 'Project'
  slug: string
  date: Date
}

const CONTENT_PATH = 'packages/tusharm.com/contents/articles'

export = class BlogGenerator extends Generator {
  private answers: UserInput = {
    type: 'Article',
    title: 'Nothing',
    slug: 'nothing',
    date: new Date()
  }
  async prompting() {
    this.answers = (await this.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Title',
        validate: i => Boolean(i)
      },
      {
        type: 'input',
        name: 'slug',
        message: 'Slug',
        default: (a: {title: string}) => slugify(a.title)
      },
      {
        type: 'input',
        name: 'date',
        message: 'Date',
        default: this.answers.date
      },
      {
        type: 'list',
        name: 'type',
        message: 'Type of content',
        choices: ['Article', 'Project']
      }
    ])) as UserInput
  }

  private slug(title: string) {
    return
  }

  async writing() {
    const blogPath = path.resolve(
      process.cwd(),
      CONTENT_PATH,
      this.answers.slug
    )

    await fs.mkdirp(blogPath)

    this.fs.copyTpl(
      this.templatePath('index.md.tmp'),
      this.destinationPath(path.resolve(CONTENT_PATH, 'index.md')),
      this.answers
    )
  }
}
