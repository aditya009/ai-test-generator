import { useState, useEffect } from 'react'
import { llmService } from '../services/api'

export default function Step2Generate({ data, updateData, goToStep }) {
  const [loading, setLoading] = useState(false)
  const [selectedTestCase, setSelectedTestCase] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (data.testCases.length === 0) {
      generateTestCases()
    } else if (data.testCases.length > 0 && !selectedTestCase) {
      setSelectedTestCase(data.testCases[0])
    }
  }, [])

  const generateTestCases = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log('Sending request to backend:', {
        provider: data.llmProvider,
        appType: data.appType,
        storyId: data.storyId,
        hasApiKey: !!data.apiKey
      })

      const response = await llmService.generateTestCases({
        provider: data.llmProvider,
        apiKey: data.apiKey,
        appType: data.appType,
        storyId: data.storyId,
        storyDescription: data.storyDescription,
        promptMode: data.promptMode,
        customPrompt: data.customPrompt
      })

      console.log('Received response:', response)

      updateData({ testCases: response.testCases })
      if (response.testCases.length > 0) {
        setSelectedTestCase(response.testCases[0])
      }
    } catch (err) {
      console.error('Error generating test cases:', err)
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to generate test cases'
      const details = err.response?.data?.details
      
      setError(details ? `${errorMsg}\n\nDetails: ${details}` : errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleTestCaseClick = (testCase) => {
    setSelectedTestCase(testCase)
  }

  return (
    <div className="card">
      <h2 className="section-title">✅ Generated Test Cases</h2>
      
      <div className="story-details">
        <h3>📋 Story Details</h3>
        <p>{data.storyId}: {data.storyDescription.substring(0, 150)}...</p>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '16px' }}>
        <span id="testCaseCount">{data.testCases.length} test cases generated</span>
      </p>

      {error && (
        <div style={{ 
          padding: '12px', 
          backgroundColor: '#fee2e2', 
          border: '1px solid #ef4444', 
          borderRadius: '6px', 
          marginBottom: '16px',
          color: '#991b1b',
          fontSize: '0.875rem'
        }}>
          ❌ {error}
        </div>
      )}

      <div className="test-case-container">
        <div className="test-case-list-column">
          <div className="test-case-list" id="testCaseListStep2">
            {loading ? (
              <div className="loading fade-in">
                <div className="loading-spinner"></div>
                <p>
                  Generating test cases
                  <span className="analyzing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </p>
                <div style={{ marginTop: '20px', width: '80%' }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="skeleton-item">
                      <div className="skeleton-line short"></div>
                      <div className="skeleton-line medium"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : data.testCases.length > 0 ? (
              data.testCases.map((tc, index) => (
                <div
                  key={tc.id}
                  className={`test-case-item fade-in ${selectedTestCase?.id === tc.id ? 'selected' : ''}`}
                  onClick={() => handleTestCaseClick(tc)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="test-case-id">{tc.id}</div>
                  <div className="test-case-title">{tc.title}</div>
                  <span className="test-case-type-badge">{tc.type}</span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                <p>No test cases generated yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="test-case-details-column">
          <div id="testCaseDetailsPanel" className="test-case-details-panel">
            {loading ? (
              <div className="fade-in">
                <div className="skeleton-line" style={{ width: '70%', height: '24px', marginBottom: '16px' }}></div>
                <div className="skeleton-line" style={{ width: '30%', height: '16px', marginBottom: '24px' }}></div>
                <div className="skeleton-line" style={{ width: '100%', height: '80px', marginBottom: '24px' }}></div>
                <div className="skeleton-line" style={{ width: '100%', height: '120px', marginBottom: '24px' }}></div>
                <div className="skeleton-line" style={{ width: '100%', height: '80px' }}></div>
              </div>
            ) : selectedTestCase ? (
              <div className="fade-in">
                <h3>{selectedTestCase.id}: {selectedTestCase.title}</h3>
                <span className="test-case-type-badge">{selectedTestCase.type}</span>

                <div className="test-case-details-section" style={{ marginTop: '20px' }}>
                  <div className="test-case-details-label">Precondition</div>
                  <div className="test-case-details-content">
                    <textarea readOnly value={selectedTestCase.precondition || 'No preconditions specified'} />
                  </div>
                </div>

                <div className="test-case-details-section">
                  <div className="test-case-details-label">Steps</div>
                  <div className="steps-list">
                    {(Array.isArray(selectedTestCase.steps) ? selectedTestCase.steps : [selectedTestCase.steps]).map((step, index) => (
                      <div key={index} className="step-item slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="step-number-badge">{index + 1}</div>
                        <div className="step-item-content">{step}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="test-case-details-section">
                  <div className="test-case-details-label">Expected Results</div>
                  <div className="test-case-details-content">
                    <textarea readOnly value={selectedTestCase.expectedResult} />
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
                <p style={{ fontSize: '0.875rem' }}>Select a test case to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="button-group">
        <button className="button button-secondary" onClick={() => goToStep(1)}>
          ← Back to Setup
        </button>
        <button className="button button-secondary" onClick={() => goToStep(4)}>
          Skip to review
        </button>
        <button 
          className="button button-primary" 
          onClick={() => goToStep(3)}
          disabled={data.testCases.length === 0}
        >
          Continue to Check Coverage →
        </button>
      </div>
    </div>
  )
}
