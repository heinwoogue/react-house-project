import { create } from 'zustand'
import {persist, createJSONStorage} from 'zustand/middleware'
import { Floor, NewHouseState, Room } from '../types';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidV4 } from "uuid";

const NEW_HOUSE = 'newHouse';

const newHouseStore = create<NewHouseState>()(
    immer(
        persist(
            (set) => ({
                newHouse: null,
                saveNewHouse: (newHouse)=>set({newHouse}),
                deleteNewHouseFloor: (floorId: string) => set(
                    state => {
                        if(!state.newHouse){
                            return;
                        }
                        const floors = state.newHouse.floors;
                        state.newHouse.floors = floors.filter(
                            floor=>floor.id !== floorId
                        )
                    }
                ),
                deleteNewHouseRoom: (floorId: string, roomId: string) => set(
                    state => {
                        if(!state.newHouse){
                            return;
                        }
                        const prevFloors = state.newHouse.floors.find(
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
                    }
                ),
                saveNewHouseFloor: (floor: Floor, floorId: string | null) => set(
                    state => {
                        if(!state.newHouse){
                            return;
                        }
                        if(floorId){
                            const floorNdx = state.newHouse.floors.findIndex(floor => floor.id === floorId);
                            if(floorNdx >= 0){
                                state.newHouse.floors[floorNdx] = {
                                    ...state.newHouse.floors,
                                    ...floor
                                }
                            }
                        }else {
                            state.newHouse.floors.push(
                                {
                                    ...floor,
                                    id: uuidV4(), 
                                    rooms: [],
                                }
                            )
                        }
                    }
                ),
                saveNewHouseRoom: (room: Room, floorId: string, roomId:string | null) => set(
                    state => {
                        if(!state.newHouse){
                            return;
                        }
                        const floor = state.newHouse.floors.find(floor=> floor.id === floorId);
                        if(!floor){
                            return;
                        }
                        if(roomId){
                            const roomNdx = floor.rooms.findIndex(room => room.id === roomId);
                            if(roomNdx >= 0){
                                floor.rooms[roomNdx] = {
                                    ...floor.rooms[roomNdx],
                                    ...room
                                }
                            }
                        }else{
                            floor.rooms.push(
                                {
                                    ...room,
                                    id: uuidV4()
                                }
                            );
                        }
                    }
                )
            }),
            {
                name: NEW_HOUSE,
                storage: createJSONStorage(() => localStorage),
            }
        )
    )
);

export const useNewHouse = ()=>newHouseStore((state)=>state.newHouse);
export const useSaveNewHouse = ()=>newHouseStore((state)=>state.saveNewHouse);
export const useDeleteNewHouseFloor = ()=>newHouseStore((state)=>state.deleteNewHouseFloor);
export const useDeleteNewHouseRoom = ()=>newHouseStore((state)=>state.deleteNewHouseRoom);
export const useSaveNewHouseFloor = ()=>newHouseStore((state)=>state.saveNewHouseFloor);
export const useSaveNewHouseRoom = ()=>newHouseStore((state)=>state.saveNewHouseRoom);
