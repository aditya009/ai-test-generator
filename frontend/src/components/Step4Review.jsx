import { useState } from 'react'
import CucumberModal from './CucumberModal'

export default function Step4Review({ data, updateData, goToStep }) {
  const [selectedTestCase, setSelectedTestCase] = useState(data.testCases[0] || null)
  const [showCucumberModal, setShowCucumberModal] = useState(false)
  const [cucumberTestCase, setCucumberTestCase] = useState(null)

  // Available tags
  const availableTags = ['Functional', 'Regression', 'Smoke', 'Cucumber', 'API', 'UI', 'Integration', 'E2E']

  const handleTestCaseClick = (testCase) => {
    setSelectedTestCase(testCase)
  }

  const handleCucumberClick = (testCase, e) => {
    e.stopPropagation()
    setCucumberTestCase(testCase)
    setShowCucumberModal(true)
  }

  const handleTagToggle = (tag) => {
    if (!selectedTestCase) return

    const currentTags = selectedTestCase.tags || [selectedTestCase.type]
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag) // Remove tag
      : [...currentTags, tag] // Add tag

    const updatedTestCases = data.testCases.map(tc =>
      tc.id === selectedTestCase.id ? { ...tc, tags: newTags } : tc
    )

    updateData({ testCases: updatedTestCases })
    setSelectedTestCase({ ...selectedTestCase, tags: newTags })
  }

  const getTestCaseTags = (testCase) => {
    return testCase.tags || [testCase.type]
  }

  return (
    <div className="card">
      <h2 className="section-title">Review</h2>
      
      <div className="story-details">
        <h3>📋 Story Details</h3>
        <p>{data.storyId}: {data.storyDescription.substring(0, 150)}...</p>
      </div>

      <h3 className="subsection-title">✅ Test Cases (Generated + Added from Coverage)</h3>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '16px' }}>
        Select a test case to view and edit details
      </p>

      <div className="test-case-container">
        <div className="test-case-list-column">
          <div className="test-case-list">
            {data.testCases.map((tc) => (
              <div
                key={tc.id}
                className={`test-case-item ${selectedTestCase?.id === tc.id ? 'selected' : ''}`}
                onClick={() => handleTestCaseClick(tc)}
              >
                <div className="test-case-id">{tc.id}</div>
                <div className="test-case-title">{tc.title}</div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                  {getTestCaseTags(tc).map((tag, idx) => (
                    <span 
                      key={idx}
                      className="test-case-type-badge"
                      style={{
                        backgroundColor: tag === 'Cucumber' ? '#10b981' : 
                                       tag === 'Smoke' ? '#f59e0b' :
                                       tag === 'Regression' ? '#8b5cf6' :
                                       '#6366f1'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="test-case-details-column">
          <div className="test-case-details-panel">
            {selectedTestCase ? (
              <>
                <h3>{selectedTestCase.id}: {selectedTestCase.title}</h3>
                
                {/* Tag Selector */}
                <div className="test-case-details-section" style={{ marginTop: '16px' }}>
                  <div className="test-case-details-label">Tags (Click to add/remove)</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {availableTags.map(tag => {
                      const isSelected = getTestCaseTags(selectedTestCase).includes(tag)
                      return (
                        <button
                          key={tag}
                          onClick={() => handleTagToggle(tag)}
                          style={{
                            padding: '6px 12px',
                            border: isSelected ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            backgroundColor: isSelected ? 
                              (tag === 'Cucumber' ? '#10b981' :
                               tag === 'Smoke' ? '#f59e0b' :
                               tag === 'Regression' ? '#8b5cf6' :
                               '#6366f1') : 'white',
                            color: isSelected ? 'white' : '#6b7280',
                            transition: 'all 0.2s',
                            transform: isSelected ? 'scale(1.05)' : 'scale(1)'
                          }}
                          onMouseOver={(e) => {
                            if (!isSelected) e.target.style.borderColor = '#3b82f6'
                          }}
                          onMouseOut={(e) => {
                            if (!isSelected) e.target.style.borderColor = '#e5e7eb'
                          }}
                        >
                          {isSelected ? '✓ ' : ''}{tag}
                        </button>
                      )
                    })}
                  </div>
                  <div style={{ 
                    marginTop: '8px', 
                    fontSize: '0.75rem', 
                    color: '#6b7280',
                    fontStyle: 'italic'
                  }}>
                    Selected tags: {getTestCaseTags(selectedTestCase).join(', ') || 'None'}
                  </div>
                </div>

                {/* Cucumber Conversion Button */}
                <div style={{ marginTop: '12px', marginBottom: '12px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCucumberClick(selectedTestCase, e)
                    }}
                    className="button button-primary"
                    style={{ 
                      width: '100%',
                      backgroundColor: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
                  >
                    🥒 Convert to Cucumber BDD
                  </button>
                </div>

                <div className="test-case-details-section">
                  <div className="test-case-details-label">Precondition</div>
                  <div className="test-case-details-content">
                    <textarea 
                      value={selectedTestCase.precondition || 'No preconditions specified'}
                      onChange={(e) => {
                        const updatedTestCases = data.testCases.map(tc =>
                          tc.id === selectedTestCase.id ? { ...tc, precondition: e.target.value } : tc
                        )
                        updateData({ testCases: updatedTestCases })
                        setSelectedTestCase({ ...selectedTestCase, precondition: e.target.value })
                      }}
                    />
                  </div>
                </div>

                <div className="test-case-details-section">
                  <div className="test-case-details-label">Steps</div>
                  <div className="steps-list">
                    {(Array.isArray(selectedTestCase.steps) ? selectedTestCase.steps : [selectedTestCase.steps]).map((step, index) => (
                      <div key={index} className="step-item">
                        <div className="step-number-badge">{index + 1}</div>
                        <div className="step-item-content">{step}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="test-case-details-section">
                  <div className="test-case-details-label">Expected Results</div>
                  <div className="test-case-details-content">
                    <textarea 
                      value={selectedTestCase.expectedResult}
                      onChange={(e) => {
                        const updatedTestCases = data.testCases.map(tc =>
                          tc.id === selectedTestCase.id ? { ...tc, expectedResult: e.target.value } : tc
                        )
                        updateData({ testCases: updatedTestCases })
                        setSelectedTestCase({ ...selectedTestCase, expectedResult: e.target.value })
                      }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
                <p style={{ fontSize: '0.875rem' }}>Select a test case to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="button-group">
        <button className="button button-secondary" onClick={() => goToStep(3)}>
          ← Back
        </button>
        <button className="button button-primary" onClick={() => goToStep(5)}>
          📥 Export Test Cases
        </button>
      </div>

      {showCucumberModal && cucumberTestCase && (
        <CucumberModal
          testCase={cucumberTestCase}
          storyDescription={data.storyDescription}
          onClose={() => setShowCucumberModal(false)}
        />
      )}
    </div>
  )
}
