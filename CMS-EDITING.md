# Editing SDL with Pages CMS

The portfolio remains a static GitHub Pages site. [Pages CMS](https://app.pagescms.org/) edits the content files in this repository; it does not replace hosting.

## First-time setup

1. Merge the Pages CMS setup pull request into `main`.
2. Open [Pages CMS](https://app.pagescms.org/) and choose `Seidenfisch/website` on the `main` branch.
3. Refresh the repository if it was already open. You should see **Work projects**, **Writing context**, and **Navigation labels** in the sidebar.

## Work projects

Open **Work projects** to edit a project entry's title, category, date/period, status/whereabouts, description, and ordered image paths. Each entry is one row in `content/projects.json`.

- Keep an existing project's **URL identifier** (`id`) unchanged, so old links keep working.
- The **first image path** is the cover photograph.
- Current photos live at the repository root, so paths look like `Brechschnell (Bicycle).JPEG`.
- To add new photos, upload them through Pages CMS **Media** (stored in `assets/uploads/`), then enter `assets/uploads/your-image.jpg` in the project's image paths. Move the image path to the first position if it should be the cover.
- Projects without any image paths are excluded from the gallery.

The Home featured projects remain Brechschnell, AEK II, and RotoLamp; their card text and photos follow the corresponding CMS entries.

## Writing context

Open **Writing context** to edit the metadata table and context note for each existing article. The `slug` matches the article's HTML filename and should not be changed.

The **full article text and embedded article images** are still in `writing/*.html`; this initial CMS setup does not turn long-form articles into rich-text CMS entries.

## Navigation labels

Open **Navigation labels** to edit the buttons in the header for **Home**, **Work**, **Writing**, **About**, and **Say hello**.

- Each button has an English master label and separate German, French, and Japanese labels. You can choose the wording independently in each language.
- **Show button** hides a button in all languages without erasing its labels. Its link remains unchanged if you show it again.
- Only labels and visibility are editable; navigation destinations stay fixed, and the button order is unchanged.
- These short interface labels are **manually managed**, not processed by the DeepL content workflow. Changing the English wording will not overwrite your other languages, and automatic translation runs will not overwrite your choices.
- If a translated label is blank, the English label is used as a fallback.
- If JavaScript is disabled or settings cannot be loaded, the existing HTML navigation labels are shown.

## Publishing

Pages CMS commits edits to GitHub. If editing `main`, GitHub Pages normally deploys them automatically. A hard refresh might be necessary if a browser has cached an old page.

The content format is plain JSON, so editing on GitHub directly remains possible.
