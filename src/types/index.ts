export type WasteStreamType =
  | 'SINGLE_STREAM'
  | 'COMMERCIAL_OCC'
  | 'RIGID_PLASTICS'
  | 'MIXED_POLYMERS'
  | 'METALS'
  | 'ORGANICS';

export type ContaminationRiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type StreamSuitability = 'ACCEPTED' | 'ACCEPTED_WITH_SORTING' | 'REJECTED';

export type MaterialCategory =
  | 'Plastics'
  | 'Paper & Cardboard'
  | 'Metals'
  | 'Glass'
  | 'Organics'
  | 'Non-Recyclable Contaminant';

export interface DetectedMaterial {
  name: string;
  category: MaterialCategory;
  estimatedPercentage: number;
  confidence: number;
  recyclableInStream: boolean;
  notes?: string;
}

export interface ContaminationAlert {
  item: string;
  severity: 'CRITICAL' | 'WARNING' | 'NOTICE';
  description: string;
  visualEvidence: string;
  correctiveAction: string;
}

export interface ActionChecklistItem {
  step: number;
  title: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  estimatedDivertRate: string;
  completed?: boolean;
}

export interface AnalysisResult {
  id: string;
  createdAt: string;
  batchName: string;
  wasteStream: WasteStreamType;
  facilityLine?: string;
  imageUrl?: string;
  overallRisk: ContaminationRiskLevel;
  contaminationScore: number; // 0 (pure/clean) to 100 (heavily contaminated)
  purityIndex: number; // 100 - contaminationScore
  streamSuitability: StreamSuitability;
  suitabilityReason: string;
  materialsDetected: DetectedMaterial[];
  contaminationAlerts: ContaminationAlert[];
  actionChecklist: ActionChecklistItem[];
  batchRecommendations: string[];
  summaryProse: string;
  operatorNotes?: string;
}

export interface WasteStreamDefinition {
  id: WasteStreamType;
  label: string;
  description: string;
  standardToleranceMaxRisk: number; // e.g. 5% for OCC
  targetPurityMin: number;
  typicalCommodities: string[];
  strictDisallowed: string[];
}
