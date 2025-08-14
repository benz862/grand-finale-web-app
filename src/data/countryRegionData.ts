// Enhanced Country and Region Data for Dynamic Selection
// This provides comprehensive country list with corresponding provinces/states/regions

export const countryRegionData = {
  // North America
  'United States': {
    label: 'State',
    regions: [
      'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 
      'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
      'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 
      'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 
      'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 
      'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 
      'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 
      'Wisconsin', 'Wyoming', 'District of Columbia', 'Puerto Rico', 'US Virgin Islands', 
      'Guam', 'American Samoa', 'Northern Mariana Islands'
    ]
  },
  'Canada': {
    label: 'Province/Territory',
    regions: [
      'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
      'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island',
      'Quebec', 'Saskatchewan', 'Yukon'
    ]
  },
  'Mexico': {
    label: 'State',
    regions: [
      'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 
      'Chihuahua', 'Coahuila', 'Colima', 'Durango', 'Guanajuato', 'Guerrero', 'Hidalgo', 
      'Jalisco', 'México', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 
      'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora', 
      'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas', 'Mexico City'
    ]
  },

  // Europe
  'United Kingdom': {
    label: 'Country/Region',
    regions: [
      'England', 'Scotland', 'Wales', 'Northern Ireland', 'Isle of Man', 'Channel Islands'
    ]
  },
  'Germany': {
    label: 'State (Länder)',
    regions: [
      'Baden-Württemberg', 'Bavaria', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg', 
      'Hesse', 'Lower Saxony', 'Mecklenburg-Vorpommern', 'North Rhine-Westphalia', 
      'Rhineland-Palatinate', 'Saarland', 'Saxony', 'Saxony-Anhalt', 'Schleswig-Holstein', 
      'Thuringia'
    ]
  },
  'France': {
    label: 'Region',
    regions: [
      'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Brittany', 'Centre-Val de Loire',
      'Corsica', 'Grand Est', 'Hauts-de-France', 'Île-de-France', 'Normandy', 'Nouvelle-Aquitaine',
      'Occitania', 'Pays de la Loire', 'Provence-Alpes-Côte d\'Azur'
    ]
  },
  'Italy': {
    label: 'Region',
    regions: [
      'Abruzzo', 'Aosta Valley', 'Apulia', 'Basilicata', 'Calabria', 'Campania', 'Emilia-Romagna',
      'Friuli-Venezia Giulia', 'Lazio', 'Liguria', 'Lombardy', 'Marche', 'Molise', 'Piedmont',
      'Sardinia', 'Sicily', 'Tuscany', 'Trentino-Alto Adige', 'Umbria', 'Veneto'
    ]
  },
  'Spain': {
    label: 'Autonomous Community',
    regions: [
      'Andalusia', 'Aragon', 'Asturias', 'Balearic Islands', 'Basque Country', 'Canary Islands',
      'Cantabria', 'Castile and León', 'Castile-La Mancha', 'Catalonia', 'Extremadura', 'Galicia',
      'La Rioja', 'Madrid', 'Murcia', 'Navarre', 'Valencia', 'Ceuta', 'Melilla'
    ]
  },
  'Netherlands': {
    label: 'Province',
    regions: [
      'Drenthe', 'Flevoland', 'Friesland', 'Gelderland', 'Groningen', 'Limburg', 'North Brabant',
      'North Holland', 'Overijssel', 'South Holland', 'Utrecht', 'Zeeland'
    ]
  },

  // Asia-Pacific
  'Australia': {
    label: 'State/Territory',
    regions: [
      'Australian Capital Territory', 'New South Wales', 'Northern Territory', 'Queensland',
      'South Australia', 'Tasmania', 'Victoria', 'Western Australia'
    ]
  },
  'India': {
    label: 'State/Union Territory',
    regions: [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
      'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
      'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
      'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
      'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
      'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
    ]
  },
  'China': {
    label: 'Province/Region',
    regions: [
      'Anhui', 'Beijing', 'Chongqing', 'Fujian', 'Gansu', 'Guangdong', 'Guangxi', 'Guizhou',
      'Hainan', 'Hebei', 'Heilongjiang', 'Henan', 'Hong Kong', 'Hubei', 'Hunan', 'Inner Mongolia',
      'Jiangsu', 'Jiangxi', 'Jilin', 'Liaoning', 'Macau', 'Ningxia', 'Qinghai', 'Shaanxi',
      'Shandong', 'Shanghai', 'Shanxi', 'Sichuan', 'Taiwan', 'Tianjin', 'Tibet', 'Xinjiang',
      'Yunnan', 'Zhejiang'
    ]
  },
  'Japan': {
    label: 'Prefecture',
    regions: [
      'Aichi', 'Akita', 'Aomori', 'Chiba', 'Ehime', 'Fukui', 'Fukuoka', 'Fukushima', 'Gifu',
      'Gunma', 'Hiroshima', 'Hokkaido', 'Hyogo', 'Ibaraki', 'Ishikawa', 'Iwate', 'Kagawa',
      'Kagoshima', 'Kanagawa', 'Kochi', 'Kumamoto', 'Kyoto', 'Mie', 'Miyagi', 'Miyazaki',
      'Nagano', 'Nagasaki', 'Nara', 'Niigata', 'Oita', 'Okayama', 'Okinawa', 'Osaka',
      'Saga', 'Saitama', 'Shiga', 'Shimane', 'Shizuoka', 'Tochigi', 'Tokushima', 'Tokyo',
      'Tottori', 'Toyama', 'Wakayama', 'Yamagata', 'Yamaguchi', 'Yamanashi'
    ]
  },

  // South America
  'Brazil': {
    label: 'State',
    regions: [
      'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal', 'Espírito Santo',
      'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará', 'Paraíba',
      'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul',
      'Rondônia', 'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'
    ]
  },
  'Argentina': {
    label: 'Province',
    regions: [
      'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes', 'Entre Ríos',
      'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro',
      'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero',
      'Tierra del Fuego', 'Tucumán', 'Buenos Aires City'
    ]
  }
};

