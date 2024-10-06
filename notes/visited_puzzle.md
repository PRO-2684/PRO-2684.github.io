---
title: Visited Puzzle
tags: [Test, Latest]
keywords: [game, test, visited]
description: Making use of a little game to test if you have visited certain pages.
scripts: true
---

<style>
    .container {
        display: flex;
        gap: 0.5em;
        flex-wrap: wrap;
    }
    a.box {
        display: block;
        width: 4em;
        height: 4em;
        font-size: 1.5em;
        text-decoration: none;
        background-color: gray;
        &::after {
            display: none;
        }
        &:visited {
            background-color: cyan;
        }
        &.enabled:visited {
            background-color: gray;
        }
        &.enabled:link {
            background-color: red;
        }
    }
    #result {
        columns: 16em auto;
        & > li {
            &.visited::after {
                content: ": Visited";
                color: green;
            }
            &.not-visited::after {
                content: ": Not Visited";
                color: gray;
            }
        }
    }
</style>

# Visited Puzzle

## Introduction

This is a simple puzzle for you to solve, and if you solve it correctly, it can determine whether you have visited certain websites recently. Note that this is **fully offline** and does not send any data to any server, so you can safely play this game. You can view the source code of this page or use devtools to verify that it does not send any data.

## Game

> Click on the boxes to change their color. The goal is to **make all boxes gray**.

<div class="container"></div>

<button id="check">I'm done!</button> <button id="reset">Reset</button>

## Results

Coverage: <span id="coverage">N/A</span>

<ul id="result">
    <li>Complete the game to see the results.</li>
</ul>

## Mechanics

> It is strongly recommended to complete the game before viewing the mechanics, otherwise it will spoil the game.

<details>
    <summary>Click to Reveal</summary>When you visit a webpage, most browsers remember that action, allowing visited links to appear in a different color the next time you see them. In this puzzle, we make use of that behavior by styling the boxes with different colors depending on whether you've visited the linked pages or not.

1. **Visited Links**: Each box corresponds to a link. If you have previously visited the link associated with a box, it will appear **cyan**. If you haven't visited it, the box will be **gray**.

2. **Game Objective**: Your task is to click on the boxes to turn all of them **gray**. However, since visited links are automatically styled as cyan, this means you need to click on the cyan boxes to "toggle" them, which removes their `:visited` style.

3. **Enabling Clicks**: When you click a box, its state is toggled by adding a class (`enabled`), which changes the colors. If a visited box is clicked, it will turn gray, and if a non-visited box is clicked, it will turn red. So only if all the visited boxes are enabled and all the non-visited boxes are disabled, will you be able to turn all boxes gray.

4. **Result Evaluation**: When you click the "I'm done!" button, the game checks which boxes are enabled. If you correctly turned all boxes gray, all enabled boxes are visited links, and the game will display the results accordingly.

Some may ask why this game is necessary, and why not use `getComputedStyle` to check the color of the boxes directly. The reason is that [`getComputedStyle` does not work for `:visited` links due to security concerns](https://developer.mozilla.org/en-US/docs/Web/CSS/Privacy_and_the_:visited_selector). This game is a simple workaround utilizing social engineering.
</details>
