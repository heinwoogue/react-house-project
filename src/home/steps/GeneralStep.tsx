import { Button, Card, Form, Stack } from "react-bootstrap"
import Select from 'react-select';
import { useImmer } from "use-immer";
import { FormEvent, useRef } from "react";
import { v4 as uuidV4 } from "uuid"
import { foundationTypeOptions, gardenOptions, roofTypeOptions } from "../../const";
import {useNextActiveStep} from "../../store/active-step-store";
import { useNewHouse, useSaveNewHouse } from "../../store/new-house-store";

function GeneralStep(): JSX.Element {
    const nextActiveStep = useNextActiveStep();
    
    const newHouse = useNewHouse();
    const saveNewHouse = useSaveNewHouse();
    
    const houseNameRef = useRef<HTMLInputElement>(null);
    const houseSizeRef = useRef<HTMLInputElement>(null);
    const [selectedFoundationType, setSelectedFoundationType] = useImmer<string | undefined>(newHouse?.foundationType);
    const [selectedRoofType, setSelectedRoofType] = useImmer<string | undefined>(newHouse?.roofType);
    const [selectedGardens, setSelectedGardens] = useImmer<string[] | undefined>(newHouse?.gardens);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        saveNewHouse({
            ...newHouse ?? {},
            id: newHouse?.id ?? uuidV4(),
            name: houseNameRef.current!.value,
            sizeInSquareMeters: Number(houseSizeRef.current!.value),
            foundationType: selectedFoundationType!,
            roofType: selectedRoofType!,
            gardens: selectedGardens || [],
            floors: newHouse?.floors || []
        });
        
        nextActiveStep();
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Stack direction="horizontal" className='justify-content-center'>
                <Card className="w-50 pb-4">
                    <Card.Body>
                        <Stack gap={4}>
                            <Form.Group controlId="name">
                                <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                                <Form.Control ref={houseNameRef} required defaultValue={newHouse?.name}/>
                            </Form.Group>
                            <Form.Group controlId="foundationType">
                                <Form.Label>Foundation Type <span className="text-danger">*</span></Form.Label>
                                <Select
                                    required
                                    name="foundationType"
                                    className="basic-single"
                                    classNamePrefix="select"
                                    isSearchable={true}
                                    options={foundationTypeOptions}
                                    value={
                                        foundationTypeOptions.find(
                                            option => option.value === selectedFoundationType
                                        )
                                    }
                                    onChange={
                                        foundationType => setSelectedFoundationType(
                                        foundationType?.value
                                        )
                                    }
                                />
                            </Form.Group>
                            <Form.Group controlId="sizeInSquareMeters">
                                <Form.Label>Size (square meters) <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="number" step=".01" ref={houseSizeRef} required defaultValue={newHouse?.sizeInSquareMeters}/>
                            </Form.Group>
                            <Form.Group controlId="roofType">
                                <Form.Label>Roof Type <span className="text-danger">*</span></Form.Label>
                                <Select
                                    name="roofType"
                                    required
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    isSearchable={true}
                                    options={roofTypeOptions}
                                    value={
                                        roofTypeOptions.find(
                                            option => option.value === selectedRoofType
                                        )
                                    }
                                    onChange={
                                        roofType => setSelectedRoofType(
                                            roofType?.value
                                        )
                                    }
                                />
                            </Form.Group>
                            <Form.Group controlId="garden">
                                <Form.Label>Garden</Form.Label>
                                <Select
                                    name="garden"
                                    isMulti
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    isSearchable={true}
                                    options={gardenOptions}
                                    value={
                                        gardenOptions.filter(
                                            option => selectedGardens?.includes(option.value)
                                        )
                                    }
                                    onChange={
                                        gardens => setSelectedGardens(
                                            gardens.map(garden => garden.value)
                                        )
                                    }
                                />
                            </Form.Group>
                        </Stack>
                    </Card.Body>
                </Card>
            </Stack>
            <Stack direction="horizontal" gap={2} className="mt-5">
                <Button type="submit"
                    className="ms-auto">
                    Next
                </Button>
            </Stack>
        </Form>
    )
}

export default GeneralStep
