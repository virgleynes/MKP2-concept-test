# Design Tokens (allow-list)

> **AUTO-GENERATED** by `scripts/gen-tokens.mjs` from `bench-shells`'s `design-tokens.css`.
> **DO NOT EDIT BY HAND** — run `npm run gen:tokens` to regenerate.
>
> These are the **only** valid design-system CSS custom properties. Token **names** are
> identical across every theme (Fusion / IAS / IES, light + dark); only **values** differ.
> The _Sample (Fusion light)_ column is illustrative only — always reference the token with
> `var(--name)`, never the literal value.
>
> **Hard rule: never invent a token name.** If a `--token` is not in this file, it does not
> exist. Use the closest listed token; fall back to a raw value only as a last resort.
>
> Total: 435 tokens.

## Most-needed tokens (start here)

| Token | Sample (Fusion light) | Use for |
| --- | --- | --- |
| `--color-container-background-primary` | `#ffffff` | card / surface background |
| `--color-page-background-primary` | `#ffffff` | page background |
| `--color-text-primary` | `#21262a` | default body text |
| `--color-text-secondary` | `#4c555b` | muted / secondary text |
| `--color-text-link` | `#0077c5` | links, interactive blue |
| `--color-divider-primary` | `#adbac2` | borders / hairlines |
| `--color-icon-primary` | `#21262a` | default icon color |
| `--radius-medium` | `6px` | default corner radius |
| `--radius-small` | `4px` | tight corner radius |
| `--space-small` | `12px` | small padding / gap |
| `--space-medium` | `16px` | default padding / gap |
| `--space-large` | `24px` | large padding / gap |
| `--space-component-gap-medium` | `8px` | gap between items in a component |
| `--space-container-padding-medium` | `20px` | padding inside a container |

## Pixel → token (spacing & radius)

When a design or existing CSS specifies a pixel value, map it to the token below instead
of hard-coding the `px`. (Derived from the real Fusion-light values; pick by intent — e.g.
use a gap/padding token for gaps and padding.)

| Pixels | Use this token |
| --- | --- |
| `2px` | `var(--radius-x-small)` |
| `4px` | `var(--radius-small)` |
| `6px` | `var(--radius-medium)` |
| `8px` | `var(--radius-large)` |
| `10px` | `var(--space-component-inline-padding-large)` |
| `12px` | `var(--space-small)` |
| `16px` | `var(--space-medium)` |
| `20px` | `var(--space-page-inline)` |
| `24px` | `var(--space-large)` |
| `32px` | `var(--space-container-padding-x-large)` |
| `40px` | `var(--space-x-large)` |
| `60px` | `var(--space-container-padding-xxx-large)` |
| `9999px` | `var(--radius-full)` |

## color

### color · action

