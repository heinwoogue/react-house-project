import { create } from 'zustand'
import { ActiveRoomIdState } from '../types';
import { immer } from 'zustand/middleware/immer'

const activeRoomIdStore = create<ActiveRoomIdState>()(
    immer(
        (set) => (
            {
                activeRoomId: null,
                setActiveRoomId: (activeRoomId)=>set(({activeRoomId})),
            }
        )
    )
);

export const useActiveRoomId = ()=>activeRoomIdStore((state)=>state.activeRoomId);
export const useSetActiveRoomId = ()=>activeRoomIdStore((state)=>state.setActiveRoomId);