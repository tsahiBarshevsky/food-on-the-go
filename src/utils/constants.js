const hours = [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00"
];

const schedule = [
    {
        day: 'Sunday',
        isOpen: false,
        open: 0,
        close: 0
    },
    {
        day: 'Monday',
        isOpen: false,
        open: 0,
        close: 0
    },
    {
        day: 'Tuesday',
        isOpen: false,
        open: 0,
        close: 0
    },
    {
        day: 'Wednesday',
        isOpen: false,
        open: 0,
        close: 0
    },
    {
        day: 'Thursday',
        isOpen: false,
        open: 0,
        close: 0
    },
    {
        day: 'Friday',
        isOpen: false,
        open: 0,
        close: 0
    },
    {
        day: 'Saturday',
        isOpen: false,
        open: 0,
        close: 0
    }
];

const restaurant = {
    email: '',
    password: '',
    name: '',
    description: '',
    link: '',
    phone: ''
};

export { hours, schedule, restaurant };