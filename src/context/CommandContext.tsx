import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  RouteSegment, 
  Shipment, 
  Vehicle, 
  Incident, 
  EvidenceItem, 
  AlertItem, 
  AuditEvent, 
  ImpactTransmissionResult,
  PriorityLevel,
  ShipmentStatus,
  IncidentStatus,
  RouteStatus
} from '../types';
import { 
  INITIAL_ROUTES, 
  INITIAL_SHIPMENTS, 
  INITIAL_VEHICLES, 
  INITIAL_INCIDENTS, 
  INITIAL_EVIDENCE, 
  INITIAL_ALERTS, 
  INITIAL_AUDIT_TRAIL 
} from '../services/initialData';
import { ImpactAnalysisService } from '../services/impactService';
import { PrototypeRiskEngine } from '../services/riskService';

export interface ToastMessage {
  id: string;
  title: string;
  body: string;
  type: 'safe' | 'alert' | 'critical';
}

interface CommandContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  
  activeModule: string;
  setActiveModule: (module: string) => void;
  
  routes: RouteSegment[];
  shipments: Shipment[];
  vehicles: Vehicle[];
  incidents: Incident[];
  evidence: EvidenceItem[];
  alerts: AlertItem[];
  auditTrail: AuditEvent[];
  
  selectedRoute: RouteSegment | null;
  setSelectedRoute: (route: RouteSegment | null) => void;
  selectedShipment: Shipment | null;
  setSelectedShipment: (shipment: Shipment | null) => void;
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  selectedIncident: Incident | null;
  setSelectedIncident: (incident: Incident | null) => void;
  
  impactAnalysis: ImpactTransmissionResult | null;
  
  // Crisis Simulations
  simulateLandslide: () => void;
  simulateFlood: () => void;
  simulateHeavyRain: () => void;
  resetSimulation: () => void;
  activeScenario: 'NONE' | 'LANDSLIDE' | 'FLOOD' | 'RAIN';
  
  // Vehicle Simulation
  isGpsSimRunning: boolean;
  startVehicleSimulation: () => void;
  pauseVehicleSimulation: () => void;
  resetVehicleSimulation: () => void;
  
  // Evidence & Incidents
  verifyEvidence: (evidenceId: string) => void;
  rejectEvidence: (evidenceId: string) => void;
  duplicateEvidence: (evidenceId: string) => void;
  
  verifyIncident: (incidentId: string) => void;
  rejectIncident: (incidentId: string) => void;
  duplicateIncident: (incidentId: string) => void;
  addIncident: (newIncident: Omit<Incident, 'id' | 'evidenceIds'>) => void;
  
  // Shipments
  createShipment: (newShipment: Omit<Shipment, 'id' | 'lastUpdate'>) => void;
  editShipment: (id: string, updates: Partial<Shipment>) => void;
  assignDriverVehicle: (shipmentId: string, driverName: string, driverPhone: string, vehicleId: string) => void;
  changeShipmentPriority: (shipmentId: string, newPriority: PriorityLevel) => void;
  rerouteShipment: (shipmentId: string, alternativeRouteId?: string) => void;
  
  // Alerts
  acknowledgeAlert: (alertId: string) => void;
  
  // Reroute Modal state
  isRerouteModalOpen: boolean;
  targetRerouteShipmentId: string | null;
  openRerouteModal: (shipmentId: string) => void;
  closeRerouteModal: () => void;
  
  // Map Layers
  layers: {
    roads: boolean;
    vehicles: boolean;
    incidents: boolean;
    weather: boolean;
    blocked: boolean;
  };
  toggleLayer: (layer: 'roads' | 'vehicles' | 'incidents' | 'weather' | 'blocked') => void;
  
  // Toast
  toast: ToastMessage | null;
  showToast: (title: string, body: string, type?: 'safe' | 'alert' | 'critical') => void;
  
  // KPIs
  kpis: {
    activeShipmentsCount: number;
    criticalShipmentsCount: number;
    delayedShipmentsCount: number;
    vehiclesEnRouteCount: number;
    highRiskRoutesCount: number;
    activeIncidentsCount: number;
  };
}

const CommandContext = createContext<CommandContextType | undefined>(undefined);

