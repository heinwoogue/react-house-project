import { create } from 'zustand'
import {persist, createJSONStorage} from 'zustand/middleware'
import { ActiveStepState } from '../types';
import { immer } from 'zustand/middleware/immer'

export const ACTIVE_STEP = 'activeStep'

const activeStepStore = create<ActiveStepState>()(
    immer(
        persist(
            (set) => (
                {
                    activeStep: 0,
                    nextActiveStep: ()=>set(state => ({activeStep: state.activeStep + 1})),
                    prevActiveStep: ()=>set(state => ({activeStep: state.activeStep - 1})),
                }
            )
            ,{
                name: ACTIVE_STEP,
                storage: createJSONStorage(() => localStorage),
            }
        )
    )
);

export const useActiveStep = ()=>activeStepStore((state)=>state.activeStep);
export const useNextActiveStep = ()=>activeStepStore((state)=>state.nextActiveStep);
export const usePrevActiveStep = ()=>activeStepStore((state) => state.prevActiveStep);