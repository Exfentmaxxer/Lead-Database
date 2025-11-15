#!/usr/bin/env node

/**
 * Lead Database API Testing Script
 * Tests all major API endpoints
 */

const http = require('http');

const CONFIG = {
  host: 'localhost',
  port: 3000
};

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Test suite
const tests = [
  {
    name: 'Health Check',
    path: '/api/health',
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'Create Lead - Valid Data',
    path: '/api/submit',
    method: 'POST',
    data: {
      business_name: 'Test Restaurant',
      address: '123 Test Street, Test City, TS 12345',
      contact_name: 'John Doe',
      phone: '555-123-4567',
      email: 'john@test.com',
      hood_type: 'Type I - Grease',
      nfpa_deficiencies: 'None found',
      service_frequency: 'Quarterly',
      pricing_notes: '$500/quarter',
      follow_up_required: true,
      general_notes: 'Test entry'
    },
    expectedStatus: 201
  },
  {
    name: 'Create Lead - Missing Required Field',
    path: '/api/submit',
    method: 'POST',
    data: {
      business_name: 'Test Restaurant'
      // Missing address
    },
    expectedStatus: 400,
    shouldFail: true
  },
  {
    name: 'Create Lead - Invalid Email',
    path: '/api/submit',
    method: 'POST',
    data: {
      business_name: 'Test Restaurant',
      address: '123 Test St',
      email: 'invalid-email'
    },
    expectedStatus: 400,
    shouldFail: true
  },
  {
    name: 'Get All Records',
    path: '/api/records',
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'Get Single Record',
    path: '/api/record/1',
    method: 'GET',
    expectedStatus: 200,
    allowNotFound: true
  },
  {
    name: 'Search Records',
    path: '/api/search?q=test',
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'Search Records - Empty Query',
    path: '/api/search?q=',
    method: 'GET',
    expectedStatus: 400,
    shouldFail: true
  }
];

// Statistics
const stats = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0
};

/**
 * Make HTTP request
 */
function makeRequest(test) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: CONFIG.host,
      port: CONFIG.port,
      path: test.path,
      method: test.method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({
            status: res.statusCode,
            data: parsed,
            headers: res.headers
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: data,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (test.data) {
      req.write(JSON.stringify(test.data));
    }

    req.end();
  });
}

/**
 * Run a single test
 */
async function runTest(test, index) {
  stats.total++;

  console.log(`\n${colors.cyan}Test ${index + 1}/${tests.length}:${colors.reset} ${test.name}`);
  console.log(`${colors.blue}→${colors.reset} ${test.method} ${test.path}`);

  try {
    const response = await makeRequest(test);

    // Check if test should fail
    if (test.shouldFail) {
      if (response.status === test.expectedStatus) {
        console.log(`${colors.green}✓ PASSED${colors.reset} - Correctly failed with status ${response.status}`);
        stats.passed++;
        return true;
      } else {
        console.log(`${colors.red}✗ FAILED${colors.reset} - Expected status ${test.expectedStatus}, got ${response.status}`);
        stats.failed++;
        return false;
      }
    }

    // Check status code
    if (test.allowNotFound && response.status === 404) {
      console.log(`${colors.yellow}⊘ SKIPPED${colors.reset} - Resource not found (expected)`);
      stats.skipped++;
      return true;
    }

    if (response.status === test.expectedStatus) {
      console.log(`${colors.green}✓ PASSED${colors.reset} - Status ${response.status}`);

      // Show response data if available
      if (response.data && typeof response.data === 'object') {
        if (response.data.success !== undefined) {
          console.log(`  Success: ${response.data.success}`);
        }
        if (response.data.message) {
          console.log(`  Message: ${response.data.message}`);
        }
        if (response.data.count !== undefined) {
          console.log(`  Count: ${response.data.count}`);
        }
        if (response.data.id) {
          console.log(`  ID: ${response.data.id}`);
        }
      }

      stats.passed++;
      return true;
    } else {
      console.log(`${colors.red}✗ FAILED${colors.reset} - Expected status ${test.expectedStatus}, got ${response.status}`);
      console.log(`  Response:`, response.data);
      stats.failed++;
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}✗ FAILED${colors.reset} - ${error.message}`);
    stats.failed++;
    return false;
  }
}

/**
 * Check if server is running
 */
async function checkServer() {
  console.log(`${colors.cyan}Checking server...${colors.reset}`);

  try {
    await makeRequest({
      path: '/api/health',
      method: 'GET'
    });
    console.log(`${colors.green}✓ Server is running${colors.reset} on http://${CONFIG.host}:${CONFIG.port}\n`);
    return true;
  } catch (error) {
    console.log(`${colors.red}✗ Server is not running${colors.reset}`);
    console.log(`  Please start the server first: ${colors.yellow}npm start${colors.reset}\n`);
    return false;
  }
}

/**
 * Print test results
 */
function printResults() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`${colors.cyan}Test Results${colors.reset}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Total:   ${stats.total}`);
  console.log(`${colors.green}Passed:  ${stats.passed}${colors.reset}`);
  console.log(`${colors.red}Failed:  ${stats.failed}${colors.reset}`);
  console.log(`${colors.yellow}Skipped: ${stats.skipped}${colors.reset}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (stats.failed === 0) {
    console.log(`${colors.green}✓ All tests passed!${colors.reset}\n`);
    return true;
  } else {
    console.log(`${colors.red}✗ Some tests failed${colors.reset}\n`);
    return false;
  }
}

/**
 * Main test runner
 */
async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`${colors.cyan}Lead Database API Tests${colors.reset}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Check if server is running
  const serverRunning = await checkServer();
  if (!serverRunning) {
    process.exit(1);
  }

  // Run all tests
  for (let i = 0; i < tests.length; i++) {
    await runTest(tests[i], i);
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Print results
  const allPassed = printResults();

  // Exit with appropriate code
  process.exit(allPassed ? 0 : 1);
}

// Run tests
main().catch((error) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
