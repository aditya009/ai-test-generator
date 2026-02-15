import { useState } from 'react'
import { exportService, integrationService } from '../services/api'

export default function Step5Export({ data, updateData, goToStep }) {
  const [integration, setIntegration] = useState('testrail')
  const [loading, setLoading] = useState(false)
  const [cucumberFramework, setCucumberFramework] = useState('playwright')

  const handleExportCucumber = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/cucumber/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testCases: data.testCases,
          framework: cucumberFramework,
          storyDescription: data.storyDescription
        })
      })

      const result = await response.json()

      // Combine all features and steps into one text file
      let content = '# CUCUMBER FEATURE FILES\n\n'
      result.features.forEach(f => {
        content += `# ${f.filename}\n${f.content}\n\n${'='.repeat(80)}\n\n`
      })

      content += '\n\n# STEP DEFINITIONS\n\n'
      result.stepDefinitions.forEach(s => {
        content += `# ${s.filename}\n${s.content}\n\n${'='.repeat(80)}\n\n`
      })

      const blob = new Blob([content], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `cucumber-${cucumberFramework}-suite.txt`)
      document.body.appendChild(link)
      link.click()
      link.remove()

      alert(`✅ Generated ${result.count} Cucumber features with ${cucumberFramework} step definitions!`)
    } catch (error) {
      console.error('Error exporting Cucumber:', error)
      alert('Failed to export Cucumber suite')
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = async () => {
    try {
      await exportService.exportCSV({
        testCases: data.testCases,
        storyId: data.storyId
      })
      alert('✅ CSV file downloaded successfully!')
    } catch (error) {
      console.error('Error exporting CSV:', error)
      alert('Failed to export CSV')
    }
  }

  const handleExportExcel = async () => {
    try {
      await exportService.exportExcel({
        testCases: data.testCases,
        storyId: data.storyId
      })
      alert('✅ Excel file downloaded successfully!')
    } catch (error) {
      console.error('Error exporting Excel:', error)
      alert('Failed to export Excel')
    }
  }

  const handlePushToTestRail = async () => {
    setLoading(true)
    try {
      const response = await integrationService.pushToTestRail({
        testRailUrl: document.getElementById('testRailUrl')?.value || '',
        testRailEmail: document.getElementById('testRailEmail')?.value || '',
        testRailApiKey: document.getElementById('testRailApiKey')?.value || '',
        projectId: document.getElementById('testRailProject')?.value || '',
        testCases: data.testCases
      })
      alert('✅ ' + response.message)
    } catch (error) {
      console.error('Error pushing to TestRail:', error)
      alert('Failed to push to TestRail: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handlePushToZephyr = async () => {
    setLoading(true)
    try {
      const response = await integrationService.pushToZephyr({
        zephyrApiToken: document.getElementById('zephyrApiToken')?.value || '',
        zephyrRegion: document.getElementById('zephyrRegion')?.value || 'US',
        projectKey: document.getElementById('jiraProjectKey')?.value || '',
        testCases: data.testCases
      })
      alert('✅ ' + response.message)
    } catch (error) {
      console.error('Error pushing to Zephyr:', error)
      alert('Failed to push to Zephyr: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="section-title">Export and Integrations</h2>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '24px' }}>
        Integrate with your project management tools or download test data in various formats.
      </p>

      <h3 className="subsection-title" style={{ marginTop: '40px' }}>🥒 Cucumber BDD Automation</h3>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '16px' }}>
        Convert all test cases to Cucumber format with automation code
      </p>

      <div style={{ 
        padding: '20px', 
        backgroundColor: '#d1fae5', 
        borderRadius: '8px', 
        border: '2px solid #10b981',
        marginBottom: '24px'
      }}>
        <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '12px', color: '#065f46' }}>
          🚀 Generate Complete BDD Test Suite
        </h4>
        <p style={{ fontSize: '0.75rem', color: '#065f46', marginBottom: '12px' }}>
          Get {data.testCases.length} Cucumber .feature files + step definitions for your framework
        </p>
        
        <label style={{ fontSize: '0.75rem', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#065f46' }}>
          Automation Framework: Playwright 🎭
        </label>
        <div style={{ 
          padding: '12px', 
          backgroundColor: '#10b981', 
          color: 'white',
          borderRadius: '6px',
          textAlign: 'center',
          fontSize: '0.875rem',
          fontWeight: '600',
          marginBottom: '16px'
        }}>
          🎭 Playwright (TypeScript) - Modern, Fast & Reliable
        </div>

        <button 
          className="button button-primary" 
          onClick={handleExportCucumber}
          disabled={loading}
          style={{ width: '100%' }}
        >
          {loading ? '⏳ Generating...' : `🥒 Export ${data.testCases.length} Cucumber Tests (Playwright)`}
        </button>
      </div>

      <h3 className="subsection-title">Test Management Integration</h3>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '16px' }}>
        Push test cases directly to your test management tool
      </p>

      <div className="form-group">
        <label className="form-label">Integration tool</label>
        <div className="radio-group">
          <div className="radio-option">
            <input 
              type="radio" 
              id="integrationTestRail" 
              name="integration" 
              value="testrail"
              checked={integration === 'testrail'}
              onChange={(e) => setIntegration(e.target.value)}
            />
            <label htmlFor="integrationTestRail">TestRail</label>
          </div>
          <div className="radio-option">
            <input 
              type="radio" 
              id="integrationZephyr" 
              name="integration" 
              value="zephyr"
              checked={integration === 'zephyr'}
              onChange={(e) => setIntegration(e.target.value)}
            />
            <label htmlFor="integrationZephyr">Zephyr Scale</label>
          </div>
        </div>
        <div className="form-help">Choose which tool to push test cases to. Relevant fields will appear below.</div>
      </div>

      {integration === 'testrail' ? (
        <div id="testRailIntegration">
          <h3 className="subsection-title">
            TestRail Integration
            <span className="integration-badge" style={{ 
              display: 'inline-block',
              padding: '4px 12px',
              backgroundColor: '#10b981',
              color: 'white',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '500',
              marginLeft: '8px'
            }}>Connected</span>
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '16px' }}>
            Configure once, push cases.
          </p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '16px' }}>
            Sync your selected test cases directly with your TestRail instance. Connection is secure.
          </p>

          <div className="form-group">
            <label className="form-label">TestRail Domain/URL</label>
            <input type="text" id="testRailUrl" placeholder="https://your-domain.testrail.io" />
          </div>

          <div className="form-group">
            <label className="form-label">TestRail Email/Username</label>
            <input type="email" id="testRailEmail" placeholder="" />
          </div>

          <div className="form-group">
            <label className="form-label">TestRail API Key</label>
            <input type="password" id="testRailApiKey" placeholder="" />
            <div className="form-help">
              <a href="https://support.testrail.com/hc/en-us/articles/7077039051284-Accessing-the-TestRail-API" target="_blank">
                How to get API key
              </a> (My Settings → API)
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">TestRail Project ID or Name</label>
            <input type="text" id="testRailProject" placeholder="" />
          </div>

          <button 
            className="button button-primary" 
            style={{ marginTop: '16px' }}
            onClick={handlePushToTestRail}
            disabled={loading}
          >
            {loading ? '🔄 Pushing...' : '🚀 Push to TestRail →'}
          </button>
        </div>
      ) : (
        <div id="zephyrIntegration">
          <h3 className="subsection-title">
            Zephyr Scale Integration
            <span className="integration-badge" style={{ 
              display: 'inline-block',
              padding: '4px 12px',
              backgroundColor: '#10b981',
              color: 'white',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '500',
              marginLeft: '8px'
            }}>Connected</span>
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '16px' }}>
            Configure once, push cases.
          </p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '16px' }}>
            Sync your test cases to Zephyr Scale (Jira). Uses Bearer token. Connection is secure.
          </p>

          <div className="form-group">
            <label className="form-label">Zephyr API region</label>
            <select id="zephyrRegion">
              <option value="US">US (api.zephyrscale.smartbear.com)</option>
              <option value="EU">EU (eu.api.zephyrscale.smartbear.com)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Zephyr API token (Bearer)</label>
            <input type="password" id="zephyrApiToken" placeholder="" />
            <div className="form-help">
              <a href="https://support.smartbear.com/zephyr-scale-cloud/docs/en/rest-api/generating-api-access-tokens.html" target="_blank">
                How to get API token
              </a> (Jira profile → Zephyr Scale API keys)
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Jira project key</label>
            <input type="text" id="jiraProjectKey" placeholder="" />
          </div>

          <div className="form-group">
            <label className="form-label">Jira URL (for "Open Zephyr" link)</label>
            <input type="text" placeholder="https://helicopter.atlassian.net" />
            <div className="form-help">
              Your Jira domain so "Open Zephyr" opens test cases in your instance (e.g. https://helicopter.atlassian.net).
            </div>
          </div>

          <button 
            className="button button-primary" 
            style={{ marginTop: '16px' }}
            onClick={handlePushToZephyr}
            disabled={loading}
          >
            {loading ? '🔄 Pushing...' : '🚀 Push to Zephyr →'}
          </button>
        </div>
      )}

      <h3 className="subsection-title" style={{ marginTop: '40px' }}>Export Options</h3>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '16px' }}>
        Download test cases for local use.
      </p>

      <div className="export-option" style={{
        padding: '16px',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '4px' }}>CSV</h4>
          <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Commonly used for data import/export.</p>
        </div>
        <button className="button button-primary" onClick={handleExportCSV}>
          📥 Export as CSV
        </button>
      </div>

      <div className="export-option" style={{
        padding: '16px',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '4px' }}>XLSX</h4>
          <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Best for viewing and advanced analysis.</p>
        </div>
        <button className="button button-primary" onClick={handleExportExcel}>
          📊 Export as Excel
        </button>
      </div>

      <div className="button-group">
        <button className="button button-secondary" onClick={() => goToStep(4)}>
          ← Back
        </button>
        <button className="button button-secondary" onClick={() => goToStep(1)}>
          🔄 Generate More Cases
        </button>
      </div>
    </div>
  )
}
