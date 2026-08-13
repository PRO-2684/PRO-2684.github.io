---
title: The Hidden Metadata Inside Jianying/CapCut GIF Exports
tags: [Technical]
keywords: [CapCut, Jianying, GIF, metadata, privacy, douyin_beauty_me, UID, DID]
description: A preliminary investigation into opaque UID and DID fields embedded in GIFs exported by Jianying/CapCut.
---

# The Hidden Metadata Inside Jianying/CapCut GIF Exports

[中文版本](/notes/douyin_beauty_me)

I was converting a GIF into a VP9/WebM sticker for Telegram when FFmpeg printed something I did not expect:

```text
Metadata:
  comment : {"source_type":"douyin_beauty_me","data":{...}}
```

The comment was JSON containing editor details, a project-like UUID, and two fields named `uid` and `did`. This post documents two GIFs; it does **not** establish that the values identify their creators or remain stable between exports.

## Reproduce it yourself

The two GIFs published with this post have had their UID and DID values sanitized (click to open in new tab and download):

![Sanitized sample 1](/attachments/douyin_beauty_me/1.gif) ![Sanitized sample 2](/attachments/douyin_beauty_me/2.gif)

```shell
ffprobe -v quiet -show_entries format_tags=comment -of default=nw=1:nk=1 1.gif
```

<details><summary>Inspect with ExifTool</summary>

```shell
exiftool -a -u -g1 -Comment 1.gif
```

</details>

The result begins:

```json
{
    "source_type": "douyin_beauty_me",
    "data": {
        "appVersion": "17.5.0",
        "os": "ios",
        "product": "lv",
        "isFromEditor": 1,
        "editorScene": "editor",
        "exportType": "export",
        "videoId": "9CD9257D-516C-40AD-84B4-8A4948970F8F"
    },
    "uid": "AAAA...AAAA==",
    "did": "AAAA...AAAA==",
    "sample_sanitized": true
}
```

<details><summary>A note about the sanitized samples</summary>

The original `uid` and `did` values may be sensitive, so I replaced each one with the Base64 representation of 256 zero bytes. I added `sample_sanitized:true` at the top level and changed nothing else in the JSON.

This preserves the metadata structure and lets you confirm that both placeholders decode to 256 bytes:

```console
$ ffprobe -v quiet -show_entries format_tags=comment -of default=nw=1:nk=1 1.gif | python -c "import base64,json,sys; m=json.loads(sys.stdin.buffer.read().decode('utf-8-sig')); print(len(base64.b64decode(m['uid'])), len(base64.b64decode(m['did'])))"
256 256
```

The public samples cannot reproduce the originals' high-entropy appearance; zeros make the substitution obvious.

</details>

## What is stored in the files?

The JSON is stored in a standard GIF Comment Extension, beginning at byte offset 800 in both samples—not an FFmpeg interpretation of unrelated bytes.

| Field        | Sample 1                                 | Sample 2                                 |
| ------------ | ---------------------------------------- | ---------------------------------------- |
| `appVersion` | `17.5.0`                                 | `18.8.0`                                 |
| `os`         | `ios`                                    | `ios`                                    |
| `product`    | `lv`                                     | `lv`                                     |
| `videoId`    | distinct UUID                            | distinct UUID                            |
| `uid`        | 344 Base64 characters, 256 decoded bytes | 344 Base64 characters, 256 decoded bytes |
| `did`        | 344 Base64 characters, 256 decoded bytes | 344 Base64 characters, 256 decoded bytes |

The original UID/DID values decoded to unreadable, high-entropy-looking bytes. Their 256-byte size is compatible with RSA-2048 output, but does not identify the encoding or prove cryptography.

<details><summary>A timestamp-like field</summary>

Both files contain an `autoPublishTemplatePreId` consisting of a UUID and a 13-digit integer. Interpreted as Unix milliseconds, the suffixes produce plausible dates. The field is undocumented, so they cannot yet be called export times.

</details>

## Why call them user and device identifiers?

