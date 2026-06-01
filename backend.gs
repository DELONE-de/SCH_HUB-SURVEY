/**
 * ============================================
 * GOOGLE APPS SCRIPT BACKEND
 * Receives survey data and saves to Google Sheets
 * ============================================
 */

// Configuration
const CONFIG = {
  SHEET_NAME: 'Survey Responses',
  SHEET_ID: '1Apu_iMEOiydkcdKUjUSkF4pb-JXLVXE0lCVX_SjpgQU'
};

/**
 * Handle POST requests
 */
function doPost(e) {
  try {
    Logger.log('doPost triggered');
    if (!e) throw new Error('No event object received');
    Logger.log('e.parameter: ' + JSON.stringify(e.parameter));
    Logger.log('e.postData: ' + (e.postData ? e.postData.contents : 'null'));

    let data;
    if (e.parameter && e.parameter.data) {
      Logger.log('Parsing from e.parameter.data');
      data = JSON.parse(e.parameter.data);
    } else if (e.postData && e.postData.contents) {
      Logger.log('Parsing from e.postData.contents');
      data = JSON.parse(e.postData.contents);
    } else {
      throw new Error('No data received. e.parameter: ' + JSON.stringify(e.parameter));
    }

    Logger.log('Parsed data keys: ' + Object.keys(data).join(', '));
    saveToSheet(data);
    Logger.log('Saved to sheet successfully');

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, timestamp: new Date().toISOString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('ERROR in doPost: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle OPTIONS preflight
 */
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'running',
      message: 'Survey backend is active',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Save survey data to Google Sheets
 */
function saveToSheet(data) {
  const sheet = getOrCreateSheet();
  
  // Check if headers exist
  if (sheet.getLastRow() === 0) {
    createHeaders(sheet);
  }
  
  // Prepare row data
  const row = [
    new Date(), // Timestamp
    data.level || '',
    data.faculty || '',
    data.department || '',
    data.accommodation || '',
    data.primaryDevice || '',
    data.appUsageFrequency || '',
    
    // Academic Pain Points
    (data.academicChallenges || []).join(', '),
    data.missedUpdatesFrequency || '',
    data.timetableStress || '',
    (data.missedItems || []).join(', '),
    data.navigationDifficulty || '',
    (data.trackingMethods || []).join(', '),
    
    // Feature Validation
    JSON.stringify(data.featureRatings || {}),
    (data.topThreeFeatures || []).join(', '),
    data.mostNeededFeature || '',
    
    // AI Features
    data.aiUsage || '',
    (data.aiToolsUsed || []).join(', '),
    (data.aiPurposes || []).join(', '),
    data.desiredAiFeature || '',
    (data.regularAiFeatures || []).join(', '),
    data.weeklyAiFeature || '',
    (data.aiFrustrations || []).join(', '),
    
    // Payment & Premium
    data.willingToPay || '',
    (data.valuableFeatures || []).join(', '),
    data.priceRange || '',
    data.paymentModel || '',
    
    // Open Feedback
    data.biggestFrustration || '',
    data.dailyUseFeature || '',
    data.wishExisted || '',
    data.additionalSuggestions || '',
    
    // Early Access
    data.earlyAccess || false,
    data.name || '',
    data.email || '',
    data.whatsapp || '',
    
    // Metadata
    data.completionTime || ''
  ];
  
  // Append row
  sheet.appendRow(row);
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, sheet.getLastColumn());
}

/**
 * Get or create the responses sheet
 */
function getOrCreateSheet() {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  }
  
  return sheet;
}

/**
 * Create column headers
 */
function createHeaders(sheet) {
  const headers = [
    'Timestamp',
    
    // Section A - Student Profile
    'Level',
    'Faculty',
    'Department',
    'Accommodation',
    'Primary Device',
    'App Usage Frequency',
    
    // Section B - Academic Pain Points
    'Academic Challenges',
    'Missed Updates Frequency',
    'Timetable Stress',
    'Missed Items',
    'Navigation Difficulty',
    'Tracking Methods',
    
    // Section C - Feature Validation
    'Feature Ratings (JSON)',
    'Top 3 Features',
    'Most Needed Feature',
    
    // Section D - AI Features
    'AI Usage',
    'AI Tools Used',
    'AI Purposes',
    'Desired AI Feature',
    'Regular AI Features',
    'Weekly AI Feature',
    'AI Frustrations',
    
    // Section E - Payment & Premium
    'Willing to Pay',
    'Valuable Features',
    'Price Range',
    'Payment Model',
    
    // Section F - Open Feedback
    'Biggest Frustration',
    'Daily Use Feature',
    'Wish Existed',
    'Additional Suggestions',
    
    // Early Access
    'Early Access',
    'Name',
    'Email',
    'WhatsApp',
    
    // Metadata
    'Completion Time (seconds)'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Style headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285F4');
  headerRange.setFontColor('#FFFFFF');
  
  // Freeze header row
  sheet.setFrozenRows(1);
}

/**
 * Get response count (for display on success screen)
 */
function getResponseCount() {
  const sheet = getOrCreateSheet();
  return Math.max(0, sheet.getLastRow() - 1); // Subtract header row
}

/**
 * Test doPost locally from the Apps Script editor
 */
function testDoPost() {
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        level: '100',
        faculty: 'Engineering',
        department: 'Computer Science',
        accommodation: 'On-campus',
        primaryDevice: 'Mobile',
        appUsageFrequency: 'Daily',
        academicChallenges: ['Scheduling', 'Notifications'],
        missedUpdatesFrequency: 'Often'
      })
    }
  };
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}
