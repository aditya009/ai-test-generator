import { useState } from 'react'

export default function Step1Setup({ data, updateData, goToStep }) {
  const [showJiraInput, setShowJiraInput] = useState(data.inputMethod === 'jira')
  const [showCustomPrompt, setShowCustomPrompt] = useState(data.promptMode === 'custom')

  const handleInputMethodChange = (method) => {
    updateData({ inputMethod: method })
    setShowJiraInput(method === 'jira')
  }

  const handlePromptModeChange = (mode) => {
    updateData({ promptMode: mode })
    setShowCustomPrompt(mode === 'custom')
  }

  const handleContinue = () => {
    // Validation
    if (!data.apiKey) {
      alert('Please enter an API Key')
      return
    }

    if (data.inputMethod === 'manual') {
      if (!data.storyId || !data.storyDescription) {
        alert('Please enter both User Story ID and Description')
        return
      }
    } else {
      if (!data.jiraUrl || !data.jiraLinks || !data.jiraEmail || !data.jiraToken) {
        alert('Please fill in all JIRA fields')
        return
      }
    }

    if (data.promptMode === 'custom' && !data.customPrompt) {
      alert('Please enter a custom prompt')
      return
    }

    goToStep(2)
  }

  return (
    <div className="card">
      <h2 className="section-title">Setup and Connections</h2>
      
      <h3 className="subsection-title">LLM Configuration</h3>
      
      <div className="form-group">
        <label className="form-label">Select LLM Provider <span className="required">*</span></label>
        <select 
          value={data.llmProvider} 
          onChange={(e) => updateData({ llmProvider: e.target.value })}
        >
          <option value="ollama">Local (Ollama)</option>
          <option value="openai">OpenAI</option>
          <option value="gemini">Gemini</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">API Key <span className="required">*</span></label>
        <input 
          type="password" 
          value={data.apiKey}
          onChange={(e) => updateData({ apiKey: e.target.value })}
          placeholder="API key will be required for the selected provider"
        />
        <div className="form-help">
          <a href="#" target="_blank">How to get API key</a>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">What type of application you have <span className="required">*</span></label>
        <div className="radio-group">
          <div className="radio-option">
            <input 
              type="radio" 
              id="appWeb" 
              name="appType" 
              value="web"
              checked={data.appType === 'web'}
              onChange={(e) => updateData({ appType: e.target.value })}
            />
            <label htmlFor="appWeb">Web</label>
          </div>
          <div className="radio-option">
            <input 
              type="radio" 
              id="appMobile" 
              name="appType" 
              value="mobile"
              checked={data.appType === 'mobile'}
              onChange={(e) => updateData({ appType: e.target.value })}
            />
            <label htmlFor="appMobile">Mobile</label>
          </div>
          <div className="radio-option">
            <input 
              type="radio" 
              id="appDashboard" 
              name="appType" 
              value="dashboard"
              checked={data.appType === 'dashboard'}
              onChange={(e) => updateData({ appType: e.target.value })}
            />
            <label htmlFor="appDashboard">Dashboard</label>
          </div>
        </div>
        <div className="form-help">Select the application type to generate relevant test cases</div>
      </div>

      <h3 className="subsection-title">User Story Configuration</h3>

      <div className="form-group">
        <label className="form-label">Input Method <span className="required">*</span></label>
        <div className="radio-group">
          <div className="radio-option">
            <input 
              type="radio" 
              id="inputManual" 
              name="inputMethod" 
              value="manual"
              checked={data.inputMethod === 'manual'}
              onChange={(e) => handleInputMethodChange(e.target.value)}
            />
            <label htmlFor="inputManual">Manual User Story Input</label>
          </div>
          <div className="radio-option">
            <input 
              type="radio" 
              id="inputJira" 
              name="inputMethod" 
              value="jira"
              checked={data.inputMethod === 'jira'}
              onChange={(e) => handleInputMethodChange(e.target.value)}
            />
            <label htmlFor="inputJira">Fetch from JIRA</label>
          </div>
        </div>
      </div>

      {!showJiraInput ? (
        <>
          <div className="form-group">
            <label className="form-label">User Story ID <span className="required">*</span></label>
            <input 
              type="text" 
              value={data.storyId}
              onChange={(e) => updateData({ storyId: e.target.value })}
              placeholder="e.g., US-123"
            />
            <div className="form-help">This will be used as the filename when downloading Excel/PDF files.</div>
          </div>

          <div className="form-group">
            <label className="form-label">User Story Description <span className="required">*</span></label>
            <textarea 
              value={data.storyDescription}
              onChange={(e) => updateData({ storyDescription: e.target.value })}
              placeholder="Enter the full user story description including acceptance criteria, user flow, and any relevant details."
            />
          </div>
        </>
      ) : (
        <>
          <div className="form-group">
            <label className="form-label">JIRA URL <span className="required">*</span></label>
            <input 
              type="text" 
              value={data.jiraUrl}
              onChange={(e) => updateData({ jiraUrl: e.target.value })}
              placeholder="Your JIRA instance URL"
            />
          </div>

          <div className="form-group">
            <label className="form-label">JIRA Link(s) <span className="required">*</span></label>
            <textarea 
              value={data.jiraLinks}
              onChange={(e) => updateData({ jiraLinks: e.target.value })}
              placeholder="Enter one or more JIRA links (one per line)."
            />
          </div>

          <div className="form-group">
            <label className="form-label">JIRA Email <span className="required">*</span></label>
            <input 
              type="email" 
              value={data.jiraEmail}
              onChange={(e) => updateData({ jiraEmail: e.target.value })}
              placeholder="Your JIRA account email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">JIRA API Token <span className="required">*</span></label>
            <input 
              type="password" 
              value={data.jiraToken}
              onChange={(e) => updateData({ jiraToken: e.target.value })}
              placeholder=""
            />
            <div className="form-help">
              <a href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank">How to get API token</a>
            </div>
          </div>
        </>
      )}

      <h3 className="subsection-title">Prompt Configuration</h3>

      <div className="form-group">
        <label className="form-label">Prompt Mode <span className="required">*</span></label>
        <div className="radio-group">
          <div className="radio-option">
            <input 
              type="radio" 
              id="promptAuto" 
              name="promptMode" 
              value="auto"
              checked={data.promptMode === 'auto'}
              onChange={(e) => handlePromptModeChange(e.target.value)}
            />
            <label htmlFor="promptAuto">Auto</label>
          </div>
          <div className="radio-option">
            <input 
              type="radio" 
              id="promptPreset" 
              name="promptMode" 
              value="prompt2"
              checked={data.promptMode === 'prompt2'}
              onChange={(e) => handlePromptModeChange(e.target.value)}
            />
            <label htmlFor="promptPreset">Prompt2</label>
          </div>
          <div className="radio-option">
            <input 
              type="radio" 
              id="promptCustom" 
              name="promptMode" 
              value="custom"
              checked={data.promptMode === 'custom'}
              onChange={(e) => handlePromptModeChange(e.target.value)}
            />
            <label htmlFor="promptCustom">Input Prompt</label>
          </div>
        </div>
      </div>

      {showCustomPrompt && (
        <div className="form-group">
          <label className="form-label">Custom Prompt <span className="required">*</span></label>
          <textarea 
            value={data.customPrompt}
            onChange={(e) => updateData({ customPrompt: e.target.value })}
            placeholder="Your custom prompt will be combined with the user story description. The story description will be automatically appended to your prompt."
          />
        </div>
      )}

      <div className="button-group">
        <button className="button button-primary button-full" onClick={handleContinue}>
          Continue to Test Case Generation →
        </button>
      </div>
    </div>
  )
}
