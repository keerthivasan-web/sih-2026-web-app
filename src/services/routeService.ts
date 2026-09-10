import { RouteCandidate, PriorityLevel, GeoCoordinate } from '../types';

export interface RouteAnalysisParams {
  origin: string;
  destination: string;
  shipmentType: string;
  priority: PriorityLevel;
  vehicleType: string;
}

export class RouteIntelligenceService {
  /**
   * Generates multiple route candidates and recommends the safest feasible route,
   * avoiding the common pitfall of naively selecting shortest high-risk paths.
   */
  public static analyzeRoutes(params: RouteAnalysisParams): {
    candidates: RouteCandidate[];
    recommendedRoute: RouteCandidate;
    analysisSummary: string;
  } {
    // Demo realistic candidate generator based on corridor
    const candidates: RouteCandidate[] = [
      {
        id: 'ROUTE-CANDIDATE-A',
        name: 'Route A (Direct Teesta Canyon Arterial - NH-10)',
        distanceKm: 114,
        estimatedDuration: '3h 30m (Nominal) / +5h 15m (Disrupted)',
        riskScore: 92,
        riskLevel: 'CRITICAL',
        accessibility: 'BLOCKED',
        reliabilityPct: 32,
        isRecommended: false,
        rationale: 'Shortest linear distance (114 km), but traverses active KM 29+400 rockfall corridor with 91% soil saturation. High probability of complete impassability.',
        waypoints: [
          { lat: 26.7271, lng: 88.3953 },
          { lat: 26.8845, lng: 88.4735 },
          { lat: 26.9854, lng: 88.4891 },
          { lat: 27.1724, lng: 88.5284 },
          { lat: 27.3389, lng: 88.6065 },
        ],
      },
      {
        id: 'ROUTE-CANDIDATE-B',
        name: 'Route B (Kalimpong - Lava - Algarah - Reshi Ridge - Alt-B)',
        distanceKm: 142,
        estimatedDuration: '4h 45m (Predictable)',
        riskScore: 24,
        riskLevel: 'LOW',
        accessibility: 'OPEN',
        reliabilityPct: 88,
        isRecommended: true,
        rationale: 'Route B is slightly longer (+28 km, +1h 15m) but has significantly lower disruption risk. Elevated ridge alignment circumvents Teesta flood plain with active BRO quick-reaction bulldozer detachment stationed at Algarah.',
        waypoints: [
          { lat: 26.8845, lng: 88.4735 },
          { lat: 27.0542, lng: 88.5912 },
          { lat: 27.0865, lng: 88.6611 },
          { lat: 27.1245, lng: 88.6322 },
          { lat: 27.2185, lng: 88.6277 },
          { lat: 27.3389, lng: 88.6065 },
        ],
      },
      {
        id: 'ROUTE-CANDIDATE-C',
        name: 'Route C (Jorethang - Melli - Namchi Western Pass)',
        distanceKm: 156,
        estimatedDuration: '5h 10m',
        riskScore: 54,
        riskLevel: 'MODERATE',
        accessibility: 'DEGRADED',
        reliabilityPct: 65,
        isRecommended: false,
        rationale: 'Moderate hazard score. Steep gradient hairpins restricted for multi-axles above 16 tonnes. Acceptable for light 4x4 relief ambulances only.',
        waypoints: [
          { lat: 26.8845, lng: 88.4735 },
          { lat: 27.0800, lng: 88.3100 },
          { lat: 27.1600, lng: 88.3500 },
          { lat: 27.3389, lng: 88.6065 },
        ],
      },
    ];

    const recommendedRoute = candidates.find(c => c.isRecommended) || candidates[1];
    const analysisSummary = `EXTRICATE Multi-Criteria Decision Analysis selected ${recommendedRoute.name}. While Route A is the shortest distance, its hazard vulnerability makes it unsafe for priority ${params.priority} cargo. ${recommendedRoute.rationale}`;

    return {
      candidates,
      recommendedRoute,
      analysisSummary,
    };
  }
}
