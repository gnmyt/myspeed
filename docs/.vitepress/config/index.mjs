import { defineConfig } from 'vitepress'
import { shared } from './shared.mjs';
import { en } from './en.mjs'
import { de } from './de.mjs'

export default defineConfig({
    ...shared,
    locales: {
        root: { label: 'English', ...en },
        de: { label: 'Deutsch', ...de }
    }
})