export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'NORMAL' | 'ELEVATED';

export type RouteStatus = 'OPEN' | 'DEGRADED' | 'HIGH-RISK' | 'BLOCKED';

export type ShipmentStatus = 
  | 'PLANNED' 
  | 'ASSIGNED' 
  | 'IN TRANSIT' 
  | 'DELAYED' 
  | 'REROUTED' 
  | 'DELIVERED' 
  | 'AT RISK';

export type IncidentType = 
  | 'LANDSLIDE' 
  | 'FLOOD' 
  | 'ROAD DAMAGE' 
  | 'BLOCKED ROAD' 
  | 'BRIDGE DAMAGE' 
  | 'HEAVY RAIN' 
  | 'ACCIDENT' 
  | 'TRAFFIC';

export type IncidentStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'DUPLICATE';

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'CAUTION' | 'INFO';

export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'CAUTION' | 'INFO';

export type AlertType = 
  | 'ROAD BLOCKED' 
  | 'LANDSLIDE RISK' 
  | 'FLOOD RISK' 
  | 'HEAVY RAIN' 
  | 'ROAD DAMAGE' 
  | 'HIGH-RISK ROUTE' 
  | 'SHIPMENT DELAY' 
  | 'ROUTE CHANGE' 
  | 'SHIPMENT AT RISK';

export interface GeoCoordinate {
  lat: number;
  lng: number;
}

export interface RouteSegment {
  id: string;
  name: string;
  code: string; // e.g. "NH-10", "NH-27"
  origin: string;
  destination: string;
  originCoord: GeoCoordinate;
  destCoord: GeoCoordinate;
  distanceKm: number;
  stdEtaMinutes: number;
  currentEtaMinutes: number;
  delayMinutes: number;
  status: RouteStatus;
  riskScore: number; // 0 - 100
  confidence: number; // 0 - 100%
  accessibility: RouteStatus;
  elevationMsl: string;
  sector: string;
  precipitationMmHr: number;
  soilSaturationPct: number;
  activeIncidentsCount: number;
  evidenceCount: number;
  lastUpdated: string;
  description: string;
  waypoints: GeoCoordinate[];
  alternativeRouteIds?: string[];
  isAlternative?: boolean;
}

export interface Shipment {
  id: string; // e.g. "MED-2045"
  commodity: string;
  priority: PriorityLevel;
  origin: string;
  destination: string;
  driverName: string;
  driverPhone: string;
  vehicleId: string;
  routeId: string;
  routeName: string;
  eta: string;
  status: ShipmentStatus;
  riskScore: number;
  isCritical: boolean;
  cargoWeightTonnes: number;
  lastUpdate: string;
  notes?: string;
}

export interface Vehicle {
  id: string; // e.g. "TRK-AS-1029"
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  assignedShipmentId?: string;
  commodity?: string;
  lat: number;
  lng: number;
  speedKmh: number;
  routeId: string;
  routeName: string;
  eta: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  lastGpsUpdate: string;
  status: 'MOVING' | 'HALTED' | 'QUEUED' | 'IDLE';
  headingDeg: number;
  currentWaypointIndex: number;
}

export interface Incident {
  id: string; // e.g. "INC-101"
  type: IncidentType;
  title: string;
  location: string;
  chainage: string; // e.g. "KM 29+400"
  gps: GeoCoordinate;
  routeId: string;
  routeName: string;
  reporter: string; // e.g. "BRO Unit 44", "SDRF Inspector"
  timestamp: string;
  description: string;
  evidenceIds: string[];
  riskScore: number;
  verificationStatus: IncidentStatus;
  severity: AlertSeverity;
}

export interface EvidenceItem {
  id: string; // e.g. "EVD-301"
  incidentId: string;
  incidentTitle: string;
  routeId: string;
  imageUrl: string;
  gps: GeoCoordinate;
  locationName: string;
  timestamp: string;
  reporter: string;
  description: string;
  aiDetectionLabel: string; // e.g. "YOLO: ROCKFALL 98.4%"
  aiConfidencePct: number;
  verificationStatus: IncidentStatus;
}

export interface AlertItem {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  location: string;
  timestamp: string;
  cause: string;
  affectedRouteId: string;
  affectedRouteName: string;
  affectedShipmentId?: string;
  recommendedAction: string;
  isAcknowledged: boolean;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  entity: string;
  previousState: string;
  newState: string;
  details?: string;
}

export interface RiskAssessmentResult {
  riskScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  confidence: number;
  accessibility: RouteStatus;
  estimatedDelayMinutes: number;
  breakdown: {
    rainfallFactor: number;
    hazardFactor: number;
    roadConditionFactor: number;
    fieldReportsFactor: number;
    historicalFactor: number;
  };
}

export interface ImpactTransmissionResult {
  blockedRouteId: string;
  blockedRouteName: string;
  affectedRoutes: RouteSegment[];
  affectedVehicles: Vehicle[];
  affectedShipments: Shipment[];
  affectedDestinations: string[];
  totalDelayMinutes: number;
  criticalShipments: Shipment[];
  recommendedAlternativeRoute: RouteSegment | null;
  recommendedAction: string;
}

export interface RouteCandidate {
  id: string;
  name: string;
  distanceKm: number;
  estimatedDuration: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  accessibility: RouteStatus;
  reliabilityPct: number;
  isRecommended: boolean;
  rationale: string;
  waypoints: GeoCoordinate[];
}
