'use strict';

const siteConfig = require('./config.js');
const postCssPlugins = require('./postcss-config.js');

module.exports = {
  siteMetadata: {
    url: siteConfig.url,
    siteUrl: siteConfig.url,
    title: siteConfig.title,
    subtitle: siteConfig.subtitle,
    copyright: siteConfig.copyright,
    disqusShortname: siteConfig.disqusShortname,
    menu: siteConfig.menu,
    author: siteConfig.author
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content`,
        name: 'pages'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/static/media`,
        name: 'media'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'assets',
        path: `${__dirname}/static`
      }
    },
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        query: `
          {
            site {
              siteMetadata {
                siteUrl
                title
                description: subtitle
              }
            }
          }
        `,
        feeds: [{
          serialize: ({ query: { site, allMarkdownRemark } }) => (
            allMarkdownRemark.edges.map((edge) => ({
              ...edge.node.frontmatter,
              description: edge.node.frontmatter.description,
              date: edge.node.frontmatter.date,
              url: `${site.siteMetadata.siteUrl}/${edge.node.fields.slug}`,
              guid: `${site.siteMetadata.siteUrl}/${edge.node.fields.slug}`,
              custom_elements: [{ 'content:encoded': edge.node.html }]
            }))
          ),
          query: `
              {
                allMarkdownRemark(
                  limit: 1000,
                  sort: { order: DESC, fields: [frontmatter___date] },
                  filter: { frontmatter: { template: { eq: "post" }, draft: { ne: true } } }
                ) {
                  edges {
                    node {
                      html
                      fields {
                        slug
                      }
                      frontmatter {
                        title
                        date
                        template
                        draft
                        description
                      }
                    }
                  }
                }
              }
            `,
          title: 'piraces.dev',
          output: '/rss.xml'
        }]
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-katex',
            options: {
              strict: 'ignore'
            }
          },
          {
            resolve: 'gatsby-remark-images',
            options: { maxWidth: 960 }
          },
          {
            resolve: 'gatsby-remark-responsive-iframe',
            options: { wrapperStyle: 'margin-bottom: 1.0725rem' }
          },
          'gatsby-remark-autolink-headers',
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants'
        ]
      }
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-netlify',
      options: {
        allPageHeaders: [
          'X-Frame-Options: DENY',
          'X-XSS-Protection: 1; mode=block',
          'X-Content-Type-Options: nosniff',
          'Strict-Transport-Security: max-age=63072000; includeSubDomains; preload',
          'Content-Security-Policy: default-src \'self\' *.disqus.com *.disquscdn.com disqus.com; script-src \'unsafe-inline\' \'unsafe-eval\' piraces.dev www.google-analytics.com ajax.googleapis.com www.googletagmanager.com piraces-dev.disqus.com *.disqus.com *.disquscdn.com disqus.com; connect-src \'self\' identity.services.netlify.com github.com www.google-analytics.com ajax.googleapis.com www.googletagmanager.com *.disqus.com *.disquscdn.com disqus.com; img-src \'self\' piraces.dev www.google-analytics.com ajax.googleapis.com www.googletagmanager.com data: *.disqus.com *.disquscdn.com; style-src \'unsafe-inline\'; font-src \'unsafe-inline\' piraces.dev data:; script-src-elem \'unsafe-inline\' piraces.dev www.google-analytics.com ajax.googleapis.com www.googletagmanager.com piraces-dev.disqus.com *.disqus.com *.disquscdn.com disqus.com',
          'Expect-CT: max-age=604800',
          'Expect-CT: enforce',
          'Feature-Policy: autoplay \'none\'; camera \'none\'',
          'Referrer-Policy: no-referrer-when-downgrade',
        ],
        headers: {
          '/*': [
            'X-Frame-Options: DENY',
            'X-XSS-Protection: 1; mode=block',
            'X-Content-Type-Options: nosniff',
            'Strict-Transport-Security: max-age=63072000; includeSubDomains; preload',
            'Content-Security-Policy: default-src \'self\' *.disqus.com *.disquscdn.com disqus.com; script-src \'unsafe-inline\' \'unsafe-eval\' piraces.dev www.google-analytics.com ajax.googleapis.com www.googletagmanager.com piraces-dev.disqus.com *.disqus.com *.disquscdn.com disqus.com; connect-src \'self\' identity.services.netlify.com github.com www.google-analytics.com ajax.googleapis.com www.googletagmanager.com *.disqus.com *.disquscdn.com disqus.com; img-src \'self\' piraces.dev www.google-analytics.com ajax.googleapis.com www.googletagmanager.com data: *.disqus.com *.disquscdn.com; style-src \'unsafe-inline\'; font-src \'unsafe-inline\' piraces.dev data:; script-src-elem \'unsafe-inline\' piraces.dev www.google-analytics.com ajax.googleapis.com www.googletagmanager.com piraces-dev.disqus.com *.disqus.com *.disquscdn.com disqus.com',
            'Expect-CT: max-age=604800',
            'Expect-CT: enforce',
            'Feature-Policy: autoplay \'none\'; camera \'none\'',
            'Referrer-Policy: no-referrer-when-downgrade',
          ]
        }
      }
    },
    {
      resolve: 'gatsby-plugin-netlify-cms',
      options: {
        modulePath: `${__dirname}/src/cms/cms.js`
      }
    },
    {
      resolve: 'gatsby-plugin-google-gtag',
      options: {
        trackingIds: [siteConfig.googleAnalyticsId],
        pluginConfig: {
          head: true,
        },
      },
    },
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
            allSitePage(
              filter: {
                path: { regex: "/^(?!/404/|/404.html|/dev-404-page/)/" }
              }
            ) {
              edges {
                node {
                  path
                }
              }
            }
          }
        `,
        output: '/sitemap.xml',
        serialize: ({ site, allSitePage }) => allSitePage.edges.map((edge) => ({
          url: site.siteMetadata.siteUrl + edge.node.path,
          changefreq: 'daily',
          priority: 0.7
        }))
      }
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: siteConfig.title,
        short_name: siteConfig.title,
        start_url: '/',
        background_color: '#FFF',
        theme_color: '#000000',
        display: 'standalone',
        icon: 'static/icon.png'
      },
    },
    'gatsby-plugin-offline',
    'gatsby-plugin-catch-links',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-sass',
      options: {
        postCssPlugins: [...postCssPlugins],
        cssLoaderOptions: {
          camelCase: false,
        }
      }
    },
    'gatsby-plugin-flow',
    {
      resolve: 'gatsby-plugin-brotli'
    },
    {
      resolve: 'gatsby-plugin-react-helmet-canonical-urls',
      options: {
        siteUrl: 'https://piraces.dev',
        stripQueryString: true
      }
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: 'https://piraces.dev',
        sitemap: 'https://piraces.dev/sitemap.xml',
        policy: [{ userAgent: '*', allow: '/' }]
      }
    }
  ]
};
