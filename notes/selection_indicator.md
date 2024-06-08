---
title: Selection Indicator
tags: [Test]
keywords: [selection indicator]
description: Selection indicator test
scripts: true
---

# Selection Indicator

<style>
    .list-container {
        --item-height: 2em;
        --indicator-height: 1.5em;
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 0.5em;
        width: fit-content;
        border: 1px dashed var(--border-dim);
        border-radius: 1em;

        &::before { /* Selection Indicator */
            content: '';
            position: absolute;
            top: calc(1em + var(--item-height) * var(--selected, 0));
            left: 1em;
            width: 3px;
            height: var(--indicator-height);
            border-radius: 3px;
            background-color: cyan;
            transition: top 0.2s ease-in-out;
        }

        span {
            padding: 0 1em;
            width: fit-content;
            color: var(--text-dim);
            transition: color 0.2s;
            cursor: pointer;

            &[data-active], &:hover {
                color: var(--text);
            }
        }
    }
</style>
<div class="list-container">
    <span data-active>Option 1</span>
    <span>Option 2</span>
    <span>Option 3</span>
    <span>Option 4</span>
    <span>Option 5</span>
    <span>Option 6</span>
    <span>Option 7</span>
    <span>Option 8</span>
    <span>Option 9</span>
    <span>Option 10</span>
</div>
