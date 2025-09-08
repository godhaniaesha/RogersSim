const Product = require('../models/Product');
const Plan = require('../models/Plan');
const Addon = require('../models/Addon');

const seedData = async () => {
  try {
    // Clear existing data
    await Product.deleteMany({});
    await Plan.deleteMany({});
    await Addon.deleteMany({});

    // Create sample products
    const products = await Product.create([
      {
        name: 'Rogers Mobile Plan',
        description: 'High-speed mobile internet with unlimited calls',
        category: 'mobile',
        price: 299,
        originalPrice: 399,
        discount: 25,
        features: ['Unlimited calls', '100GB data', '5G network', 'Free roaming'],
        specifications: {
          'Data Speed': '5G',
          'Call Limit': 'Unlimited',
          'SMS': 'Unlimited',
          'Validity': '30 days'
        },
        isActive: true,
        isPopular: true,
        tags: ['mobile', 'unlimited', '5g'],
        rating: 4.5,
        reviewCount: 120
      },
      {
        name: 'Rogers Home Internet',
        description: 'High-speed broadband internet for home',
        category: 'internet',
        price: 799,
        originalPrice: 999,
        discount: 20,
        features: ['100 Mbps speed', 'Unlimited data', 'Free installation', '24/7 support'],
        specifications: {
          'Speed': '100 Mbps',
          'Data Limit': 'Unlimited',
          'Installation': 'Free',
          'Support': '24/7'
        },
        isActive: true,
        isPopular: true,
        tags: ['internet', 'broadband', 'home'],
        rating: 4.3,
        reviewCount: 85
      },
      {
        name: 'Rogers Cable TV',
        description: 'Premium cable TV with 200+ channels',
        category: 'cable',
        price: 499,
        originalPrice: 599,
        discount: 17,
        features: ['200+ channels', 'HD quality', 'Recording feature', 'On-demand content'],
        specifications: {
          'Channels': '200+',
          'Quality': 'HD',
          'Recording': 'Yes',
          'On-demand': 'Yes'
        },
        isActive: true,
        isPopular: false,
        tags: ['cable', 'tv', 'channels'],
        rating: 4.1,
        reviewCount: 65
      }
    ]);

    // Create sample plans for each product
    const plans = await Plan.create([
      // Mobile plans
      {
        name: 'Basic Mobile Plan',
        description: 'Basic mobile plan with essential features',
        product: products[0]._id,
        price: 199,
        validity: '1_month',
        dataLimit: '10GB',
        speed: '4G',
        features: ['10GB data', 'Unlimited calls', '100 SMS'],
        isActive: true,
        sortOrder: 1
      },
      {
        name: 'Premium Mobile Plan',
        description: 'Premium mobile plan with high-speed data',
        product: products[0]._id,
        price: 399,
        validity: '1_month',
        dataLimit: '50GB',
        speed: '5G',
        features: ['50GB data', 'Unlimited calls', 'Unlimited SMS', 'Free roaming'],
        isActive: true,
        isPopular: true,
        sortOrder: 2
      },
      {
        name: 'Unlimited Mobile Plan',
        description: 'Unlimited mobile plan for heavy users',
        product: products[0]._id,
        price: 599,
        validity: '1_month',
        dataLimit: 'unlimited',
        speed: '5G',
        features: ['Unlimited data', 'Unlimited calls', 'Unlimited SMS', 'Free roaming', 'Hotspot'],
        isActive: true,
        sortOrder: 3
      },
      // Internet plans
      {
        name: 'Basic Internet Plan',
        description: 'Basic home internet plan',
        product: products[1]._id,
        price: 499,
        validity: '1_month',
        dataLimit: 'unlimited',
        speed: '50Mbps',
        features: ['50 Mbps speed', 'Unlimited data', 'Free installation'],
        isActive: true,
        sortOrder: 1
      },
      {
        name: 'Standard Internet Plan',
        description: 'Standard home internet plan',
        product: products[1]._id,
        price: 799,
        validity: '1_month',
        dataLimit: 'unlimited',
        speed: '100Mbps',
        features: ['100 Mbps speed', 'Unlimited data', 'Free installation', 'WiFi router'],
        isActive: true,
        isPopular: true,
        sortOrder: 2
      },
      {
        name: 'Premium Internet Plan',
        description: 'Premium home internet plan',
        product: products[1]._id,
        price: 1299,
        validity: '1_month',
        dataLimit: 'unlimited',
        speed: '200Mbps',
        features: ['200 Mbps speed', 'Unlimited data', 'Free installation', 'Premium WiFi router', 'Priority support'],
        isActive: true,
        sortOrder: 3
      },
      // Cable plans
      {
        name: 'Basic Cable Plan',
        description: 'Basic cable TV plan',
        product: products[2]._id,
        price: 299,
        validity: '1_month',
        dataLimit: 'unlimited',
        speed: 'unlimited',
        features: ['100+ channels', 'SD quality', 'Basic recording'],
        isActive: true,
        sortOrder: 1
      },
      {
        name: 'Premium Cable Plan',
        description: 'Premium cable TV plan',
        product: products[2]._id,
        price: 499,
        validity: '1_month',
        dataLimit: 'unlimited',
        speed: 'unlimited',
        features: ['200+ channels', 'HD quality', 'Advanced recording', 'On-demand content'],
        isActive: true,
        isPopular: true,
        sortOrder: 2
      }
    ]);

    // Create sample add-ons
    await Addon.create([
      {
        name: 'Extra Data Pack',
        description: 'Additional 10GB data for mobile plans',
        plan: plans[0]._id,
        price: 99,
        validity: '1_month',
        features: ['10GB extra data', 'Valid for 30 days'],
        isActive: true,
        sortOrder: 1
      },
      {
        name: 'International Roaming',
        description: 'International roaming pack',
        plan: plans[1]._id,
        price: 199,
        validity: '1_month',
        features: ['International calls', 'Data roaming', 'SMS roaming'],
        isActive: true,
        sortOrder: 1
      },
      {
        name: 'WiFi Extender',
        description: 'WiFi range extender for home internet',
        plan: plans[4]._id,
        price: 299,
        validity: 'lifetime',
        features: ['Extended WiFi range', 'Easy setup', 'Compatible with all routers'],
        isActive: true,
        sortOrder: 1
      },
      {
        name: 'Premium Channels Pack',
        description: 'Additional premium channels for cable',
        plan: plans[7]._id,
        price: 149,
        validity: '1_month',
        features: ['20+ premium channels', 'Sports channels', 'Movie channels'],
        isActive: true,
        sortOrder: 1
      }
    ]);

    console.log('Sample data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = seedData;