| Token | Sample (Fusion light) |
| --- | --- |
| `--color-action-complementary` | `#5d686f` |
| `--color-action-complementary-active` | `#3c4348` |
| `--color-action-complementary-border` | `#ffffff` |
| `--color-action-complementary-focus` | `#5d686f` |
| `--color-action-complementary-hover` | `#4c555b` |
| `--color-action-complementary-subtle` | `rgba(255, 255, 255, 0)` |
| `--color-action-complementary-subtle-active` | `rgba(255, 255, 255, 0.2)` |
| `--color-action-complementary-subtle-focus` | `rgba(255, 255, 255, 0)` |
| `--color-action-complementary-subtle-hover` | `rgba(255, 255, 255, 0.1)` |
| `--color-action-negative` | `#b61a37` |
| `--color-action-negative-active` | `#6e0b1e` |
| `--color-action-negative-focus` | `#b61a37` |
| `--color-action-negative-hover` | `#8f1229` |
| `--color-action-negative-subtle` | `rgba(219, 51, 77, 0)` |
| `--color-action-negative-subtle-active` | `rgba(219, 51, 77, 0.2)` |
| `--color-action-negative-subtle-focus` | `rgba(219, 51, 77, 0)` |
| `--color-action-negative-subtle-hover` | `rgba(219, 51, 77, 0.1)` |
| `--color-action-passive` | `#e2e9ed` |
| `--color-action-passive-active` | `#c3ced5` |
| `--color-action-passive-border` | `#d5dee3` |
| `--color-action-passive-focus` | `#e2e9ed` |
| `--color-action-passive-hover` | `#d5dee3` |
| `--color-action-passive-subtle` | `rgba(133, 146, 153, 0)` |
| `--color-action-passive-subtle-active` | `rgba(133, 146, 153, 0.2)` |
| `--color-action-passive-subtle-focus` | `rgba(133, 146, 153, 0)` |
| `--color-action-passive-subtle-hover` | `rgba(133, 146, 153, 0.1)` |
| `--color-action-special-use` | `#2b77cc` |
| `--color-action-special-use-active` | `#17497f` |
| `--color-action-special-use-focus` | `#2b77cc` |
| `--color-action-special-use-hover` | `#205ea3` |
| `--color-action-special-use-subtle` | `rgba(43, 119, 204, 0)` |
| `--color-action-special-use-subtle-active` | `rgba(43, 119, 204, 0.2)` |
| `--color-action-special-use-subtle-focus` | `rgba(43, 119, 204, 0)` |
| `--color-action-special-use-subtle-hover` | `rgba(43, 119, 204, 0.1)` |
| `--color-action-standard` | `#003e31` |
| `--color-action-standard-active` | `#002b21` |
| `--color-action-standard-focus` | `#003e31` |
| `--color-action-standard-hover` | `#005244` |
| `--color-action-standard-subtle` | `rgba(0, 133, 109, 0)` |
| `--color-action-standard-subtle-active` | `rgba(0, 133, 109, 0.2)` |
| `--color-action-standard-subtle-focus` | `rgba(0, 133, 109, 0)` |
| `--color-action-standard-subtle-hover` | `rgba(0, 133, 109, 0.1)` |

### color · container

| Token | Sample (Fusion light) |
| --- | --- |
| `--color-container-background-accent` | `#e0edff` |
| `--color-container-background-accent-active` | `#a0cfff` |
| `--color-container-background-accent-focus` | `#e0edff` |
| `--color-container-background-accent-hover` | `#c5e1ff` |
| `--color-container-background-accent-selected` | `#a0cfff` |
| `--color-container-background-attention` | `#ffeac7` |
| `--color-container-background-attention-secondary` | `#ffd8a0` |
| `--color-container-background-attention-tertiary` | `#ffffff` |
| `--color-container-background-beta` | `#e1f9ff` |
| `--color-container-background-beta-secondary` | `#d9f6f5` |
| `--color-container-background-beta-tertiary` | `#ffffff` |
| `--color-container-background-complementary` | `#21262a` |
| `--color-container-background-info` | `#e0edff` |
| `--color-container-background-info-secondary` | `#c5e1ff` |
| `--color-container-background-info-tertiary` | `#ffffff` |
| `--color-container-background-inverse` | `#21262a` |
| `--color-container-background-negative` | `#ffe7e7` |
| `--color-container-background-negative-secondary` | `#ffd4d8` |
| `--color-container-background-negative-tertiary` | `#ffffff` |
| `--color-container-background-neutral` | `#e2e9ed` |
| `--color-container-background-neutral-secondary` | `#d9f6f5` |
| `--color-container-background-neutral-tertiary` | `#ffffff` |
| `--color-container-background-new` | `#ffe6f4` |
| `--color-container-background-new-secondary` | `#fbddf0` |
| `--color-container-background-new-tertiary` | `#ffffff` |
| `--color-container-background-positive` | `#d8ffdb` |
| `--color-container-background-positive-secondary` | `#afffb9` |
| `--color-container-background-positive-tertiary` | `#ffffff` |
| `--color-container-background-primary` | `#ffffff` |
| `--color-container-background-quaternary` | `#e2e9ed` |
| `--color-container-background-secondary` | `#f8fafb` |
| `--color-container-background-special-use-1` | `#7cbcff` |
| `--color-container-background-special-use-2` | `#00d5b0` |
| `--color-container-background-special-use-3` | `#ff808c` |
| `--color-container-background-special-use-4` | `#d5dee3` |
| `--color-container-background-tertiary` | `#f0f4f6` |
| `--color-container-border-accent` | `#00856d` |
| `--color-container-border-attention` | `#c84f00` |
| `--color-container-border-complementary` | `#5d686f` |
| `--color-container-border-info` | `#3492ef` |
| `--color-container-border-negative` | `#db334d` |
| `--color-container-border-positive` | `#00a63b` |
| `--color-container-border-primary` | `#c3ced5` |
| `--color-container-border-secondary` | `#d5dee3` |
| `--color-container-border-tertiary` | `#e2e9ed` |
| `--color-container-overlay` | `rgba(255, 255, 255, 0.5)` |

