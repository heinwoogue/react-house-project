import { create } from 'zustand'
import { ActiveFloorIdState } from '../types';
import { immer } from 'zustand/middleware/immer'

const activeFloorIdStore = create<ActiveFloorIdState>()(
    immer(
        (set) => (
            {
                activeFloorId: null,
                setActiveFloorId: (activeFloorId)=>set(({activeFloorId})),
            }
        )
    )
);

export const useActiveFloorId = ()=>activeFloorIdStore((state)=>state.activeFloorId);
export const useSetActiveFloorId = ()=>activeFloorIdStore((state)=>state.setActiveFloorId);