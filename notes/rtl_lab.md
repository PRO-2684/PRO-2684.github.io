---
title: RTL Lab
tags: [Test]
keywords: [Javascript, RLO, LRO, RTL, LTR, Unicode]
description: Some explanations and utils on Right-To-Left Override and Left-To-Right Override.
scripts: true
---

<style>
    .rtl-visualized {
        padding: 0.5em;
        margin: 1em 0;
        border: 1px dashed var(--border-dim);
        border-radius: 0.5em;
        transition: border-color 0.2s ease-in-out;

        &:hover {
            border-color: var(--border);
        }

        &[data-editable] {
            .cursor::before {
                content: "|";
                color: var(--text);
                animation: none;
            }
        }

        &[data-focused] {
            border-color: cyan;

            .cursor::before {
                animation: blink 1s infinite;
            }
        }

        div {
            padding: 0;
            display: inline-block;
            border: 1px solid;
            margin: 2px;

            &.rlo {
                color: red;
            }

            &.lro {
                color: green;
            }
        }
    }

    .rtl-control {
        padding: 0.5em;
        margin: 1em 0;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 1em;
    }

    ul > li > label {
        display: inline-block;
        width: 100%;
    }

    @keyframes blink {
        0%, 50% {
            opacity: 1;
        }
        51%, 100% {
            opacity: 0;
        }
    }
</style>
<style>
    /* Hide RLO and LRO characters */
    .rtl-visualized {
        span.rlo, span.lro {
            display: none;
        }
    }
</style>
<style>
    /* Hide border */
    .rtl-visualized div {
        border: none;
        margin: 0;
    }
</style>

# RTL Lab

## Explanation

The Unicode characters `U+202E` and `U+202D` are used to change the text direction of a string. The `U+202E` character is used to change the text direction to RTL (Right-To-Left) and the `U+202D` character is used to change the text direction to LTR (Left-To-Right). Thus, the `U+202E` character is called `RLO` (Right-To-Left Override) and the `U+202D` character is called `LRO` (Left-To-Right Override).

Below are some visualizations of the `RLO` and `LRO` characters. `RLO` is represented by the emoji `⬅️` and `LRO` is represented by the emoji `➡️`.

| Direction | Color |
| --------- | ----- |
| Default   | unset |
| LTR       | Green |
| RTL       | Red   |

<div class="rtl-visualized">Before LRO&#x202D;After LRO</div>
<div class="rtl-visualized">Before RLO&#x202E;After RLO</div>
<div class="rtl-visualized">Part A&#x202E;Part B&#x202D;Part C</div>

## Playground

Double click on the visualized text to focus on it, double click again or press `ESC` or click outside to unfocus. You can then use the arrow keys to move the cursor, `Backspace` and `Delete` keys to delete characters, and type to insert characters. Also, you can preview/edit the raw string on the input, and insert `RLO` and `LRO` characters by clicking the buttons.

<div class="rtl-visualized" data-editable>[Prefix]&#x202E;[xiffuS]&#x202D;Anytext</div>

## Settings

- [ ] Hide `RLO` and `LRO` characters.
- [ ] Hide border.

## References

- [Bidirectional_text](https://www.wikiwand.com/en/Bidirectional_text)
- [Bidirectional_Character_Types](https://www.unicode.org/reports/tr9/#Bidirectional_Character_Types)
