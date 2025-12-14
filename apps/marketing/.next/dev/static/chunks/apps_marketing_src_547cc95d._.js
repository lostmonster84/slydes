(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/marketing/src/components/slyde-demo/frameData.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Frame Data Configuration for WildTrax Demo
 * 
 * This file contains all the data for the WildTrax demo Slydes.
 * Each Frame follows the AIDA framework:
 * - Attention (Hook)
 * - Interest (How, Who, What)
 * - Desire (Social Proof, Choose, Cinematic)
 * - Action (Trust, Book)
 * 
 * TERMINOLOGY (per STRUCTURE.md):
 * - Slyde = shareable experience (e.g., "Camping", "Just Drive")
 * - Frame = vertical screen inside a Slyde
 * 
 * @see SLYDESBUILD.md for schema documentation
 * @see STRUCTURE.md for canonical hierarchy
 */ __turbopack_context__.s([
    "campingFAQs",
    ()=>campingFAQs,
    "campingFrames",
    ()=>campingFrames,
    "campingSlides",
    ()=>campingSlides,
    "campingSlydeConfig",
    ()=>campingSlydeConfig,
    "justDriveFAQs",
    ()=>justDriveFAQs,
    "justDriveFrames",
    ()=>justDriveFrames,
    "justDriveSlides",
    ()=>justDriveSlides,
    "justDriveSlydeConfig",
    ()=>justDriveSlydeConfig,
    "wildtraxBusiness",
    ()=>wildtraxBusiness,
    "wildtraxFAQs",
    ()=>wildtraxFAQs,
    "wildtraxFeaturedReviews",
    ()=>wildtraxFeaturedReviews,
    "wildtraxReviews",
    ()=>wildtraxReviews,
    "wildtraxSlides",
    ()=>wildtraxSlides,
    "wildtraxSlydes",
    ()=>wildtraxSlydes
]);
const wildtraxBusiness = {
    id: 'wildtrax',
    name: 'WildTrax',
    tagline: 'Highland Adventures',
    location: 'Scottish Highlands',
    rating: 5.0,
    reviewCount: 209,
    credentials: [
        {
            icon: '⭐',
            label: '5-Star',
            value: 'Rated'
        },
        {
            icon: '🏆',
            label: 'Top',
            value: 'Rated 2024'
        },
        {
            icon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
            label: 'Est',
            value: '2019'
        }
    ],
    about: 'Land Rover Defender camping experiences in the Scottish Highlands. We provide fully-equipped Defenders with rooftop tents, kitchens, and all the gear you need. Wake up anywhere. No camping experience required.',
    highlights: [
        '15+ years of Highland adventure experience',
        'NC500 and off-grid specialists',
        'Fully equipped Defender 110s',
        'No camping experience required',
        'Award-winning customer service'
    ],
    contact: {
        phone: '+44 1234 567890',
        email: 'hello@wildtrax.co.uk',
        website: 'https://wildtrax.co.uk'
    },
    accentColor: 'bg-red-600'
};
const campingSlydeConfig = {
    id: 'camping',
    slug: 'camping',
    name: 'Camping',
    description: 'Land Rover + Rooftop Tent',
    icon: 'tent',
    accentColor: 'bg-red-600'
};
const justDriveSlydeConfig = {
    id: 'just-drive',
    slug: 'just-drive',
    name: 'Just Drive',
    description: 'Land Rover Day Hire',
    icon: 'car',
    accentColor: 'bg-amber-600'
};
const wildtraxSlydes = [
    campingSlydeConfig,
    justDriveSlydeConfig
];
const campingFrames = [
    {
        id: 'hook',
        order: 1,
        templateType: 'hook',
        title: 'Wake Up',
        subtitle: 'Here',
        badge: '⭐ 5-Star Rated',
        rating: 5.0,
        reviewCount: 209,
        heartCount: 2400,
        faqCount: 12,
        cta: {
            text: 'Book Now',
            icon: 'book',
            action: 'https://wildtrax.co.uk/book'
        },
        background: {
            type: 'video',
            src: '/videos/hero-defender.mp4',
            startTime: 0
        },
        accentColor: 'bg-red-600',
        infoContent: {
            headline: 'The WildTrax Experience',
            description: 'Land Rover Defender camping in the Scottish Highlands. Everything included - just bring yourself and a sense of adventure.',
            highlights: [
                {
                    icon: '🏔️',
                    label: 'Location',
                    value: 'Scottish Highlands'
                },
                {
                    icon: '🚗',
                    label: 'Vehicle',
                    value: 'Land Rover Defender'
                },
                {
                    icon: '⏱️',
                    label: 'Min Stay',
                    value: '2 nights'
                }
            ]
        }
    },
    {
        id: 'how',
        order: 2,
        templateType: 'how',
        title: 'Rooftop Tent',
        subtitle: 'Pop up in 60 seconds',
        badge: '🏕️ Easy Setup',
        heartCount: 1800,
        faqCount: 8,
        cta: {
            text: 'See How It Works',
            icon: 'view',
            action: 'info'
        },
        background: {
            type: 'video',
            src: '/videos/hero-defender.mp4',
            startTime: 3
        },
        accentColor: 'bg-red-600',
        infoContent: {
            headline: 'How the Tent Works',
            description: 'Our QuickPitch rooftop tent sets up in under 60 seconds. No poles, no pegs, no stress.',
            items: [
                'Unfold the tent from the roof rack',
                'Pull the ladder down',
                'Climb in and sleep',
                'Pack down in 2 minutes'
            ],
            highlights: [
                {
                    icon: '⏱️',
                    label: 'Setup',
                    value: '60 seconds'
                },
                {
                    icon: '👥',
                    label: 'Sleeps',
                    value: '2-3 people'
                },
                {
                    icon: '📏',
                    label: 'Size',
                    value: 'King-size mattress'
                }
            ]
        }
    },
    {
        id: 'who',
        order: 3,
        templateType: 'who',
        title: 'The Experience',
        subtitle: 'Couples • Families • Friends • Solo',
        badge: '🚗 4 Adventures',
        heartCount: 3100,
        faqCount: 15,
        cta: {
            text: 'Find Your Trip',
            icon: 'view',
            action: 'https://wildtrax.co.uk/experiences'
        },
        background: {
            type: 'video',
            src: '/videos/hero-defender.mp4',
            startTime: 6
        },
        accentColor: 'bg-red-600',
        infoContent: {
            headline: 'Perfect For Everyone',
            description: 'Whether you\'re a couple seeking romance, a family making memories, friends on an adventure, or a solo explorer - we\'ve got you covered.',
            items: [
                '💑 Couples - Romantic highland escapes',
                '👨‍👩‍👧‍👦 Families - Kid-friendly adventures',
                '👯 Friends - Group road trips',
                '🧘 Solo - Find yourself in nature'
            ]
        }
    },
    {
        id: 'what',
        order: 4,
        templateType: 'what',
        title: 'Full Kit',
        subtitle: 'Everything included',
        badge: '✅ Everything Included',
        heartCount: 2900,
        faqCount: 22,
        cta: {
            text: 'View Gear List',
            icon: 'view',
            action: 'info'
        },
        background: {
            type: 'video',
            src: '/videos/hero-defender.mp4',
            startTime: 9
        },
        accentColor: 'bg-red-600',
        infoContent: {
            headline: 'What\'s Included',
            description: 'Everything you need for a comfortable camping experience. No need to buy or bring any gear.',
            items: [
                '🏕️ Rooftop tent with king-size mattress',
                '🛏️ Bedding: duvet, pillows, sheets',
                '🍳 Full kitchen: stove, pans, utensils',
                '🪑 Camping chairs and table',
                '💡 LED lighting (interior + exterior)',
                '❄️ Cool box for food and drinks',
                '☔ Awning for shade and rain cover',
                '🔌 USB charging ports'
            ],
            highlights: [
                {
                    icon: '📦',
                    label: 'Items',
                    value: '30+ included'
                },
                {
                    icon: '💰',
                    label: 'Extra Cost',
                    value: 'None'
                },
                {
                    icon: '✅',
                    label: 'Setup',
                    value: 'Ready to go'
                }
            ]
        }
    },
    {
        id: 'proof',
        order: 5,
        templateType: 'proof',
        title: '209 Reviews',
        subtitle: '"Best trip of our lives"',
        badge: '💬 Verified Reviews',
        rating: 5.0,
        reviewCount: 209,
        heartCount: 4200,
        faqCount: 6,
        cta: {
            text: 'Read Reviews',
            icon: 'view',
            action: 'reviews'
        },
        background: {
            type: 'video',
            src: '/videos/hero-defender.mp4',
            startTime: 12
        },
        accentColor: 'bg-red-600',
        infoContent: {
            headline: 'What Guests Say',
            description: '209 five-star reviews and counting. Here\'s what real guests have to say:',
            items: [
                '"Absolutely incredible! Waking up to Glencoe views was unforgettable." - James & Sarah',
                '"The kids loved it. So easy to set up, we were cooking dinner in 10 minutes." - The Thompsons',
                '"Best way to see the Highlands. Will definitely be back!" - Mike R.',
                '"Perfect for our honeymoon. Romantic and adventurous." - Emma & Tom'
            ],
            highlights: [
                {
                    icon: '⭐',
                    label: 'Rating',
                    value: '5.0 / 5.0'
                },
                {
                    icon: '💬',
                    label: 'Reviews',
                    value: '209 verified'
                },
                {
                    icon: '👍',
                    label: 'Recommend',
                    value: '100%'
                }
            ]
        }
    },
    {
        id: 'choose',
        order: 6,
        title: 'Pick Your Defender',
        subtitle: '3 vehicles • All equipped',
        badge: '🚙 Choose Your Ride',
        rating: 5.0,
        reviewCount: 209,
        heartCount: 5100,
        faqCount: 18,
        cta: {
            text: 'View Fleet',
            icon: 'view',
            action: 'info'
        },
        background: {
            type: 'video',
            src: '/videos/hero-defender.mp4',
            startTime: 15
        },
        accentColor: 'bg-red-600',
        infoContent: {
            headline: 'Our Fleet',
            description: 'Three Land Rover Defenders, each fully equipped with rooftop tent and camping kit.',
            items: [
                '🟢 Defender 90 "Glen" - Compact, nimble, perfect for couples',
                '🔵 Defender 110 "Loch" - More space, great for families',
                '🟡 Defender 110 "Ben" - Our newest addition, premium spec'
            ],
            highlights: [
                {
                    icon: '🚗',
                    label: 'Vehicles',
                    value: '3 available'
                },
                {
                    icon: '📅',
                    label: 'Book ahead',
                    value: '2-4 weeks'
                },
                {
                    icon: '🔄',
                    label: 'Availability',
                    value: 'Check dates'
                }
            ]
        }
    },
    {
        id: 'cinematic',
        order: 7,
        title: '',
        subtitle: '',
        heartCount: 6300,
        faqCount: 4,
        background: {
            type: 'video',
            src: '/videos/hero-defender.mp4',
            startTime: 18
        },
        accentColor: 'bg-red-600',
        infoContent: {
            headline: 'The Highland Experience',
            description: 'This is what awaits you. Wild camping under the stars, waking up to mountain views, complete freedom to explore.'
        }
    },
    {
        id: 'trust',
        order: 8,
        templateType: 'trust',
        title: 'Quick Answers',
        subtitle: 'Top questions answered',
        badge: '❓ FAQs',
        heartCount: 1200,
        faqCount: 31,
        cta: {
            text: 'View All FAQs',
            icon: 'view',
            action: 'faq'
        },
        background: {
            type: 'video',
            src: '/videos/hero-defender.mp4',
            startTime: 21
        },
        accentColor: 'bg-red-600',
        infoContent: {
            headline: 'Common Questions',
            items: [
                '🐕 Dogs welcome - no extra charge',
                '❌ Free cancellation up to 48 hours',
                '🪪 Standard UK license required (25+)',
                '📍 Pick up from Inverness',
                '⛽ Fuel not included (25-30 MPG)',
                '🏕️ Wild camping allowed in Scotland'
            ]
        }
    },
    {
        id: 'action',
        order: 9,
        templateType: 'action',
        title: 'Book Now',
        subtitle: 'From £165/night',
        badge: '💰 Best Price',
        rating: 5.0,
        reviewCount: 209,
        heartCount: 2800,
        faqCount: 9,
        cta: {
            text: 'Check Availability',
            icon: 'book',
            action: 'https://wildtrax.co.uk/book'
        },
        background: {
            type: 'video',
            src: '/videos/hero-defender.mp4',
            startTime: 24
        },
        accentColor: 'bg-red-600',
        infoContent: {
            headline: 'Pricing & Booking',
            description: 'Simple, transparent pricing. Everything included.',
            highlights: [
                {
                    icon: '💰',
                    label: 'From',
                    value: '£165/night'
                },
                {
                    icon: '📅',
                    label: 'Min stay',
                    value: '2 nights'
                },
                {
                    icon: '❌',
                    label: 'Cancellation',
                    value: 'Free (48hrs)'
                }
            ],
            items: [
                '✅ Defender + rooftop tent',
                '✅ Full camping kit (30+ items)',
                '✅ Unlimited mileage',
                '✅ 24/7 roadside assistance',
                '✅ Comprehensive insurance'
            ]
        }
    },
    {
        id: 'slydes',
        order: 10,
        templateType: 'slydes',
        title: 'Want This For',
        subtitle: 'Your Business?',
        badge: '✨ Powered by Slydes',
        heartCount: 0,
        faqCount: 0,
        cta: {
            text: 'Try Slydes',
            icon: 'arrow',
            action: 'https://slydes.io'
        },
        background: {
            type: 'video',
            src: '/videos/hero-defender.mp4',
            startTime: 27
        },
        accentColor: 'bg-gradient-to-r from-[#2563EB] to-[#06B6D4]',
        infoContent: {
            headline: 'About Slydes.io',
            description: 'Mobile-first, video-driven experiences that actually convert. Old school websites are OUT. Slydes are IN.',
            highlights: [
                {
                    icon: '📱',
                    label: 'Built for',
                    value: 'Mobile'
                },
                {
                    icon: '⚡',
                    label: 'Setup',
                    value: '10 mins'
                },
                {
                    icon: '🚀',
                    label: 'Future',
                    value: '2030'
                }
            ]
        }
    }
];
const campingFAQs = [
    {
        id: 'dogs',
        question: 'Do you allow dogs?',
        answer: 'Yes! Dogs are welcome in all our vehicles. We just ask that you bring a blanket for them and clean up any mess. There\'s no extra charge for furry friends.'
    },
    {
        id: 'included',
        question: 'What\'s included in the camping kit?',
        answer: 'Full setup: rooftop tent, awning, kitchen with stove and cookware, bedding (duvet, pillows, sheets), camping chairs, table, LED lighting, and a cool box. Everything you need to camp in comfort.'
    },
    {
        id: 'cancel',
        question: 'Can I cancel my booking?',
        answer: 'Free cancellation up to 48 hours before your trip. Cancellations within 48 hours are charged at 50% of the booking value. No-shows are charged in full.'
    },
    {
        id: 'pickup',
        question: 'Where do I pick up?',
        answer: 'Our base is in Inverness, just 10 minutes from Inverness Airport. We provide detailed directions and can arrange airport transfers if needed.'
    },
    {
        id: 'experience',
        question: 'Do I need camping experience?',
        answer: 'No experience needed! We provide a full handover showing you how everything works - the tent, kitchen, and all the gear. Most guests are set up and cooking within 15 minutes.'
    },
    {
        id: 'license',
        question: 'What license do I need?',
        answer: 'A standard UK driving license (or international equivalent) held for at least 2 years. You must be 25 or over to hire. Named drivers can be added for a small fee.'
    },
    {
        id: 'fuel',
        question: 'Is fuel included?',
        answer: 'You\'ll receive the vehicle with a full tank and should return it full. The Defenders average about 25-30 MPG depending on driving style and terrain.'
    },
    {
        id: 'wild-camp',
        question: 'Can I wild camp anywhere?',
        answer: 'Scotland has fantastic wild camping rights! You can camp on most unenclosed land. We provide a guide to the best spots and local regulations. Please follow Leave No Trace principles.'
    }
];
const justDriveFrames = [
    {
        id: 'hook',
        order: 1,
        templateType: 'hook',
        title: 'Just',
        subtitle: 'Drive',
        badge: '⭐ 5-Star Rated',
        rating: 5.0,
        reviewCount: 156,
        heartCount: 1800,
        faqCount: 10,
        cta: {
            text: 'Book Now',
            icon: 'book',
            action: 'https://wildtrax.co.uk/book'
        },
        background: {
            type: 'video',
            src: '/videos/hero-defender.mp4',
            startTime: 2
        },
        accentColor: 'bg-amber-600',
        infoContent: {
            headline: 'Land Rover Day Hire',
            description: 'Take a Defender for the day and explore the Scottish Highlands your way. No camping kit, just pure driving freedom.',
            highlights: [
                {
                    icon: '🏔️',
                    label: 'Location',
                    value: 'Scottish Highlands'
                },
                {
                    icon: '🚗',
                    label: 'Vehicle',
                    value: 'Land Rover Defender'
                },
                {
                    icon: '⏱️',
                    label: 'Min Hire',
                    value: '1 day'
                }
            ]
        }
    },
    {
        id: 'how',
        order: 2,
        templateType: 'how',
        title: 'Pick Up',
        subtitle: 'Drive. Return.',
        badge: '🚗 Simple Process',
        heartCount: 1200,
        faqCount: 6,
        cta: {
            text: 'See How It Works',
            icon: 'view',
            action: 'info'
        },
        background: {
            type: 'video',
            src: '/videos/hero-defender.mp4',
            startTime: 5
        },
        accentColor: 'bg-amber-600',
        infoContent: {
            headline: 'How It Works',
            description: 'Simple, hassle-free Land Rover hire. Pick up in Inverness, explore the Highlands, return when you\'re done.',
            items: [
                'Collect from our Inverness base',
                'Full vehicle handover and orientation',
                'Explore at your own pace',
                'Return with a full tank'
            ],
            highlights: [
                {
                    icon: '📍',
                    label: 'Pickup',
                    value: 'Inverness'
                },
                {
                    icon: '⏱️',
                    label: 'Handover',
                    value: '15 mins'
                },
                {
                    icon: '🛣️',
                    label: 'Mileage',
                    value: 'Unlimited'
                }
            ]
        }
    },
    {
        id: 'who',
        order: 3,
        templateType: 'who',
        title: 'Day Trips',
        subtitle: 'NC500 • Glencoe • Isle of Skye',
        badge: '🗺️ Explore',
        heartCount: 2200,
        faqCount: 12,
        cta: {
            text: 'Plan Your Route',
            icon: 'view',
            action: 'https://wildtrax.co.uk/routes'
        },
        background: {
            type: 'video',
            src: '/videos/hero-defender.mp4',
            startTime: 8
        },
        accentColor: 'bg-amber-600',
        infoContent: {
            headline: 'Perfect For',
            description: 'Whether you want to tackle the NC500, explore Glencoe, or drive to the Isle of Skye - a Defender is the ultimate way to do it.',
            items: [
                '🛣️ NC500 - The ultimate Scottish road trip',
                '🏔️ Glencoe - Dramatic Highland scenery',
                '🌊 Isle of Skye - Fairy pools and castles',
                '🏴󠁧󠁢󠁳󠁣󠁴󠁿 Off the beaten track - Go anywhere'
            ]
        }
    },
    {
        id: 'what',
        order: 4,
        templateType: 'what',
        title: 'Defender',
        subtitle: 'Ready to go',
        badge: '✅ Fully Equipped',
        heartCount: 1900,
        faqCount: 15,
        cta: {
            text: 'View Specs',
            icon: 'view',
            action: 'info'
        },
        background: {
            type: 'video',
            src: '/videos/hero-defender.mp4',
            startTime: 11
        },
        accentColor: 'bg-amber-600',
        infoContent: {
            headline: 'What\'s Included',
            description: 'Every Defender comes fully equipped for your Highland adventure.',
            items: [
                '🚗 Land Rover Defender 110',
                '📱 Apple CarPlay / Android Auto',
                '🗺️ Sat Nav with offline maps',
                '🔌 USB charging ports',
                '❄️ Heated seats',
                '📷 360° parking cameras',
                '🛡️ Comprehensive insurance',
                '🆘 24/7 roadside assistance'
            ],
            highlights: [
                {
                    icon: '🛣️',
                    label: 'Mileage',
                    value: 'Unlimited'
                },
                {
                    icon: '⛽',
                    label: 'Fuel',
                    value: 'Full tank'
                },
                {
                    icon: '🛡️',
                    label: 'Insurance',
                    value: 'Included'
                }
            ]
        }
    },
    {
        id: 'proof',
        order: 5,
        templateType: 'proof',
        title: '156 Reviews',
        subtitle: '"Best drive of my life"',
        badge: '💬 Verified Reviews',
        rating: 5.0,
        reviewCount: 156,
        heartCount: 2800,
        faqCount: 4,
        cta: {
            text: 'Read Reviews',
            icon: 'view',
            action: 'reviews'
        },
        background: {
            type: 'video',
            src: '/videos/hero-defender.mp4',
            startTime: 14
        },
        accentColor: 'bg-amber-600',
        infoContent: {
            headline: 'What Drivers Say',
            description: '156 five-star reviews from happy drivers.',
            items: [
                '"The Defender handled everything - single track roads, muddy trails, you name it!" - Mark T.',
                '"Perfect for our NC500 trip. Turned heads everywhere we went." - Lisa & Dave',
                '"So easy to pick up and drop off. Will definitely hire again." - James R.',
                '"Best way to see the Highlands. Period." - Sarah M.'
            ],
            highlights: [
                {
                    icon: '⭐',
                    label: 'Rating',
                    value: '5.0 / 5.0'
                },
                {
                    icon: '💬',
                    label: 'Reviews',
                    value: '156 verified'
                },
                {
                    icon: '👍',
                    label: 'Recommend',
                    value: '100%'
                }
            ]
        }
    },
    {
        id: 'choose',
        order: 6,
        title: 'The Fleet',
        subtitle: '3 Defenders available',
        badge: '🚙 Choose Your Ride',
        rating: 5.0,
        reviewCount: 156,
        heartCount: 3200,
        faqCount: 14,
        cta: {
            text: 'View Fleet',
            icon: 'view',
            action: 'info'
        },
        background: {
            type: 'video',
            src: '/videos/hero-defender.mp4',
            startTime: 17
        },
        accentColor: 'bg-amber-600',
        infoContent: {
            headline: 'Our Fleet',
            description: 'Three Land Rover Defenders ready for your Highland adventure.',
            items: [
                '🟢 Defender 90 "Glen" - Compact, nimble, perfect for couples',
                '🔵 Defender 110 "Loch" - More space, great for families',
                '🟡 Defender 110 "Ben" - Our newest addition, premium spec'
            ],
            highlights: [
                {
                    icon: '🚗',
                    label: 'Vehicles',
                    value: '3 available'
                },
                {
                    icon: '📅',
                    label: 'Book ahead',
                    value: '1-2 weeks'
                },
                {
                    icon: '🔄',
                    label: 'Availability',
                    value: 'Check dates'
                }
            ]
        }
    },
    {
        id: 'cinematic',
        order: 7,
        title: '',
        subtitle: '',
        heartCount: 4100,
        faqCount: 3,
        background: {
            type: 'video',
            src: '/videos/hero-defender.mp4',
            startTime: 20
        },
        accentColor: 'bg-amber-600',
        infoContent: {
            headline: 'The Highland Drive',
            description: 'This is what awaits you. Open roads, dramatic scenery, and the freedom to explore.'
        }
    },
    {
        id: 'trust',
        order: 8,
        templateType: 'trust',
        title: 'Quick Answers',
        subtitle: 'Common questions',
        badge: '❓ FAQs',
        heartCount: 900,
        faqCount: 22,
        cta: {
            text: 'View All FAQs',
            icon: 'view',
            action: 'faq'
        },
        background: {
            type: 'video',
            src: '/videos/hero-defender.mp4',
            startTime: 23
        },
        accentColor: 'bg-amber-600',
        infoContent: {
            headline: 'Common Questions',
            items: [
                '🪪 Standard UK license (25+)',
                '🛣️ Unlimited mileage included',
                '⛽ Return with full tank',
                '❌ Free cancellation (48hrs)',
                '🛡️ Fully comprehensive insurance',
                '📍 Pick up from Inverness'
            ]
        }
    },
    {
        id: 'action',
        order: 9,
        templateType: 'action',
        title: 'Book Your',
        subtitle: 'Drive',
        badge: '💰 From £125/day',
        rating: 5.0,
        reviewCount: 156,
        heartCount: 2100,
        faqCount: 7,
        cta: {
            text: 'Check Availability',
            icon: 'book',
            action: 'https://wildtrax.co.uk/book'
        },
        background: {
            type: 'video',
            src: '/videos/hero-defender.mp4',
            startTime: 26
        },
        accentColor: 'bg-amber-600',
        infoContent: {
            headline: 'Pricing & Booking',
            description: 'Simple, transparent pricing. Everything included.',
            highlights: [
                {
                    icon: '💰',
                    label: 'From',
                    value: '£125/day'
                },
                {
                    icon: '📅',
                    label: 'Min hire',
                    value: '1 day'
                },
                {
                    icon: '❌',
                    label: 'Cancellation',
                    value: 'Free (48hrs)'
                }
            ],
            items: [
                '✅ Land Rover Defender',
                '✅ Unlimited mileage',
                '✅ Comprehensive insurance',
                '✅ 24/7 roadside assistance',
                '✅ Full tank of fuel'
            ]
        }
    },
    {
        id: 'slydes',
        order: 10,
        templateType: 'slydes',
        title: 'Want This For',
        subtitle: 'Your Business?',
        badge: '✨ Powered by Slydes',
        heartCount: 0,
        faqCount: 0,
        cta: {
            text: 'Try Slydes',
            icon: 'arrow',
            action: 'https://slydes.io'
        },
        background: {
            type: 'video',
            src: '/videos/hero-defender.mp4',
            startTime: 29
        },
        accentColor: 'bg-gradient-to-r from-[#2563EB] to-[#06B6D4]',
        infoContent: {
            headline: 'About Slydes.io',
            description: 'Mobile-first, video-driven experiences that actually convert. Old school websites are OUT. Slydes are IN.',
            highlights: [
                {
                    icon: '📱',
                    label: 'Built for',
                    value: 'Mobile'
                },
                {
                    icon: '⚡',
                    label: 'Setup',
                    value: '10 mins'
                },
                {
                    icon: '🚀',
                    label: 'Future',
                    value: 'Now'
                }
            ]
        }
    }
];
const justDriveFAQs = [
    {
        id: 'license',
        question: 'What license do I need?',
        answer: 'A standard UK driving license (or international equivalent) held for at least 2 years. You must be 25 or over to hire. Named drivers can be added for a small fee.'
    },
    {
        id: 'mileage',
        question: 'Is mileage unlimited?',
        answer: 'Yes! All our hires include unlimited mileage. Drive as far as you like without worrying about extra charges.'
    },
    {
        id: 'fuel',
        question: 'What about fuel?',
        answer: 'You\'ll receive the vehicle with a full tank and should return it full. The Defenders average about 25-30 MPG depending on driving style and terrain.'
    },
    {
        id: 'insurance',
        question: 'Is insurance included?',
        answer: 'Yes, fully comprehensive insurance is included. There\'s a £500 excess which can be reduced to £0 for an additional fee.'
    },
    {
        id: 'cancel',
        question: 'Can I cancel my booking?',
        answer: 'Free cancellation up to 48 hours before your hire. Cancellations within 48 hours are charged at 50% of the booking value.'
    },
    {
        id: 'pickup',
        question: 'Where do I pick up?',
        answer: 'Our base is in Inverness, just 10 minutes from Inverness Airport. We provide detailed directions and can arrange airport transfers if needed.'
    },
    {
        id: 'offroad',
        question: 'Can I go off-road?',
        answer: 'The Defenders are capable off-road vehicles, but we ask that you stick to established tracks and trails. No extreme off-roading or water crossings please!'
    },
    {
        id: 'breakdown',
        question: 'What if I break down?',
        answer: '24/7 roadside assistance is included. If you have any issues, call our emergency number and we\'ll get you sorted as quickly as possible.'
    }
];
const wildtraxReviews = [
    {
        id: 'review-1',
        author: 'James & Sarah',
        authorLocation: 'Edinburgh, UK',
        rating: 5,
        text: 'Absolutely incredible! Waking up to Glencoe views was unforgettable. The Defender was immaculate and the camping kit had everything we needed. Already planning our next trip!',
        date: '2024-11-15',
        source: 'google',
        featured: true,
        verified: true
    },
    {
        id: 'review-2',
        author: 'The Thompson Family',
        authorLocation: 'Manchester, UK',
        rating: 5,
        text: 'The kids absolutely loved it! So easy to set up - we were cooking dinner within 10 minutes of arriving at our spot. The rooftop tent was a huge hit. Best family adventure ever.',
        date: '2024-11-08',
        source: 'google',
        featured: true,
        verified: true
    },
    {
        id: 'review-3',
        author: 'Mike R.',
        authorLocation: 'London, UK',
        rating: 5,
        text: 'Best way to see the Highlands. The freedom to just pull up anywhere and camp is incredible. Defender handled every track we threw at it. Will definitely be back!',
        date: '2024-10-28',
        source: 'google',
        featured: true,
        verified: true
    },
    {
        id: 'review-4',
        author: 'Emma & Tom',
        authorLocation: 'Bristol, UK',
        rating: 5,
        text: 'Perfect for our honeymoon. Romantic and adventurous in equal measure. Watching the sunset from the rooftop tent with a glass of wine - pure magic. Thank you WildTrax!',
        date: '2024-10-20',
        source: 'google',
        featured: true,
        verified: true
    },
    {
        id: 'review-5',
        author: 'David Chen',
        authorLocation: 'Glasgow, UK',
        rating: 5,
        text: 'Third time booking with WildTrax and it just keeps getting better. The team are so helpful and the vehicles are always spotless. NC500 in a Defender is the only way to do it.',
        date: '2024-10-12',
        source: 'google',
        featured: true,
        verified: true
    },
    {
        id: 'review-6',
        author: 'Sophie Williams',
        authorLocation: 'Cardiff, UK',
        rating: 5,
        text: 'Solo trip and I felt completely safe and prepared. The handover was thorough and they even gave me tips on the best wild camping spots. Incredible experience!',
        date: '2024-09-30',
        source: 'google',
        featured: false,
        verified: true
    },
    {
        id: 'review-7',
        author: 'The Patels',
        authorLocation: 'Birmingham, UK',
        rating: 5,
        text: 'We were nervous about camping with no experience but WildTrax made it so easy. Everything was explained clearly and the gear quality is top notch. 10/10!',
        date: '2024-09-22',
        source: 'google',
        featured: false,
        verified: true
    },
    {
        id: 'review-8',
        author: 'Chris & Anna',
        authorLocation: 'Newcastle, UK',
        rating: 5,
        text: 'Celebrated our anniversary in style. The Defender turned heads everywhere we went. Waking up by Loch Ness was surreal. Already booked again for next year!',
        date: '2024-09-15',
        source: 'google',
        featured: false,
        verified: true
    }
];
const wildtraxFeaturedReviews = wildtraxReviews.filter((r)=>r.featured).map((r)=>r.id);
const campingSlides = campingFrames;
const justDriveSlides = justDriveFrames;
const wildtraxSlides = campingFrames;
const wildtraxFAQs = campingFAQs;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/marketing/src/app/demo/editor-home/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EditorHomePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$11$2e$18$2e$2_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@11.18.2_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$11$2e$18$2e$2_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@11.18.2_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$marketing$2f$src$2f$components$2f$slyde$2d$demo$2f$frameData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/marketing/src/components/slyde-demo/frameData.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function SlydeCard({ slyde, frameCount, onClick, isSelected }) {
    const iconMap = {
        tent: '🏕️',
        car: '🚗',
        home: '🏠',
        restaurant: '🍽️',
        hotel: '🏨',
        shop: '🛍️',
        travel: '✈️',
        boat: '⛵',
        bike: '🚴',
        photo: '📷'
    };
    const icon = slyde.icon ? iconMap[slyde.icon] || '📄' : '📄';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$11$2e$18$2e$2_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
        onClick: onClick,
        whileHover: {
            scale: 1.02
        },
        whileTap: {
            scale: 0.98
        },
        className: `w-full p-4 rounded-2xl border-2 transition-all text-left ${isSelected ? 'border-red-500 bg-red-50 dark:bg-red-500/10' : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 bg-white dark:bg-white/5'}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-start gap-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${slyde.accentColor || 'bg-gray-100 dark:bg-white/10'}`,
                    children: icon
                }, void 0, false, {
                    fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                    lineNumber: 59,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 min-w-0",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-semibold text-gray-900 dark:text-white",
                            children: slyde.name
                        }, void 0, false, {
                            fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                            lineNumber: 63,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-gray-500 dark:text-white/60 mt-0.5",
                            children: slyde.description || 'No description'
                        }, void 0, false, {
                            fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                            lineNumber: 66,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3 mt-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs text-gray-400 dark:text-white/40 px-2 py-0.5 bg-gray-100 dark:bg-white/10 rounded-full",
                                    children: [
                                        frameCount,
                                        " frames"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                    lineNumber: 70,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs text-gray-400 dark:text-white/40",
                                    children: [
                                        "/",
                                        slyde.slug
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                    lineNumber: 73,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                    lineNumber: 62,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-5 h-5 text-gray-400 dark:text-white/40 mt-1",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M9 5l7 7-7 7"
                    }, void 0, false, {
                        fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                        lineNumber: 79,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                    lineNumber: 78,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
            lineNumber: 58,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, this);
}
_c = SlydeCard;
function EditorHomePage() {
    _s();
    const [selectedSlydeId, setSelectedSlydeId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showCreateModal, setShowCreateModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [newSlydeName, setNewSlydeName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Map slyde IDs to frame counts
    const frameCountMap = {
        'camping': __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$marketing$2f$src$2f$components$2f$slyde$2d$demo$2f$frameData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["campingFrames"].length,
        'just-drive': __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$marketing$2f$src$2f$components$2f$slyde$2d$demo$2f$frameData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["justDriveFrames"].length
    };
    const business = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$marketing$2f$src$2f$components$2f$slyde$2d$demo$2f$frameData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wildtraxBusiness"];
    const slydes = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$marketing$2f$src$2f$components$2f$slyde$2d$demo$2f$frameData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wildtraxSlydes"];
    const defaultSlydeId = slydes[0]?.id || 'camping';
    const activeSlydeId = selectedSlydeId || defaultSlydeId;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50 dark:bg-[#1c1c1e] flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "h-16 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-[#2c2c2e] flex items-center px-6 gap-4 shrink-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/demo",
                        className: "flex items-center gap-2 text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "w-5 h-5",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M15 19l-7-7 7-7"
                                }, void 0, false, {
                                    fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                    lineNumber: 108,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                lineNumber: 107,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm",
                                children: "Back"
                            }, void 0, false, {
                                fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                lineNumber: 110,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                        lineNumber: 106,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-6 w-px bg-gray-200 dark:bg-white/10"
                    }, void 0, false, {
                        fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${business.accentColor}`,
                                children: business.name.charAt(0)
                            }, void 0, false, {
                                fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                lineNumber: 116,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "font-semibold text-gray-900 dark:text-white",
                                        children: business.name
                                    }, void 0, false, {
                                        fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                        lineNumber: 120,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500 dark:text-white/50",
                                        children: business.tagline
                                    }, void 0, false, {
                                        fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                        lineNumber: 121,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                lineNumber: 119,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                        lineNumber: 115,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1"
                    }, void 0, false, {
                        fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                        lineNumber: 125,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: `/demo/editor-mockup?slyde=${encodeURIComponent(activeSlydeId)}`,
                        className: "px-4 py-2 text-sm text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors",
                        children: "Frame Editor →"
                    }, void 0, false, {
                        fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                        lineNumber: 127,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                lineNumber: 105,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "flex-1 p-8 max-w-4xl mx-auto w-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between mb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-2xl font-bold text-gray-900 dark:text-white",
                                        children: "Your Slydes"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                        lineNumber: 140,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-gray-500 dark:text-white/50",
                                        children: [
                                            "Profile: slydes.io/",
                                            business.id
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                        lineNumber: 141,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                lineNumber: 139,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600 dark:text-white/60",
                                children: "Each Slyde is a shareable experience. Click on one to edit its frames."
                            }, void 0, false, {
                                fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                lineNumber: 145,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                        lineNumber: 138,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4 mb-8",
                        children: slydes.map((slyde)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SlydeCard, {
                                slyde: slyde,
                                frameCount: frameCountMap[slyde.id] || 0,
                                onClick: ()=>setSelectedSlydeId(slyde.id),
                                isSelected: selectedSlydeId === slyde.id
                            }, slyde.id, false, {
                                fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                lineNumber: 153,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                        lineNumber: 151,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setShowCreateModal(true),
                        className: "w-full py-4 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-2xl text-gray-500 dark:text-white/50 hover:border-red-400 hover:text-red-500 dark:hover:border-red-500 dark:hover:text-red-400 transition-colors font-medium",
                        children: "+ Create New Slyde"
                    }, void 0, false, {
                        fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$11$2e$18$2e$2_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                        children: selectedSlydeId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$11$2e$18$2e$2_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0,
                                y: 20
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            exit: {
                                opacity: 0,
                                y: 20
                            },
                            className: "fixed bottom-8 left-1/2 -translate-x-1/2 bg-white dark:bg-[#2c2c2e] rounded-2xl shadow-xl border border-gray-200 dark:border-white/10 p-4 flex items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-gray-600 dark:text-white/70",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold text-gray-900 dark:text-white",
                                            children: slydes.find((s)=>s.id === selectedSlydeId)?.name
                                        }, void 0, false, {
                                            fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                            lineNumber: 181,
                                            columnNumber: 17
                                        }, this),
                                        ' ',
                                        "selected"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                    lineNumber: 180,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-6 w-px bg-gray-200 dark:bg-white/10"
                                }, void 0, false, {
                                    fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                    lineNumber: 186,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/demo/editor-mockup?slyde=${encodeURIComponent(activeSlydeId)}`,
                                    className: "px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors",
                                    children: "Edit Frames"
                                }, void 0, false, {
                                    fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                    lineNumber: 187,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setSelectedSlydeId(null),
                                    className: "px-3 py-2 text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70 text-sm transition-colors",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                    lineNumber: 193,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                            lineNumber: 174,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                        lineNumber: 172,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-12 p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-semibold text-gray-900 dark:text-white mb-3",
                                children: "Understanding the Hierarchy"
                            }, void 0, false, {
                                fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                lineNumber: 205,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "w-6 h-6 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                                                children: "1"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                                lineNumber: 208,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium text-gray-900 dark:text-white",
                                                        children: "Profile"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                                        lineNumber: 210,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-500 dark:text-white/50",
                                                        children: [
                                                            " — Your business home page (slydes.io/",
                                                            business.id,
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                                        lineNumber: 211,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                                lineNumber: 209,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                        lineNumber: 207,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "w-6 h-6 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                                                children: "2"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                                lineNumber: 215,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium text-gray-900 dark:text-white",
                                                        children: "Slyde"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                                        lineNumber: 217,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-500 dark:text-white/50",
                                                        children: ' — A shareable experience (e.g., "Camping" or "Just Drive")'
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                                        lineNumber: 218,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                                lineNumber: 216,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                        lineNumber: 214,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "w-6 h-6 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                                                children: "3"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                                lineNumber: 222,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium text-gray-900 dark:text-white",
                                                        children: "Frame"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                                        lineNumber: 224,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-500 dark:text-white/50",
                                                        children: " — A vertical screen inside a Slyde (what users swipe through)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                                        lineNumber: 225,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                                lineNumber: 223,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                        lineNumber: 221,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                lineNumber: 206,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                        lineNumber: 204,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                lineNumber: 136,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$11$2e$18$2e$2_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: showCreateModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$11$2e$18$2e$2_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0
                    },
                    className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",
                    onClick: ()=>setShowCreateModal(false),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$11$2e$18$2e$2_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            scale: 0.95,
                            opacity: 0
                        },
                        animate: {
                            scale: 1,
                            opacity: 1
                        },
                        exit: {
                            scale: 0.95,
                            opacity: 0
                        },
                        onClick: (e)=>e.stopPropagation(),
                        className: "bg-white dark:bg-[#2c2c2e] rounded-2xl w-full max-w-md overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 border-b border-gray-200 dark:border-white/10",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-lg font-semibold text-gray-900 dark:text-white",
                                        children: "Create New Slyde"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                        lineNumber: 250,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-sm text-gray-600 dark:text-white/60",
                                        children: "A new shareable experience for your business."
                                    }, void 0, false, {
                                        fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                        lineNumber: 251,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                lineNumber: 249,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 space-y-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-xs font-medium text-gray-500 dark:text-white/50 uppercase tracking-wider mb-2",
                                            children: "Slyde Name"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                            lineNumber: 257,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: newSlydeName,
                                            onChange: (e)=>setNewSlydeName(e.target.value),
                                            placeholder: "e.g., Summer Menu, Property 3, Day Tours",
                                            className: "w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                            lineNumber: 260,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                    lineNumber: 256,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                lineNumber: 255,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 border-t border-gray-200 dark:border-white/10 flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setShowCreateModal(false);
                                            setNewSlydeName('');
                                        },
                                        className: "flex-1 py-2 border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-white/80 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                        lineNumber: 270,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: `/demo/editor-mockup?slyde=new&name=${encodeURIComponent((newSlydeName || 'New Slyde').trim())}`,
                                        onClick: ()=>setShowCreateModal(false),
                                        className: "flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors text-center",
                                        children: "Create & Edit"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                        lineNumber: 279,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                                lineNumber: 269,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                        lineNumber: 242,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                    lineNumber: 235,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
                lineNumber: 233,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/marketing/src/app/demo/editor-home/page.tsx",
        lineNumber: 103,
        columnNumber: 5
    }, this);
}
_s(EditorHomePage, "p4bJubqpEstbdwKrSEDc94w8YcY=");
_c1 = EditorHomePage;
var _c, _c1;
__turbopack_context__.k.register(_c, "SlydeCard");
__turbopack_context__.k.register(_c1, "EditorHomePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=apps_marketing_src_547cc95d._.js.map