import { WasteStreamDefinition } from '../types/index.ts';

export const WASTE_STREAM_DEFINITIONS: Record<string, WasteStreamDefinition> = {
  SINGLE_STREAM: {
    id: 'SINGLE_STREAM',
    label: 'Single-Stream Recyclables',
    description: 'Curbside mixed paper, rigid containers, cardboard, and aluminum cans for MRF mechanical separation.',
    standardToleranceMaxRisk: 12.0,
    targetPurityMin: 88.0,
    typicalCommodities: ['Corrugated Cardboard (OCC)', 'PET #1 Bottles', 'HDPE #2 Jugs', 'Aluminum UBC', 'Steel Cans'],
    strictDisallowed: ['Flexible film wrap', 'Lithium batteries', 'Bio-waste', 'Garden hoses', 'Propane tanks']
  },
  COMMERCIAL_OCC: {
    id: 'COMMERCIAL_OCC',
    label: 'Commercial Paper & Cardboard (OCC)',
    description: 'Old Corrugated Containers from retail, distribution centers, and commercial facilities according to EN 643.',
    standardToleranceMaxRisk: 5.0,
    targetPurityMin: 95.0,
    typicalCommodities: ['Double-wall cardboard', 'Single-wall shipping cartons', 'Kraft linerboard'],
    strictDisallowed: ['Wax-impregnated paperboard', 'Food-grease soaked boxes', 'Plastic strapping', 'Polystyrene corners']
  },
  RIGID_PLASTICS: {
    id: 'RIGID_PLASTICS',
    label: 'Rigid Polymers (PET / HDPE #1 & #2)',
    description: 'Post-consumer bottle and jug stream for bottle-to-bottle food-grade rPET / rHDPE flake recovery.',
    standardToleranceMaxRisk: 6.0,
    targetPurityMin: 94.0,
    typicalCommodities: ['Clear PET water & beverage bottles', 'Natural HDPE milk jugs', 'Colored HDPE detergent bottles'],
    strictDisallowed: ['PVC (#3) bottles', 'Polystyrene foam (#6)', 'Metal fasteners', 'Hazardous pesticide bottles']
  },
  MIXED_POLYMERS: {
    id: 'MIXED_POLYMERS',
    label: 'Mixed Polymers (#1-#7)',
    description: 'Blended rigid and thermoformed plastics for secondary compounding or mechanical injection molding.',
    standardToleranceMaxRisk: 15.0,
    targetPurityMin: 85.0,
    typicalCommodities: ['Polypropylene (#5) food tubs', 'PET thermoform clamshells', 'Rigid toys (metal removed)'],
    strictDisallowed: ['Multi-layer metallized foil pouches', 'Thermoset rubbers', 'Polyurethane foam']
  },
  METALS: {
    id: 'METALS',
    label: 'Scrap & Non-Ferrous Metals',
    description: 'Sorted aluminum beverage cans (UBC), tin-plated food cans, and non-ferrous alloys for remelting.',
    standardToleranceMaxRisk: 3.0,
    targetPurityMin: 97.0,
    typicalCommodities: ['Aluminum Used Beverage Cans (UBC)', 'Tin food tins', 'Clean aluminum foil trays'],
    strictDisallowed: ['Unpunctured pressurized aerosol cans', 'Lead-acid / lithium batteries', 'Radioactive scrap']
  },
  ORGANICS: {
    id: 'ORGANICS',
    label: 'Compostable & Organic Biomass',
    description: 'Food scraps, yard waste, and certified BPI compostable foodware for commercial industrial composting.',
    standardToleranceMaxRisk: 2.0,
    targetPurityMin: 98.0,
    typicalCommodities: ['Vegetable & produce trimmings', 'Coffee grounds', 'Certified compostable fiber packaging'],
    strictDisallowed: ['Conventional petroleum-based plastics', 'Glass fragments', 'Treated timber / chemical mulch']
  }
};
