import { useState } from 'react'

export default function CucumberModal({ testCase, onClose, storyDescription }) {
  const [framework, setFramework] = useState('playwright')
  const [activeTab, setActiveTab] = useState('feature')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const frameworks = {
    playwright: { name: 'Playwright', language: 'TypeScript', icon: '🎭' }
  }

  const handleConvert = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/cucumber/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testCase,
          framework,
          storyDescription
        })
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error converting to Cucumber:', error)
      alert('Failed to convert: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content)
    alert('✅ Copied to clipboard!')
  }

  const handleDownload = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>
              🥒 Convert to Cucumber BDD
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                fontSize: '1.5rem',
                cursor: 'pointer',
                borderRadius: '6px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>
          <p style={{ margin: '8px 0 0 0', fontSize: '0.875rem', opacity: 0.9 }}>
            {testCase.id}: {testCase.title}
          </p>
        </div>

        {/* Framework Info */}
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#eff6ff' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '12px',
            backgroundColor: '#3b82f6',
            borderRadius: '8px'
          }}>
            <span style={{ fontSize: '1.5rem', marginRight: '12px' }}>🎭</span>
            <div style={{ color: 'white' }}>
              <div style={{ fontWeight: '700', fontSize: '0.875rem' }}>Playwright</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>TypeScript - Modern E2E Testing</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
          {!result ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🥒</div>
              <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                Click the button below to convert this test case to Cucumber format
              </p>
              <button
                className="button button-primary"
                onClick={handleConvert}
                disabled={loading}
                style={{ minWidth: '200px' }}
              >
                {loading ? '⏳ Converting...' : '✨ Convert to Cucumber'}
              </button>
            </div>
          ) : (
            <div className="fade-in">
              {/* Tabs */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '2px solid #e5e7eb' }}>
                <button
                  onClick={() => setActiveTab('feature')}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    borderBottom: activeTab === 'feature' ? '2px solid #3b82f6' : '2px solid transparent',
                    background: 'none',
                    cursor: 'pointer',
                    fontWeight: activeTab === 'feature' ? '600' : '400',
                    color: activeTab === 'feature' ? '#3b82f6' : '#6b7280',
                    marginBottom: '-2px'
                  }}
                >
                  📄 Feature File
                </button>
                <button
                  onClick={() => setActiveTab('steps')}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    borderBottom: activeTab === 'steps' ? '2px solid #3b82f6' : '2px solid transparent',
                    background: 'none',
                    cursor: 'pointer',
                    fontWeight: activeTab === 'steps' ? '600' : '400',
                    color: activeTab === 'steps' ? '#3b82f6' : '#6b7280',
                    marginBottom: '-2px'
                  }}
                >
                  🔧 Step Definitions
                </button>
              </div>

              {/* Code Display */}
              {activeTab === 'feature' ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {result.featureFile.filename}
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="button button-secondary"
                        onClick={() => handleCopy(result.featureFile.content)}
                        style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                      >
                        📋 Copy
                      </button>
                      <button
                        className="button button-primary"
                        onClick={() => handleDownload(result.featureFile.content, result.featureFile.filename)}
                        style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                      >
                        💾 Download
                      </button>
                    </div>
                  </div>
                  <pre style={{
                    backgroundColor: '#1e293b',
                    color: '#e2e8f0',
                    padding: '20px',
                    borderRadius: '8px',
                    overflow: 'auto',
                    maxHeight: '400px',
                    fontSize: '0.75rem',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    <code>{result.featureFile.content}</code>
                  </pre>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {result.stepDefinitions.filename}
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="button button-secondary"
                        onClick={() => handleCopy(result.stepDefinitions.content)}
                        style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                      >
                        📋 Copy
                      </button>
                      <button
                        className="button button-primary"
                        onClick={() => handleDownload(result.stepDefinitions.content, result.stepDefinitions.filename)}
                        style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                      >
                        💾 Download
                      </button>
                    </div>
                  </div>
                  <pre style={{
                    backgroundColor: '#1e293b',
                    color: '#e2e8f0',
                    padding: '20px',
                    borderRadius: '8px',
                    overflow: 'auto',
                    maxHeight: '400px',
                    fontSize: '0.75rem',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    <code>{result.stepDefinitions.content}</code>
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {result && (
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              💡 Copy both files to your test automation project
            </span>
            <button className="button button-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
