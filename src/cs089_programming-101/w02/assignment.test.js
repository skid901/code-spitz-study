const myJSON = {
  number: v => (isFinite(v) ? v.toString() : 'null'),
  string: v => '"' + escapeChk.convert(v) + '"',
  boolean: v => v.toString(),
  null: v => 'null',
  stringify(v) {
    return (this[typeof v] ?? this['null'])(v);
  },
};

const escapeChk = {
  data: {
    '"': '\\"',
    '\\': '\\',
    '/': '\\/',
    '\b': '\\b',
    '\f': '\\f',
    '\n': '\\n',
    '\r': '\\r',
    '\t': '\\t',
  },
  convert(str) {
    let acc = '';
    for (const chr of str) acc += this.data[chr] ?? chr;
    return acc;
  },
};

const err = msg => {
  throw msg;
};

const recursive = (_recursive => (
  (_recursive = (arr, idx) =>
    idx < arr.length
      ? (idx ? ',' : '[') +
        myJSON.stringify(arr[idx]) +
        _recursive(arr, idx + 1)
      : ']'),
  arr =>
    !Array.isArray(arr)
      ? err('invalid array')
      : arr.length
      ? _recursive(arr, 0)
      : '[]'
))();

const tailRecursive = (_recursive => (
  (_recursive = (arr, idx, acc) =>
    idx < arr.length
      ? _recursive(
          arr,
          idx + 1,
          acc + (idx ? ',' : '[') + myJSON.stringify(arr[idx]),
        )
      : acc + ']'),
  arr =>
    !Array.isArray(arr)
      ? err('invalid array')
      : arr.length
      ? _recursive(arr, 0, '')
      : '[]'
))();

const iteration = arr => {
  if (!Array.isArray(arr)) err('invalid array');
  if (arr.length) {
    let idx, acc;
    for (idx = 0, acc = ''; idx < arr.length; idx = idx + 1) {
      acc = acc + (idx ? ',' : '[') + myJSON.stringify(arr[idx]);
    }
    return acc + ']';
  } else return '[]';
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

  it('1. 재귀', () => {
    expect(recursive(arr)).toBe(expected(arr));
    expect(recursive([])).toBe(expected([]));
  });

  it('2. 꼬리 재귀', () => {
    expect(tailRecursive(arr)).toBe(expected(arr));
    expect(tailRecursive([])).toBe(expected([]));
  });

  it('3. 이터레이션', () => {
    expect(iteration(arr)).toBe(expected(arr));
    expect(iteration([])).toBe(expected([]));
  });
});
