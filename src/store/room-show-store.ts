import { create } from 'zustand'
import { FloorShowState, RoomShowState } from '../types';
import { immer } from 'zustand/middleware/immer'

const roomShowStore = create<RoomShowState>()(
    immer(
        (set) => (
            {
                roomShow: false,
                showRoom: ()=>set({roomShow: true}),
                hideRoom: ()=>set({roomShow: false}),
            }
        )
    )
);

export const useRoomShow = ()=>roomShowStore((state)=>state.roomShow);
export const useShowRoom = ()=>roomShowStore((state)=>state.showRoom);
export const useHideRoom = ()=>roomShowStore((state) => state.hideRoom);