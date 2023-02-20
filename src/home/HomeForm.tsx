import { FormEvent, useRef } from 'react'
import { useImmer } from "use-immer";
import { Accordion, Button, Card, Form, InputGroup, Modal, Stack } from 'react-bootstrap';
import { AccordionEventKey } from 'react-bootstrap/esm/AccordionContext';
import { Stepper } from 'react-form-stepper';

import Select from 'react-select';
import { v4 as uuidV4 } from "uuid";
import CreatableSelect from 'react-select/creatable';
import { useLocalStorage, NEW_HOUSE, ACTIVE_STEP } from '../hooks/useLocalStorage';
import { 
    floorTypeOptions, roomTypeOptions, roomTypePropertiesOptions, 
    stepStyleDTOCustom, windowStyleOptions, foundationTypeOptions,
    roofTypeOptions, gardenOptions, glassTypeOptions
} from '../const';
import GeneralStep from './GeneralStep';
import CompleteStep from './CompleteStep';
import { House } from '../types';
import FloorStep from './FloorStep';

function HomeForm() {
    const [activeStep, setActiveStep] = useLocalStorage<number>(ACTIVE_STEP, 0);
    const [newHouse, setNewHouse] = useLocalStorage<House | null>(NEW_HOUSE, null);
    
    return (
        <>
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

export default HomeForm