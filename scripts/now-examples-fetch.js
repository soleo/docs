const fs = require('fs-extra')
const { resolve } = require('path')

const examples = new Map([
  ['crystal-hello', 'main.cr'],
  ['go-hello', 'main.go'],
  ['node-micro', 'server.js'],
  ['php-7-hello-world', 'index.php']
])

async function main() {
  const nowExamplesDir = process.argv[2]
  const data = {}
  await Promise.all(
    Array.from(examples.keys()).map(async example => {
      const entrypoint = examples.get(example)
      const dir = resolve(nowExamplesDir, example)
      const filenames = await fs.readdir(dir)
      data[example] = {
        main: entrypoint,
        files: {}
      }
      await Promise.all(
        filenames.map(async filename => {
          const file = resolve(dir, filename)
          const contents = await fs.readFile(file, 'utf8')
          data[example].files[filename] = contents
        })
      )
    })
  )
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(data, null, 2))
}

main().catch(err => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
