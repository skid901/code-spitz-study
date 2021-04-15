const escapes = {
  '"': '\\"',
  '\\': '\\',
  '/': '\\/',
  '\b': '\\b',
  '\f': '\\f',
  '\n': '\\n',
  '\r': '\\r',
  '\t': '\\t',
};

const convertEscape = chr => (chr in escapes ? escapes[chr] : chr);

const primStringify = primitive => {
  switch (typeof primitive) {
    case 'number':
      return isFinite(primitive) ? '' + primitive : 'null';
    case 'string':
      return '"' + [...primitive].map(convertEscape).join('') + '"';
    case 'boolean':
      return primitive ? 'true' : 'false';
    default:
      return 'null';
  }
};

const recursive = (_recursive => (
  (_recursive = (arr, idx) =>
    idx < arr.length
      ? (idx ? ',' : '[') + primStringify(arr[idx]) + _recursive(arr, idx + 1)
      : ']'),
  arr => _recursive(arr, 0)
))();

const tailRecursive = (_recursive => (
  (_recursive = (arr, idx, acc) =>
    idx < arr.length
      ? _recursive(
          arr,
          idx + 1,
          acc + (idx ? ',' : '[') + primStringify(arr[idx]),
        )
      : acc + ']'),
  arr => _recursive(arr, 0, '')
))();

const iteration = arr => {
  let idx, acc;
  for (idx = 0, acc = ''; idx < arr.length; idx = idx + 1) {
    acc = acc + (idx ? ',' : '[') + primStringify(arr[idx]);
  }
  return acc + ']';
};

const expected = arr => JSON.stringify(arr);

describe('w02: Array -> JSON String 함수를 재귀, 꼬리 재귀, 이터레이션 방식으로 구현', () => {
  const arr = [
    1,
    Infinity,
    NaN,
    'abc"\\/\b\f\n\r\t',
    true,
    undefined,
    null,
    _ => 3,
    Symbol(),
  ];

  it('1. 재귀', () => expect(recursive(arr)).toBe(expected(arr)));

  it('2. 꼬리 재귀', () => expect(tailRecursive(arr)).toBe(expected(arr)));

  it('3. 이터레이션', () => expect(iteration(arr)).toBe(expected(arr)));
});
