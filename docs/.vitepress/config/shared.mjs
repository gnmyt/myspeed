import { defineConfig } from 'vitepress'

export const shared = defineConfig({
    rewrites: {
        'en/:rest*': ':rest*'
    },

    title: 'MySpeed',

    lastUpdated: true,
    cleanUrls: true,
    metaChunk: true,

    sitemap: {
        hostname: 'https://myspeed.gnmyt.dev',
        transformItems(items) {
            return items.filter((item) => !item.url.includes('migration'))
        }
    },

    /* prettier-ignore */
    head: [
        ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
        ['meta', { name: 'theme-color', content: '#1C2232' }],
        ['meta', { property: 'og:type', content: 'website' }],
        ['meta', { property: 'og:locale', content: 'en' }],
        ['meta', { property: 'og:title', content: 'MySpeed | Self-hosted speedtest analysis software' }],
        ['meta', { property: 'og:site_name', content: 'MySpeed' }],
        ['meta', { property: 'og:image', content: 'https://myspeed.gnmyt.dev/assets/images/thumbnail.png' }],
        ['meta', { property: 'og:url', content: 'https://myspeed.gnmyt.dev/' }]
    ],
    themeConfig: {
        logo: '/logo.png',
        footer: {
            copyright: '© 2024 Mathias Wagner',
        },
        search: {
            provider: 'local'
        },
        socialLinks: [
            {icon: 'github', link: 'https://github.com/gnmyt/myspeed'},
            {icon: 'discord', link: 'https://discord.com/users/386242172632170496'}
        ],
    }
})