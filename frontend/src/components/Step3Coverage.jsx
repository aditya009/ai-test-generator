import { useState, useEffect } from 'react'
import { coverageService } from '../services/api'

export default function Step3Coverage({ data, updateData, goToStep }) {
  const [loading, setLoading] = useState(true)
  const [coverage, setCoverage] = useState(null)
  const [selectedMissing, setSelectedMissing] = useState([])

  useEffect(() => {
    analyzeCoverage()
  }, [])

  const analyzeCoverage = async () => {
    setLoading(true)
    
    try {
      const response = await coverageService.analyze({
        appType: data.appType,
        testCases: data.testCases
      })
      
      setCoverage(response.coverage)
      updateData({ coverage: response.coverage })
      
      // Select all missing by default
      setSelectedMissing(response.coverage.missing.map((_, index) => index))
    } catch (error) {
      console.error('Error analyzing coverage:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckboxChange = (index) => {
    setSelectedMissing(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const handleAddSuggestedTests = async () => {
    if (selectedMissing.length === 0) {
      alert('⚠️ Please select at least one test case to add.')
      return
    }

    const selectedAreas = selectedMissing.map(index => coverage.missing[index].area)

    try {
      const response = await coverageService.suggest({
        appType: data.appType,
        testCases: data.testCases,
        selectedAreas
      })

      const newTestCases = [...data.testCases, ...response.suggested]
      updateData({ testCases: newTestCases })

      alert(`✅ Added ${response.suggested.length} test case${response.suggested.length > 1 ? 's' : ''}!\n\nTotal test cases: ${newTestCases.length}\n\nRecalculating coverage...`)
      
      // Recalculate coverage
      setTimeout(() => {
        analyzeCoverage()
      }, 500)
    } catch (error) {
      console.error('Error adding suggested tests:', error)
      alert('Failed to add suggested tests')
    }
  }

  return (
    <div className="card">
      <h2 className="section-title">Coverage Analysis</h2>
      
      <div id="coverageLoading" className={loading ? '' : 'hidden'}>
        <div className="loading fade-in">
          <div className="loading-spinner"></div>
          <p>
            Analyzing test case coverage
            <span className="analyzing-dots">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </p>
          <div className="progress-bar" style={{ width: '60%', margin: '20px auto' }}></div>
        </div>
      </div>

      <div id="coverageResults" className={!loading && coverage ? '' : 'hidden'}>
        {coverage && (
          <>
            <div className="coverage-summary">
              <div className="coverage-stat-card">
                <div className="coverage-stat-number">{coverage.percentage}%</div>
                <div className="coverage-stat-label">Overall Coverage</div>
              </div>
              <div className="coverage-stat-card">
                <div className="coverage-stat-number">{coverage.coveredCount}</div>
                <div className="coverage-stat-label">Areas Covered</div>
              </div>
              <div className="coverage-stat-card">
                <div className="coverage-stat-number">{coverage.missingCount}</div>
                <div className="coverage-stat-label">Areas Missing</div>
              </div>
              <div className="coverage-stat-card">
                <div className="coverage-stat-number">{data.testCases.length}</div>
                <div className="coverage-stat-label">Total Test Cases</div>
              </div>
            </div>

            <div className="coverage-details">
              <h3 className="subsection-title">✅ Covered Areas</h3>
              <div className="coverage-list">
                {coverage.covered.length > 0 ? (
                  coverage.covered.map((test, index) => (
                    <div key={index} className="coverage-item covered">
                      <div className="coverage-item-icon">✅</div>
                      <div className="coverage-item-content">
                        <div className="coverage-item-title">{test.title}</div>
                        <div className="coverage-item-description">
                          <span style={{ 
                            backgroundColor: '#e0e7ff', 
                            padding: '2px 8px', 
                            borderRadius: '4px', 
                            fontSize: '0.75rem', 
                            color: '#4338ca', 
                            fontWeight: '500' 
                          }}>
                            {test.area}
                          </span>
                          <span style={{ marginLeft: '8px', color: '#059669', fontWeight: '500' }}>
                            Priority: {test.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    No test cases match the coverage criteria yet.
                  </p>
                )}
              </div>

              <h3 className="subsection-title" style={{ marginTop: '32px' }}>
                ⚠️ Missing Coverage - Suggestions
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '16px' }}>
                The following areas are not covered by your current test cases. Would you like to add them?
              </p>
              <div className="coverage-list">
                {coverage.missing.length > 0 ? (
                  coverage.missing.map((test, index) => (
                    <div key={index} className="coverage-item missing">
                      <div className="coverage-item-checkbox">
                        <input 
                          type="checkbox" 
                          id={`missing-${index}`}
                          checked={selectedMissing.includes(index)}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      </div>
                      <div className="coverage-item-content">
                        <div className="coverage-item-title">{test.title}</div>
                        <div className="coverage-item-description">
                          <span style={{ 
                            backgroundColor: '#fef3c7', 
                            padding: '2px 8px', 
                            borderRadius: '4px', 
                            fontSize: '0.75rem', 
                            color: '#92400e', 
                            fontWeight: '500' 
                          }}>
                            {test.area}
                          </span>
                          <span style={{ 
                            marginLeft: '8px', 
                            color: test.priority === 'High' ? '#dc2626' : test.priority === 'Medium' ? '#f59e0b' : '#6b7280', 
                            fontWeight: '500' 
                          }}>
                            Priority: {test.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: '500' }}>
                    🎉 Perfect! You have 100% test coverage!
                  </p>
                )}
              </div>

              {coverage.missing.length > 0 && (
                <button 
                  className="button button-primary" 
                  style={{ marginTop: '16px' }}
                  onClick={handleAddSuggestedTests}
                >
                  Add Suggested Test Cases
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <div className="button-group">
        <button className="button button-secondary" onClick={() => goToStep(2)}>
          ← Back
        </button>
        <button className="button button-primary" onClick={() => goToStep(4)}>
          Review →
        </button>
      </div>
    </div>
  )
}
