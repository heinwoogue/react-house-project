import { create } from 'zustand'
import { ActiveFloorNdxState } from '../types';
import { immer } from 'zustand/middleware/immer'

const activeFloorNdxStore = create<ActiveFloorNdxState>()(
    immer(
        (set) => (
            {
                activeFloorNdx: null,
                setActiveFloorNdx: (activeFloorNdx)=>set({activeFloorNdx}),
            }
        )
    )
);

export const useActiveFloorNdx = ()=>activeFloorNdxStore((state)=>state.activeFloorNdx);
export const useSetActiveFloorNdx = ()=>activeFloorNdxStore((state)=>state.setActiveFloorNdx);