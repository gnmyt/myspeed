import { defineConfig } from 'vitepress'

export const de = defineConfig({
    lang: "de",
    description: "MySpeed ist eine selbstgehostete Speedtest-Analyse-Software, die die Geschwindigkeit Ihres Internets bis zu 30 Tage lang speichert.",
    themeConfig: {
        nav: [
            { text: 'Häufig gestellte Fragen', link: 'de/faq' },
            {
                text: 'Einrichtung',
                items: [
                    { text: 'Linux', link: 'de/setup/linux' },
                    { text: 'Windows', link: 'de/setup/windows' }
                ]
            },
            {
                text: 'Anleitungen',
                items: [
                    { text: 'Einrichten eines Reverse Proxys', link: 'de/guides/reverse-proxy' }
                ]
            },
            { text: 'Fehlerbehebung', link: 'de/troubleshooting' },
            {
                text: 'Anweisungen',
                items: [
                    { text: 'Die Benutzeroberfläche', link: 'de/instructions/main' },
                    { text: 'Einstellungen', link: 'de/instructions/settings' }
                ]
            }
        ]
    },
})
