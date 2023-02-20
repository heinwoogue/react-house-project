export const foundationTypeOptions = [
    {value: 'brick', label: 'Brick'},
    {value: 'slab', label: 'Slab'},
    {value: 'reinforcedConcrete', label: 'Reinforced Concrete'}
];

export const roomTypeOptions = [
    {value: 'bedroom', label: 'Bedroom'},
    {value: 'lounge', label: 'Lounge'},
    {value: 'diner', label: 'Diner'},
    {value: 'kitchen', label: 'Kitchen'},
    {value: 'bathroom', label: 'Bathroom'},
    {value: 'office', label: 'Office'},
];

export const roomTypePropertiesOptions: {[key: string]: {value:string, label: string}[]} = {
    'bedroom': [
        {value: 'hasToilet', label: 'Has Toilet'},
        {value: 'hasComputer', label: 'Has Computer'},
    ],
    'lounge': [
        {value: 'hasSofa', label: 'Has Sofa'},
        {value: 'hasFountain', label: 'Has Fountain'},
    ],
    'diner': [
        {value: 'hasIsland', label: 'Has Island'},
        {value: 'hasMusicBox', label: 'Has Music Box'},
    ],
    'kitchen': [
        {value: 'hasOven', label: 'Has Oven'},
        {value: 'hasMicrowave', label: 'Has Microwave'},
    ],
    'bathroom': [
        {value: 'hasBidet', label: 'Has Bidet'},
        {value: 'hasDryer', label: 'Has Dryer'},
    ],
    'office': [
        {value: 'hasDesk', label: 'Has Desk'},
        {value: 'hasChair', label: 'Has Chair'},
    ],
}

export const roofTypeOptions = [
    {value: 'straw', label: 'Straw'},
    {value: 'thatched', label: 'Thatched'},
    {value: 'tiled', label: 'Tiled'},
    {value: 'flat', label: 'Flat'},
];


export const floorTypeOptions = [
    {value: 'wood', label: 'Wood'},
    {value: 'carpet', label: 'Carpet'}
];

export const windowStyleOptions = [
    {value: 'bay', label: 'Bay'},
    {value: 'flat', label: 'Flat'},
    {value: 'fullHeight', label: 'Full Height'}
];

export const glassTypeOptions = [
    {value: 'tempered', label: 'Tempered'},
    {value: 'tripleGlazed', label: 'Triple Glazed'},
    {value: 'doubleGlazed', label: 'Double Glazed'}
];

export const gardenOptions = [
    {value: 'grass', label: 'Grass'},
    {value: 'bush', label: 'Bush'},
    {value: 'wildFlower', label: 'Wildflower'},
    {value: 'thistle', label: 'Thistle'},
    {value: 'flower', label: 'Flower'},
    {value: 'bamboo', label: 'Bamboo'},
];

export const stepStyleDTOCustom = {
    activeBgColor: 'black',
    activeTextColor: '#ffffff',
    completedBgColor: 'gray',
    completedTextColor: '#ffffff',
    inactiveBgColor: '#e0e0e0',
    inactiveTextColor: '#ffffff',
    size: '2em',
    circleFontSize: '1rem',
    labelFontSize: '0.875rem',
    borderRadius: '50%',
    fontWeight: 500
}