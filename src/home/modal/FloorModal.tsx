import React, { FormEvent, useRef } from 'react'
import { v4 as uuidV4 } from "uuid";
import { Button, Form, Modal, Stack } from 'react-bootstrap'
import { FloorModalProps } from '../../types'
import { useFloorShow, useHideFloor } from '../../store/floor-show-store';

function FloorModal(
    {activeFloorId, setActiveFloorNdx, newHouse, setNewHouse}
    : FloorModalProps
) {
    const floorShow = useFloorShow();
    const hideFloor = useHideFloor();

    const floorNameRef = useRef<HTMLInputElement>(null);
    
    const handleSaveFloor = (e: FormEvent)=>{
        e.preventDefault();
        setNewHouse(
            prev => {
                if(!prev){
                    return prev;
                }
                if(activeFloorId){
                    const prevFloor = prev.floors.find(
                        floor => floor.id === activeFloorId
                    );
                    if(prevFloor){
                        prevFloor.name = floorNameRef.current!.value
                    }
                }else {
                    prev.floors.push(
                        {
                            id: uuidV4(), 
                            name: floorNameRef.current!.value, 
                            rooms: []
                        }
                    )
                }
            }
        );
        if(!activeFloorId){
            setActiveFloorNdx(newHouse!.floors.length);
        }
        hideFloor();
    }
    return (
        <Modal show={floorShow} onHide={hideFloor}>
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
    )
}

export default FloorModal