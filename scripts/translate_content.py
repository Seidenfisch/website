#!/usr/bin/env python3
"""Translate English Pages CMS content into German/French/Japanese with DeepL API Free.

Only content fields are translated. Project IDs, titles, categories and image paths
are copied verbatim. Source hashes permit incremental updates without re-billing
unchanged text, and explicit overrides always win.
"""

import argparse
import hashlib
import json
import os
from pathlib import Path
import sys
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"
API_URL = "https://api-free.deepl.com/v2/translate"
LANGUAGES = ("de", "fr", "ja")
COLLECTIONS = {
    "projects": ("id", ("period", "status", "description")),
    "writing-context": ("slug", ("period", "type", "status", "note")),
}
STATE_FILE = CONTENT / "translation-state.json"
OVERRIDES_FILE = CONTENT / "translation-overrides.json"


def read_json(path, default=None):
    if not path.exists():
        return default
    with path.open(encoding="utf-8") as file:
        return json.load(file)


def write_json(path, value):
    output = json.dumps(value, ensure_ascii=False, indent=2) + "\n"
    if not path.exists() or path.read_text(encoding="utf-8") != output:
        path.write_text(output, encoding="utf-8")
        return True
    return False


def source_hash(value):
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def deepl_translate(texts, target, api_key):
    """Batch by character count as well as element count; fail rather than truncate."""
    results = []
    batches = []
    batch = []
    batch_size = 0
    for text in texts:
        size = len(text.encode("utf-8"))
        if size > 60_000:
            raise ValueError("A CMS field exceeds the supported DeepL batch size")
        if batch and (len(batch) >= 40 or batch_size + size > 60_000):
            batches.append(batch)
            batch, batch_size = [], 0
        batch.append(text)
        batch_size += size
    if batch:
        batches.append(batch)

    for items in batches:
        payload = json.dumps({
            "text": items,
            "source_lang": "EN",
            "target_lang": target.upper(),
            "preserve_formatting": True,
        }).encode("utf-8")
        request = Request(API_URL, data=payload, method="POST", headers={
            "Authorization": "DeepL-Auth-Key " + api_key,
            "Content-Type": "application/json",
        })
        try:
            with urlopen(request, timeout=50) as response:
                response_data = json.load(response)
        except HTTPError as error:
            message = error.read().decode("utf-8", errors="replace")[:300]
            raise RuntimeError(f"DeepL API returned HTTP {error.code}: {message}") from error
        except URLError as error:
            raise RuntimeError(f"DeepL API connection failed: {error.reason}") from error
        translated = response_data.get("translations", [])
        if len(translated) != len(items) or any("text" not in item for item in translated):
            raise RuntimeError("DeepL API returned an incomplete translation batch")
        results.extend(item["text"] for item in translated)
    return results


def build_translations(sources, current, previous_state, overrides, translator):
    """Return output and new state, collecting changed fields for one API batch."""
    output = {}
    state = {}
    queued = []
    for language in LANGUAGES:
        output[language] = {}
        state[language] = {}
        for collection, (identity, translated_fields) in COLLECTIONS.items():
            old_rows = {
                row[identity]: row
                for row in current.get(language, {}).get(collection, [])
                if isinstance(row, dict) and isinstance(row.get(identity), str)
            }
            rows = []
            for source in sources[collection]:
                row = source.copy()
                identifier = source[identity]
                for field in translated_fields:
                    value = source.get(field)
                    if not isinstance(value, str) or not value.strip():
                        continue
                    key = f"{collection}/{identifier}/{field}"
                    checksum = source_hash(value)
                    override = (overrides.get(language, {})
                                .get(collection, {}).get(identifier, {}).get(field))
                    if override is not None:
                        if not isinstance(override, str):
                            raise ValueError(f"Invalid non-string override for {language}/{key}")
                        state[language][key] = "override:" + checksum
                        row[field] = override
                    elif (previous_state.get(language, {}).get(key) == checksum
                          and isinstance(old_rows.get(identifier, {}).get(field), str)):
                        state[language][key] = checksum
                        row[field] = old_rows[identifier][field]
                    else:
                        state[language][key] = checksum
                        queued.append((language, row, field, value))
                rows.append(row)
            output[language][collection] = rows

    for language in LANGUAGES:
        requests = [(row, field, value) for lang, row, field, value in queued if lang == language]
        if requests:
            translations = translator([value for _, _, value in requests], language)
            if len(translations) != len(requests):
                raise RuntimeError(f"Wrong number of translations returned for {language}")
            for (row, field, _), translated in zip(requests, translations):
                row[field] = translated
            print(f"{language.upper()}: translated {len(requests)} changed fields")
        else:
            print(f"{language.upper()}: no translation needed")
    return output, state


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Validate sources and configuration without contacting DeepL")
    args = parser.parse_args()

    sources = {}
    for collection, (identity, _) in COLLECTIONS.items():
        rows = read_json(CONTENT / f"{collection}.json")
        if not isinstance(rows, list):
            raise ValueError(f"{collection}.json must be a JSON list")
        ids = [row.get(identity) for row in rows if isinstance(row, dict)]
        if len(ids) != len(rows) or any(not isinstance(key, str) or not key for key in ids) or len(ids) != len(set(ids)):
            raise ValueError(f"{collection}.json has missing or duplicate {identity} values")
        sources[collection] = rows

    overrides = read_json(OVERRIDES_FILE, {})
    if not isinstance(overrides, dict):
        raise ValueError("translation-overrides.json must be an object")
    if args.check:
        print("Source content and overrides are valid")
        return

    previous_state = read_json(STATE_FILE, {})
    current = {
        language: {collection: read_json(CONTENT / f"{collection}.{language}.json", [])
                   for collection in COLLECTIONS}
        for language in LANGUAGES
    }

    api_key = os.environ.get("DEEPL_API_KEY", "")
    def translator(texts, language):
        if not api_key:
            raise RuntimeError("Missing DEEPL_API_KEY GitHub Actions repository secret")
        return deepl_translate(texts, language, api_key)

    output, state = build_translations(sources, current, previous_state, overrides, translator)
    changed = 0
    for language in LANGUAGES:
        for collection in COLLECTIONS:
            changed += write_json(CONTENT / f"{collection}.{language}.json", output[language][collection])
    changed += write_json(STATE_FILE, state)
    print(f"Updated {changed} content files")


if __name__ == "__main__":
    try:
        main()
    except (ValueError, RuntimeError) as error:
        print(f"Translation failed: {error}", file=sys.stderr)
        sys.exit(1)
