import { Updater } from "use-immer";

export type Window = {
    id: string;
    windowStyle: string;
    glassType: string;
}

export type Room = {
    id: string;
    name: string;
    sizeInSquareMeters: number;
    type: string;
    specialProps: string[];
    floorType: string;
    windows: Window[];
}

export type Floor = {
    id: string;
    name: string;
    rooms: Room[];
};

export type House = {
    id: string;
    name: string;
    foundationType: string;
    sizeInSquareMeters: number;
    roofType: string;
    gardens: string[];
    floors: Floor[];
}

export type HouseFormStepProps = {
    newHouse: House | null;
    setNewHouse: Updater<House | null>;
}

export type FloorModalProps = {
    newHouse: House | null;
    setNewHouse: Updater<House | null>;
}

export type RoomModalProps = {
    activeRoomId: string | null;
    setActiveRoomId: Updater<string | null>;
    newHouse: House | null;
    setNewHouse: Updater<House | null>;
}

export type ActiveStepState = {
    activeStep: number;
    nextActiveStep: () => void;
    prevActiveStep: () => void;
}

export type FloorShowState = {
    floorShow: boolean;
    hideFloor: () => void;
    showFloor: () => void;
}

export type RoomShowState = {
    roomShow: boolean;
    hideRoom: () => void;
    showRoom: () => void;
}

export type ActiveFloorIdState = {
    activeFloorId: string | null;
    setActiveFloorId: (activeFloorId: string | null) => void;
}

export type ActiveFloorNdxState = {
    activeFloorNdx: number | null;
    setActiveFloorNdx: (activeFloorId: number | null) => void;
}