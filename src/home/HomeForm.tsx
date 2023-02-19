import { FormEvent, useRef } from 'react'
import { useImmer } from "use-immer";
import { Accordion, Button, Card, Form, InputGroup, Modal, Stack } from 'react-bootstrap';
import { AccordionEventKey } from 'react-bootstrap/esm/AccordionContext';
import { Stepper } from 'react-form-stepper';

import Select from 'react-select';
import { v4 as uuidV4 } from "uuid"
import CreatableSelect from 'react-select/creatable';
import { useLocalStorage, NEW_HOUSE, ACTIVE_STEP } from '../hooks/useLocalStorage';
import { 
    floorTypeOptions, roomTypeOptions, roomTypePropertiesOptions, 
    stepStyleDTOCustom, windowStyleOptions, foundationTypeOptions,
    roofTypeOptions, gardenOptions, glassTypeOptions
} from './const';

type Window = {
    id: string;
    windowStyle: string;
    glassType: string;
}

type Room = {
    id: string;
    name: string;
    sizeInSquareMeters: number;
    type: string;
    specialProps: string[];
    floorType: string;
    windows: Window[];
}

type Floor = {
    id: string;
    name: string;
    rooms: Room[];
};

type House = {
    id: string;
    name: string;
    foundationType: string;
    sizeInSquareMeters: number;
    roofType: string;
    gardens: string[];
    floors: Floor[];
}

