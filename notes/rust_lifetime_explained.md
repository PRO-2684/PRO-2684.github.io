---
title: Rust Lifetime Explained (Mathematically)
tags: [Technical, Rust]
keywords: [rust, lifetime, mathematical, formal, explanation]
description: Explaining Rust lifetime formally from a mathematical perspective.
---

# 🦀 Rust Lifetime Explained (Mathematically)

## 📚 Introduction

> Disclaimer: This article assumes you have a basic understanding of Rust lifetimes. The following content is the author's personal opinion and may or may not be correct.

The [Rust Book](https://doc.rust-lang.org/book/) explains how you should use lifetime annotations in Rust. However, it doesn't explain clearly why you should use them that way. This article aims to explain Rust lifetime formally from a mathematical perspective.

## 🔢 Symbolic Representation

To be clear, I'll use the following symbols to represent different concepts:

- $\text{lifetime(x)}$: The lifetime of a variable $x$.
- $\text{Lifetime}$: The set of all possible lifetimes.
- $\min, \max$: Taking the minimum or maximum over given lifetimes, assuming that they are overlapping.

For simplicity, I'll refer to a lifetime in equations without the preceding `'`. Now, let's start from [Lifetime Annotations in Function Signatures](#lifetime-annotations-in-function-signatures) and compare my explanation with the Rust Book's explanation.

## ✍️ Lifetime Annotations in Function Signatures

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

> [Rust Book](https://doc.rust-lang.org/stable/book/ch10-03-lifetime-syntax.html#lifetime-annotations-in-function-signatures): The function signature now tells Rust that **for some** lifetime `'a`, the function takes two parameters, both of which are string slices *that* live at least as long as lifetime `'a`. The function signature also tells Rust that the string slice returned from the function will live at least as long as lifetime `'a`. In practice, it means that the lifetime of the reference returned by the `longest` function is the same as the smaller of the lifetimes of the values referred to by the function arguments. These relationships are what we want Rust to use when analyzing this code.

I found myself quite confused by the phrase "for some", and I'd explain it as follows:

The function signature now tells Rust that **for all** lifetime `'a`, the function takes two parameters, both of which are string slices. *If* both live at least as long as lifetime `'a`, the string slice returned from the function *must* live at least as long as lifetime `'a`, too. (skip)

Let's denote the return value of the function as $r$. Then, it can be formalized as:

$$
\forall a \in \text{Lifetime}, \\
\text{lifetime}(x) \supseteq a \land \text{lifetime}(y) \supseteq a \\
\Rightarrow \text{lifetime}(r) \supseteq a
$$

Which translates to:

$$
\text{lifetime}(r) \supseteq \min(\text{lifetime}(x), \text{lifetime}(y))
$$

In plain English, the lifetime of the return value $r$ is at least as long as the smaller of the lifetimes of the values referred to by the function arguments. Whoa! We've reached the same conclusion as the Rust Book, but with a more formal explanation! We'll see how this formal explanation helps us understand [Lifetime Annotations in Struct Definitions](https://doc.rust-lang.org/stable/book/ch10-03-lifetime-syntax.html#lifetime-annotations-in-struct-definitions) more clearly.

## 🏗️ Lifetime Annotations in Struct Definitions

```rust
struct ImportantExcerpt<'a> {
    part: &'a str,
}
```

> [Rust Book](https://doc.rust-lang.org/stable/book/ch10-03-lifetime-syntax.html#lifetime-annotations-in-struct-definitions): This struct has the single field `part` that holds a string slice, which is a reference. As with generic data types, we declare the name of the generic lifetime parameter inside angle brackets after the name of the struct so we can use the lifetime parameter in the body of the struct definition. This annotation means an instance of `ImportantExcerpt` can’t outlive the reference it holds in its `part` field.

Here, the Rust Book doesn't care to explain why "This annotation means" blah blah. However, I think not. For simplicity, let's denote an instance of `ImportantExcerpt` as $i$, and its field `part` as $p$. Then, it can be formalized as:

$$
\forall a \in \text{Lifetime}, \\
\text{lifetime}(i) \supseteq a \\
\Rightarrow \text{lifetime}(p) \supseteq a
$$

Note that here, we placed $\text{lifetime}(i)$ in the condition. You can think of it as a "return value" returned by a call to `ImportantExcerpt`. In JavaScript terms, the instance $i$ is returned by a call to the constructor function `ImportantExcerpt`, with argument `part` set to $p$. In this way, this example also follows the same pattern as the previous one. We can simplify the above equation as:

$$
\text{lifetime}(p) \supseteq \text{lifetime}(i)
$$

In plain English, the lifetime of the field `part` is at least as long as the lifetime of the instance of `ImportantExcerpt`. Again, we've reached the same conclusion as the Rust Book.

## 📝 Conclusion

In this article, I've explained Rust lifetime formally from a mathematical perspective. I hope this explanation helps you understand Rust lifetime better. If you have any suggestions or simply want to share your opinion, please feel free to open an issue on the [GitHub repository](https://github.com/PRO-2684/PRO-2684.github.io), or make a pull request to [this article](https://github.com/PRO-2684/PRO-2684.github.io/blob/master/notes/rust_lifetime_explained.md). Thanks for reading!