export const CommandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('extricate_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('extricate_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const [activeModule, setActiveModuleState] = useState<string>('dashboard');

  const setActiveModule = useCallback((module: string) => {
    setActiveModuleState(module);
    setIsMobileMenuOpen(false); // Close mobile drawer when selecting module
  }, []);
  
  const [routes, setRoutes] = useState<RouteSegment[]>(INITIAL_ROUTES);
  const [shipments, setShipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [evidence, setEvidence] = useState<EvidenceItem[]>(INITIAL_EVIDENCE);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [auditTrail, setAuditTrail] = useState<AuditEvent[]>(INITIAL_AUDIT_TRAIL);
  
  const [selectedRoute, setSelectedRoute] = useState<RouteSegment | null>(INITIAL_ROUTES[0]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(INITIAL_SHIPMENTS[0]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(INITIAL_VEHICLES[0]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(INITIAL_INCIDENTS[0]);
  
  const [activeScenario, setActiveScenario] = useState<'NONE' | 'LANDSLIDE' | 'FLOOD' | 'RAIN'>('NONE');
  const [isGpsSimRunning, setIsGpsSimRunning] = useState<boolean>(true);
  
  const [isRerouteModalOpen, setIsRerouteModalOpen] = useState<boolean>(false);
  const [targetRerouteShipmentId, setTargetRerouteShipmentId] = useState<string | null>(null);
  
  const [toast, setToast] = useState<ToastMessage | null>(null);
  
  const [layers, setLayers] = useState({
    roads: true,
    vehicles: true,
    incidents: true,
    weather: true,
    blocked: true,
  });

  const toggleLayer = useCallback((layer: 'roads' | 'vehicles' | 'incidents' | 'weather' | 'blocked') => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  }, []);

  const showToast = useCallback((title: string, body: string, type: 'safe' | 'alert' | 'critical' = 'safe') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToast({ id, title, body, type });
    setTimeout(() => {
      setToast(curr => (curr?.id === id ? null : curr));
    }, 4500);
  }, []);

  const addAuditEvent = useCallback((action: string, entity: string, previousState: string, newState: string, details?: string) => {
    const now = new Date();
    const timestamp = now.toTimeString().split(' ')[0] + ' IST';
    const newEvent: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp,
      action,
      user: 'Rajeev Sharma (Authority)',
      entity,
      previousState,
      newState,
      details,
    };
    setAuditTrail(prev => [newEvent, ...prev]);
  }, []);

  // Compute live impact analysis based on selected route or primary blocked route
  const impactAnalysis = useMemo(() => {
    const blockedRoute = routes.find(r => r.status === 'BLOCKED') || routes.find(r => r.status === 'HIGH-RISK') || routes[0];
    return ImpactAnalysisService.calculateImpact(blockedRoute.id, routes, shipments, vehicles);
  }, [routes, shipments, vehicles]);

  // Compute operational KPIs dynamically
  const kpis = useMemo(() => {
    const activeShipmentsCount = shipments.filter(s => s.status === 'IN TRANSIT' || s.status === 'REROUTED' || s.status === 'DELAYED' || s.status === 'AT RISK').length;
    const criticalShipmentsCount = shipments.filter(s => s.isCritical || s.priority === 'CRITICAL').length;
    const delayedShipmentsCount = shipments.filter(s => s.status === 'DELAYED' || s.status === 'AT RISK').length;
    const vehiclesEnRouteCount = vehicles.filter(v => v.status === 'MOVING').length;
    const highRiskRoutesCount = routes.filter(r => r.status === 'HIGH-RISK' || r.status === 'BLOCKED').length;
    const activeIncidentsCount = incidents.filter(i => i.verificationStatus === 'VERIFIED' || i.verificationStatus === 'PENDING').length;
    
    return {
      activeShipmentsCount,
      criticalShipmentsCount,
      delayedShipmentsCount,
      vehiclesEnRouteCount,
      highRiskRoutesCount,
      activeIncidentsCount,
    };
  }, [shipments, vehicles, routes, incidents]);

  // Simulated GPS Vehicle movement loop
  useEffect(() => {
    if (!isGpsSimRunning) return;
    const interval = setInterval(() => {
      setVehicles(prevVehicles =>
        prevVehicles.map(v => {
          if (v.status !== 'MOVING') return v;
          const assignedRoute = routes.find(r => r.id === v.routeId);
          if (!assignedRoute || assignedRoute.waypoints.length < 2) return v;
          
          const nextIndex = (v.currentWaypointIndex + 1) % assignedRoute.waypoints.length;
          const targetWp = assignedRoute.waypoints[nextIndex];
          
          // Micro step towards waypoint
          const dLat = (targetWp.lat - v.lat) * 0.05;
          const dLng = (targetWp.lng - v.lng) * 0.05;
          
          const distToWp = Math.hypot(targetWp.lat - v.lat, targetWp.lng - v.lng);
          const newWaypointIndex = distToWp < 0.02 ? nextIndex : v.currentWaypointIndex;
          
          // Random slight speed jitter
          const speedDelta = (Math.random() - 0.5) * 4;
          const speedKmh = Math.max(15, Math.min(80, Math.round(v.speedKmh + speedDelta)));

          return {
            ...v,
            lat: Number((v.lat + dLat).toFixed(6)),
            lng: Number((v.lng + dLng).toFixed(6)),
            speedKmh,
            currentWaypointIndex: newWaypointIndex,
            lastGpsUpdate: 'Just now',
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isGpsSimRunning, routes]);

  // SIMULATE LANDSLIDE (Primary SIH Demonstration Flow)
  const simulateLandslide = useCallback(() => {
    setActiveScenario('LANDSLIDE');

    // 1. Update Route NH-10 from OPEN to BLOCKED
    setRoutes(prev =>
      prev.map(r => {
        if (r.id === 'ROUTE-NH-10') {
          return {
            ...r,
            status: 'BLOCKED',
            accessibility: 'BLOCKED',
            riskScore: 96,
            delayMinutes: 270, // +4h 30m
            activeIncidentsCount: r.activeIncidentsCount + 1,
            lastUpdated: 'Just now',
          };
        }
        return r;
      })
    );

    // 2. Mark critical shipment MED-2045 as DELAYED / AT RISK
    setShipments(prev =>
      prev.map(s => {
        if (s.id === 'MED-2045') {
          return {
            ...s,
            status: 'AT RISK',
            riskScore: 96,
            eta: '19:45 IST (+4h 30m Stranded)',
            lastUpdate: 'Just now',
            notes: 'HALTED at KM 24. Debris barrier at Mile 29. Critical hemodialysis units in danger of temperature excursion.',
          };
        }
        if (s.routeId === 'ROUTE-NH-10' && s.id !== 'MED-2045') {
          return {
            ...s,
            status: 'DELAYED',
            riskScore: 96,
            eta: 'Stalled (+5h 15m)',
            lastUpdate: 'Just now',
          };
        }
        return s;
      })
    );

    // 3. Halt Convoy TRK-AS-1029
    setVehicles(prev =>
      prev.map(v => {
        if (v.id === 'TRK-AS-1029') {
          return {
            ...v,
            status: 'HALTED',
            speedKmh: 0,
            riskLevel: 'CRITICAL',
            lastGpsUpdate: 'Just now',
          };
        }
        return v;
      })
    );

    // 4. Create Incident & Alert
    const newAlert: AlertItem = {
      id: `ALT-CRISIS-${Date.now().toString().slice(-4)}`,
      type: 'ROAD BLOCKED',
      severity: 'CRITICAL',
      title: 'CRITICAL SEVERANCE: NH-10 Mile 29 Landslide',
      location: 'KM 29+400 (Teesta Canyon)',
      timestamp: 'Just now',
      cause: 'Catastrophic debris cascade triggered. 1,400m³ shale buried road.',
      affectedRouteId: 'ROUTE-NH-10',
      affectedRouteName: 'NH-10 (Siliguri - Sevoke - Gangtok)',
      affectedShipmentId: 'MED-2045',
      recommendedAction: 'EXTRICATE recommends urgent tactical reroute of Convoy TRK-AS-1029 via Corridor Alt-B (Lava-Algarah-Reshi).',
      isAcknowledged: false,
    };
    setAlerts(prev => [newAlert, ...prev]);

    // 5. Log Audit event
    addAuditEvent(
      'Simulate Landslide Override',
      'Route NH-10 & MED-2045',
      'OPEN',
      'BLOCKED / AT RISK',
      'Disaster scenario executed. Impasse at Mile 29. Impact: 3 shipments, 2 vehicles. Alt-B Lava recommended.'
    );

    showToast(
      'CRISIS SIMULATION: LANDSLIDE ACTIVATED',
      'NH-10 Severed at KM 29+400. Critical Convoy TRK-AS-1029 (MED-2045) halted. Impact analysis ready.',
      'critical'
    );
  }, [addAuditEvent, showToast]);

  // SIMULATE FLOOD
  const simulateFlood = useCallback(() => {
    setActiveScenario('FLOOD');
    setRoutes(prev =>
      prev.map(r => {
        if (r.id === 'ROUTE-NH-27') {
          return {
            ...r,
            status: 'HIGH-RISK',
            accessibility: 'HIGH-RISK',
            riskScore: 78,
            delayMinutes: 75,
            lastUpdated: 'Just now',
          };
        }
        return r;
      })
    );

    setShipments(prev =>
      prev.map(s => {
        if (s.id === 'OXY-902') {
          return {
            ...s,
            status: 'DELAYED',
            riskScore: 78,
            lastUpdate: 'Just now',
          };
        }
        return s;
      })
    );

    addAuditEvent(
      'Simulate Flood Surge',
      'Route NH-27 (Brahmaputra Low Pier)',
      'OPEN',
      'HIGH-RISK',
      'River gauge +1.8m above danger mark. Speed restriction 20 km/h applied.'
    );

    showToast(
      'SIMULATION: BRAHMAPUTRA FLOOD DELUGE',
      'Tezpur bridge approach submerged. Liquid oxygen convoy OXY-902 speed restricted.',
      'alert'
    );
  }, [addAuditEvent, showToast]);

  // SIMULATE HEAVY RAIN
  const simulateHeavyRain = useCallback(() => {
    setActiveScenario('RAIN');
    setRoutes(prev =>
      prev.map(r => {
        if (r.id === 'ROUTE-NH-6') {
          return {
            ...r,
            status: 'DEGRADED',
            accessibility: 'DEGRADED',
            riskScore: 68,
            delayMinutes: 90,
            precipitationMmHr: 95,
            soilSaturationPct: 94,
            lastUpdated: 'Just now',
          };
        }
        return r;
      })
    );

    addAuditEvent(
      'Simulate Torrential Monsoon',
      'Route NH-6 (Jowai Pass)',
      'MODERATE',
      'DEGRADED',
      'Precipitation surged to 95 mm/hr. Heavy siltation drag recorded.'
    );

    showToast(
      'SIMULATION: MONSOON CLOUDBURST',
      'Heavy rain active across Barak transit sector NH-6. Delayed freight.',
      'alert'
    );
  }, [addAuditEvent, showToast]);

  // RESET SIMULATION
  const resetSimulation = useCallback(() => {
    setActiveScenario('NONE');
    setRoutes(INITIAL_ROUTES);
    setShipments(INITIAL_SHIPMENTS);
    setVehicles(INITIAL_VEHICLES);
    setIncidents(INITIAL_INCIDENTS);
    setEvidence(INITIAL_EVIDENCE);
    setAlerts(INITIAL_ALERTS);

    addAuditEvent(
      'Simulation Reset',
      'All Corridors & Fleets',
      'DISRUPTED',
      'BASELINE SYNTHETIC',
      'Restored baseline NER logistics steady-state schedule.'
    );

    showToast(
      'SIMULATION RESET COMPLETED',
      'All corridors restored to baseline synthetic schedule. Vehicle routes re-aligned.',
      'safe'
    );
  }, [addAuditEvent, showToast]);

  // Reroute Action (completes the core SIH loop!)
  const rerouteShipment = useCallback((shipmentId: string, altRouteId = 'ROUTE-ALT-B') => {
    const targetShipment = shipments.find(s => s.id === shipmentId);
    const altRoute = routes.find(r => r.id === altRouteId) || routes[1];

    if (!targetShipment) return;

    // 1. Update Shipment
    setShipments(prev =>
      prev.map(s => {
        if (s.id === shipmentId) {
          return {
            ...s,
            routeId: altRoute.id,
            routeName: altRoute.name,
            status: 'REROUTED',
            riskScore: altRoute.riskScore,
            eta: '16:30 IST (Safe Passage via Lava)',
            lastUpdate: 'Just now',
            notes: `TACTICAL DIRECTIVE: Rerouted by Authority from ${s.routeName} to ${altRoute.name}. Safe passage confirmed.`,
          };
        }
        return s;
      })
    );

    // 2. Update Vehicle
    if (targetShipment.vehicleId) {
      setVehicles(prev =>
        prev.map(v => {
          if (v.id === targetShipment.vehicleId) {
            return {
              ...v,
              routeId: altRoute.id,
              routeName: altRoute.name,
              status: 'MOVING',
              speedKmh: 42,
              riskLevel: 'LOW',
              currentWaypointIndex: 1,
              eta: '4h 45m',
              lastGpsUpdate: 'Just now',
            };
          }
          return v;
        })
      );
    }

    // 3. Acknowledge matching alerts
    setAlerts(prev =>
      prev.map(a => {
        if (a.affectedShipmentId === shipmentId) {
          return { ...a, isAcknowledged: true };
        }
        return a;
      })
    );

    // 4. Record in Audit Trail
    addAuditEvent(
      'Authorize Emergency Reroute',
      `Shipment ${targetShipment.id} (${targetShipment.commodity})`,
      `${targetShipment.routeName} [BLOCKED]`,
      `${altRoute.name} [REROUTED]`,
      `Authority override approved. Convoy ${targetShipment.vehicleId} diverted via Lava-Algarah-Reshi ridge. ETA recovered by +3h 15m.`
    );

    setIsRerouteModalOpen(false);
    setTargetRerouteShipmentId(null);

    showToast(
      'TACTICAL REROUTE AUTHORIZED',
      `Shipment ${targetShipment.id} successfully switched to ${altRoute.name}. Fleet notified.`,
      'safe'
    );
  }, [shipments, routes, addAuditEvent, showToast]);

  const openRerouteModal = useCallback((shipmentId: string) => {
    setTargetRerouteShipmentId(shipmentId);
    setIsRerouteModalOpen(true);
  }, []);

  const closeRerouteModal = useCallback(() => {
    setIsRerouteModalOpen(false);
    setTargetRerouteShipmentId(null);
  }, []);

  // Evidence Verification (State Mutation Chain: Evidence -> Incident -> Route Risk -> Alert -> Audit)
  const verifyEvidence = useCallback((evidenceId: string) => {
    const ev = evidence.find(e => e.id === evidenceId);
    if (!ev) return;

    // 1. Mark verified
    setEvidence(prev =>
      prev.map(e => (e.id === evidenceId ? { ...e, verificationStatus: 'VERIFIED' } : e))
    );

    // 2. Update route evidence count and risk
    setRoutes(prev =>
      prev.map(r => {
        if (r.id === ev.routeId) {
          const newEvidenceCount = r.evidenceCount + 1;
          const assessment = PrototypeRiskEngine.calculateRisk({
            precipitationMmHr: r.precipitationMmHr,
            activeIncidentsCount: r.activeIncidentsCount,
            severeIncidentsCount: r.status === 'BLOCKED' ? 1 : 0,
            soilSaturationPct: r.soilSaturationPct,
            verifiedEvidenceCount: newEvidenceCount,
            roadConditionRating: r.status === 'BLOCKED' ? 'COLLAPSED' : r.status === 'DEGRADED' ? 'DEGRADED' : 'MODERATE',
            historicalRiskBase: 40,
          });

          return {
            ...r,
            evidenceCount: newEvidenceCount,
            confidence: assessment.confidence,
            riskScore: assessment.riskScore,
            accessibility: assessment.accessibility,
            lastUpdated: 'Just now',
          };
        }
        return r;
      })
    );

    // 3. Audit event
    addAuditEvent(
      'Verify Field Evidence',
      `Evidence ${ev.id} (${ev.aiDetectionLabel})`,
      'PENDING',
      'VERIFIED',
      `Authority validated ground proof at ${ev.locationName}. Route risk engine re-evaluated.`
    );

    showToast('FIELD EVIDENCE VERIFIED', `Proof ${ev.id} verified. Route risk score recalculated.`, 'safe');
  }, [evidence, addAuditEvent, showToast]);

  const rejectEvidence = useCallback((evidenceId: string) => {
    setEvidence(prev =>
      prev.map(e => (e.id === evidenceId ? { ...e, verificationStatus: 'REJECTED' } : e))
    );
    addAuditEvent('Reject Field Evidence', `Evidence ${evidenceId}`, 'PENDING', 'REJECTED', 'Marked as false positive or outdated.');
    showToast('EVIDENCE REJECTED', `Evidence ${evidenceId} rejected.`, 'alert');
  }, [addAuditEvent, showToast]);

  const duplicateEvidence = useCallback((evidenceId: string) => {
    setEvidence(prev =>
      prev.map(e => (e.id === evidenceId ? { ...e, verificationStatus: 'DUPLICATE' } : e))
    );
    addAuditEvent('Mark Evidence Duplicate', `Evidence ${evidenceId}`, 'PENDING', 'DUPLICATE', 'Merged into existing incident cluster.');
    showToast('EVIDENCE FLAGGED DUPLICATE', `Evidence ${evidenceId} merged.`, 'safe');
  }, [addAuditEvent, showToast]);

  // Incident Verification Actions
  const verifyIncident = useCallback((incidentId: string) => {
    setIncidents(prev =>
      prev.map(inc => (inc.id === incidentId ? { ...inc, verificationStatus: 'VERIFIED' } : inc))
    );
    addAuditEvent('Verify Incident', `Incident ${incidentId}`, 'PENDING', 'VERIFIED', 'Field incident confirmed by authority.');
    showToast('INCIDENT VERIFIED', `Incident ${incidentId} confirmed on tactical registry.`, 'safe');
  }, [addAuditEvent, showToast]);

  const rejectIncident = useCallback((incidentId: string) => {
    setIncidents(prev =>
      prev.map(inc => (inc.id === incidentId ? { ...inc, verificationStatus: 'REJECTED' } : inc))
    );
    addAuditEvent('Reject Incident', `Incident ${incidentId}`, 'PENDING', 'REJECTED', 'Incident dismissed as cleared or invalid.');
    showToast('INCIDENT REJECTED', `Incident ${incidentId} dismissed.`, 'alert');
  }, [addAuditEvent, showToast]);

  const duplicateIncident = useCallback((incidentId: string) => {
    setIncidents(prev =>
      prev.map(inc => (inc.id === incidentId ? { ...inc, verificationStatus: 'DUPLICATE' } : inc))
    );
    addAuditEvent('Mark Duplicate Incident', `Incident ${incidentId}`, 'PENDING', 'DUPLICATE', 'Merged into parent incident.');
    showToast('INCIDENT MARKED DUPLICATE', `Incident ${incidentId} flagged as duplicate.`, 'safe');
  }, [addAuditEvent, showToast]);

  const addIncident = useCallback((newInc: Omit<Incident, 'id' | 'evidenceIds'>) => {
    const id = `INC-${Date.now().toString().slice(-3)}`;
    const created: Incident = {
      ...newInc,
      id,
      evidenceIds: [],
    };
    setIncidents(prev => [created, ...prev]);
    addAuditEvent('Create Incident', `Incident ${id} (${created.type})`, 'NONE', 'CREATED', created.description);
    showToast('NEW INCIDENT REGISTERED', `${created.title} added to live monitor.`, 'alert');
  }, [addAuditEvent, showToast]);

  // Shipment Actions
  const createShipment = useCallback((newShip: Omit<Shipment, 'id' | 'lastUpdate'>) => {
    const id = `SHP-${Date.now().toString().slice(-4)}`;
    const created: Shipment = {
      ...newShip,
      id,
      lastUpdate: 'Just now',
    };
    setShipments(prev => [created, ...prev]);
    addAuditEvent('Create Shipment', `Shipment ${id} (${created.commodity})`, 'NONE', created.status, `Priority: ${created.priority}`);
    showToast('SHIPMENT CREATED', `Shipment ${id} added to dispatch matrix.`, 'safe');
  }, [addAuditEvent, showToast]);

  const editShipment = useCallback((id: string, updates: Partial<Shipment>) => {
    setShipments(prev =>
      prev.map(s => {
        if (s.id === id) {
          const updated = { ...s, ...updates, lastUpdate: 'Just now' };
          return updated;
        }
        return s;
      })
    );
    addAuditEvent('Edit Shipment', `Shipment ${id}`, 'MODIFIED', 'UPDATED', JSON.stringify(updates));
    showToast('SHIPMENT UPDATED', `Shipment ${id} parameters updated.`, 'safe');
  }, [addAuditEvent, showToast]);

  const assignDriverVehicle = useCallback((shipmentId: string, driverName: string, driverPhone: string, vehicleId: string) => {
    setShipments(prev =>
      prev.map(s => {
        if (s.id === shipmentId) {
          return {
            ...s,
            driverName,
            driverPhone,
            vehicleId,
            status: s.status === 'PLANNED' ? 'ASSIGNED' : s.status,
            lastUpdate: 'Just now',
          };
        }
        return s;
      })
    );

    // Update vehicle assignment
    setVehicles(prev =>
      prev.map(v => {
        if (v.id === vehicleId) {
          return {
            ...v,
            driverName,
            driverPhone,
            assignedShipmentId: shipmentId,
            status: 'MOVING',
          };
        }
        return v;
      })
    );

    addAuditEvent('Assign Driver & Vehicle', `Shipment ${shipmentId}`, 'UNASSIGNED', `Assigned: ${driverName} / ${vehicleId}`, 'Assigned dispatch credentials.');
    showToast('DRIVER & FLEET ASSIGNED', `${driverName} assigned to vehicle ${vehicleId}.`, 'safe');
  }, [addAuditEvent, showToast]);

  const changeShipmentPriority = useCallback((shipmentId: string, newPriority: PriorityLevel) => {
    setShipments(prev =>
      prev.map(s => {
        if (s.id === shipmentId) {
          return {
            ...s,
            priority: newPriority,
            isCritical: newPriority === 'CRITICAL',
            lastUpdate: 'Just now',
          };
        }
        return s;
      })
    );
    addAuditEvent('Change Shipment Priority', `Shipment ${shipmentId}`, 'PRIORITY_CHANGE', newPriority, `Escalated or adjusted to ${newPriority}`);
    showToast('PRIORITY UPDATED', `Shipment ${shipmentId} changed to ${newPriority}.`, 'safe');
  }, [addAuditEvent, showToast]);

  // Alert Actions
  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, isAcknowledged: true } : a))
    );
    addAuditEvent('Acknowledge Alert', `Alert ${alertId}`, 'ACTIVE', 'ACKNOWLEDGED', 'Operator acknowledged alert advisory.');
    showToast('ALERT ACKNOWLEDGED', `Alert ${alertId} marked as acknowledged.`, 'safe');
  }, [addAuditEvent, showToast]);

  // Vehicle Simulation controls
  const startVehicleSimulation = useCallback(() => {
    setIsGpsSimRunning(true);
    showToast('SIMULATION STARTED', 'Vehicle GPS movements and telemetry are active.', 'safe');
  }, [showToast]);

  const pauseVehicleSimulation = useCallback(() => {
    setIsGpsSimRunning(false);
    showToast('SIMULATION PAUSED', 'Vehicle positions frozen.', 'alert');
  }, [showToast]);

  const resetVehicleSimulation = useCallback(() => {
    setVehicles(INITIAL_VEHICLES);
    showToast('VEHICLES RESET', 'Fleet positions reset to initial checkpoints.', 'safe');
  }, [showToast]);

  const value = {
    theme,
    toggleTheme,
    searchQuery,
    setSearchQuery,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    toggleMobileMenu,
    activeModule,
    setActiveModule,
    routes,
    shipments,
    vehicles,
    incidents,
    evidence,
    alerts,
    auditTrail,
    selectedRoute,
    setSelectedRoute,
    selectedShipment,
    setSelectedShipment,
    selectedVehicle,
    setSelectedVehicle,
    selectedIncident,
    setSelectedIncident,
    impactAnalysis,
    simulateLandslide,
    simulateFlood,
    simulateHeavyRain,
    resetSimulation,
    activeScenario,
    isGpsSimRunning,
    startVehicleSimulation,
    pauseVehicleSimulation,
    resetVehicleSimulation,
    verifyEvidence,
    rejectEvidence,
    duplicateEvidence,
    verifyIncident,
    rejectIncident,
    duplicateIncident,
    addIncident,
    createShipment,
    editShipment,
    assignDriverVehicle,
    changeShipmentPriority,
    rerouteShipment,
    acknowledgeAlert,
    isRerouteModalOpen,
    targetRerouteShipmentId,
    openRerouteModal,
    closeRerouteModal,
    layers,
    toggleLayer,
    toast,
    showToast,
    kpis,
  };

  return <CommandContext.Provider value={value}>{children}</CommandContext.Provider>;
};

export const useCommand = () => {
  const context = useContext(CommandContext);
  if (!context) {
    throw new Error('useCommand must be used within a CommandProvider');
  }
  return context;
};
