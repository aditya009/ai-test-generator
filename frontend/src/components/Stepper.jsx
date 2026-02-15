export default function Stepper({ currentStep }) {
  const steps = [
    { number: 1, label: 'Setup' },
    { number: 2, label: 'Generate' },
    { number: 3, label: 'Coverage' },
    { number: 4, label: 'Review' },
    { number: 5, label: 'Export' },
  ]

  return (
    <div className="stepper">
      {steps.map((step) => (
        <div
          key={step.number}
          className={`step ${currentStep === step.number ? 'active' : ''} ${
            currentStep > step.number ? 'completed' : ''
          }`}
          data-step={step.number}
        >
          <div className="step-number">{step.number}</div>
          <div className="step-label">{step.label}</div>
        </div>
      ))}
    </div>
  )
}
