import React from 'react';
import { CheckCircle } from 'lucide-react';

const steps = [
  { id: 1, name: "Personal Info", description: "Basic information" },
  { id: 2, name: "Academic", description: "GPA and test scores" }, 
  { id: 3, name: "Activities", description: "Extracurriculars" },
  { id: 4, name: "Preferences", description: "College preferences" },
  { id: 5, name: "Review", description: "Final review" }
];

export default function ProgressBar({ currentStep, completedSteps }) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-700 ease-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isUpcoming = step.id > currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center relative bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg p-3 min-w-0">
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-500 border-emerald-500 text-white scale-110'
                    : isCurrent
                    ? 'bg-blue-600 border-blue-600 text-white scale-110 shadow-lg'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-bold">{step.id}</span>
                )}
              </div>
              <div className="mt-3 text-center">
                <div
                  className={`text-sm font-semibold transition-colors duration-300 ${
                    isCompleted || isCurrent
                      ? 'text-gray-900'
                      : 'text-gray-500'
                  }`}
                >
                  {step.name}
                </div>
                <div className="text-xs text-gray-500 hidden sm:block">
                  {step.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}