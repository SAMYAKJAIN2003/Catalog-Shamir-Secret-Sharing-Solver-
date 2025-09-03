// Shamir Secret Sharing Solver
// Solves polynomial reconstruction using Lagrange interpolation

/**
 * Converts a number from any base (2-36) to decimal
 * @param {string} value - The number as a string
 * @param {number} base - The base of the number system
 * @returns {number} The decimal representation
 */
function convertToDecimal(value, base) {
    const digits = '0123456789abcdefghijklmnopqrstuvwxyz';
    let result = 0;
    
    for (let i = 0; i < value.length; i++) {
        const digit = digits.indexOf(value[i].toLowerCase());
        if (digit === -1 || digit >= base) {
            throw new Error(`Invalid digit '${value[i]}' for base ${base}`);
        }
        result = result * base + digit;
    }
    
    return result;
}

/**
 * Performs Lagrange interpolation to find f(0) - the constant term
 * @param {Array<Array<number>>} points - Array of [x, y] coordinate pairs
 * @param {number} k - Number of points to use
 * @returns {number} The value of the polynomial at x=0 (the secret)
 */
function lagrangeInterpolation(points, k) {
    // Use only the first k points
    const selectedPoints = points.slice(0, k);
    let secret = 0;
    
    // Apply Lagrange interpolation formula to find f(0)
    for (let i = 0; i < selectedPoints.length; i++) {
        const [xi, yi] = selectedPoints[i];
        
        // Calculate the Lagrange basis polynomial Li(0)
        let basisValue = 1;
        for (let j = 0; j < selectedPoints.length; j++) {
            if (i !== j) {
                const [xj] = selectedPoints[j];
                // Li(0) = (0 - xj) / (xi - xj)
                basisValue *= (0 - xj) / (xi - xj);
            }
        }
        
        // Add this term to the sum: yi * Li(0)
        secret += yi * basisValue;
    }
    
    return Math.round(secret);
}

/**
 * Parses test case JSON and extracts coordinate points
 * @param {Object} testData - The test case JSON object
 * @returns {Object} Parsed data with points array and metadata
 */
function parseTestCase(testData) {
    const { n, k } = testData.keys;
    const points = [];
    
    // Extract all points from the test data
    for (let i = 1; i <= n; i++) {
        const key = i.toString();
        if (testData[key]) {
            const { base, value } = testData[key];
            const x = i;  // x-coordinate is the key
            const y = convertToDecimal(value, parseInt(base));  // y-coordinate is converted value
            points.push([x, y]);
        }
    }
    
    return {
        n,
        k,
        points,
        totalPointsFound: points.length
    };
}

/**
 * Main solver function
 * @param {Object} testData - The test case JSON
 * @returns {Object} Solution with secret and metadata
 */
function solveShamirSecretSharing(testData) {
    console.log("Processing test case...");
    
    const parsed = parseTestCase(testData);
    const { n, k, points, totalPointsFound } = parsed;
    
    console.log(`Expected points: ${n}`);
    console.log(`Found points: ${totalPointsFound}`);
    console.log(`Minimum points needed: ${k}`);
    
    if (totalPointsFound < k) {
        throw new Error(`Insufficient points: need ${k}, found ${totalPointsFound}`);
    }
    
    // Display the points being used
    console.log("\nPoints (x, y):");
    for (let i = 0; i < Math.min(points.length, k); i++) {
        console.log(`Point ${i + 1}: (${points[i][0]}, ${points[i][1]})`);
    }
    
    // Find the secret using Lagrange interpolation
    const secret = lagrangeInterpolation(points, k);
    
    return {
        secret,
        pointsUsed: k,
        totalPoints: totalPointsFound,
        polynomial_degree: k - 1
    };
}

// Test Case 1
const testCase1 = {
    "keys": { "n": 4, "k": 3 },
    "1": { "base": "10", "value": "4" },
    "2": { "base": "2", "value": "111" },
    "3": { "base": "10", "value": "12" },
    "6": { "base": "4", "value": "213" }
};

// Test Case 2
const testCase2 = {
    "keys": { "n": 10, "k": 7 },
    "1": { "base": "6", "value": "13444211440455345511" },
    "2": { "base": "15", "value": "aed7015a346d635" },
    "3": { "base": "15", "value": "6aeeb69631c227c" },
    "4": { "base": "16", "value": "e1b5e05623d881f" },
    "5": { "base": "8", "value": "316034514573652620673" },
    "6": { "base": "3", "value": "2122212201122002221120200210011020220200" },
    "7": { "base": "3", "value": "20120221122211000100210021102001201112121" },
    "8": { "base": "6", "value": "20220554335330240002224253" },
    "9": { "base": "12", "value": "45153788322a1255483" },
    "10": { "base": "7", "value": "1101613130313526312514143" }
};

// Run Test Case 1
console.log("==================== TEST CASE 1 ====================");
try {
    const result1 = solveShamirSecretSharing(testCase1);
    console.log(`\n*** SECRET FOUND: ${result1.secret} ***`);
    console.log(`Polynomial degree: ${result1.polynomial_degree}`);
    console.log(`Points used: ${result1.pointsUsed}/${result1.totalPoints}`);
} catch (error) {
    console.error(`Error in Test Case 1: ${error.message}`);
}

console.log("\n==================== TEST CASE 2 ====================");
try {
    const result2 = solveShamirSecretSharing(testCase2);
    console.log(`\n*** SECRET FOUND: ${result2.secret} ***`);
    console.log(`Polynomial degree: ${result2.polynomial_degree}`);
    console.log(`Points used: ${result2.pointsUsed}/${result2.totalPoints}`);
} catch (error) {
    console.error(`Error in Test Case 2: ${error.message}`);
}

// Manual verification for Test Case 1
console.log("\n============= MANUAL VERIFICATION (Test Case 1) =============");
console.log("Converting values to decimal:");
console.log(`Point 1: base 10, "4" → ${convertToDecimal("4", 10)}`);
console.log(`Point 2: base 2, "111" → ${convertToDecimal("111", 2)} (binary: 1×4 + 1×2 + 1×1)`);
console.log(`Point 3: base 10, "12" → ${convertToDecimal("12", 10)}`);
console.log(`Point 6: base 4, "213" → ${convertToDecimal("213", 4)} (quaternary: 2×16 + 1×4 + 3×1)`);

console.log("\nCoordinate points:");
console.log("(1, 4), (2, 7), (3, 12), (6, 39)");

console.log("\nUsing Lagrange interpolation with first 3 points to find f(0):");
const manualPoints = [[1, 4], [2, 7], [3, 12]];
const manualSecret = lagrangeInterpolation(manualPoints, 3);
console.log(`Manual calculation: f(0) = ${manualSecret}`);

// Export functions for testing (if running in Node.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        convertToDecimal,
        lagrangeInterpolation,
        solveShamirSecretSharing
    };
}