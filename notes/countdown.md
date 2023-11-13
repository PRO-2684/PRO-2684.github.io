---
title: Countdown
tags: [Test]
keywords: [Countdown, 倒计时]
description: Simple 60s countdown
scripts: true
---

# Countdown

<style>
    .countdown {
        font-size: 2rem;
        line-height: 1em;
        display: flex;
        justify-content: center;
    }
    .countdown>span.description {
        color: gray;
    }
    .countdown>span.countdown-digit {
        display: inline-block;
        height: 1em;
        overflow-y: hidden;
        margin: 0 0 0 .2em;
        cursor: pointer;
    }
    .countdown>span.countdown-digit::before {
        position: relative;
        content: "00\a 01\a 02\a 03\a 04\a 05\a 06\a 07\a 08\a 09\a 10\a 11\a 12\a 13\a 14\a 15\a 16\a 17\a 18\a 19\a 20\a 21\a 22\a 23\a 24\a 25\a 26\a 27\a 28\a 29\a 30\a 31\a 32\a 33\a 34\a 35\a 36\a 37\a 38\a 39\a 40\a 41\a 42\a 43\a 44\a 45\a 46\a 47\a 48\a 49\a 50\a 51\a 52\a 53\a 54\a 55\a 56\a 57\a 58\a 59\a 60\a";
        white-space: pre;
        top: calc(var(--value) * -1em);
        text-align: center;
        transition: top 1s cubic-bezier(1, 0, 0, 1);
    }
</style>
<div class="countdown">
    <span class="description">There's</span>
    <span class="countdown-digit" style="--value: 60;" title="Click to restart"></span>
    <span class="description">s left</span>
</div>
