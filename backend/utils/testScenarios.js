export const testScenarios = {
  web: [
    { title: 'Verify login with valid credentials', area: 'Authentication', priority: 'High' },
    { title: 'Verify login with invalid credentials', area: 'Authentication', priority: 'High' },
    { title: 'Verify password reset functionality', area: 'Authentication', priority: 'High' },
    { title: 'Verify logout functionality', area: 'Authentication', priority: 'Medium' },
    { title: 'Verify session timeout handling', area: 'Authentication', priority: 'Medium' },
    { title: 'Verify form validation on empty fields', area: 'Form Validation', priority: 'High' },
    { title: 'Verify form validation with invalid email format', area: 'Form Validation', priority: 'Medium' },
    { title: 'Verify navigation menu functionality', area: 'Navigation', priority: 'Medium' },
    { title: 'Verify XSS prevention in input fields', area: 'Security', priority: 'High' },
    { title: 'Verify SQL injection prevention', area: 'Security', priority: 'High' }
  ],
  mobile: [
    { title: 'Verify app launches successfully', area: 'App Lifecycle', priority: 'High' },
    { title: 'Verify app handles background/foreground transitions', area: 'App Lifecycle', priority: 'High' },
    { title: 'Verify touch gestures (swipe, pinch, tap)', area: 'Touch Gestures', priority: 'High' },
    { title: 'Verify app works in portrait and landscape', area: 'Orientation', priority: 'High' },
    { title: 'Verify push notification functionality', area: 'Notifications', priority: 'High' },
    { title: 'Verify offline mode functionality', area: 'Network', priority: 'High' },
    { title: 'Verify camera permission request', area: 'Permissions', priority: 'Medium' },
    { title: 'Verify location permission request', area: 'Permissions', priority: 'Medium' }
  ],
  dashboard: [
    { title: 'Verify dashboard loads all widgets', area: 'Widget Display', priority: 'High' },
    { title: 'Verify widget shows correct data', area: 'Widget Display', priority: 'High' },
    { title: 'Verify widget displays error state when data unavailable', area: 'Widget Display', priority: 'High' },
    { title: 'Verify data filtering by date range', area: 'Data Filtering', priority: 'High' },
    { title: 'Verify chart/graph rendering', area: 'Data Visualization', priority: 'High' },
    { title: 'Verify export to CSV/Excel', area: 'Export', priority: 'High' },
    { title: 'Verify real-time data updates', area: 'Data Refresh', priority: 'High' }
  ]
};
