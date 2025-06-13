// Test script for LINE Channel Access Token
require('dotenv').config({ path: '.env.local' });

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

console.log('Testing LINE_CHANNEL_ACCESS_TOKEN configuration...');

if (!LINE_CHANNEL_ACCESS_TOKEN) {
  console.error('❌ LINE_CHANNEL_ACCESS_TOKEN is not configured!');
  console.log('Please create a .env.local file with your token:');
  console.log('LINE_CHANNEL_ACCESS_TOKEN=your_token_here');
  process.exit(1);
} else {
  console.log('✅ LINE_CHANNEL_ACCESS_TOKEN found!');
  
  // Check if token format looks valid (starts with a base64-like string)
  if (LINE_CHANNEL_ACCESS_TOKEN.match(/^[A-Za-z0-9+/=]+/)) {
    console.log('✅ Token format appears valid');
    
    // Mask the token for security when displaying
    const maskedToken = 
      LINE_CHANNEL_ACCESS_TOKEN.substring(0, 6) + 
      '...' + 
      LINE_CHANNEL_ACCESS_TOKEN.substring(LINE_CHANNEL_ACCESS_TOKEN.length - 6);
    
    console.log(`Token (masked): ${maskedToken}`);
    console.log('Length:', LINE_CHANNEL_ACCESS_TOKEN.length, 'characters');
    
    console.log('\nChecking if token can be used to access LINE API...');
    
    // Make a test request to LINE API
    fetch('https://api.line.me/v2/bot/info', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json().then(data => {
          console.log('✅ Token is valid! Successfully connected to LINE API');
          console.log('Bot information:');
          console.log(data);
        });
      } else {
        return response.text().then(text => {
          console.error('❌ Token validation failed!');
          console.error(`Status: ${response.status}`);
          console.error(`Response: ${text}`);
          
          if (response.status === 401) {
            console.error('\nYour token appears to be invalid or expired.');
            console.error('Please generate a new token from the LINE Developers Console.');
          }
        });
      }
    })
    .catch(error => {
      console.error('❌ Error testing the token:', error.message);
    });
  } else {
    console.warn('⚠️ Token format looks unusual - please verify it\'s correct');
  }
}
