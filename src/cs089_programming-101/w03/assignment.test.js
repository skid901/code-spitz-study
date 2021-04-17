const JSOFF = {
  data: {
    number: v => numJSOFF.stringify(v),
    string: v => `"${strJSOFF.stringify(v)}"`,
    boolean: v => v.toString(),
  },
  stringify(v) {
    return this.data[typeof v]?.(v) ?? 'null';
  },
};

const numJSOFF = {
  data: [
    [isNaN, v => 'null'],
    [v => !isFinite(v), v => 'null'],
  ],
  stringify(v) {
    let rtn = v.toString();
    for (const [cond, toStr] of this.data) {
      if (cond(v)) {
        rtn = toStr(v);
        break;
      }
    }
    return rtn;
  },
};

const strJSOFF = {
  data: [
    ['"', '\\"'],
    ['\\', '\\'],
    ['/', '\\/'],
    ['\b', '\\b'],
    ['\f', '\\f'],
    ['\n', '\\n'],
    ['\r', '\\r'],
    ['\t', '\\t'],
  ],
  stringify(v) {
    let acc = '';
    for (const chr of v) {
      let curr = chr;
      for (const [k, _v] of this.data) {
        if (chr === k) {
          curr = _v;
          break;
        }
      }
      acc = `${acc}${curr}`;
    }
    return acc;
  },
};

const err = msg => {
  throw msg;
};

const recursive = (_recursive => (
  (_recursive = (cntxt, acc) => {
    if (cntxt.length) {
      const curr = cntxt[cntxt.length - 1];
      const { arr, idx } = curr;
      let _acc = acc;
      if (!idx) _acc = `${acc}${'['}`;

      if (idx < arr.length) {
        curr.idx = idx + 1;
        if (idx) _acc = `${_acc}${','}`;

        if (Array.isArray(arr[idx])) {
          cntxt.push({ arr: arr[idx], idx: 0 });
          return _recursive(cntxt, _acc);
        } else return _recursive(cntxt, `${_acc}${JSOFF.stringify(arr[idx])}`);
      } else {
        cntxt.pop();
        return _recursive(cntxt, `${_acc}]`);
      }
    } else return acc;
  }),
  arr =>
    !Array.isArray(arr)
      ? err('invalid array')
      : _recursive([{ arr, idx: 0 }], '')
))();

const loop = arr => {
  if (!Array.isArray(arr)) err('invalid array');

  const cntxt = [{ arr, idx: 0 }];
  let acc = '';
  while (cntxt.length) {
    const curr = cntxt[cntxt.length - 1];
    const { arr, idx } = curr;
    if (!idx) acc = `${acc}${'['}`;

    if (idx < arr.length) {
      curr.idx = idx + 1;
      if (idx) acc = `${acc}${','}`;

      if (Array.isArray(arr[idx])) cntxt.push({ arr: arr[idx], idx: 0 });
      else acc = `${acc}${JSOFF.stringify(arr[idx])}`;
    } else {
      cntxt.pop();
      acc = `${acc}]`;
    }
  }
  return acc;
};

const expected = arr => JSON.stringify(arr);

describe('w02: Array -> JSON String 함수를 재귀, 꼬리 재귀, 이터레이션 방식으로 구현', () => {
  const arr = [
    1,
    2,
    ['a', [3, 4], false, Infinity],
    5,
    [],
    NaN,
    [['abc"\\/\b\f\n\r\t'], -Infinity],
    ['b', 'c', [6, 7]],
    [],
  ];

  it('1. 재귀', () => {
    expect(recursive(arr)).toBe(expected(arr));
    expect(recursive([])).toBe(expected([]));
    expect(recursive([[[]]])).toBe(expected([[[]]]));
    expect(recursive([[], []])).toBe(expected([[], []]));
  });

  it('2. 루프', () => {
    expect(loop(arr)).toBe(expected(arr));
    expect(loop([])).toBe(expected([]));
    expect(loop([[[]]])).toBe(expected([[[]]]));
    expect(loop([[], []])).toBe(expected([[], []]));
  });
});
