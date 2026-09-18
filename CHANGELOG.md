# Changelog

All notable changes to the Electro Shopify theme.

## [1.0.0] — 2026-09-18

First release. Electro ported from the Colorlib HTML template onto Shopify's
theme-blocks architecture, sharing its foundation with Furn, Fashe and ABC Book.

### Added

- `specs` theme block — a specification table driven by a product metafield in
  the `specs` namespace, accepting either a JSON list of `{label, value}` or a
  list of single-line `"Label: value"` strings. Renders nothing when unset.
  Added to the default product template.
- `products.product.spec_table_caption` storefront string.
- Electronics defaults: square card images, vendor shown as the brand, rating
  shown, finish swatches on.

### Notes

- `shopify theme check`: 99 files, 0 offenses.
- Palette and type from the original Electro template: crimson #d10024 on
  near-black #15161d, Montserrat, 2px radii, uppercase headings.
- `assets/base.css` is the canonical shared design system; `electro-html` syncs
  from this file and verifies its tokens against `config/settings_data.json`.
