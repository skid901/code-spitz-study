const recursive = arr => (arr.length ? arr[0] + recursive(arr.slice(1)) : 0);

const tailRecursive = (_recursive => (
  (_recursive = (acc, _arr) =>
    _arr.length ? _recursive(_arr[0] + acc, _arr.slice(1)) : acc),
  arr => _recursive(0, arr)
))();

const iteration = arr => {
  let acc, _arr;
  for (
    acc = 0, _arr = arr;
    _arr.length;
    acc = _arr[0] + acc, _arr = _arr.slice(1)
  );
  return acc;
};

const expected = arr => arr.reduce((acc, cur) => acc + cur, 0);

describe('w01: 1차원 배열의 합을 구하는 함수를 재귀, 꼬래 재귀, 이터레이션 방식으로 구현', () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  it('1. 재귀', () => expect(recursive(arr)).toBe(expected(arr)));

  it('2. 꼬리 재귀', () => expect(tailRecursive(arr)).toBe(expected(arr)));

  it('3. 이터레이션', () => expect(iteration(arr)).toBe(expected(arr)));
});
