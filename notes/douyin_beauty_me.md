---
title: The Hidden Metadata Inside Jianying/CapCut GIF Exports
tags: [Technical]
keywords: [CapCut, Jianying, GIF, metadata, privacy, douyin_beauty_me, UID, DID]
description: A preliminary investigation into opaque UID and DID fields embedded in GIFs exported by Jianying/CapCut.
---

# The Hidden Metadata Inside Jianying/CapCut GIF Exports

I was converting a GIF into a VP9/WebM sticker for Telegram when FFmpeg printed something I did not expect:

```text
Metadata:
  comment : {"source_type":"douyin_beauty_me","data":{...}}
```

The comment was not a harmless encoder name. It was a JSON object containing the editor version, operating system, workflow information, a project-like UUID, and two fields named `uid` and `did`.

This post documents what I could reproduce from two GIFs. It does **not** establish that an arbitrary recipient can identify their creator, or even that the identifiers remain stable between exports. Those are the questions that make the finding interesting—and the experiments still missing.

## Reproduce it yourself

The two GIFs published with this post have had their UID and DID values sanitized (click to open in new tab and download):

![Sanitized sample 1](/attachments/douyin_beauty_me/1.gif)

![Sanitized sample 2](/attachments/douyin_beauty_me/2.gif)

Run:

```shell
ffprobe -v quiet -show_entries format_tags=comment -of default=nw=1:nk=1 1.gif
```

ExifTool finds the same value:

```shell
exiftool -a -u -g1 -Comment 1.gif
```

The result begins like this:

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

The downloadable files contain the complete JSON rather than the abbreviated example above.

### A note about the sanitized samples

The original `uid` and `did` values may be sensitive, so I replaced each one with the Base64 representation of 256 zero bytes. I added `sample_sanitized:true` at the top level and changed nothing else in the JSON.

This lets you reproduce the location of the metadata, parse its structure, and confirm that both placeholder values decode to 256 bytes:

```shell
ffprobe -v quiet -show_entries format_tags=comment -of default=nw=1:nk=1 1.gif | python -c "import base64,json,sys; m=json.loads(sys.stdin.buffer.read().decode('utf-8-sig')); print(len(base64.b64decode(m['uid'])), len(base64.b64decode(m['did'])))"
```

Expected output:

```text
256 256
```

You cannot use the public samples to reproduce my observation that the original decoded values looked high-entropy: zeros were chosen precisely so nobody could mistake the replacements for real identifiers.

## What is stored in the files?

The JSON is stored in a standard GIF Comment Extension. In both samples the extension begins at byte offset 800, so this is not an FFmpeg-only interpretation of unrelated bytes.

The most relevant fields were:

| Field        | Sample 1                                 | Sample 2                                 |
| ------------ | ---------------------------------------- | ---------------------------------------- |
| `appVersion` | `17.5.0`                                 | `18.8.0`                                 |
| `os`         | `ios`                                    | `ios`                                    |
| `product`    | `lv`                                     | `lv`                                     |
| `videoId`    | distinct UUID                            | distinct UUID                            |
| `uid`        | 344 Base64 characters, 256 decoded bytes | 344 Base64 characters, 256 decoded bytes |
| `did`        | 344 Base64 characters, 256 decoded bytes | 344 Base64 characters, 256 decoded bytes |

The original decoded UID/DID values were not readable text. Their bytes looked high-entropy, consistent with an encrypted or otherwise opaque binary envelope.

Exactly 256 bytes is compatible with the output size of a 2048-bit RSA operation. That is only a clue, not identification of the scheme: many unrelated formats can have the same length, and blob size alone proves no cryptography.

Both files also contain an `autoPublishTemplatePreId` with a UUID followed by a 13-digit integer. Interpreted as Unix milliseconds, the suffixes correspond to plausible dates. The field is undocumented, however, so it would be premature to call either value the exact export time.

## Why call them user and device identifiers?

CapCut's own help page defines **UID** as “User ID” and **DID** as “Device ID.” It describes both as unique identifiers used by support to locate and troubleshoot an account.[^capcut-uid]

CapCut's privacy policy separately says that it automatically collects unique device identifiers, application versions, operating-system information, and other technical data.[^capcut-privacy]

Those sources establish that UID and DID have official meanings in CapCut. They do **not** prove that the opaque values exported in these GIFs are byte-for-byte the identifiers displayed in CapCut's settings. The exported values might instead be encrypted versions, signed envelopes, temporary tokens, or something else entirely.

## Beyond GIF

The `douyin_beauty_me` namespace predates these samples. A Chinese-language report updated in 2021 documented it in videos exported from Jianying, including `product:"lv"`, the operating system, resource IDs, and a `videoId` that reportedly changed on every export.[^xiaozhongpai]

The `douyin_beauty_me` namespace is not specific to GIF. The 2021 report documented it in Jianying-exported video files, while Wikimedia Commons exposes the same namespace in the metadata of a JPEG produced by an image-editing workflow.[^wikimedia] This suggests that the metadata-writing behavior spans multiple export formats and applications in ByteDance's editing ecosystem.

Those examples do not establish that every format contains the newer opaque UID/DID fields. This investigation confirms those fields only in the two GIF samples examined here.

