import { create } from 'zustand'
import { FloorShowState } from '../types';
import { immer } from 'zustand/middleware/immer'

const floorShowStore = create<FloorShowState>()(
    immer(
        (set) => (
            {
                floorShow: false,
                showFloor: ()=>set({floorShow: true}),
                hideFloor: ()=>set({floorShow: false}),
            }
        )
    )
);

export const useFloorShow = ()=>floorShowStore((state)=>state.floorShow);
export const useShowFloor = ()=>floorShowStore((state)=>state.showFloor);
export const useHideFloor = ()=>floorShowStore((state) => state.hideFloor);