import React from 'react';
import { CheckCircle } from 'lucide-react';

const FormStepper = ({ step, steps }) => {
    return (
        <div className="flex justify-between items-center mb-10 relative">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-100 -z-10"></div>
            {steps.map(({ num, label }) => {
                const isPast = step > num;
                const isCurrent = step === num;
                return (
                    <div key={num} className="flex flex-col items-center gap-2 bg-white px-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors shadow-sm ${isCurrent ? 'bg-auis-blue text-white ring-4 ring-auis-blue/20' :
                            isPast ? 'bg-auis-gold text-white' : 'bg-gray-100 text-gray-400'
                            }`}>
                            {isPast ? <CheckCircle size={16} /> : num}
                        </div>
                        <span className={`text-xs font-semibold ${isCurrent ? 'text-auis-blue' : 'text-gray-400'}`}>{label}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default FormStepper;
