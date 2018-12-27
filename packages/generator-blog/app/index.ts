import * as Generator from 'yeoman-generator'
import * as fs from 'fs-extra'
import * as path from 'path'
import slugify from 'slugify'
import * as dateFormat from 'dateformat'

type UserInput = {
  title: string
  type: 'Article' | 'Project'
  slug: string
  date: string
}

const CONTENT_PATH = 'packages/tusharm.com/contents/articles'

export = class BlogGenerator extends Generator {
  configuring() {
    this.destinationRoot(path.resolve(process.cwd(), CONTENT_PATH))
  }

  private answers: UserInput = {
    type: 'Article',
    title: 'Nothing',
    slug: 'nothing',
    date: dateFormat(new Date(), 'yyyy-mmm-dd')
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

  async writing() {
    await fs.mkdirp(this.destinationPath(this.answers.slug))

    this.fs.copyTpl(
      this.templatePath('index.md.tmp'),
      this.destinationPath(path.resolve(this.answers.slug, 'index.md')),
      this.answers
    )
  }
}