// Comprehensive list of all countries
export const allCountries = [
  // North America
  'United States', 'Canada', 'Mexico', 'Greenland', 'Guatemala', 'Belize', 'El Salvador', 'Honduras',
  'Nicaragua', 'Costa Rica', 'Panama', 'Cuba', 'Jamaica', 'Haiti', 'Dominican Republic', 'Bahamas',
  'Trinidad and Tobago', 'Barbados', 'Saint Lucia', 'Grenada', 'Saint Vincent and the Grenadines',
  'Antigua and Barbuda', 'Dominica', 'Saint Kitts and Nevis',

  // South America
  'Brazil', 'Argentina', 'Colombia', 'Peru', 'Venezuela', 'Chile', 'Ecuador', 'Bolivia', 'Paraguay',
  'Uruguay', 'Guyana', 'Suriname', 'French Guiana',

  // Europe
  'Russia', 'Germany', 'United Kingdom', 'France', 'Italy', 'Spain', 'Ukraine', 'Poland', 'Romania',
  'Netherlands', 'Belgium', 'Czech Republic', 'Greece', 'Portugal', 'Sweden', 'Hungary', 'Austria',
  'Belarus', 'Switzerland', 'Bulgaria', 'Serbia', 'Denmark', 'Finland', 'Slovakia', 'Norway',
  'Ireland', 'Croatia', 'Bosnia and Herzegovina', 'Albania', 'Lithuania', 'Slovenia', 'Latvia',
  'Estonia', 'Macedonia', 'Moldova', 'Luxembourg', 'Malta', 'Iceland', 'Montenegro', 'Andorra',
  'Liechtenstein', 'Monaco', 'San Marino', 'Vatican City',

  // Asia
  'China', 'India', 'Indonesia', 'Pakistan', 'Bangladesh', 'Japan', 'Philippines', 'Vietnam',
  'Turkey', 'Iran', 'Thailand', 'Myanmar', 'South Korea', 'Iraq', 'Afghanistan', 'Saudi Arabia',
  'Uzbekistan', 'Malaysia', 'Nepal', 'Yemen', 'North Korea', 'Syria', 'Cambodia', 'Jordan',
  'Azerbaijan', 'United Arab Emirates', 'Tajikistan', 'Israel', 'Laos', 'Singapore', 'Oman',
  'Kuwait', 'Georgia', 'Mongolia', 'Armenia', 'Qatar', 'Bahrain', 'East Timor', 'Cyprus',
  'Bhutan', 'Brunei', 'Maldives',

  // Africa
  'Nigeria', 'Ethiopia', 'Egypt', 'Democratic Republic of the Congo', 'Tanzania', 'South Africa',
  'Kenya', 'Uganda', 'Algeria', 'Sudan', 'Morocco', 'Angola', 'Ghana', 'Mozambique', 'Madagascar',
  'Cameroon', 'Ivory Coast', 'Niger', 'Burkina Faso', 'Mali', 'Malawi', 'Zambia', 'Somalia',
  'Senegal', 'Chad', 'Zimbabwe', 'Guinea', 'Rwanda', 'Benin', 'Burundi', 'Tunisia', 'South Sudan',
  'Togo', 'Sierra Leone', 'Libya', 'Liberia', 'Central African Republic', 'Mauritania', 'Eritrea',
  'Gambia', 'Botswana', 'Namibia', 'Gabon', 'Lesotho', 'Guinea-Bissau', 'Equatorial Guinea',
  'Mauritius', 'Eswatini', 'Djibouti', 'Comoros', 'Cape Verde', 'São Tomé and Príncipe', 'Seychelles',

  // Oceania
  'Australia', 'Papua New Guinea', 'New Zealand', 'Fiji', 'Solomon Islands', 'Vanuatu', 'Samoa',
  'Micronesia', 'Tonga', 'Kiribati', 'Palau', 'Marshall Islands', 'Tuvalu', 'Nauru'
];

// Helper function to get regions for a country
export const getRegionsForCountry = (country: string) => {
  return countryRegionData[country] || null;
};

// Helper function to get the label for regions in a country
export const getRegionLabel = (country: string) => {
  const data = countryRegionData[country];
  return data ? data.label : 'Province/State';
};