### color · data

| Token | Sample (Fusion light) |
| --- | --- |
| `--color-data-attention` | `#e56c1d` |
| `--color-data-attention-100` | `#f88a42` |
| `--color-data-attention-200` | `#e56c1d` |
| `--color-data-attention-300` | `#c84f00` |
| `--color-data-attention-400` | `#a53900` |
| `--color-data-category-1` | `#00b797` |
| `--color-data-category-1-background` | `#00eec5` |
| `--color-data-category-10` | `#e56c1d` |
| `--color-data-category-10-background` | `#fca354` |
| `--color-data-category-2` | `#17497f` |
| `--color-data-category-2-background` | `#7cbcff` |
| `--color-data-category-3` | `#8f4bff` |
| `--color-data-category-3-background` | `#c0abff` |
| `--color-data-category-4` | `#00d0e0` |
| `--color-data-category-4-background` | `#81f2fe` |
| `--color-data-category-5` | `#d72792` |
| `--color-data-category-5-background` | `#ff95d3` |
| `--color-data-category-6` | `#f9c741` |
| `--color-data-category-6-background` | `#fedb5e` |
| `--color-data-category-7` | `#2b77cc` |
| `--color-data-category-7-background` | `#a0cfff` |
| `--color-data-category-8` | `#a1cc3b` |
| `--color-data-category-8-background` | `#c5ef71` |
| `--color-data-category-9` | `#f7576c` |
| `--color-data-category-9-background` | `#ff9ba4` |
| `--color-data-negative` | `#db334d` |
| `--color-data-negative-100` | `#ff808c` |
| `--color-data-negative-200` | `#f7576c` |
| `--color-data-negative-300` | `#db334d` |
| `--color-data-negative-400` | `#b61a37` |
| `--color-data-neutral` | `#e2e9ed` |
| `--color-data-neutral-100` | `#adbac2` |
| `--color-data-neutral-200` | `#859299` |
| `--color-data-neutral-300` | `#5d686f` |
| `--color-data-neutral-400` | `#3c4348` |
| `--color-data-positive` | `#00892e` |
| `--color-data-positive-100` | `#3bd85e` |
| `--color-data-positive-200` | `#00bb42` |
| `--color-data-positive-300` | `#00a63b` |
| `--color-data-positive-400` | `#00892e` |
| `--color-data-primary` | `#00b797` |
| `--color-data-primary-100` | `#00d5b0` |
| `--color-data-primary-200` | `#00b797` |
| `--color-data-primary-300` | `#00a286` |
| `--color-data-primary-400` | `#00856d` |
| `--color-data-secondary` | `#17497f` |
| `--color-data-secondary-100` | `#205ea3` |
| `--color-data-secondary-200` | `#17497f` |
| `--color-data-secondary-300` | `#103661` |
| `--color-data-secondary-400` | `#00254a` |
| `--color-data-tertiary` | `#8f4bff` |
| `--color-data-tertiary-100` | `#a275ff` |
| `--color-data-tertiary-200` | `#8f4bff` |
| `--color-data-tertiary-300` | `#7c00f6` |
| `--color-data-tertiary-400` | `#6100c2` |

### color · divider

| Token | Sample (Fusion light) |
| --- | --- |
| `--color-divider-inverse` | `#ffffff` |
| `--color-divider-primary` | `#adbac2` |
| `--color-divider-secondary` | `#c3ced5` |
| `--color-divider-tertiary` | `#d5dee3` |

### color · icon

| Token | Sample (Fusion light) |
| --- | --- |
| `--color-icon-accent` | `#006a56` |
| `--color-icon-complementary` | `#ffffff` |
| `--color-icon-disabled` | `#859299` |
| `--color-icon-inverse` | `#ffffff` |
| `--color-icon-primary` | `#21262a` |
| `--color-icon-secondary` | `#4c555b` |

