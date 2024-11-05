---
title: CSS Test
tags: [Test]
keywords: [CSS]
description: CSS test
scripts: false
---

# CSS Test

<style>
    style.show { /* Make styles visible */
        display: block;
        border: 1px solid gray;
        border-radius: 5px;
        padding: 0.5em;
        background-color: var(--code-bg);
        /* Make it line break */
        white-space: pre-wrap;
        &::before {
            content: "CSS";
            display: block;
            border-bottom: 1px solid gray;
            text-align: center;
            margin-bottom: -1em;
        }
    }
</style>

## Placeholder

### Classical animation using `::placeholder`

<style class="show">
    #input1::placeholder {
        transition: all 0.2s;
    }
    #input1:focus::placeholder {
        color: cyan;
        display: block;
        font-size: 0.7em;
        transform: translateY(-1.5em);
    }
</style>

<input id="input1" type="text" placeholder="Input 1">

Problems:

- Overflowed part of the placeholder is not shown.
- Placeholder will not be shown if user types something.

### Classical animation using `::before`

<style class="show">
    #input2::before {
        content: attr(placeholder);
        position: absolute;
        color: gray;
        transition: all 0.2s;
    }
    #input2:focus::before {
        color: cyan;
        display: block;
        font-size: 0.7em;
        transform: translateY(-1.5em);
    }
</style>

<input id="input2" type="text" placeholder="Input 2">

Problems:

- Not working, since `input` is a replaced element.

### Simple opacity transition using `::placeholder`

<style class="show">
    #input3::placeholder {
        opacity: 1;
        transition: all 0.2s;
    }
    #input3:focus::placeholder {
        opacity: 0;
    }
</style>

<input id="input3" type="text" placeholder="Input 3">
