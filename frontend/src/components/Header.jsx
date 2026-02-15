import { useState } from 'react'

export default function Header() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div className="header">
        <h1>
          <span>🤖</span> AI Test Case Generator
        </h1>
        <p>Generate comprehensive test cases using AI in minutes</p>
        <button 
          onClick={() => setShowModal(true)}
          className="how-it-works-link"
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '8px 20px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s',
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.3)'
            e.target.style.transform = 'translateY(-2px)'
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)'
            e.target.style.transform = 'translateY(0)'
          }}
        >
          How it works?
        </button>
        <div style={{
          marginTop: '16px',
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.8)',
          fontStyle: 'italic'
        }}>
          Created by <span style={{ fontWeight: '600', color: 'white' }}>Aditya</span>
        </div>
      </div>

      {showModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            animation: 'fadeIn 0.3s ease-in-out'
          }}
          onClick={() => setShowModal(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              animation: 'slideUp 0.3s ease-in-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '32px',
              borderRadius: '16px 16px 0 0',
              color: 'white'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: '700', margin: '0 0 8px 0' }}>
                    🤖 How It Works
                  </h2>
                  <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>
                    AI-Powered Test Case Generation for Modern QA Teams
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    color: 'white',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                  onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '32px' }}>
              {/* About Section */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  marginBottom: '16px',
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>📖</span> About This Application
                </h3>
                <p style={{ 
                  color: '#475569', 
                  lineHeight: '1.7',
                  fontSize: '0.95rem',
                  margin: 0
                }}>
                  This application helps QA teams push test cases to TestRail and automatically generates 
                  comprehensive test cases from acceptance criteria. Simply provide your requirements, and 
                  let AI handle the tedious work of writing detailed test cases.
                </p>
              </div>

              {/* Problem We're Solving */}
              <div style={{ 
                marginBottom: '32px',
                padding: '24px',
                backgroundColor: '#f0f9ff',
                borderRadius: '12px',
                border: '1px solid #bae6fd'
              }}>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  marginBottom: '16px',
                  color: '#0c4a6e',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>🎯</span> Problems We Solve
                </h3>
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: '24px',
                  color: '#0c4a6e'
                }}>
                  <li style={{ marginBottom: '12px', lineHeight: '1.6' }}>
                    <strong>Save Time on Test Case Creation:</strong> QA should spend time reviewing test cases, 
                    not manually writing them. Pick and choose the test cases you want.
                  </li>
                  <li style={{ marginBottom: '12px', lineHeight: '1.6' }}>
                    <strong>Automate Repetitive Tasks:</strong> QA time should be spent on actual testing, 
                    not writing manual test cases and pushing to TestRail. Let AI agents do it.
                  </li>
                  <li style={{ marginBottom: '0', lineHeight: '1.6' }}>
                    <strong>Focus on Quality:</strong> QA should focus on writing automation code and 
                    improving quality, not administrative work.
                  </li>
                </ul>
              </div>

              {/* Features */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  marginBottom: '16px',
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>✨</span> Key Features
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '16px'
                }}>
                  {[
                    { icon: '🤖', title: 'AI-Powered Generation', desc: 'Generate test cases from acceptance criteria using Gemini or OpenAI' },
                    { icon: '🥒', title: 'Cucumber BDD', desc: 'Generate Cucumber-style test cases with Playwright code' },
                    { icon: '📊', title: 'Coverage Analysis', desc: 'Identify gaps and missing test scenarios automatically' },
                    { icon: '✅', title: 'Review & Select', desc: 'Pick and choose which test cases to keep or modify' },
                    { icon: '🚀', title: 'TestRail Integration', desc: 'Push test cases directly to TestRail or Zephyr' },
                    { icon: '📥', title: 'Multiple Export Formats', desc: 'Export as CSV, Excel, or Cucumber feature files' }
                  ].map((feature, idx) => (
                    <div key={idx} style={{
                      padding: '16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{feature.icon}</div>
                      <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '4px', color: '#1e293b' }}>
                        {feature.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.5' }}>
                        {feature.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* API Keys Section */}
              <div style={{ 
                marginBottom: '32px',
                padding: '24px',
                backgroundColor: '#fef3c7',
                borderRadius: '12px',
                border: '1px solid #fbbf24'
              }}>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  marginBottom: '16px',
                  color: '#92400e',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>🔑</span> Getting Your API Key (Free!)
                </h3>
                
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ 
                    fontSize: '1rem', 
                    fontWeight: '600', 
                    marginBottom: '12px',
                    color: '#92400e',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ 
                      backgroundColor: '#10b981', 
                      color: 'white', 
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: '700'
                    }}>1</span>
                    Gemini API (Recommended - 100% Free)
                  </h4>
                  <ol style={{ margin: '0', paddingLeft: '40px', color: '#92400e' }}>
                    <li style={{ marginBottom: '8px' }}>
                      Visit: <a 
                        href="https://aistudio.google.com/app/apikey" 
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#0ea5e9', fontWeight: '600' }}
                      >
                        https://aistudio.google.com/app/apikey
                      </a>
                    </li>
                    <li style={{ marginBottom: '8px' }}>Sign in with your Google account</li>
                    <li style={{ marginBottom: '8px' }}>Click "Create API key in new project"</li>
                    <li style={{ marginBottom: '8px' }}>Copy your API key (starts with AIza...)</li>
                    <li style={{ marginBottom: '0' }}>
                      <strong>Free Tier:</strong> 1,500 requests/day, no credit card needed!
                    </li>
                  </ol>
                </div>

                <div>
                  <h4 style={{ 
                    fontSize: '1rem', 
                    fontWeight: '600', 
                    marginBottom: '12px',
                    color: '#92400e',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ 
                      backgroundColor: '#3b82f6', 
                      color: 'white', 
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: '700'
                    }}>2</span>
                    OpenAI API (Alternative)
                  </h4>
                  <ol style={{ margin: '0', paddingLeft: '40px', color: '#92400e' }}>
                    <li style={{ marginBottom: '8px' }}>
                      Visit: <a 
                        href="https://platform.openai.com/api-keys" 
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#0ea5e9', fontWeight: '600' }}
                      >
                        https://platform.openai.com/api-keys
                      </a>
                    </li>
                    <li style={{ marginBottom: '8px' }}>Create an account or sign in</li>
                    <li style={{ marginBottom: '8px' }}>Click "Create new secret key"</li>
                    <li style={{ marginBottom: '8px' }}>Copy your API key (starts with sk-...)</li>
                    <li style={{ marginBottom: '0' }}>
                      <strong>Note:</strong> Requires credits ($5-10 minimum)
                    </li>
                  </ol>
                </div>
              </div>

              {/* GitHub & Feedback */}
              <div style={{ 
                padding: '24px',
                backgroundColor: '#f1f5f9',
                borderRadius: '12px',
                border: '1px solid #cbd5e1'
              }}>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  marginBottom: '16px',
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>💬</span> Feedback & Contribution
                </h3>
                <p style={{ color: '#475569', lineHeight: '1.7', marginBottom: '16px' }}>
                  This is an open-source project! Have feedback or want to make it better? 
                  Visit the GitHub repository to contribute, report issues, or suggest features.
                </p>
                <a 
                  href="https://github.com/aditya009/ai-test-generator" 
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    backgroundColor: '#1e293b',
                    color: 'white',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#334155'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#1e293b'}
                >
                  <span>⭐</span> View on GitHub
                </a>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '20px 32px',
              borderTop: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              borderRadius: '0 0 16px 16px',
              textAlign: 'center'
            }}>
              <p style={{ 
                margin: 0, 
                color: '#64748b', 
                fontSize: '0.875rem'
              }}>
                Created with ❤️ by <strong style={{ color: '#1e293b' }}>Aditya</strong> to help QA teams work smarter, not harder
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
