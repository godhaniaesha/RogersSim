// Mock data for development

export const products = [
  {
    id: 1,
    name: 'Rogers Prepaid SIM',
    simType: 'prepaid',
    physicalType: 'physical',
    price: 199,
    description: 'Prepaid SIM card with flexible recharge options',
    image: 'https://via.placeholder.com/300x200?text=Prepaid+SIM',
    isPopular: true,
    popularity: 95,
  },
  {
    id: 2,
    name: 'Rogers Postpaid SIM',
    simType: 'postpaid',
    physicalType: 'physical',
    price: 299,
    description: 'Postpaid SIM card with monthly billing',
    image: 'https://via.placeholder.com/300x200?text=Postpaid+SIM',
    isPopular: true,
    popularity: 90,
  },
  {
    id: 3,
    name: 'Rogers Data Only SIM',
    simType: 'data',
    physicalType: 'physical',
    price: 249,
    description: 'Data-only SIM card for tablets and hotspots',
    image: 'https://via.placeholder.com/300x200?text=Data+Only+SIM',
    isPopular: false,
    popularity: 75,
  },
  {
    id: 4,
    name: 'Rogers eSIM',
    simType: 'esim',
    physicalType: 'esim',
    price: 149,
    description: 'Digital SIM card for compatible devices',
    image: 'https://via.placeholder.com/300x200?text=eSIM',
    isPopular: true,
    popularity: 85,
  },
];

export const plans = [
  {
    id: 1,
    name: 'Basic Plan',
    price: 199,
    data: '1.5 GB',
    calls: 'Unlimited',
    sms: '100 SMS/day',
    validity: '28 days',
    description: 'Basic plan for light users',
    isPopular: false,
  },
  {
    id: 2,
    name: 'Standard Plan',
    price: 399,
    data: '3 GB',
    calls: 'Unlimited',
    sms: 'Unlimited',
    validity: '28 days',
    description: 'Standard plan for regular users',
    isPopular: true,
  },
  {
    id: 3,
    name: 'Premium Plan',
    price: 699,
    data: '6 GB',
    calls: 'Unlimited',
    sms: 'Unlimited',
    validity: '28 days',
    description: 'Premium plan for heavy data users',
    isPopular: true,
  },
  {
    id: 4,
    name: 'Ultra Plan',
    price: 999,
    data: '12 GB',
    calls: 'Unlimited',
    sms: 'Unlimited',
    validity: '28 days',
    description: 'Ultra plan for power users',
    isPopular: false,
  },
];

export const addons = [
  {
    id: 1,
    name: 'Extra Data Pack',
    price: 49,
    data: '1 GB',
    validity: '7 days',
    description: 'Additional data when you need it',
  },
  {
    id: 2,
    name: 'International Calling Pack',
    price: 99,
    calls: '100 minutes',
    validity: '28 days',
    description: 'International calling to select countries',
  },
  {
    id: 3,
    name: 'Weekend Data Pack',
    price: 29,
    data: 'Unlimited',
    validity: 'Weekend only',
    description: 'Unlimited data for weekends',
  },
  {
    id: 4,
    name: 'Roaming Pack',
    price: 499,
    data: '2 GB',
    calls: '50 minutes',
    sms: '50 SMS',
    validity: '10 days',
    description: 'Stay connected while traveling abroad',
  },
];

export const orders = [
  {
    id: 'ORD123456',
    date: '2023-10-15',
    product: 'Rogers Prepaid SIM',
    plan: 'Standard Plan',
    amount: 399,
    status: 'Delivered',
  },
  {
    id: 'ORD123457',
    date: '2023-09-28',
    product: 'Rogers Postpaid SIM',
    plan: 'Premium Plan',
    amount: 699,
    status: 'Processing',
  },
  {
    id: 'ORD123458',
    date: '2023-08-10',
    product: 'Rogers eSIM',
    plan: 'Ultra Plan',
    amount: 999,
    status: 'Delivered',
  },
];

export const addresses = [
  {
    id: 1,
    name: 'Home',
    addressLine1: '123 Main Street',
    addressLine2: 'Apartment 4B',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    isDefault: true,
  },
  {
    id: 2,
    name: 'Office',
    addressLine1: '456 Business Park',
    addressLine2: 'Building C, Floor 5',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400051',
    isDefault: false,
  },
];

export const banners = [
  {
    id: 1,
    title: 'New SIM @ ₹199',
    description: 'Get started with Rogers at our lowest price ever',
    image: 'https://via.placeholder.com/1200x400?text=New+SIM+Offer',
    link: '/products?type=prepaid',
  },
  {
    id: 2,
    title: 'Port-in Offer',
    description: 'Switch to Rogers and get 50% off on your first recharge',
    image: 'https://via.placeholder.com/1200x400?text=Port-in+Offer',
    link: '/products?type=postpaid',
  },
  {
    id: 3,
    title: 'Premium Plans',
    description: 'Unlimited data, calls, and more starting at ₹699',
    image: 'https://via.placeholder.com/1200x400?text=Premium+Plans',
    link: '/products',
  },
];

export const deliverySlots = [
  {
    id: 1,
    date: '2023-11-01',
    slots: ['9:00 AM - 12:00 PM', '1:00 PM - 4:00 PM', '5:00 PM - 8:00 PM'],
  },
  {
    id: 2,
    date: '2023-11-02',
    slots: ['9:00 AM - 12:00 PM', '1:00 PM - 4:00 PM', '5:00 PM - 8:00 PM'],
  },
  {
    id: 3,
    date: '2023-11-03',
    slots: ['9:00 AM - 12:00 PM', '1:00 PM - 4:00 PM', '5:00 PM - 8:00 PM'],
  },
];