CapCut defines **UID** as “User ID” and **DID** as “Device ID”, used by support to locate and troubleshoot accounts.[^capcut_uid] Its privacy policy also says it collects unique device identifiers and related technical data.[^capcut_privacy]

This establishes CapCut's terminology—not that the exported blobs equal the IDs shown in settings. They might be encrypted values, signed envelopes, temporary tokens, or something else.

## Beyond GIF

The namespace predates these samples and is not GIF-specific. A 2021 report found it in Jianying-exported video, including `product:"lv"`, resource IDs, and an export-varying `videoId`.[^xiaozhongpai] Wikimedia Commons exposes it in a JPEG from an image-editing workflow.[^wikimedia]

The behavior therefore spans formats, and websites can expose it to search engines. But those examples do not contain the newer opaque UID/DID blobs; this investigation only confirms those in two GIFs.

## Speculation: what might the opaque blobs enable?

> **Warning:** Everything in this section is speculative. The supplied files cannot distinguish among these possibilities.

Three plausible models:

1. **Vendor-resolvable identity envelopes.** Each blob could contain an account or installation identifier encrypted for ByteDance. Randomized encryption would make the bytes differ on every export while still allowing the holder of the private key to recover the same underlying identity.
2. **Public correlation tokens.** If either value is deterministic for an account or device, anyone could search for equality across files without decrypting it. A value need not reveal a person's name to become a useful tracking handle.
3. **Diagnostic or obsolete data.** The values could be export-scoped support tokens, misleading legacy fields, or non-resolvable data—with much smaller privacy impact.

Unequal ciphertexts do not disprove stable underlying data when randomized encryption is involved; field names and length do not prove that model either. The defensible question is:

> Can the party that created these blobs resolve independently distributed exports to the same account or device—and, if so, why are those blobs included in user-distributed files?

<details><summary>The experiment that would answer it</summary>

1. Export the same project several times from one account and device.
2. Export several unrelated projects from that same account and device.
3. Repeat while logged out.
4. Compare exports from the same account on two devices.
5. Compare two accounts on the same device.
6. Repeat before and after reinstalling the app.

Compare `uid`, `did`, `videoId`, the timestamp-like suffix, and the IDs displayed in the app. Equal blobs show public linkability; unequal blobs rule out equality matching, not vendor-side resolution.

</details>

## Inspecting and removing the metadata

ExifTool can remove the comment without re-encoding the animation:

```shell
exiftool -Comment= -o clean.gif input.gif
```

Alternatively, FFmpeg removes it while decoding and re-encoding:

```shell
ffmpeg -i input.gif -map_metadata -1 clean.gif
```

Verify removal:

```shell
ffprobe -v quiet -show_entries format_tags=comment -of default=nw=1:nk=1 clean.gif
```

No output means no comment was found. In my tests, adding `-c copy` preserved the extension despite `-map_metadata -1`; use ExifTool for lossless removal or let FFmpeg re-encode.

## Preliminary conclusion

Two recent Jianying/CapCut GIFs contained opaque 256-byte fields named UID and DID. Until controlled exports establish whether they are stable or resolvable, they are best described as a **potential correlation channel**—not proof of deanonymization.

<details><summary>What it does not establish</summary>

- The blobs have not been decoded or matched to the IDs shown in CapCut.
- Stability across exports, accounts, devices, or installations remains untested.
- Creator identification, deliberate tracking, and legal or security conclusions are not demonstrated.

</details>

---

[^capcut_uid]: [How to Find My UID / DID in CapCut?](https://www.capcut.com/help/uid-and-did-in-capcut), CapCut Help Center.

[^capcut_privacy]: [CapCut Privacy Policy](https://www.capcut.com/clause/privacy-policy?lang=en), section “Technical Information.”

[^xiaozhongpai]: [剪映APP导出的视频文件会携带识别符信息](https://www.xiaozhongpai.com/p/2472), 小众派.

[^wikimedia]: [File:Ryan Kopel in Dear Evan Hansen UK Tour 04.jpg](https://commons.wikimedia.org/wiki/File:Ryan_Kopel_in_Dear_Evan_Hansen_UK_Tour_04.jpg), Wikimedia Commons metadata.
