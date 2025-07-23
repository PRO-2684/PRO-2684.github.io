---
title: Windows 11 Country Flag Emojis
tags: [Technical, Latest]
keywords: [Windows 11, Emoji, Country Flags, Segoe UI Emoji, seguiemj+country.ttf, seguiemj.ttf]
description: This article introduces a method for replacing emoji font on Windows 11, and provides the Segoe UI Emoji font with proper country flags.
---

## Introduction

Here's some of the country flags: 🇺🇸 🇬🇧 🇪🇸. Do you see flags, or ugly placeholders like `US`, `GB` and `ES`? If you're on unmodified Windows 11, it will be the latter case. As you may have already known, the emoji font on Windows 11 is called `Segoe UI Emoji`, usually located at `C:\Windows\Fonts\seguiemj.ttf`. So to add proper country flags, we can build our modified versions of it and force Windows use our font instead.

## Method

### Copying Font File

1. Download your preferred emoji font from [the following section](#ready-made-fonts). We'll use ["Segoe UI Emoji + Twemoji Country Flags"](#segoe-ui-emoji--twemoji-country-flags) for example.
2. Copy `seguiemj+country.ttf` to `C:\Windows\Fonts` in **elevated** mode via **command-line**.

    - Dragging and dropping in file explorer won't work, since that would install the font to the user fonts directory (`C:\Users\username\AppData\Local\Microsoft\Windows\Fonts`).
    - On PowerShell, [Git Bash](https://gitforwindows.org/#:~:text=and%20novices%20alike.-,Git%20BASH,-Git%20for%20Windows) or [NuShell](https://www.nushell.sh/): `cp path/to/seguiemj+country.ttf C:\Windows\Fonts\`.

### The Registry Hack

1. Open regedit by pressing `Win` + `R`, input `regedit` and pressing `Enter`.
2. Navigate to `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Fonts`.
3. Double click the entry named `Segoe UI Emoji (TrueType)` to edit it.
4. Set the value to `seguiemj+country.ttf` in the popup.

### Follow-up Work

Reboot your machine and enjoy!

## Ready-made Fonts

### Segoe UI Emoji + Twemoji Country Flags

📥 [seguiemj+country.ttf](/attachments/seguiemj+country.ttf).

This font is created by combining Segoe UI Emoji with country flag emojis from Twemoji (Emoji used by Twitter / X). However, since it is based on an older version of Segoe UI Emoji, by using this font:

- You'll only get 2D versions of the Segoe UI emoji. (Which I actually prefer to the 3D versions)
- Some recently added emojis will not display properly.

<details><summary>📸 Screenshots</summary>

![seguiemj+country_flags.png](/attachments/seguiemj+country_flags.png)

![seguiemj+country_missing_donkey.png](/attachments/seguiemj+country_missing_donkey.png)

</details>

### Noto Color Emoji (Google)

📥 [google_emoji_font_for_windows.ttf](https://github.com/perguto/Country-Flag-Emojis-for-Windows/blob/master/google_emoji_font_for_windows.ttf?raw=true).

This font is derived by making [Noto Color Emoji](https://fonts.google.com/download?family=Noto%20Color%20Emoji) compatible with Windows, and then changing its name. For more details, refer to [the readme](https://github.com/perguto/Country-Flag-Emojis-for-Windows?tab=readme-ov-file#how-i-did-it).

### Twemoji (Twitter / X)

You'll need to follow [their instructions](https://github.com/13rac1/twemoji-color-font?tab=readme-ov-file#replace-the-default-windows-emoji-fonts) instead, which is quite complex and does not work on all apps.

## The Regret Pill

In case you regret, simply do the reverse action:

1. Open regedit by pressing `Win` + `R`, input `regedit` and pressing `Enter`.
2. Navigate to `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Fonts`.
3. Double click the entry named `Segoe UI Emoji (TrueType)` to edit it.
4. Reset the value to `seguiemj.ttf` in the popup.
5. (Optional) Remove `C:\Windows\Fonts\seguiemj+country.ttf` in **elevated** mode via **command-line**.

## Credits

- [@Inf0soft on GitHub](https://github.com/Inf0soft), for [providing `seguiemj+country.ttf`](https://github.com/thedemons/merge_color_emoji_font/issues/5#issuecomment-1376091769).
- [@xhsmm on Zhihu](https://www.zhihu.com/people/xhsmm), for [showcasing the registry hack](https://www.zhihu.com/question/508120676/answer/3390044165) to replace built-in fonts on recent Windows 11.
- [@perguto on GitHub](https://github.com/perguto), for doing the [pioneering work](https://github.com/perguto/Country-Flag-Emojis-for-Windows) and providing `google_emoji_font_for_windows.ttf`.
