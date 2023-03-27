---
title: timeline
title_custom: true
tags: [Other]
created: 2022-03-24T13:35:41.920Z
modified: 2022-12-10T22:01:31.577Z
---

# 🗓️ Timeline
## 2022
### 3.21
Created this project.

### 3.22 ~ 3.24
Not documented.

### 3.24
1. Switch from hash `#` navigation to pjax like navigation, which takes advantage of url query strings and `pushState` method.
2. Display metadata.
3. Convert Notable `@note/xxx` link to `?page=xxx`, remove their `target` and `rel` attributes, and add `onclick` function as below. In this way, if the user clicks the note link directly, `load` will be invoked instead of refreshing or openning a new tab, while right click and middle click works just as fine.

    ```javascript
    nodes[i].onclick = function (e) {
        load(filename);
        e.preventDefault();
    }
    ```

### 3.25
1. Fix the behavior of reloading when hash changes.
2. Smooth anchor positioning.
3. Use `highlight.js` for syntax highlighting.

### 3.26
1. Fix the behavior of reloading when hash changes(bug reappeared, dunno why).
2. Fix the bug where hash argument disappeares after refreshing; Also add an `anchor_header` id for navigating to the top smoothly.
3. Store markdown content in `state`, so you don't have to request for it every time you go back or forward.
4. If no title set in metadata, document title is set to `<filename>.md - PRO's blog`; If error occured, document title is set to `<errcode> <errtext> - PRO's blog`.
5. Add link to markdown source code.
6. Better time display. (`2022-03-26T15:02:28.619Z` to `2022-03-26 15:02:28`)
7. More output during requests.

### 3.27
1. Border radius for `code` tags.
2. Change scrollbar style. (mostly from [MDN](https://developer.mozilla.org/))
3. Fix `blockquote` elements and add style for it.
4. Metadata changes when switching to another page.
5. Tags now have round borders.

### 3.28
1. Switch to relative units for most css.
2. Css for tables.

### 3.29
1. Self-adaptive anchors for every header.
2. Fix recurring "Unexpected loading" bugs.

### 3.30
1. Fix some annoying emoji problems.
2. Centered header; floating `info` div on wide screens; scroll to top button.

### 3.31
1. Scroll to top button.
2. Css improvements.

### 4.3
1. Use flex to redesign the layout.
2. Floating outline.
3. Use [css for smooth scrolling](https://gomakethings.com/how-to-animate-scrolling-to-anchor-links-with-one-line-of-css/). This not only reduced code size, but also improved performance and reduced potential bugs.

### 4.4
1. Amimation for anchors.
2. Selection colors.

### 4.7
1. Link color transition.

### 4.12
1. Use `::before` pseudo elements in anchors.

### 4.13
1. `flex` layout for side buttons, which will ease the process of adding buttons.
2. Unify naming rules.

### 4.17
1. Switch to [PrismJS](https://prismjs.com/) for syntax highlighting.

### 4.18
1. Use `sessionStorage` for storing articles temporarily.

### 4.20
1. Re-structure of layout on widescreen devices.

### 5.22
1. Prototype of secret notes.

### 5.27
1. Progress bars.

### 5.28
1. Moved to `index.html`.

### 5.29
1. Menu(outline) on narrow-screen devices.
2. Css improvements for light mode.

### 5.30
1. Overlay when menu is displayed.
2. Hide scroll bars on mobile devices.
3. Re-define wide screen to wider than `767px`.
4. Minor overlay-related bug fix.
5. Disable text selecting on buttons.

### 7.16
1. Bookmarks.
2. Icons for external links.

### 12.10
1. Tags made clickable.

## 2023
### 1.4
1. Css fix.

### 1.9
1. Fix $\LaTex$ in outline.

### 1.11
1. Render order fix.
2. Css fix.

### 3.21
1. Use async functions to improve performance.

### 3.24
1. Loading animation.

### 3.27
1. Using `fetch` instead of `XMLHttpRequest`.
2. Using built-in `searchParams`.