### color · input

| Token | Sample (Fusion light) |
| --- | --- |
| `--color-input-background-disabled` | `#e2e9ed` |
| `--color-input-background-error` | `#ffe7e7` |
| `--color-input-background-error-focus` | `#fff6f6` |
| `--color-input-background-primary` | `#ffffff` |
| `--color-input-background-primary-active` | `#ffffff` |
| `--color-input-background-primary-focus` | `#ffffff` |
| `--color-input-background-primary-hover` | `#f8fafb` |
| `--color-input-background-primary-selected` | `#006a56` |
| `--color-input-background-readonly` | `#f0f4f6` |
| `--color-input-background-secondary` | `#9aa7b0` |
| `--color-input-background-secondary-active` | `#727e85` |
| `--color-input-background-secondary-focus` | `#9aa7b0` |
| `--color-input-background-secondary-hover` | `#859299` |
| `--color-input-background-tertiary` | `#ffffff` |
| `--color-input-background-tertiary-active` | `#ffffff` |
| `--color-input-background-tertiary-focus` | `#ffffff` |
| `--color-input-background-tertiary-hover` | `#f8fafb` |
| `--color-input-background-warning` | `#ffeac7` |
| `--color-input-background-warning-focus` | `#fff7ec` |
| `--color-input-border-disabled` | `#c3ced5` |
| `--color-input-border-error` | `#b61a37` |
| `--color-input-border-primary` | `#c3ced5` |
| `--color-input-border-primary-active` | `#006a56` |
| `--color-input-border-primary-focus` | `#006a56` |
| `--color-input-border-primary-hover` | `#3c4348` |
| `--color-input-border-primary-selected` | `#006a56` |
| `--color-input-border-readonly` | `#859299` |
| `--color-input-border-secondary` | `#adbac2` |
| `--color-input-border-secondary-active` | `#006a56` |
| `--color-input-border-secondary-focus` | `#006a56` |
| `--color-input-border-secondary-hover` | `#3c4348` |
| `--color-input-border-tertiary` | `#859299` |
| `--color-input-border-tertiary-active` | `#006a56` |
| `--color-input-border-tertiary-focus` | `#006a56` |
| `--color-input-border-tertiary-hover` | `#3c4348` |
| `--color-input-border-warning` | `#e56c1d` |
| `--color-input-label` | `#4c555b` |
| `--color-input-placeholder` | `#859299` |
| `--color-input-placeholder-disabled` | `#859299` |

### color · link

| Token | Sample (Fusion light) |
| --- | --- |
| `--color-link-background` | `#e0edff` |
| `--color-link-background-visited` | `#f0e9ff` |
| `--color-link-text` | `#205ea3` |
| `--color-link-text-active` | `#103661` |
| `--color-link-text-complementary` | `#5dabff` |
| `--color-link-text-complementary-active` | `#a0cfff` |
| `--color-link-text-complementary-hover` | `#7cbcff` |
| `--color-link-text-complementary-visited` | `#b496ff` |
| `--color-link-text-focus` | `#205ea3` |
| `--color-link-text-hover` | `#17497f` |
| `--color-link-text-visited` | `#7c00f6` |

### color · other

| Token | Sample (Fusion light) |
| --- | --- |
| `--color-code-attribute` | `#00892e` |
| `--color-code-boolean` | `#6100c2` |
| `--color-code-comment` | `#adbac2` |
| `--color-code-keyword` | `#d72792` |
| `--color-code-line-highlight` | `#f0f4f6` |
| `--color-code-line-number` | `#859299` |
| `--color-code-number` | `#c84f00` |
| `--color-code-operator` | `#859299` |
| `--color-code-qualifier` | `#3bd85e` |
| `--color-code-string` | `#00828d` |
| `--color-code-text` | `#21262a` |
| `--color-code-type` | `#fca354` |
| `--color-code-variable-1` | `#21262a` |
| `--color-code-variable-2` | `#21262a` |
| `--color-code-variable-3` | `#fca354` |
| `--color-focus-indicator` | `#006a56` |
| `--color-loading-indicator` | `#003e31` |
| `--color-message-background-received` | `#e0edff` |
| `--color-message-background-sent` | `#f0f4f6` |
| `--color-message-text-received` | `#21262a` |
| `--color-message-text-sent` | `#21262a` |
| `--color-overlay` | `rgba(0, 0, 0, 0.4)` |
| `--color-progress-indicator` | `#006a56` |
| `--color-selection-indicator` | `#006a56` |
| `--color-shadow` | `rgba(76, 85, 91, 0.2)` |
| `--color-track-primary` | `#e2e9ed` |
| `--color-track-secondary` | `#c3ced5` |