function HomeForm() {
    const [activeStep, setActiveStep] = useLocalStorage<number>(ACTIVE_STEP, 0);
    const [floorShow, setFloorShow] = useImmer(false);
    const [roomShow, setRoomShow] = useImmer(false);
    const [activeRoomId, setActiveRoomId] = useImmer<string | null>(null);
    const [activeFloorId, setActiveFloorId] = useImmer<string | null>(null);
    const [activeFloorNdx, setActiveFloorNdx] = useImmer<number | null>(0);
    const [newHouse, setNewHouse] = useLocalStorage<House | null>(NEW_HOUSE, null);

    const houseNameRef = useRef<HTMLInputElement>(null);
    const houseSizeRef = useRef<HTMLInputElement>(null);
    const [selectedFoundationType, setSelectedFoundationType] = useImmer<string | undefined>(newHouse?.foundationType);
    const [selectedRoofType, setSelectedRoofType] = useImmer<string | undefined>(newHouse?.roofType);
    const [selectedGardens, setSelectedGardens] = useImmer<string[] | undefined>(newHouse?.gardens);

    const floorNameRef = useRef<HTMLInputElement>(null);

    const roomNameRef = useRef<HTMLInputElement>(null);
    const roomSizeRef = useRef<HTMLInputElement>(null);
    const [selectedRoomType, setSelectedRoomType] = useImmer<string | undefined>(undefined);
    const [selectedSpecialProps, setSelectedSpecialProps] = useImmer<string[]>([]);
    const [selectedFloorType, setSelectedFloorType] = useImmer<string | undefined>(undefined);

    const [inputWindows, setInputWindows] = useImmer<({selectedWindowStyle: string, selectedGlassType: string} | undefined )[]>([]);
    
    const handleFloorClose = () => setFloorShow(false);
    const handleFloorShow = (floorId?: string) => {
        if(floorNameRef.current){
            floorNameRef.current.value = '';
        }
        if(floorId){
            setActiveFloorId(floorId);
        }else{
            setActiveFloorId(null);
        }
        
        setFloorShow(true)
    };
    const handleRoomClose = () => setRoomShow(false);
    const handleRoomShow = (floorId: string, roomId ?: string) => {
        if(floorId){
            setActiveFloorId(floorId);
        }else{
            setActiveFloorId(null);
        }
        if(roomId){
            setActiveRoomId(roomId);
        }else{
            setActiveRoomId(null);
        }

        const room = newHouse?.floors.find(floor => floor.id === floorId)
            ?.rooms.find(room => room.id === roomId);
            
        if(room){
            setSelectedRoomType(room.type);
            setSelectedFloorType(room.floorType);
            setInputWindows(room.windows.map(
                window => ({
                    selectedWindowStyle: window.windowStyle,
                    selectedGlassType: window.glassType
                })
            ));
        }else{
            setSelectedRoomType(undefined);
            setSelectedFloorType(undefined);
            setInputWindows([]);
        }

        setRoomShow(true);
    };
    const handleSaveFloor = (e: FormEvent)=>{
        e.preventDefault();
        setNewHouse(
            prev => {
                if(!prev){
                    return null;
                }
                if(activeFloorId){
                    return {
                        ...prev,
                        floors: prev.floors.map(
                            floor => {
                                if(floor.id === activeFloorId){
                                    return {
                                        ...floor,
                                        name: floorNameRef.current!.value
                                    }
                                }
                                return floor;
                            }
                        )
                    }
                }else {
                    return {
                        ...prev,
                        floors: [
                            ...prev?.floors,
                            {
                                id: uuidV4(), 
                                name: floorNameRef.current!.value, 
                                rooms: []
                            }
                        ]
                    }
                }
            }
        );
        if(!activeFloorId){
            setActiveFloorNdx(newHouse!.floors.length);
        }
        handleFloorClose();
    }
    const handleSaveRoom = (e: FormEvent)=>{
        e.preventDefault();
        setNewHouse(
            prev => {
                if(!prev){
                    return prev;
                }
                return {
                    ...prev,
                    floors: prev.floors.map(
                        floor => {
                            if(floor.id === activeFloorId){
                                if(activeRoomId){
                                    return {
                                        ...floor,
                                        rooms: floor.rooms.map(
                                            room => {
                                                if(room.id === activeRoomId){
                                                    return {
                                                        ...room,
                                                        name: roomNameRef.current!.value,
                                                        sizeInSquareMeters: Number(roomSizeRef.current!.value),
                                                        type: selectedRoomType!,
                                                        specialProps: [],
                                                        floorType: selectedFloorType!,
                                                        windows: inputWindows.map(
                                                            inputWindow => (
                                                                {
                                                                    id: uuidV4(),
                                                                    windowStyle: inputWindow!.selectedWindowStyle!,
                                                                    glassType: inputWindow!.selectedGlassType!
                                                                }
                                                            )
                                                        )
                                                    }
                                                }
                                                return room;
                                            }
                                        )
                                    }
                                }
                                return {
                                    ...floor,
                                    rooms: [
                                        ...floor.rooms,
                                        {
                                            id: uuidV4(),
                                            name: roomNameRef.current!.value,
                                            sizeInSquareMeters: Number(roomSizeRef.current!.value),
                                            type: selectedRoomType!,
                                            specialProps: [],
                                            floorType: selectedFloorType!,
                                            windows: inputWindows.map(
                                                inputWindow => (
                                                    {
                                                        id: uuidV4(),
                                                        windowStyle: inputWindow!.selectedWindowStyle!,
                                                        glassType: inputWindow!.selectedGlassType!
                                                    }
                                                )
                                            )
                                        }
                                    ]
                                }
                            }
                            return floor;
                        }
                    )
                }
            }
        );
        handleRoomClose();
    }
    const handleAddWindow = ()=>{
        setInputWindows(
            prev=> [
                ...prev,
                undefined
            ]
        )
    };
    const accordionOnSelect = (event: AccordionEventKey) => {
        if(event){
            setActiveFloorNdx(Number(event));
        }else {
            setActiveFloorNdx(null);
        }
    }
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if(activeStep === 0){
            setNewHouse(
                prev => {
                    return {
                        ...prev ?? {},
                        id: prev?.id ?? uuidV4(),
                        name: houseNameRef.current!.value,
                        sizeInSquareMeters: Number(houseSizeRef.current!.value),
                        foundationType: selectedFoundationType!,
                        roofType: selectedRoofType!,
                        gardens: selectedGardens || [],
                        floors: prev?.floors || []
                    }
                }
            );
        }
        
        setActiveStep(prev => prev + 1);
    }
    const deleteFloor = (floorId: string) => {
        setNewHouse(
            prev => {
                if(!prev){
                    return prev;
                }
                return {
                    ...prev,
                    floors: prev.floors.filter(
                        floor=>floor.id !== floorId
                    )
                }
            }
        );
        setActiveFloorNdx(0);
    }
    const deleteRoom = (floorId: string, roomId: string)=>{
        setNewHouse(
            prev=>{
                if(!prev){
                    return prev;
                }
                return {
                    ...prev,
                    floors: prev.floors.map(
                        floor => {
                            if(floor.id === floorId){
                                return {
                                    ...floor,
                                    rooms: floor.rooms.filter(
                                        room => room.id !== roomId
                                    ) 
                                }
                            }
                            return floor;
                        }
                    )
                }
            }
        );
    }

    return (
        <>
            <Stepper
                steps={[{ label: 'Genreal' }, { label: 'Floors' }, {label: 'Complete'}]}
                activeStep={activeStep}
                styleConfig={stepStyleDTOCustom}
            />
            <Form onSubmit={handleSubmit}>
                <Stack direction="horizontal" className='justify-content-center'>
                    {
                        activeStep === 0 &&
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
                    }
                    {
                        activeStep === 1 &&
                        <Card className="w-50 pb-4">
                            <Card.Body>
                                <p className="mt-4">Total Floors: {newHouse?.floors.length}</p>
                                <Stack direction="horizontal" className="justify-content-center">
                                    <Button type="button" variant="primary" onClick={()=>handleFloorShow()}>
                                        + Add Floor
                                    </Button>
                                </Stack>
                                <Accordion activeKey={`${activeFloorNdx}`} onSelect={accordionOnSelect} className="mt-4">
                                {
                                    newHouse?.floors.map(
                                        (floor, ndx) => {
                                            return (
                                                <Accordion.Item key={floor.id} eventKey={`${ndx}`}>
                                                    <Accordion.Header>{floor.name}</Accordion.Header>
                                                    <Accordion.Body className="mb-4">
                                                        <Stack direction="horizontal" gap={2} className="mt-1">
                                                            <Button type="button" variant="success"
                                                                onClick={()=>handleFloorShow(floor.id)}>
                                                                Edit Floor
                                                            </Button>
                                                            <Button type="button"
                                                                variant="danger"
                                                                className="ms-auto"
                                                                onClick={ ()=>deleteFloor(floor.id)}>
                                                                Delete Floor
                                                            </Button>
                                                        </Stack>
                                                        <Stack direction="horizontal" className="justify-content-between mt-5">
                                                            <span>
                                                                Total Rooms: &nbsp;
                                                                {!floor.rooms || floor.rooms.length === 0 ? 0: floor.rooms.length}
                                                            </span>
                                                            <Button type="button" variant="primary" onClick={()=>handleRoomShow(floor.id)}>
                                                                + Add Room
                                                            </Button>
                                                            <span className="invisible">
                                                                Total Rooms: &nbsp;
                                                                {!floor.rooms || floor.rooms.length === 0 ? 0: floor.rooms.length}
                                                            </span>
                                                        </Stack>
                                                        {
                                                            floor.rooms.map(
                                                                (room) => {
                                                                    return (
                                                                        <Stack key={room.id} direction="horizontal" className="mt-4 pb-3 border-bottom">
                                                                            <span>{room.name}</span>
                                                                            <Button type="button" variant="success"
                                                                                className="ms-auto me-2"
                                                                                onClick={()=>handleRoomShow(floor.id, room.id)}>
                                                                                Edit Room
                                                                            </Button>
                                                                            <Button type="button"
                                                                                variant="danger"
                                                                                onClick={()=>deleteRoom(floor.id, room.id)}>
                                                                                Delete Room
                                                                            </Button>
                                                                        </Stack>
                                                                    )
                                                                }
                                                            )
                                                        }
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            )
                                        }
                                    )
                                }
                                </Accordion>   
                            </Card.Body>
                        </Card>
                    }
                    {
                        activeStep === 2 &&
                        <Card className="w-50 pb-4">
                            <Card.Body>
                                <Stack direction="horizontal" className="justify-content-center">
                                    <h2>Thank you for filling up your new house!</h2>
                                </Stack>
                            </Card.Body>
                        </Card>
                    }
                </Stack>

                <Stack direction="horizontal" gap={2} className="mt-5">
                    { 
                        activeStep > 0 &&
                        <Button type="button" variant="primary"
                            onClick={()=>setActiveStep(prev => prev - 1)}>
                            Back
                        </Button>
                    }
                    {
                        activeStep < 2 &&
                        <Button type="submit"
                            className="ms-auto">
                            Next
                        </Button>
                    }
                </Stack>
            </Form>

            <Modal show={roomShow} onHide={handleRoomClose} size="lg">
                <Form onSubmit={handleSaveRoom}>
                    <Modal.Header closeButton>
                    <Modal.Title>{activeRoomId !== null ? 'Edit': 'Add'} Room</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Stack gap={4}>
                            <Form.Group controlId="name">
                                <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                                <Form.Control ref={roomNameRef} 
                                    defaultValue={
                                        newHouse?.floors.find(floor => floor.id === activeFloorId)
                                            ?.rooms.find(room => room.id === activeRoomId)
                                            ?.name
                                    }
                                    required/>
                            </Form.Group>
                            <Form.Group controlId="sizeInSquareMeters">
                                <Form.Label>Size (square meters) <span className="text-danger">*</span></Form.Label>
                                <Form.Control ref={roomSizeRef} 
                                    type="number" step=".01"
                                    defaultValue={
                                        newHouse?.floors.find(floor => floor.id === activeFloorId)
                                            ?.rooms.find(room => room.id === activeRoomId)
                                            ?.sizeInSquareMeters
                                    }
                                    required/>
                            </Form.Group>
                            <Form.Group controlId="type">
                                <Form.Label>Type <span className="text-danger">*</span></Form.Label>
                                <Select
                                    name="foundationType"
                                    required
                                    className="basic-single"
                                    classNamePrefix="select"
                                    isSearchable={true}
                                    options={roomTypeOptions}
                                    value={
                                        roomTypeOptions.find(
                                            option => option.value === selectedRoomType
                                        )
                                    }
                                    onChange={
                                        roomType => {
                                            setSelectedRoomType(roomType?.value);
                                            setSelectedSpecialProps([]);
                                        }
                                    }
                                />
                            </Form.Group>
                            <Form.Group controlId="specialProps">
                                <Form.Label>Special Properties</Form.Label>
                                <Select
                                    name="specialProps"
                                    isMulti
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    isSearchable={true}
                                    options={selectedRoomType? roomTypePropertiesOptions[selectedRoomType]: []}
                                    value={
                                        selectedRoomType
                                        ? roomTypePropertiesOptions[selectedRoomType]?.filter(
                                            opt => selectedSpecialProps.includes(opt.value)
                                        ) ?? []
                                        : []
                                    }
                                    onChange={
                                        specialProps => setSelectedSpecialProps(
                                            prev => specialProps.map(prop=>prop.value)
                                        )
                                    }
                                />
                            </Form.Group>
                            <Form.Group controlId="floorType">
                                <Form.Label>Floor Type <span className="text-danger">*</span></Form.Label>
                                <Select
                                    name="floorType"
                                    required
                                    className="basic-single"
                                    classNamePrefix="select"
                                    isSearchable={true}
                                    options={floorTypeOptions}
                                    value={
                                        floorTypeOptions.find(
                                            option => option.value === selectedFloorType
                                        )
                                    }
                                    onChange={
                                        floorType => setSelectedFloorType(
                                            floorType?.value
                                        )
                                    }
                                />
                            </Form.Group>
                            <Stack direction="horizontal">
                                <span>
                                    Total Windows: &nbsp;
                                    {inputWindows.length}
                                </span>
                                <Button type="button" variant="primary"
                                    className="ms-auto"
                                    onClick={handleAddWindow}>
                                    + Add Window
                                </Button>
                            </Stack>
                            {
                                inputWindows.map(
                                    (inputWindow, ndx) => (
                                        <InputGroup key={ndx} style={{marginTop: '-20px'}}>
                                            <InputGroup.Text>
                                                Style
                                            </InputGroup.Text>
                                            <div className="form-control p-0 m-0">
                                                <CreatableSelect
                                                    required
                                                    name={`windowStyle_${ndx}`}
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    isSearchable={true}
                                                    options={windowStyleOptions}
                                                    value={
                                                        inputWindow && inputWindow.selectedWindowStyle
                                                        ? {value: inputWindow.selectedWindowStyle, label: inputWindow.selectedWindowStyle}
                                                        :undefined
                                                    }
                                                    onChange={
                                                        windowStyle => {
                                                            setInputWindows(
                                                                prev => prev.map(
                                                                    (inputWindow, i)=>{
                                                                        if(i===ndx){
                                                                            return {
                                                                                ...inputWindow,
                                                                                selectedWindowStyle: windowStyle!.value
                                                                            }
                                                                        }
                                                                        return inputWindow;
                                                                    }
                                                                )
                                                            )
                                                        }
                                                    }
                                                /> 
                                            </div>
                                            <InputGroup.Text>
                                                Glass Type
                                            </InputGroup.Text>
                                            <div className="form-control p-0 m-0">
                                                <CreatableSelect
                                                    required
                                                    name={`glassType_${ndx}`}
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    isSearchable={true}
                                                    options={glassTypeOptions}
                                                    value={
                                                        inputWindow && inputWindow.selectedGlassType
                                                        ? {value: inputWindow.selectedGlassType, label: inputWindow.selectedGlassType}
                                                        : undefined
                                                    }
                                                    onChange={
                                                        glassType => {
                                                            setInputWindows(
                                                                prev => prev.map(
                                                                    (inputWindow, i)=>{
                                                                        if(i===ndx){
                                                                            return {
                                                                                ...inputWindow,
                                                                                selectedGlassType: glassType!.value
                                                                            }
                                                                        }
                                                                        return inputWindow;
                                                                    }
                                                                )
                                                            )
                                                        }
                                                    }
                                                />
                                            </div>
                                        </InputGroup>
                                    )
                                )
                            }
                        </Stack>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" variant="primary">
                            Save
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal show={floorShow} onHide={handleFloorClose}>
                <Form onSubmit={handleSaveFloor}>
                    <Modal.Header closeButton>
                    <Modal.Title>{activeFloorId !== null ? 'Edit': 'Add'} Floor</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Stack gap={4}>
                            <Form.Group controlId="name">
                                <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                                <Form.Control ref={floorNameRef} required 
                                    defaultValue={
                                        activeFloorId !== null 
                                        ?  newHouse?.floors.find(floor => floor.id === activeFloorId)?.name
                                        : '' 
                                    }
                                />
                            </Form.Group>
                        </Stack>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button type="submit" variant="primary">
                        Save
                    </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default HomeForm