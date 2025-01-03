# SmolYAML

SmolYAML is a minimalistic parser for YAML-like data.

YAML is a [complex spec](https://ruudvanasseldonk.com/2023/01/11/the-yaml-document-from-hell).

An `npm install yaml` weighs about 100kb of minified JavaScript.

This static site generator project tries to be as minimalistic as possible, but depends on YAML for
parsing frontmatter, which is a block of meta data in template files.

SmolYAML tries to address that by implementing only a small subset of the specification. To be fair,
an opinionated one that is (opinionatedly) considered good enough to parse frontmatter meta data.

In roughly 2KB of minified JavaScript.

## Usage

```sh
npm i @sissijs/smolyaml
```

```js
import { smolYAML } from 'smolyaml';

const metadata = `
name: Lea
description: Lea is a Web Developer
age: 42
details:
  frontend: She loves doing Front of the Frontend work
  fullstack: But she really hates being called a fullstack developer
`

console.log(smolYAML(metadata));
```

## Limitations

- Right now, multi-line string values aren't supported.
- Only a parser is provided.
