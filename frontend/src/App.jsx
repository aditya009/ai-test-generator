import { useState } from 'react'
import Header from './components/Header'
import Stepper from './components/Stepper'
import Step1Setup from './components/Step1Setup'
import Step2Generate from './components/Step2Generate'
import Step3Coverage from './components/Step3Coverage'
import Step4Review from './components/Step4Review'
import Step5Export from './components/Step5Export'

function App() {
  const [currentStep, setCurrentStep] = useState(1)
  const [appData, setAppData] = useState({
    llmProvider: 'openai',
    apiKey: '',
    appType: 'web',
    inputMethod: 'manual',
    storyId: '',
    storyDescription: '',
    jiraUrl: '',
    jiraLinks: '',
    jiraEmail: '',
    jiraToken: '',
    promptMode: 'auto',
    customPrompt: '',
    testCases: [],
    coverage: null,
  })

  const goToStep = (step) => {
    setCurrentStep(step)
    window.scrollTo(0, 0)
  }

  const updateData = (newData) => {
    setAppData(prev => ({ ...prev, ...newData }))
  }

  return (
    <div className="container">
      <Header />
      <Stepper currentStep={currentStep} />
      
      {currentStep === 1 && (
        <Step1Setup 
          data={appData} 
          updateData={updateData} 
          goToStep={goToStep} 
        />
      )}
      
      {currentStep === 2 && (
        <Step2Generate 
          data={appData} 
          updateData={updateData} 
          goToStep={goToStep} 
        />
      )}
      
      {currentStep === 3 && (
        <Step3Coverage 
          data={appData} 
          updateData={updateData} 
          goToStep={goToStep} 
        />
      )}
      
      {currentStep === 4 && (
        <Step4Review 
          data={appData} 
          updateData={updateData} 
          goToStep={goToStep} 
        />
      )}
      
      {currentStep === 5 && (
        <Step5Export 
          data={appData} 
          updateData={updateData} 
          goToStep={goToStep} 
        />
      )}
    </div>
  )
}

export default App
