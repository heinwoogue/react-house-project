import React, { FormEvent, useRef } from 'react'
import { v4 as uuidV4 } from "uuid";
import { Button, Form, Modal, Stack } from 'react-bootstrap'
import { useFloorShow, useHideFloor } from '../../store/floor-show-store';
import { useActiveFloorId } from '../../store/active-floor-id-store';
import { useSetActiveFloorNdx } from '../../store/active-floor-ndx-store';
import { useNewHouse, useSaveNewHouseFloor, useSaveNewHouse } from '../../store/new-house-store';

function FloorModal(): JSX.Element {
    const floorShow = useFloorShow();
    const hideFloor = useHideFloor();

    const newHouse = useNewHouse();

    const saveNewHouseFloor = useSaveNewHouseFloor();

    const activeFloorId = useActiveFloorId();

    const setActiveFloorNdx = useSetActiveFloorNdx();

    const floorNameRef = useRef<HTMLInputElement>(null);
    
    const handleSaveFloor = (e: FormEvent)=>{
        e.preventDefault();
        const floor = newHouse?.floors.find(
            floor => floor.id === activeFloorId
        );
        saveNewHouseFloor(
            {
                id: floor?.id ?? uuidV4(),
                rooms: floor?.rooms ?? [],
                name: floorNameRef.current!.value, 
            },
            activeFloorId
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