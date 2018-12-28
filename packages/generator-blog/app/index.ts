import * as dateFormat from 'dateformat'
import * as fs from 'fs-extra'
import * as path from 'path'
import slugify from 'slugify'
import * as Generator from 'yeoman-generator'

interface IUserInput {
  date: string
  slug: string
  title: string
  type: 'Article' | 'Project'
}

const CONTENT_PATH = 'packages/tusharm.com/contents/articles'

export = class BlogGenerator extends Generator {
  private answers: IUserInput = {
    type: 'Article',
    title: 'Nothing',
    slug: 'nothing',
    date: dateFormat(new Date(), 'yyyy-mmm-dd')
  }

  public configuring(): void {
    this.destinationRoot(path.resolve(process.cwd(), CONTENT_PATH))
  }

  public async prompting(): Promise<void> {
    this.answers = (await this.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Title',
        validate: Boolean
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
    ])) as IUserInput
  }

  public async writing(): Promise<void> {
    await fs.mkdirp(this.destinationPath(this.answers.slug))

    this.fs.copyTpl(
      this.templatePath('index.md.tmp'),
      this.destinationPath(path.resolve(this.answers.slug, 'index.md')),
      this.answers
    )
  }
}
