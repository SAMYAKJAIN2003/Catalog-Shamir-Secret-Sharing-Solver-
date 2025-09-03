# Shamir Secret Sharing Solver

This project solves Shamir's Secret Sharing polynomial reconstruction problem using Lagrange interpolation.

## Problem Description

Given:
- `n` points (roots) in different number bases
- `k` minimum number of points needed to reconstruct polynomial of degree `m = k-1`
- Each point has format: `"x": { "base": "b", "value": "v" }`

Goal: Find the constant term of the polynomial (the secret).

## Algorithm

1. **Convert bases to decimal**: Convert each point's value from its given base to decimal
2. **Extract coordinates**: Use the key as x-coordinate and converted value as y-coordinate
3. **Lagrange interpolation**: Use the first `k` points to reconstruct the polynomial and evaluate at x=0

The constant term f(0) is calculated using:
```
f(0) = Σ(i=0 to k-1) yi * Π(j≠i) (-xj)/(xi-xj)
```

## Usage

```bash
npm start
```

## Test Cases

### Test Case 1
- Input: 4 points, need 3 points minimum
- Points: (1,4), (2,7), (3,12), (6,39)
- Expected output: The secret (constant term)

### Test Case 2  
- Input: 10 points, need 7 points minimum
- Large numbers in various bases
- Expected output: The secret (constant term)

## File Structure

- `shamir_solver.js` - Main solver implementation
- `package.json` - Node.js project configuration
- `README.md` - This file

## Implementation Details

- Uses precise arithmetic to handle large numbers
- Supports bases 2-36
- Implements Lagrange interpolation for polynomial reconstruction
- Includes manual verification for test case 1

## Output

The program outputs:
- The secret (constant term) for each test case
- Points used in calculation
- Manual verification for test case 1
