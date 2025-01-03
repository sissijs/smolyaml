# SmolYAML

SmolYAML is a minimalistic parser for YAML-like data.

YAML is a [complex spec](https://ruudvanasseldonk.com/2023/01/11/the-yaml-document-from-hell).

An `npm install yaml` weighs about 100kb of minified JavaScript.

SmolYAML is used in a static site generator that tries tries to be as minimalistic as possible.
That static site generator depends on YAML for parsing frontmatter, a block of meta data in template files.
But including the full YAML implementation would quite bloat it.

SmolYAML tries to address that by implementing only a small subset of the specification. To be fair,
it's an opinionated one that is (opinionatedly) considered good enough to parse frontmatter meta data.

In roughly 2KB of minified JavaScript.

## Usage

```sh
npm i @sissijs/smolyaml
```

```js
import { smolYAML } from '@sissijs/smolyaml';

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
