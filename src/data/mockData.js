// src/data/mockData.js
export const CONTACT_FORMS = [
  { id: 1, name: 'Dr. Rajesh Kumar', phone: '9876543210', email: 'rajesh.kumar@lab.com', company: 'Research Labs', message: 'Need information about analytical balances.', status: 'pending', createdAt: '2024-01-15T10:30:00', read: false },
  { id: 2, name: 'Priya Sharma', phone: '9988776655', email: 'priya.sharma@biotech.in', company: 'BioTech Solutions', message: 'Looking for chromatography systems.', status: 'replied', createdAt: '2024-01-14T14:20:00', read: true },
];

export const QUOTE_REQUESTS = [
  { 
    id: 1, 
    name: 'Amit Patel', 
    phone: '9856741230', 
    email: 'amit.patel@industries.com', 
    company: 'Precision Industries', 
    city: 'Mumbai', 
    product: 'Analytical Balances', 
    quantity: '3', 
    usage: 'Quality Control', 
    status: 'pending', 
    quotedPrice: null,
    createdAt: '2024-01-15T11:45:00' 
  },
  { 
    id: 2, 
    name: 'Dr. Meera Iyer', 
    phone: '9745632189', 
    email: 'meera.iyer@university.edu', 
    company: 'Central University', 
    city: 'Bangalore', 
    product: 'Liquid Chromatography', 
    quantity: '1', 
    usage: 'Research', 
    status: 'sent', 
    quotedPrice: 1850000,
    createdAt: '2024-01-14T16:30:00' 
  },
  { 
    id: 3, 
    name: 'Vikram Singh', 
    phone: '9812345678', 
    email: 'vikram.singh@foodtech.com', 
    company: 'FoodTech Solutions', 
    city: 'Delhi', 
    product: 'Climate Chambers', 
    quantity: '2', 
    usage: 'Production', 
    status: 'approved', 
    quotedPrice: 1120000,
    createdAt: '2024-01-13T09:15:00' 
  },
  { 
    id: 4, 
    name: 'Dr. Sneha Reddy', 
    phone: '9988776655', 
    email: 'sneha.reddy@pharma.co', 
    company: 'PharmaCorp', 
    city: 'Hyderabad', 
    product: 'Incubators', 
    quantity: '4', 
    usage: 'Cell Culture', 
    status: 'pending', 
    quotedPrice: null,
    createdAt: '2024-01-16T14:20:00' 
  },
  { 
    id: 5, 
    name: 'Rajesh Khanna', 
    phone: '9876543210', 
    email: 'rajesh.k@testinglab.com', 
    company: 'National Testing Lab', 
    city: 'Chennai', 
    product: 'Spectrophotometer', 
    quantity: '1', 
    usage: 'Material Analysis', 
    status: 'sent', 
    quotedPrice: 950000,
    createdAt: '2024-01-12T10:30:00' 
  },
];


export const CATEGORIES = [
  { 
    id: 1, 
    name: 'Weighing & Measurement', 
    slug: 'weighing-measurement', 
    description: 'Precision weighing and measurement instruments',
    icon: '⚖️',
    active: true, 
    productCount: 12,
    subCategories: [
      { id: 101, name: 'Analytical Balances', slug: 'analytical-balances', description: 'High precision 0.1mg readability', active: true, productCount: 5 },
      { id: 102, name: 'Precision Balances', slug: 'precision-balances', description: 'For everyday lab use', active: true, productCount: 4 },
      { id: 103, name: 'Industrial Scales', slug: 'industrial-scales', description: 'Heavy-duty industrial scales', active: true, productCount: 3 },
    ]
  },
  { 
    id: 2, 
    name: 'Chromatography', 
    slug: 'chromatography', 
    description: 'Advanced separation and analysis systems',
    icon: '🧪',
    active: true, 
    productCount: 8,
    subCategories: [
      { id: 201, name: 'Gas Chromatography', slug: 'gas-chromatography', description: 'GC systems for volatile compounds', active: true, productCount: 4 },
      { id: 202, name: 'Liquid Chromatography', slug: 'liquid-chromatography', description: 'HPLC and UHPLC systems', active: true, productCount: 4 },
    ]
  },
  { 
    id: 3, 
    name: 'Thermal Cooling', 
    slug: 'thermal-cooling', 
    description: 'Temperature control and cooling solutions',
    icon: '🌡️',
    active: true, 
    productCount: 15,
    subCategories: [
      { id: 301, name: 'Incubators', slug: 'incubators', description: 'Cell culture and microbiology', active: true, productCount: 6 },
      { id: 302, name: 'Freezers', slug: 'freezers', description: 'ULT and laboratory freezers', active: true, productCount: 5 },
      { id: 303, name: 'Climate Chambers', slug: 'climate-chambers', description: 'Temperature and humidity control', active: true, productCount: 4 },
    ]
  },
];

export const PRODUCTS = [
  { id: 1, name: 'Analytical Balance XPR', sku: 'SART-001', category: 'Weighing & Measurement', subCategory: 'Analytical Balances', brand: 'Sartorius', price: 245000, stock: 15, status: 'active', featured: true, inStock: true },
  { id: 2, name: 'Gas Chromatography', sku: 'SCION-001', category: 'Chromatography', subCategory: 'Gas Chromatography', brand: 'Scion', price: 1250000, stock: 3, status: 'active', featured: true, inStock: true },
  { id: 3, name: 'ULT Freezer', sku: 'ARCT-001', category: 'Thermal Cooling', subCategory: 'Freezers', brand: 'Arctiko', price: 875000, stock: 0, status: 'active', featured: false, inStock: false },
];

export const DASHBOARD_STATS = {
  totalProducts: 87,
  totalCategories: 5,
  pendingContacts: 3,
  pendingQuotes: 4,
  monthlyData: {
    labels:   ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
    contacts: [8, 12, 15, 10, 18, 14, 18],
    quotes:   [5, 9, 11, 7, 15, 11, 24],
  },
  recentActivity: [
    { type: 'quote',   text: 'New quote request — Amit Patel (Analytical Balances ×3)',  time: '5m ago',  color: '#10b981' },
    { type: 'contact', text: 'Contact form — Arun Krishnamurthy (Urgent balance inquiry)', time: '22m ago', color: '#2563eb' },
    { type: 'product', text: 'Product updated — ULT Freezer marked Out of Stock',          time: '1h ago',  color: '#f59e0b' },
    { type: 'quote',   text: 'Quote sent to Dr. Meera Iyer — LC Waters',                  time: '2h ago',  color: '#10b981' },
    { type: 'contact', text: 'Reply sent to Priya Sharma — BioTech Solutions',             time: '3h ago',  color: '#8b5cf6' },
  ],
};