This demonstrates that websites can preserve the metadata and expose it in HTML that search engines can index. It does not yet demonstrate that genuine modern UID/DID ciphertexts are commonly indexed.

## What this investigation establishes

- Both supplied GIFs contain valid `douyin_beauty_me` JSON in a GIF Comment Extension.
- Both contain top-level fields explicitly named `uid` and `did`.
- All four original values are valid Base64 and decode to opaque 256-byte blobs.
- The files identify an iOS editing workflow, `product:"lv"`, and application versions 17.5.0 and 18.8.0.
- The two `videoId`, UID, and DID values differ.

The last observation does not show that UID or DID rotates between exports. These are two uncontrolled files of different provenance, not repeated exports from one account and device.

## What it does not establish

- That Base64 decoding reveals an account or device ID.
- That two exports from the same user contain equal UID/DID blobs.
- That `did` refers to immutable physical hardware.
- That a third party can identify the creator of a GIF.
- That ByteDance actively searches the web for these values.
- That including the metadata was intended for tracking.
- That this behavior violates a particular law or constitutes a security vulnerability.

## Speculation: what might the opaque blobs enable?

> **Warning:** Everything in this section is speculative. The supplied files cannot distinguish among these possibilities.

Here are four models, ordered roughly from more concerning to less concerning:

1. **Vendor-resolvable identity envelopes.** Each blob could contain an account or installation identifier encrypted for ByteDance. Randomized encryption would make the bytes differ on every export while still allowing the holder of the private key to recover the same underlying identity.
2. **Public correlation tokens.** If either value is deterministic for an account or device, anyone could search for equality across files without decrypting it. A value need not reveal a person's name to become a useful tracking handle.
3. **Export-scoped diagnostic tokens.** The values could identify one export or support event, with any account association stored only on the vendor's servers. This might still permit vendor-side attribution but not third-party correlation.
4. **Non-resolvable opaque data.** The names may be misleading, obsolete, or filled with values that no longer support any meaningful lookup. In that case the privacy impact would be much smaller.

The first model is particularly easy to miss: unequal ciphertexts do not disprove stable underlying data when randomized encryption is involved. Conversely, the field names and 256-byte length do not prove that model either.

The provocative question is therefore not “Can anyone identify the author?” The defensible question is:

> Can the party that created these blobs resolve independently distributed exports to the same account or device—and, if so, why are those blobs included in user-distributed files?

## The experiment that would answer it

The next step is a controlled export matrix:

1. Export the same project several times from one account and device.
2. Export several unrelated projects from that same account and device.
3. Repeat while logged out.
4. Compare exports from the same account on two devices.
5. Compare two accounts on the same device.
6. Repeat before and after reinstalling the app.

For each file, compare `uid`, `did`, `videoId`, and the timestamp-like suffix. Also record the UID and DID displayed in the application's interface, without publishing them.

Equal exported blobs would directly show third-party linkability. Unequal blobs would rule out simple equality matching, but not vendor-side resolution. Answering the latter likely requires reverse engineering or cooperation from ByteDance.

## Inspecting and removing the metadata

To inspect a GIF:

```shell
ffprobe -v quiet -show_entries format_tags=comment -of default=nw=1:nk=1 input.gif
```

ExifTool can remove the comment without re-encoding the animation:

```shell
exiftool -Comment= -o clean.gif input.gif
```

Alternatively, FFmpeg removes it while decoding and re-encoding:

```shell
ffmpeg -i input.gif -map_metadata -1 clean.gif
```

Verify the result rather than assuming it worked:

```shell
ffprobe -v quiet -show_entries format_tags=comment -of default=nw=1:nk=1 clean.gif
```

No output means no comment was found.

One trap: in my tests, adding `-c copy` to the FFmpeg command preserved the GIF Comment Extension despite `-map_metadata -1`. Use ExifTool for lossless targeted removal, or let FFmpeg re-encode and verify the result.

## Preliminary conclusion

Jianying/CapCut's editing stack has embedded `douyin_beauty_me` provenance metadata in exported media for years. The two recent GIFs examined here go further: they contain opaque fields explicitly named UID and DID, each encoded as a 256-byte binary value.

That is enough to justify investigation, not enough to declare deanonymization. Until controlled exports reveal whether the values are stable or vendor-resolvable, the accurate description is a **potential correlation channel** embedded in files users are likely to distribute.

[^capcut-uid]: [How to Find My UID / DID in CapCut?](https://www.capcut.com/help/uid-and-did-in-capcut), CapCut Help Center.

[^capcut-privacy]: [CapCut Privacy Policy](https://www.capcut.com/clause/privacy-policy?lang=en), section “Technical Information.”

[^xiaozhongpai]: [剪映APP导出的视频文件会携带识别符信息](https://www.xiaozhongpai.com/p/2472), 小众派.

[^wikimedia]: [File:Ryan Kopel in Dear Evan Hansen UK Tour 04.jpg](https://commons.wikimedia.org/wiki/File:Ryan_Kopel_in_Dear_Evan_Hansen_UK_Tour_04.jpg), Wikimedia Commons metadata.
