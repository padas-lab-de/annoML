module.exports = {
  plugins: [
    require('./plugin.js')
  ],
  dest: 'public',
  locales: {
    '/': {
      lang: 'en-US',
      title: 'annoML',
      description: 'A annotation and discussion framework for Vega-Lite visualization written in Vue.js'
    }
  },
  themeConfig: {
    repo: '/annoml',
    docsDir: 'docs',
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on Gitlab',
        nav: [{
          text: 'Release Notes',
          link: 'https://gitlab.thomb.org/thomborg/annoml/releases'
        }],
        sidebar: [
          '/installation.md',
          '/started.md',
        ]
      }
    }
  }
}
