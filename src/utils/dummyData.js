const loremIpsum = {
    v1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pretium, nisl sed egestas elementum, quam nunc accumsan risus, sit amet luctus elit sem pretium eros. Fusce molestie ut tortor ac finibus. Suspendisse elementum metus id hendrerit placerat. Nunc euismod nisl sapien, in egestas ante tempor non. Duis dictum velit ut.',
    v2: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris mi eros, vehicula eget ante ac, lobortis hendrerit erat. Proin quis risus in purus feugiat venenatis. Vestibulum finibus quam eu egestas tempor. Aenean vel neque vel magna bibendum facilisis id a leo. Fusce tincidunt, quam at molestie porttitor, justo neque tincidunt.',
    v3: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum auctor augue, et porta ligula dapibus nec. Proin quis lacinia lectus, a scelerisque ante. Nullam efficitur ipsum eu nulla sagittis, quis dignissim justo maximus. Duis quis gravida massa, at lobortis nunc. Nam at lectus cursus augue semper mattis. Praesent mattis.'
};

const dummyRestaurants = [
    {
        owner: null,
        name: 'Meat Wagon',
        description: loremIpsum.v2,
        link: null,
        type: "Food Truck",
        phone: '0521234567',
        accessible: true,
        kosher: true,
        vegetarian: true,
        vegan: true,
        glutenFree: true,
        priceRange: { lowest: 45, highest: 175 },
        reviews: [],
        openingHours: [{ "close": 6, "day": "Sunday", "isOpen": true, "open": 5 }, { "close": 8, "day": "Monday", "isOpen": false, "open": 5 }, { "close": 20, "day": "Tuesday", "isOpen": true, "open": 7 }, { "close": 7, "day": "Wednesday", "isOpen": true, "open": 6 }, { "close": 17, "day": "Thursday", "isOpen": true, "open": 7 }, { "close": 0, "day": "Friday", "isOpen": false, "open": 0 }, { "close": 20, "day": "Saturday", "isOpen": true, "open": 6 }],
        location: {
            city: 'Bat Yam, Israel',
            latitude: 32.009103,
            longitude: 34.735462
        },
        image: 'https://res.cloudinary.com/ddofzlgdu/image/upload/v1674911278/Food%20on%20the%20go%20images/pexels-andr%C3%A9s-g%C3%B3ngora-13068565_jl6wrc.jpg'
    },
    {
        owner: null,
        name: 'Java the Cup',
        description: loremIpsum.v3,
        link: null,
        type: "Coffee Cart",
        phone: '0521234567',
        accessible: false,
        kosher: true,
        vegetarian: true,
        vegan: false,
        glutenFree: true,
        priceRange: { lowest: 15, highest: 35 },
        reviews: [],
        openingHours: [{ "close": 6, "day": "Sunday", "isOpen": true, "open": 5 }, { "close": 8, "day": "Monday", "isOpen": true, "open": 5 }, { "close": 0, "day": "Tuesday", "isOpen": false, "open": 0 }, { "close": 22, "day": "Wednesday", "isOpen": true, "open": 8 }, { "close": 0, "day": "Thursday", "isOpen": false, "open": 0 }, { "close": 0, "day": "Friday", "isOpen": false, "open": 0 }, { "close": 0, "day": "Saturday", "isOpen": false, "open": 0 }],
        location: {
            city: 'Holon, Israel',
            latitude: 32.032246,
            longitude: 34.822866
        },
        image: 'https://res.cloudinary.com/ddofzlgdu/image/upload/v1674912137/Food%20on%20the%20go%20images/pexels-chevanon-photography-302899_bn7hta.jpg'
    },
    {
        owner: null,
        name: 'Mug Shot',
        description: loremIpsum.v1,
        link: null,
        type: "Coffee Truck",
        phone: '0521234567',
        accessible: true,
        kosher: true,
        vegetarian: false,
        vegan: false,
        glutenFree: true,
        priceRange: { lowest: 15, highest: 55 },
        reviews: [],
        openingHours: [{ "close": 6, "day": "Sunday", "isOpen": true, "open": 5 }, { "close": 8, "day": "Monday", "isOpen": false, "open": 5 }, { "close": 7, "day": "Tuesday", "isOpen": true, "open": 5 }, { "close": 7, "day": "Wednesday", "isOpen": false, "open": 6 }, { "close": 0, "day": "Thursday", "isOpen": false, "open": 0 }, { "close": 0, "day": "Friday", "isOpen": false, "open": 0 }, { "close": 11, "day": "Saturday", "isOpen": true, "open": 6 }],
        location: {
            city: 'Tel Aviv, Israel',
            latitude: 32.065965,
            longitude: 34.761582
        },
        image: 'https://res.cloudinary.com/ddofzlgdu/image/upload/v1674912286/Food%20on%20the%20go%20images/pexels-lisa-fotios-1207918_xjjnxe.jpg'
    },
    {
        owner: null,
        name: 'Pasta Paradise',
        description: loremIpsum.v3,
        link: null,
        type: "Food Truck",
        phone: '0521234567',
        accessible: true,
        kosher: false,
        vegetarian: true,
        vegan: false,
        glutenFree: false,
        priceRange: { lowest: 55, highest: 120 },
        reviews: [],
        openingHours: [{ "close": 6, "day": "Sunday", "isOpen": true, "open": 5 }, { "close": 8, "day": "Monday", "isOpen": false, "open": 5 }, { "close": 20, "day": "Tuesday", "isOpen": true, "open": 7 }, { "close": 7, "day": "Wednesday", "isOpen": true, "open": 6 }, { "close": 17, "day": "Thursday", "isOpen": true, "open": 7 }, { "close": 0, "day": "Friday", "isOpen": false, "open": 0 }, { "close": 20, "day": "Saturday", "isOpen": true, "open": 6 }],
        location: {
            city: 'Tel Aviv, Israel',
            latitude: 32.097454,
            longitude: 34.820720
        },
        image: 'https://res.cloudinary.com/ddofzlgdu/image/upload/v1674912420/Food%20on%20the%20go%20images/pexels-jorge-zapata-1398688_ovhqvp.jpg'
    },
    {
        owner: null,
        name: 'Rolling Stoves',
        description: loremIpsum.v2,
        link: null,
        type: "Food Truck",
        phone: '0521234567',
        accessible: true,
        kosher: true,
        vegetarian: true,
        vegan: true,
        glutenFree: true,
        priceRange: { lowest: 35, highest: 80 },
        reviews: [],
        openingHours: [{ "close": 6, "day": "Sunday", "isOpen": true, "open": 5 }, { "close": 8, "day": "Monday", "isOpen": true, "open": 5 }, { "close": 0, "day": "Tuesday", "isOpen": false, "open": 0 }, { "close": 22, "day": "Wednesday", "isOpen": true, "open": 8 }, { "close": 0, "day": "Thursday", "isOpen": false, "open": 0 }, { "close": 0, "day": "Friday", "isOpen": false, "open": 0 }, { "close": 0, "day": "Saturday", "isOpen": false, "open": 0 }],
        location: {
            city: 'Givat Hen, Israel',
            latitude: 32.164469,
            longitude: 34.871574
        },
        image: 'https://res.cloudinary.com/ddofzlgdu/image/upload/v1674912589/Food%20on%20the%20go%20images/pexels-andrea-piacquadio-3768169_j9korv.jpg'
    },
    {
        owner: null,
        name: 'The Food Stop',
        description: loremIpsum.v1,
        link: null,
        type: "Food Truck",
        phone: '0521234567',
        accessible: true,
        kosher: true,
        vegetarian: false,
        vegan: false,
        glutenFree: true,
        priceRange: { lowest: 32, highest: 100 },
        reviews: [],
        openingHours: [{ "close": 6, "day": "Sunday", "isOpen": true, "open": 5 }, { "close": 8, "day": "Monday", "isOpen": false, "open": 5 }, { "close": 7, "day": "Tuesday", "isOpen": true, "open": 5 }, { "close": 7, "day": "Wednesday", "isOpen": false, "open": 6 }, { "close": 0, "day": "Thursday", "isOpen": false, "open": 0 }, { "close": 0, "day": "Friday", "isOpen": false, "open": 0 }, { "close": 11, "day": "Saturday", "isOpen": true, "open": 6 }],
        location: {
            city: 'Genosar, Israel',
            latitude: 32.850254,
            longitude: 35.520841
        },
        image: 'https://res.cloudinary.com/ddofzlgdu/image/upload/v1674912790/Food%20on%20the%20go%20images/pexels-kampus-production-5920742_uhs7ad.jpg'
    },
    {
        owner: null,
        name: 'Latte Da',
        description: loremIpsum.v3,
        link: null,
        type: "Coffee Cart",
        phone: '0521234567',
        accessible: true,
        kosher: false,
        vegetarian: true,
        vegan: false,
        glutenFree: true,
        priceRange: { lowest: 5, highest: 25 },
        reviews: [],
        openingHours: [{ "close": 6, "day": "Sunday", "isOpen": true, "open": 5 }, { "close": 8, "day": "Monday", "isOpen": false, "open": 5 }, { "close": 20, "day": "Tuesday", "isOpen": true, "open": 7 }, { "close": 7, "day": "Wednesday", "isOpen": true, "open": 6 }, { "close": 17, "day": "Thursday", "isOpen": true, "open": 7 }, { "close": 0, "day": "Friday", "isOpen": false, "open": 0 }, { "close": 20, "day": "Saturday", "isOpen": true, "open": 6 }],
        location: {
            city: 'Akko, Israel',
            latitude: 32.948646,
            longitude: 35.093136
        },
        image: 'https://res.cloudinary.com/ddofzlgdu/image/upload/v1674912963/Food%20on%20the%20go%20images/pexels-chevanon-photography-302905_dsxotb.jpg'
    },
    {
        owner: null,
        name: 'Travel Cup',
        description: loremIpsum.v1,
        link: null,
        type: "Coffee Cart",
        phone: '0521234567',
        accessible: false,
        kosher: true,
        vegetarian: false,
        vegan: false,
        glutenFree: true,
        priceRange: { lowest: 15, highest: 35 },
        reviews: [],
        openingHours: [{ "close": 6, "day": "Sunday", "isOpen": true, "open": 5 }, { "close": 8, "day": "Monday", "isOpen": true, "open": 5 }, { "close": 0, "day": "Tuesday", "isOpen": false, "open": 0 }, { "close": 22, "day": "Wednesday", "isOpen": true, "open": 8 }, { "close": 0, "day": "Thursday", "isOpen": false, "open": 0 }, { "close": 0, "day": "Friday", "isOpen": false, "open": 0 }, { "close": 0, "day": "Saturday", "isOpen": false, "open": 0 }],
        location: {
            city: 'Haifa, Israel',
            latitude: 32.835407,
            longitude: 34.979499
        },
        image: 'https://res.cloudinary.com/ddofzlgdu/image/upload/v1674913102/Food%20on%20the%20go%20images/pexels-engin-akyurt-1437318_nyeybi.jpg'
    },
    {
        owner: null,
        name: 'Street Food 4 U',
        description: loremIpsum.v3,
        link: null,
        type: "Food Truck",
        phone: '0521234567',
        accessible: true,
        kosher: true,
        vegetarian: true,
        vegan: true,
        glutenFree: true,
        priceRange: { lowest: 35, highest: 110 },
        reviews: [],
        openingHours: [{ "close": 6, "day": "Sunday", "isOpen": true, "open": 5 }, { "close": 8, "day": "Monday", "isOpen": false, "open": 5 }, { "close": 7, "day": "Tuesday", "isOpen": true, "open": 5 }, { "close": 7, "day": "Wednesday", "isOpen": false, "open": 6 }, { "close": 0, "day": "Thursday", "isOpen": false, "open": 0 }, { "close": 0, "day": "Friday", "isOpen": false, "open": 0 }, { "close": 11, "day": "Saturday", "isOpen": true, "open": 6 }],
        location: {
            city: 'Merom Golan, Israel',
            latitude: 33.140985,
            longitude: 35.778142
        },
        image: 'https://res.cloudinary.com/ddofzlgdu/image/upload/v1674913263/Food%20on%20the%20go%20images/pexels-adrian-dorobantu-2089719_vcihk1.jpg'
    },
];

export { dummyRestaurants };