### color · page-background

| Token | Sample (Fusion light) |
| --- | --- |
| `--color-page-background-accent` | `#e2e9ed` |
| `--color-page-background-primary` | `#ffffff` |
| `--color-page-background-secondary` | `#f8fafb` |
| `--color-page-background-tertiary` | `#f0f4f6` |

### color · text

| Token | Sample (Fusion light) |
| --- | --- |
| `--color-text-accent` | `#006a56` |
| `--color-text-complementary` | `#ffffff` |
| `--color-text-disabled` | `#859299` |
| `--color-text-highlight` | `#d7fdef` |
| `--color-text-inverse` | `#ffffff` |
| `--color-text-link` | `#0077c5` |
| `--color-text-negative` | `#b61a37` |
| `--color-text-primary` | `#21262a` |
| `--color-text-quaternary` | `#adbac2` |
| `--color-text-secondary` | `#4c555b` |
| `--color-text-tertiary` | `#859299` |

### color · ui

| Token | Sample (Fusion light) |
| --- | --- |
| `--color-ui-attention` | `#ba6025` |
| `--color-ui-attention-active` | `#a53900` |
| `--color-ui-attention-hover` | `#c84f00` |
| `--color-ui-beta` | `#00828d` |
| `--color-ui-completed` | `#006a56` |
| `--color-ui-discover` | `#3492ef` |
| `--color-ui-info` | `#2b77cc` |
| `--color-ui-negative` | `#b61a37` |
| `--color-ui-negative-active` | `#6e0b1e` |
| `--color-ui-negative-hover` | `#8f1229` |
| `--color-ui-neutral` | `#5d686f` |
| `--color-ui-neutral-active` | `#3c4348` |
| `--color-ui-neutral-focus` | `#5d686f` |
| `--color-ui-neutral-hover` | `#4c555b` |
| `--color-ui-neutral-selected` | `#3c4348` |
| `--color-ui-new` | `#d72792` |
| `--color-ui-positive` | `#00892e` |
| `--color-ui-primary` | `#003e31` |
| `--color-ui-primary-active` | `#002b21` |
| `--color-ui-primary-focus` | `#003e31` |
| `--color-ui-primary-hover` | `#005244` |
| `--color-ui-secondary` | `#2b3135` |
| `--color-ui-secondary-active` | `#181c1f` |
| `--color-ui-secondary-focus` | `#2b3135` |
| `--color-ui-secondary-hover` | `#21262a` |
| `--color-ui-tertiary` | `#f0f4f6` |
| `--color-ui-tertiary-active` | `#d5dee3` |
| `--color-ui-tertiary-focus` | `#f0f4f6` |
| `--color-ui-tertiary-hover` | `#e2e9ed` |

## space

