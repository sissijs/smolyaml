// smolYAML is a subset of YAML

/**
 * Parse a yaml value. Uses JSON.parse under the hood.
 * @param {string|undefined} str 
 * @returns {any}
 */
const parseValue = (str) => typeof str === "undefined" ? undefined : 
  str === null ? null :
  str === 'NaN' ? NaN : 
  str === 'undefined' ? undefined : 
  /^-?\d+(?:\.\d+)?(?:e\d+)?$/.test(str) || ['true', 'false', 'null'].includes(str) || /^['"{}[\]/]/.test(str) ? JSON.parse(str) : str;

/**
 * @typedef AnalyzedLine
 * Internal type used for parsing yaml line-by-line.
 * 
 * @property {number} t line type
 * @property {number} i indent level
 * @property {string} [k] key
 * @property {string} [v] value 
 */

/**
 * Parse lines analyzed by smolYAML and iteratively builds an object from it.
 * @param {AnalyzedLine[]} lines 
 * @returns 
 */
function buildObject(lines) {
  if (lines.length === 0) {
    return null;
  }
  if (lines.length === 1 && lines[0].t === 3) {
    return parseValue(lines[0].v)
  }
  const result = lines[0].t === 0 ? {} : [];
  let ref = result;
  /** @type {Array<[any, number]>} */
  const stack = [];
  let temp = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.t >= 3) {
      throw new Error('unsupported Syntax');
    }
    const nextLine = i < lines.length - 1 ? lines[i + 1] : null;
    const prop = line.k === 'prototype' || line.k === '__proto__' ? '_invalid_' : line.k;
    if (line.t === 2 && prop && ref instanceof Array) {
      temp = { [prop]: parseValue(line.v) };
      ref.push(temp);
      stack.push([ref, line.i]);
      ref = temp;
    }
    if (line.t === 0 && prop && ref instanceof Array === false) {
      if (line.v) {
        ref[prop] = parseValue(line.v);
      } else {
        ref[prop] = nextLine?.t === 0 ? {} : [];
      }
      if (nextLine && nextLine.i > line.i) {
        stack.push([ref, line.i]);
        ref = ref[prop];
        continue;
      }
    }
    if (line.t === 1 && line.v && ref instanceof Array) {
      ref.push(parseValue(line.v));
    }
    if (nextLine && nextLine.i < line.i) {
      let indent = line.i;
      while (indent > nextLine.i) {
        const stackItem = stack.pop();
        if (!stackItem) {
          throw new Error('stack underflow');
        }
        const [formerRef, formerIndent] = stackItem;
        ref = formerRef;
        indent = formerIndent;
      }
    }
  }
  return result;
}

/**
 * Like trim, but with counting the trimmed characters
 * @param {string} [str] input string
 * @returns {{slice: string, trimStart: number, trimEnd: number}}
 */
function countedTrim(str) {
  return (!str) ? { slice: '', trimStart: 0, trimEnd: 0 } : {
    slice: str.trim(),
    trimStart: str.length - str.trimStart().length,
    trimEnd: str.length - str.trimEnd().length
  };
}

/**
 * smolYAML, a subset of YAML
 * @param {string} str an arbitrary smolYAML string 
 * @returns {any} returns the parsed object 
 */
export function smolYAML(str) {
  /** @type {Array<AnalyzedLine|undefined>} */
  const analyzed = str?.split(/\r?\n/).map(line => {
    const trimmed = countedTrim(line);
    const m0 = trimmed.slice.match(/^(\w+):(.+)?$/);
    if (m0) {
      return { t: 0, i: trimmed.trimStart, k: m0[1], v: m0[2]?.trim() };
    }
    const m2 = trimmed.slice.match(/^- (\w+):(.+)$/)
    if (m2) {
      return { t: 2, i: trimmed.trimStart, k: m2[1], v: m2[2]?.trim() };
    }
    const m1 = trimmed.slice.match(/^- (.+)$/);
    if (m1) {
      return { t: 1, i: trimmed.trimStart, v: m1[1] };
    }
    if (trimmed.slice === '' || /^#|(\/\/)/.test(trimmed.slice)) {
      return undefined;
    }
    return { t: 3, i: trimmed.trimStart, v: trimmed.slice };
  }) ?? [];
  return buildObject(analyzed.filter(it => typeof it !== "undefined"));
}
