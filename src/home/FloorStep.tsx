import React, { FormEvent, useRef } from 'react'
import { v4 as uuidV4 } from "uuid";
import { useImmer } from "use-immer";
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { Accordion, Button, Form, Modal, Stack, InputGroup, Card } from 'react-bootstrap'
import { HouseFormStepProps } from '../types'
import { AccordionEventKey } from 'react-bootstrap/esm/AccordionContext';
import { floorTypeOptions, glassTypeOptions, roomTypeOptions, roomTypePropertiesOptions, windowStyleOptions } from '../const';
import FloorModal from './modal/FloorModal';
import RoomModal from './modal/RoomModal';

function FloorStep({setActiveStep, newHouse, setNewHouse}: HouseFormStepProps) {
    const [floorShow, setFloorShow] = useImmer(false);
    const [activeFloorNdx, setActiveFloorNdx] = useImmer<number | null>(null);
    
    const [activeFloorId, setActiveFloorId] = useImmer<string | null>(null);

    const [activeRoomId, setActiveRoomId] = useImmer<string | null>(null);
    const [roomShow, setRoomShow] = useImmer(false);
    
    const handleFloorShow = (floorId?: string) => {
        if(floorId){
            setActiveFloorId(floorId);
        }else{
            setActiveFloorId(null);
        }
        
        setFloorShow(true)
    };
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

        setRoomShow(true);
    };
    
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
        setActiveFloorNdx(null);
    }
    
    const deleteRoom = (floorId: string, roomId: string)=>{
        setNewHouse(
            prev=>{
                if(!prev){
                    return prev;
                }
                const prevFloors = prev.floors.find(
                    floor => floor.id === floorId
                );
                if(prevFloors){
                    const roomNdx = prevFloors.rooms.findIndex(
                        room => room.id === roomId
                    );
                    if(roomNdx >= 0){
                        prevFloors.rooms.splice(roomNdx, 1);
                    }
                }
                return prev;
            }
        );
    }

    const accordionOnSelect = (event: AccordionEventKey) => {
        if(event){
            setActiveFloorNdx(Number(event));
        }else {
            setActiveFloorNdx(null);
        }
    }

    return (
        <>
            <Stack direction="horizontal" className='justify-content-center'>
                <Card className="w-50 pb-4">
                    <Card.Body>
                        <Stack direction="horizontal" className="justify-content-between mt-3">
                            <Button type="button" variant="primary" 
                                onClick={()=>handleFloorShow()}>
                                + Add Floor
                            </Button>  
                            <p>Total Floors: {newHouse?.floors.length}</p>
                        </Stack>
                        <Accordion className="mt-4"
                            activeKey={`${activeFloorNdx}`} 
                            onSelect={accordionOnSelect}>
                            {
                                newHouse?.floors.map(
                                    (floor, ndx) => {
                                        return (
                                            <Accordion.Item key={floor.id} eventKey={`${ndx}`}>
                                                <Accordion.Header>{floor.name}</Accordion.Header>
                                                <Accordion.Body className="mb-4">
                                                    <Stack direction="horizontal">
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
                                                    <Stack direction="horizontal" className="justify-content-between mt-5 mb-2">
                                                        <Button type="button" variant="primary" 
                                                            onClick={()=>handleRoomShow(floor.id)}>
                                                            + Add Room
                                                        </Button>
                                                        <span>
                                                            Total Rooms: &nbsp;
                                                            {!floor.rooms || floor.rooms.length === 0 ? 0: floor.rooms.length}
                                                        </span>
                                                    </Stack>
                                                    {
                                                        floor.rooms.map(
                                                            (room) => {
                                                                return (
                                                                    <Stack key={room.id} direction="horizontal" className="mb-2 pb-1 border-bottom">
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
            </Stack>

            <Stack direction="horizontal" gap={2} className="mt-5">
                <Button type="button" variant="primary"
                    onClick={()=>setActiveStep(prev => prev - 1)}>
                    Back
                </Button>
                <Button type="button" className="ms-auto"
                    onClick={()=>setActiveStep(prev => prev + 1)}>
                    Next
                </Button>
            </Stack>

            <RoomModal 
                roomShow={roomShow} 
                setRoomShow={setRoomShow}
                activeFloorId={activeFloorId}
                setActiveFloorId={setActiveFloorId}
                activeRoomId={activeRoomId}
                setActiveRoomId={setActiveRoomId}
                newHouse={newHouse}
                setNewHouse={setNewHouse}
            />

            <FloorModal 
                floorShow={floorShow}
                setFloorShow={setFloorShow}
                activeFloorId={activeFloorId}
                setActiveFloorId={setActiveFloorId}
                activeFloorNdx={activeFloorNdx}
                setActiveFloorNdx={setActiveFloorNdx}
                newHouse={newHouse}
                setNewHouse={setNewHouse}
            />
        </>
    )
}

export default FloorStep