| Token | Sample (Fusion light) |
| --- | --- |
| `--space-column-gap-large` | `24px` |
| `--space-column-gap-medium` | `20px` |
| `--space-column-gap-small` | `16px` |
| `--space-column-gap-x-large` | `40px` |
| `--space-column-gap-x-small` | `8px` |
| `--space-column-gap-xx-small` | `4px` |
| `--space-component-gap-large` | `12px` |
| `--space-component-gap-medium` | `8px` |
| `--space-component-gap-small` | `4px` |
| `--space-component-gap-x-small` | `2px` |
| `--space-component-inline-padding-large` | `10px` |
| `--space-component-inline-padding-medium` | `8px` |
| `--space-component-inline-padding-small` | `6px` |
| `--space-component-inline-padding-x-large` | `12px` |
| `--space-component-inline-padding-x-small` | `4px` |
| `--space-component-inline-padding-xx-large` | `16px` |
| `--space-component-inline-padding-xx-small` | `2px` |
| `--space-component-inline-padding-xxx-large` | `20px` |
| `--space-component-inline-padding-xxx-small` | `0` |
| `--space-component-stack-padding-large` | `8px` |
| `--space-component-stack-padding-medium` | `6px` |
| `--space-component-stack-padding-small` | `4px` |
| `--space-component-stack-padding-x-large` | `10px` |
| `--space-component-stack-padding-x-small` | `2px` |
| `--space-component-stack-padding-xx-small` | `0` |
| `--space-container-padding-large` | `24px` |
| `--space-container-padding-medium` | `20px` |
| `--space-container-padding-small` | `16px` |
| `--space-container-padding-x-large` | `32px` |
| `--space-container-padding-x-small` | `12px` |
| `--space-container-padding-xx-large` | `40px` |
| `--space-container-padding-xx-small` | `8px` |
| `--space-container-padding-xxx-large` | `60px` |
| `--space-container-padding-xxx-small` | `4px` |
| `--space-input-inline-padding-medium` | `10px` |
| `--space-input-inline-padding-small` | `8px` |
| `--space-input-stack-padding-medium` | `8px` |
| `--space-input-stack-padding-small` | `6px` |
| `--space-large` | `24px` |
| `--space-medium` | `16px` |
| `--space-page-inline` | `20px` |
| `--space-row-gap-large` | `40px` |
| `--space-row-gap-medium` | `20px` |
| `--space-row-gap-small` | `12px` |
| `--space-row-gap-x-large` | `60px` |
| `--space-row-gap-x-small` | `8px` |
| `--space-small` | `12px` |
| `--space-x-large` | `40px` |
| `--space-x-small` | `8px` |

## radius

| Token | Sample (Fusion light) |
| --- | --- |
| `--radius-action` | `6px` |
| `--radius-container-overlay` | `6px` |
| `--radius-content-control` | `6px` |
| `--radius-full` | `9999px` |
| `--radius-large` | `8px` |
| `--radius-medium` | `6px` |
| `--radius-none` | `0` |
| `--radius-small` | `4px` |
| `--radius-table` | `6px` |
| `--radius-x-large` | `12px` |
| `--radius-x-small` | `2px` |

## font-size

| Token | Sample (Fusion light) |
| --- | --- |
| `--font-size-action-large` | `20px` |
| `--font-size-action-medium` | `16px` |
| `--font-size-action-small` | `14px` |
| `--font-size-action-x-small` | `12px` |
| `--font-size-body-1` | `20px` |
| `--font-size-body-2` | `16px` |
| `--font-size-body-3` | `14px` |
| `--font-size-body-4` | `12px` |
| `--font-size-component-large` | `20px` |
| `--font-size-component-medium` | `16px` |
| `--font-size-component-small` | `14px` |
| `--font-size-component-x-large` | `24px` |
| `--font-size-component-x-small` | `12px` |
| `--font-size-display-1` | `84px` |
| `--font-size-display-2` | `72px` |
| `--font-size-display-3` | `60px` |
| `--font-size-display-4` | `48px` |
| `--font-size-heading-1` | `48px` |
| `--font-size-heading-2` | `40px` |
| `--font-size-heading-3` | `34px` |
| `--font-size-heading-4` | `28px` |
| `--font-size-heading-5` | `24px` |
| `--font-size-heading-6` | `20px` |
| `--font-size-input-label` | `14px` |
| `--font-size-input-label-small` | `14px` |
| `--font-size-input-text` | `16px` |
| `--font-size-input-text-small` | `14px` |
| `--font-size-mega-1` | `132px` |
| `--font-size-mega-2` | `120px` |
| `--font-size-mega-3` | `108px` |
| `--font-size-mega-4` | `96px` |

## font-weight

| Token | Sample (Fusion light) |
| --- | --- |
| `--font-weight-body` | `400` |
| `--font-weight-body-bold` | `600` |
| `--font-weight-body-semibold` | `500` |
| `--font-weight-component` | `400` |
| `--font-weight-component-bold` | `600` |
| `--font-weight-component-semibold` | `500` |
| `--font-weight-display` | `500` |
| `--font-weight-display-bold` | `700` |
| `--font-weight-heading` | `500` |
| `--font-weight-heading-bold` | `700` |
| `--font-weight-input-label` | `400` |
| `--font-weight-input-text` | `400` |
| `--font-weight-mega` | `400` |
| `--font-weight-mega-bold` | `500` |

