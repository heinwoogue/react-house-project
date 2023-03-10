import { Button, Card, Stack } from 'react-bootstrap'
import {usePrevActiveStep} from '../../store/active-step-store';

function CompleteStep(): JSX.Element {
    const prevActiveStep = usePrevActiveStep();

    return (
        <>
            <Stack direction="horizontal" className='justify-content-center'>
                <Card className="w-50 pb-4">
                    <Card.Body>
                    <Stack direction="horizontal" className="justify-content-center">
                        <h2>Thank you for filling up your new house!</h2>
                    </Stack>
                    </Card.Body>
                </Card>
            </Stack>
            <Stack direction="horizontal" gap={2} className="mt-5">
                <Button type="button" variant="primary"
                    onClick={prevActiveStep}>
                    Back
                </Button>
            </Stack>
        </>
    )
}

export default CompleteStep