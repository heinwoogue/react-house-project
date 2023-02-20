import { FormEvent, useEffect, useRef } from 'react'
import { useImmer } from "use-immer";
import { Button, Form, InputGroup, Modal, Stack } from 'react-bootstrap';
import { v4 as uuidV4 } from "uuid";
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { floorTypeOptions, glassTypeOptions, roomTypeOptions, roomTypePropertiesOptions, windowStyleOptions } from '../../const';
import { useHideRoom, useRoomShow } from '../../store/room-show-store';
import { useActiveFloorId } from '../../store/active-floor-id-store';
import { useActiveRoomId } from '../../store/active-room-id-store';
import { useNewHouse, useSaveNewHouseRoom, useSaveNewHouse } from '../../store/new-house-store';
import { Room } from '../../types';

function RoomModal() {
    const roomShow = useRoomShow();
    const hideRoom = useHideRoom();

    const newHouse = useNewHouse();
    const saveNewHouseRoom = useSaveNewHouseRoom();

    const activeFloorId = useActiveFloorId();
    const activeRoomId = useActiveRoomId();
    
    const roomNameRef = useRef<HTMLInputElement>(null);
    const roomSizeRef = useRef<HTMLInputElement>(null);
    const [selectedRoomType, setSelectedRoomType] = useImmer<string | null>(null);
    const [selectedSpecialProps, setSelectedSpecialProps] = useImmer<string[]>([]);
    const [selectedFloorType, setSelectedFloorType] = useImmer<string | null>(null);
    const [inputWindows, setInputWindows] = useImmer<{selectedWindowStyle: string, selectedGlassType: string}[]>([]);

    useEffect(
        ()=>{
            const room = newHouse?.floors.find(floor => floor.id === activeFloorId)
                ?.rooms.find(room => room.id === activeRoomId);
            
            if(room){
                setSelectedRoomType(room.type);
                setSelectedSpecialProps(room.specialProps ?? []);
                setSelectedFloorType(room.floorType);
                setInputWindows(room.windows.map(
                    window => ({
                        selectedWindowStyle: window.windowStyle,
                        selectedGlassType: window.glassType
                    })
                ));
            }else{
                setSelectedRoomType(null);
                setSelectedSpecialProps([]);
                setSelectedFloorType(null);
                setInputWindows([]);
            }
        }
        ,[activeRoomId]
    );
    
    const handleSaveRoom = (e: FormEvent)=>{
        e.preventDefault();
        saveNewHouseRoom(
            {
                name: roomNameRef.current!.value,
                sizeInSquareMeters: Number(roomSizeRef.current!.value),
                type: selectedRoomType!,
                specialProps: selectedSpecialProps ?? [],
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
            } as Room,
            activeFloorId!,
            activeRoomId
        );
        hideRoom();
    }
    const handleAddWindow = ()=>{
        setInputWindows(
            prev=> [
                ...prev,
                {}
            ]
        )
    };

    return (
        <Modal show={roomShow} onHide={hideRoom} size="lg">
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
                                name="type"
                                required
                                className="basic-single"
                                classNamePrefix="select"
                                isSearchable={true}
                                options={roomTypeOptions}
                                value={
                                    roomTypeOptions.find(
                                        option => option.value === selectedRoomType
                                    ) ?? null
                                }
                                onChange={
                                    roomType => {
                                        setSelectedRoomType(roomType?.value ?? null);
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
                                    ) ?? null
                                }
                                onChange={
                                    floorType => setSelectedFloorType(
                                        floorType?.value ?? null
                                    )
                                }
                            />
                        </Form.Group>
                        <Stack direction="horizontal" className='justify-content-between'>
                            <Button type="button" variant="primary"
                                onClick={handleAddWindow}>
                                + Add Window
                            </Button>
                            <span>
                                Total Windows: &nbsp;
                                {inputWindows.length}
                            </span>
                        </Stack>
                        {
                            inputWindows.map(
                                (inputWindow, ndx) => (
                                    <InputGroup key={ndx} style={{marginTop: '-20px'}}>
                                        <InputGroup.Text>
                                            Style <span className="text-danger">*</span>
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
                                                    ? {
                                                        value: inputWindow.selectedWindowStyle, 
                                                        label: windowStyleOptions.find(
                                                            option => option.value === inputWindow.selectedWindowStyle
                                                        )?.label ?? inputWindow.selectedWindowStyle
                                                    }
                                                    :undefined
                                                }
                                                onChange={
                                                    windowStyle => {
                                                        setInputWindows(
                                                            prev => {
                                                                const prevWindow = prev[ndx];
                                                                if(prevWindow){
                                                                    prevWindow.selectedWindowStyle = windowStyle!.value
                                                                }
                                                                return prev;
                                                            }
                                                        )
                                                    }
                                                }
                                            /> 
                                        </div>
                                        <InputGroup.Text>
                                            Glass Type <span className="text-danger">*</span>
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
                                                    ? {
                                                        value: inputWindow.selectedGlassType, 
                                                        label: glassTypeOptions.find(
                                                            option => option.value === inputWindow.selectedGlassType
                                                        )?.label ?? inputWindow.selectedGlassType
                                                    }
                                                    : undefined
                                                }
                                                onChange={
                                                    glassType => {
                                                        setInputWindows(
                                                            prev => {
                                                                const prevWindow = prev[ndx];
                                                                if(prevWindow){
                                                                    prevWindow.selectedGlassType = glassType!.value;
                                                                }
                                                                return prev;
                                                            }
                                                        )
                                                    }
                                                }
                                            />
                                        </div>
                                        <Button variant="danger"
                                            onClick={
                                                ()=>{
                                                    setInputWindows(
                                                        prev => {
                                                            prev.splice(ndx, 1);
                                                            return prev;
                                                        }
                                                    )
                                                }
                                            }>
                                            Delete
                                        </Button>
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
    )
}

export default RoomModal