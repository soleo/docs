import withDoc from '../../../lib/with-doc'

import { sergio } from '../../../lib/data/team'
import { TerminalInput } from '../../../components/text/terminal'

export const meta = {
  title: 'Deploy a Slackin Server',
  description: 'Deploy in a single command a Slackin server to made your Slack public',
  date: '19 Jun 2018',
  authors: [sergio],
  editUrl: 'pages/docs/examples/slackin.md'
}

[Slackin](https://github.com/rauchg/slackin) is a super simple server which enables public access to a Slack workspace. It gives ]you a nice basic landing page you can use to receive user emails and send them an invite to join your Slack workspace. It also gives you badges to add in your site or repositories to show connected users in realtime.

## Deploying Slackin

There are two ways to deploy a Slackin server. In both cases you need to get a Slack API Token going to [Create and regenerate API tokens](https://get.slack.help/hc/en-us/articles/215770388-Creating-and-regenerating-API-tokens) and your Slack subdomain which is what you use to access your Slack workspace (eg. https://**{this}**.slack.com).

### Deploy from original repository

The first way to deploy is deploying the original repository of Slackin using the following command:

<TerminalInput>now rauchg/slackin</TerminalInput>

This will ask you for your Slack API Token and your Slack subdomain. This way will also ask you for a [Google Captcha](https://www.google.com/recaptcha/intro/v3beta.html) Secret and Sitekey, this is used to prevent abuse.

Note if you deploy from the original directory your deployment will need to go through a build process using Gulp.

### Deploy from ready to use repository

To avoid the build step we create a ready to use repository with the site already built, in this repository Slackin is installed as a dependency from npm where the Gulp process has already happened.

To deploy this way you need to run the following command:

<TerminalInput>now now-examples/slackin</TerminalInput>

It will ask you for your Slack API Tokena and Slack subdomain and that's all. Now you will have an unique deployment URL similar to https://now-examples-slackin.now.sh/.

## Final Step

As a final step you can [assign an alias](/docs/features/aliases) to your deployment in order to have it working on a subdomain of your main domain or using a free `.now.sh` subdomain unique for your community.

export default withDoc({...meta})(({children}) => <>{children}</>)
