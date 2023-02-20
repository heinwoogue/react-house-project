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
    setActiveStep: Updater<number>;
}