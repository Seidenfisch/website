import importlib.util
from pathlib import Path
import unittest


spec = importlib.util.spec_from_file_location(
    "translate_content", Path(__file__).resolve().parents[1] / "scripts" / "translate_content.py"
)
translator = importlib.util.module_from_spec(spec)
spec.loader.exec_module(translator)


class TranslationTests(unittest.TestCase):
    def setUp(self):
        self.sources = {
            "projects": [{
                "id": "test", "title": "My Project", "category": "bicycles",
                "period": "2025", "status": "In use", "description": "Built by hand.",
                "images": ["hero.jpg", "detail.jpg"]
            }],
            "writing-context": [{
                "slug": "essay", "period": "2024", "type": "Essay",
                "status": "Published", "note": "Context for readers."
            }],
        }
        self.calls = []

    def fake_translate(self, texts, language):
        self.calls.append((language, tuple(texts)))
        return [f"[{language}] {text}" for text in texts]

    def test_initial_translation_preserves_ids_images_and_titles(self):
        output, state = translator.build_translations(
            self.sources, {}, {}, {}, self.fake_translate
        )
        self.assertEqual(len(self.calls), 3)
        self.assertEqual(len(self.calls[0][1]), 7)
        for lang in ("de", "fr", "ja"):
            project = output[lang]["projects"][0]
            self.assertEqual(project["title"], "My Project")
            self.assertEqual(project["images"], ["hero.jpg", "detail.jpg"])
            self.assertEqual(project["id"], "test")
            self.assertEqual(project["description"], f"[{lang}] Built by hand.")
            self.assertIn("projects/test/description", state[lang])

    def test_unchanged_data_costs_no_new_calls(self):
        first, state = translator.build_translations(
            self.sources, {}, {}, {}, self.fake_translate
        )
        self.calls.clear()
        output, _ = translator.build_translations(
            self.sources, first, state, {}, self.fake_translate
        )
        self.assertEqual(self.calls, [])
        self.assertEqual(output, first)

    def test_changed_field_only_and_overrides(self):
        first, state = translator.build_translations(
            self.sources, {}, {}, {}, self.fake_translate
        )
        self.calls.clear()
        self.sources["projects"][0]["description"] = "New text"
        overrides = {"de": {"projects": {"test": {"description": "Eigener Text"}}}}
        output, new_state = translator.build_translations(
            self.sources, first, state, overrides, self.fake_translate
        )
        self.assertEqual(output["de"]["projects"][0]["description"], "Eigener Text")
        self.assertEqual(self.calls, [("fr", ("New text",))])
        self.assertTrue(new_state["de"]["projects/test/description"].startswith("override:"))
        self.calls.clear()
        translator.build_translations(self.sources, output, new_state, {}, self.fake_translate)
        self.assertEqual(self.calls, [("de", ("New text",))])


if __name__ == "__main__":
    unittest.main()
