const recursive = (_recursive => (
  (_recursive = (idx, arr) =>
    idx < arr.length ? arr[idx] + _recursive(idx + 1, arr) : 0),
  arr => _recursive(0, arr)
))();

const tailRecursive = (_recursive => (
  (_recursive = (acc, idx, arr) =>
    idx < arr.length ? _recursive(acc + arr[idx], idx + 1, arr) : acc),
  arr => _recursive(0, 0, arr)
))();

const iteration = arr => {
  let acc, idx;
  for (acc = 0, idx = 0; idx < arr.length; acc = acc + arr[idx], idx = idx + 1);
  return acc;
};

const expected = arr => arr.reduce((acc, cur) => acc + cur, 0);

describe('w01: 1차원 배열의 합을 구하는 함수를 재귀, 꼬리 재귀, 이터레이션 방식으로 구현', () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  it('1. 재귀', () => expect(recursive(arr)).toBe(expected(arr)));

  it('2. 꼬리 재귀', () => expect(tailRecursive(arr)).toBe(expected(arr)));

  it('3. 이터레이션', () => expect(iteration(arr)).toBe(expected(arr)));
});
