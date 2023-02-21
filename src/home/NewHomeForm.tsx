import { Stepper } from 'react-form-stepper';
import { stepStyleDTOCustom} from '../const';

import CompleteStep from './steps/CompleteStep';
import GeneralStep from './steps/GeneralStep';
import FloorStep from './steps/FloorStep';
import {useActiveStep} from '../store/active-step-store';


function NewHomeForm(): JSX.Element {
    const activeStep = useActiveStep();
    
    return (
        <>
            <h1>New House</h1>
            <Stepper
                steps={[{ label: 'General' }, { label: 'Floors' }, {label: 'Complete'}]}
                activeStep={activeStep}
                styleConfig={stepStyleDTOCustom}
            />

            {
                activeStep === 0 &&
                <GeneralStep/>
            }
            {
                activeStep === 1 &&
                <FloorStep />
            }
            {
                activeStep === 2 &&
                <CompleteStep/>
            }
        </>
    )
}

export default NewHomeForm;