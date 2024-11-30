---
title: Redirect
tags: [Secret]
keywords: [Redirect]
description: This is a page that allows you to redirect to another URL, useful for scenarios where only `http://` or `https://` URLs are allowed.
scripts: true
---

# Redirect

You're being redirected to [`None`](#). If nothing happens, click the link.

## About

This is a page that allows you to redirect to another URL, useful for scenarios where only `http://` or `https://` URLs are allowed. Simply pass the URL-encoded `url` parameter to this page, and you will be redirected to the specified URL. Or, you can use the form below to quickly make your redirect link (which will be copied to your clipboard and displayed below).

## Redirect Form

<form id="redirect-form">
    <label for="url">URL:</label>
    <input type="text" id="url" name="url" placeholder="https://example.com" required>
    <button type="submit">Redirect</button>
</form>

Result: <code id="result">...</code>
