#!/usr/bin/env node

/**
 * Test Gemini API Key
 * Usage: node test-gemini.js YOUR_API_KEY
 */

import axios from 'axios';

const apiKey = process.argv[2];

if (!apiKey) {
  console.error('❌ Please provide API key: node test-gemini.js YOUR_API_KEY');
  process.exit(1);
}

console.log('🔍 Testing Gemini API Key...\n');

const modelsToTry = [
  { name: 'gemini-1.5-flash-latest', version: 'v1beta' },
  { name: 'gemini-1.5-flash', version: 'v1beta' },
  { name: 'gemini-1.5-pro-latest', version: 'v1beta' },
  { name: 'gemini-1.5-pro', version: 'v1beta' },
  { name: 'gemini-pro', version: 'v1' },
  { name: 'gemini-pro', version: 'v1beta' }
];

async function testModel(model) {
  try {
    const url = `https://generativelanguage.googleapis.com/${model.version}/models/${model.name}:generateContent?key=${apiKey}`;
    
    const response = await axios.post(url, {
      contents: [{
        parts: [{
          text: 'Say hello'
        }]
      }]
    });

    console.log(`✅ SUCCESS: ${model.name} (${model.version})`);
    console.log(`   Response: ${response.data.candidates[0].content.parts[0].text.substring(0, 50)}...\n`);
    return true;
  } catch (error) {
    console.log(`❌ FAILED: ${model.name} (${model.version})`);
    console.log(`   Error: ${error.response?.status} - ${error.response?.data?.error?.message || error.message}\n`);
    return false;
  }
}

async function testAll() {
  console.log(`Testing ${modelsToTry.length} models...\n`);
  
  let successCount = 0;
  
  for (const model of modelsToTry) {
    const success = await testModel(model);
    if (success) successCount++;
  }
  
  console.log('═'.repeat(60));
  console.log(`\n📊 Results: ${successCount}/${modelsToTry.length} models working\n`);
  
  if (successCount === 0) {
    console.log('❌ No models worked. Your API key might be:');
    console.log('   1. Invalid or expired');
    console.log('   2. Not enabled for Gemini API');
    console.log('   3. Restricted by region/quota\n');
    console.log('💡 Get a new key from: https://makersuite.google.com/app/apikey\n');
  } else {
    console.log('✅ Your API key works!\n');
  }
}

testAll();
