---
title: 感觉不如汇编
tags: [Other]
keywords: [汇编, 抽象, 编程语言, 数学证明, 形式化证明, asm, assembly, programming language, mathematical proof, formal proof]
description: 在“如果一个语言的编译器是用另一种语言写的，那么这个语言就不如后者”的假设下，证明所有语言都不如汇编。
---

# 感觉不如汇编

## 背景

最近看到了一个思之令人发笑的言论：“Rust 编译器都是 C++ 写的，说明 Rust 没啥用不如 C++”。

<details><summary>聊天记录</summary>

![Screenshot 1](/attachments/not_as_good_as_asm_1.jpg)

![Screenshot 2](/attachments/not_as_good_as_asm_2.jpg)

</details>

让我们分析一下这句话隐含的逻辑。它的意思是，*如果一个语言的编译器是用另一种语言写的，那么这个语言就不如后者*。显然，这个逻辑是不成立的。接下来让我们证明：假设这个逻辑成立，那么 **所有语言都不如汇编**。

## 形式化定义

- $A < B$：语言 $A$ 不如语言 $B$。
- $\text{Compiler}(A, B)$：语言 $A$ 的编译器是用语言 $B$ 编写的。
- $\text{Language}$：所有可在计算机上执行的编程语言的集合。
- $\text{asm}$：汇编语言。
- $\text{Asm}(A)$：语言 $A$ 具有汇编性。汇编性定义如下：
  - $\text{Asm}(A) \Leftrightarrow A = \text{asm} \lor \exists B \in \text{Language}, \text{Compiler}(A, B) \land \text{Asm}(B)$。
  - 意思是：语言 $A$ 具有汇编性，当且仅当它自己就是汇编语言，亦或是它的编译器是由具有汇编性的语言编写的。
- 目标：证明 $\forall A \in \text{Language}, A \neq \text{asm} \Rightarrow A < \text{asm}$。

## 前提与假设

我们确立以下前提：

1. $<$ 是一个偏序关系，具有传递性。
2. 计算机只能运行汇编语言。
3. 我们只考虑能够在计算机上执行的编程语言。

我们的假设是：$\text{Compiler}(A, B) \Rightarrow A < B$。即，如果语言 $A$ 的编译器是用语言 $B$ 编写的，那么 $A$ 不如 $B$。

## 引理：所有语言都具有汇编性

我们根据某语言编译时所需的“中间语言”个数进行归纳证明。

- 基础情况：$A_0 = \text{asm}$ 时，显然 $\text{Asm}(A_0)$ 成立，因为汇编语言具有汇编性。
- 归纳假设：假设对于某个需要 $i$ 门中间语言的语言 $A_i$，$\text{Asm}(A_i)$ 成立。
- 归纳步骤：考虑某个需要 $i+1$ 门中间语言的语言 $A_{i+1}$，因为它需要能够在计算机上运行，那么 $\exists A_i, \text{Compiler}(A_{i+1}, A_i)$。根据归纳假设，$\text{Asm}(A_i)$ 成立。因此，$\text{Asm}(A_{i+1})$ 成立。

根据归纳法，我们得出结论：所有语言都具有汇编性。

$$\forall A \in \text{Language}, \text{Asm}(A)$$

## 证明：所有语言都不如汇编

给定任意需要 $n$ 门中间语言的编程语言 $A_n$，根据引理，$\text{Asm}(A_n)$ 成立。接下来我们通过归纳法证明：$A_n < \text{asm}$。

- 特殊情况：$n = 0$ 时，$A_0 = \text{asm}$，不满足 $A_0 \neq \text{asm}$。
- 基础情况：$A_1$ 需要一门中间语言，那么 $\text{Compiler}(A_1, \text{asm})$。根据假设，$A_1 < \text{asm}$。
- 归纳假设：假设对于某个需要 $i$ 门中间语言的语言 $A_i$，$A_i < \text{asm}$ 成立。
- 归纳步骤：考虑某个需要 $i+1$ 门中间语言的语言 $A_{i+1}$，因为 $\text{Compiler}(A_{i+1}, A_i)$，根据归纳假设，$A_i < \text{asm}$。根据假设，$A_{i+1} < A_i$。因为 $<$ 具有传递性，$A_{i+1} < \text{asm}$。

根据归纳法，我们得出结论：所有语言都不如汇编。

$$\forall A \in \text{Language}, A \neq \text{asm} \Rightarrow A < \text{asm}$$
