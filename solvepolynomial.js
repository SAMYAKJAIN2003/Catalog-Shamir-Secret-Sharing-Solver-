const fs = require("fs");

function parseValue(base, value) {
  return parseInt(value, parseInt(base));
}

function gaussJordan(A, b) {
  const n = A.length;
  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
        maxRow = k;
      }
    }
    [A[i], A[maxRow]] = [A[maxRow], A[i]];
    [b[i], b[maxRow]] = [b[maxRow], b[i]];

    const div = A[i][i];
    for (let j = i; j < n; j++) A[i][j] /= div;
    b[i] /= div;

    for (let k = 0; k < n; k++) {
      if (k === i) continue;
      const factor = A[k][i];
      for (let j = i; j < n; j++) A[k][j] -= factor * A[i][j];
      b[k] -= factor * b[i];
    }
  }
  return b;
}

function solvePolynomial(jsonData) {
  const n = jsonData.keys.n;
  const k = jsonData.keys.k;
  const degree = k - 1;

  const points = [];
  let idx = 1;
  while (points.length < k && idx <= n) {
    if (jsonData[idx]) {
      const y = parseValue(jsonData[idx].base, jsonData[idx].value);
      points.push([idx, y]); // use key as x
    }
    idx++;
  }

  const A = [];
  const b = [];
  for (let [x, y] of points) {
    const row = [];
    for (let p = 0; p <= degree; p++) {
      row.push(Math.pow(x, p));
    }
    A.push(row);
    b.push(y);
  }

  const coeffs = gaussJordan(A, b);
  return coeffs[0];
}

if (process.argv.length < 3) {
  console.log("Usage: node solvePolynomial.js testcase.json");
  process.exit(1);
}

const file = process.argv[2];
const data = JSON.parse(fs.readFileSync(file, "utf8"));

const c = solvePolynomial(data);
console.log(c);
