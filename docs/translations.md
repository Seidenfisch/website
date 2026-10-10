# SDL translations

The English Pages CMS content is the source of truth. The GitHub Actions workflow
`Translate Pages CMS content` translates edited text into German, French and Japanese via
DeepL API Free and commits the generated JSON files back to `main`.

## One-time setup

1. In GitHub, open **Settings → Secrets and variables → Actions → New repository secret**.
2. Name it **`DEEPL_API_KEY`** and paste the DeepL API Free key. Never add the key to repository files or Pages CMS.
3. Ensure the workflow can write repository contents. The workflow requests `contents: write`; repository/org policy must permit it.
4. Open **Actions → Translate Pages CMS content → Run workflow** on `main` once. The DE/FR/JA content files will then be generated and deployed by GitHub Pages.

Subsequent edits to `content/projects.json` or `content/writing-context.json`
from Pages CMS automatically trigger translation when committed to `main`.

## What is translated

- Work: `period`, `status`, `description`.
- Writing context: `period`, `type`, `status`, `note`.
- Project names, IDs, category keys, article slugs, image filenames and gallery ordering stay untouched.
- Navigation and other interface translations are maintained in `locale.js` and the language-specific HTML files.
- Full creative writing/article bodies are **not** automatically machine-translated. Those pages remain in English with their existing notice; translate and review them separately before publishing translations.

Source hashes in `content/translation-state.json` make unchanged fields reusable,
reducing DeepL character usage. Generated `content/*.de.json` and
`content/*.fr.json` and `content/*.ja.json` should not be edited directly: they'll be regenerated.

## Adjusting wording

Add a manual override in `content/translation-overrides.json`, identified by
language, collection, project ID or article slug, and field. Example:

```json
{
  "de": {
    "projects": {
      "brechschnell": {
        "status": "Im Einsatz"
      }
    },
    "writing-context": {}
  },
  "fr": {
    "projects": {},
    "writing-context": {}
  },
  "ja": {
    "projects": {},
    "writing-context": {}
  }
}
```

Override values always take priority over DeepL. Removing an override causes
that field to be translated again on the next workflow run. To test JSON
structure locally without using the API, run
`python scripts/translate_content.py --check`.

If a workflow fails because of rate limits, quota, or a temporary service
error, existing translations remain unchanged and the workflow can be rerun.