## font-name

| Token | Sample (Fusion light) |
| --- | --- |
| `--font-name-body` | `Avenir Next forINTUIT` |
| `--font-name-component` | `Avenir Next forINTUIT` |
| `--font-name-display` | `Avenir Next forINTUIT` |
| `--font-name-heading` | `Avenir Next forINTUIT` |
| `--font-name-mega` | `Avenir Next forINTUIT` |

## line-height

| Token | Sample (Fusion light) |
| --- | --- |
| `--line-height-body` | `1.5` |
| `--line-height-component` | `1.3` |
| `--line-height-display` | `1.3` |
| `--line-height-heading` | `1.3` |
| `--line-height-mega` | `1.2` |

## duration

| Token | Sample (Fusion light) |
| --- | --- |
| `--duration-appear-emphasize-fast` | `500ms` |
| `--duration-appear-emphasize-moderate` | `700ms` |
| `--duration-appear-emphasize-slow` | `800ms` |
| `--duration-appear-fast` | `250ms` |
| `--duration-appear-moderate` | `300ms` |
| `--duration-appear-slow` | `350ms` |
| `--duration-disappear-emphasize-fast` | `500ms` |
| `--duration-disappear-emphasize-moderate` | `700ms` |
| `--duration-disappear-emphasize-slow` | `800ms` |
| `--duration-disappear-fast` | `200ms` |
| `--duration-disappear-moderate` | `250ms` |
| `--duration-disappear-slow` | `300ms` |
| `--duration-fade-fast` | `150ms` |
| `--duration-fade-moderate` | `200ms` |
| `--duration-fade-slow` | `250ms` |
| `--duration-progress-fast` | `500ms` |
| `--duration-progress-moderate` | `1000ms` |
| `--duration-progress-slow` | `1500ms` |
| `--duration-progress-slowest` | `2000ms` |
| `--duration-transform-emphasize-fast` | `500ms` |
| `--duration-transform-emphasize-moderate` | `700ms` |
| `--duration-transform-emphasize-slow` | `800ms` |
| `--duration-transform-fast` | `350ms` |
| `--duration-transform-moderate` | `400ms` |
| `--duration-transform-slow` | `450ms` |

## ease

| Token | Sample (Fusion light) |
| --- | --- |
| `--ease-appear` | `cubic-bezier(0, 0, 0.25, 1)` |
| `--ease-appear-emphasize` | `cubic-bezier(0.15, 1.4, 0.25, 1)` |
| `--ease-disappear` | `cubic-bezier(0.35, 0, 1, 1)` |
| `--ease-disappear-emphasize` | `cubic-bezier(0.4, 0, 0.6, -0.4)` |
| `--ease-fade` | `cubic-bezier(0.35, 0, 0.5, 1)` |
| `--ease-transform` | `cubic-bezier(0.35, 0, 0.25, 1)` |
| `--ease-transform-emphasize` | `cubic-bezier(0.35, 1.4, 0.25, 1)` |

## elevation

| Token | Sample (Fusion light) |
| --- | --- |
| `--elevation-level-0` | `0 0 0 0` |
| `--elevation-level-1` | `0 1px 4px 0` |
| `--elevation-level-2` | `0 2px 8px 0` |
| `--elevation-level-3` | `0 4px 16px 0` |
| `--elevation-level-4` | `0 6px 24px 0` |

## opacity

| Token | Sample (Fusion light) |
| --- | --- |
| `--opacity-disabled` | `0.5` |
| `--opacity-shadow` | `0.2` |

## size

| Token | Sample (Fusion light) |
| --- | --- |
| `--size-action-border` | `2px` |
| `--size-action-icon-large` | `28px` |
| `--size-action-icon-medium` | `24px` |
| `--size-action-icon-small` | `16px` |
| `--size-action-min-width-large` | `120px` |
| `--size-action-min-width-medium` | `100px` |
| `--size-action-min-width-small` | `80px` |
