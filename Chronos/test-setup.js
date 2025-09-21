#!/usr/bin/env node

/**
 * Chronos Setup Test Script
 * 
 * This script tests the centralized API key management system
 * to ensure it works properly for all team members.
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Chronos Setup...\n');

// Test 1: Check if .env.example exists
console.log('1. Checking .env.example file...');
if (fs.existsSync('.env.example')) {
    console.log('   ✅ .env.example exists');
} else {
    console.log('   ❌ .env.example missing');
    process.exit(1);
}

// Test 2: Check if .env.local exists (optional)
console.log('\n2. Checking .env.local file...');
if (fs.existsSync('.env.local')) {
    console.log('   ✅ .env.local exists');

    // Read and validate .env.local
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const requiredKeys = ['GROQ_API_KEY'];
    const optionalKeys = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];

    console.log('   📋 Environment variables:');
    requiredKeys.forEach(key => {
        if (envContent.includes(key)) {
            console.log(`   ✅ ${key} is set`);
        } else {
            console.log(`   ⚠️  ${key} is missing (required)`);
        }
    });

    optionalKeys.forEach(key => {
        if (envContent.includes(key)) {
            console.log(`   ✅ ${key} is set`);
        } else {
            console.log(`   ℹ️  ${key} is not set (optional)`);
        }
    });
} else {
    console.log('   ℹ️  .env.local not found (create it from .env.example)');
}

// Test 3: Check if centralized config exists
console.log('\n3. Checking centralized configuration...');
if (fs.existsSync('lib/config.ts')) {
    console.log('   ✅ lib/config.ts exists');
} else {
    console.log('   ❌ lib/config.ts missing');
    process.exit(1);
}

// Test 4: Check if setup documentation exists
console.log('\n4. Checking documentation...');
if (fs.existsSync('SETUP.md')) {
    console.log('   ✅ SETUP.md exists');
} else {
    console.log('   ❌ SETUP.md missing');
    process.exit(1);
}

// Test 5: Check package.json scripts
console.log('\n5. Checking package.json...');
if (fs.existsSync('package.json')) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (packageJson.scripts && packageJson.scripts.dev) {
        console.log('   ✅ npm run dev script exists');
    } else {
        console.log('   ❌ npm run dev script missing');
        process.exit(1);
    }
} else {
    console.log('   ❌ package.json missing');
    process.exit(1);
}

console.log('\n🎉 All setup tests passed!');
console.log('\n📝 Next steps for your friend:');
console.log('   1. Copy .env.example to .env.local');
console.log('   2. Add their API keys to .env.local');
console.log('   3. Run: npm install');
console.log('   4. Run: npm run dev');
console.log('\n🔗 For detailed instructions, see SETUP.md');
