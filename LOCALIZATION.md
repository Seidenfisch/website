# SDL language support (stage 1)

English is the master version. Root HTML pages, `content/projects.json`, and `content/writing-context.json` are edited in English (including through Pages CMS).

The `de/` and `fr/` folders provide static language-specific routes and translated site navigation/interface copy. `locale.js` supplies translated dynamic project and metadata labels. Each locale uses the same project IDs, image assets, writing sources, and CMS data as English.

**Not yet automatic:** Full project descriptions and creative writing remain in English. Locale HTML mirrors must be refreshed when English page structure changes, until stage 2 adds a generation/translation workflow. Do not edit CMS content in three places.

The language switcher preserves query parameters such as `?id=brechschnell` and anchors when switching versions. Files under `writing/` use paths relative to their language directory. Keep `data-asset-root` correct on each page.

Stage 2 will generate translated content from the English master, with glossary and manual override support; stage 3 will add full SEO annotations.
