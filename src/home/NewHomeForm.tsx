import { Stepper } from 'react-form-stepper';

import { useLocalStorage, NEW_HOUSE, ACTIVE_STEP } from '../hooks/useLocalStorage';
import { stepStyleDTOCustom} from '../const';

import CompleteStep from './steps/CompleteStep';
import { House } from '../types';
import GeneralStep from './steps/GeneralStep';
import FloorStep from './steps/FloorStep';


function NewHomeForm() {
    const [activeStep, setActiveStep] = useLocalStorage<number>(ACTIVE_STEP, 0);
    const [newHouse, setNewHouse] = useLocalStorage<House | null>(NEW_HOUSE, null);
    
    return (
        <>
            <h1>New Home</h1>
            <Stepper
                steps={[{ label: 'Genreal' }, { label: 'Floors' }, {label: 'Complete'}]}
                activeStep={activeStep}
                styleConfig={stepStyleDTOCustom}
            />

            {
                activeStep === 0 &&
                <GeneralStep 
                    newHouse={newHouse}
                    setNewHouse={setNewHouse}
                    setActiveStep={setActiveStep}
                />
            }
            {
                activeStep === 1 &&
                <FloorStep 
                    newHouse={newHouse}
                    setNewHouse={setNewHouse}
                    setActiveStep={setActiveStep}
                />
            }
            {
                activeStep === 2 &&
                <CompleteStep
                    setActiveStep={setActiveStep}
                />
            }
        </>
    )
}

export default NewHomeForm;