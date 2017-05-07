
### Motivation
Providing meta information to GitHub repository can be automated. This service, when integrated with a GitHub account, will set project details (repository description and website) according to package.json.

### Technologies and resources:
- Node.js (latest)
- GitHub API

### Development guidelines
- Test-first (Mocha/Chai)
- Service should listen to on-push callbacks, filter those including changes to package.json and set project meta information (description, website) in repository's web-interface accordingly.
- Service can be integrated and configured via it's own web-interface (jekyll, login with GitHub account)

### Possible enhancements
- add support for composer/gemfile
- add sync for topics

### Usage
TBA
