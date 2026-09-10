import { 
  ImpactTransmissionResult, 
  RouteSegment, 
  Shipment, 
  Vehicle 
} from '../types';

export class ImpactAnalysisService {
  /**
   * Calculates the operational blast radius when a corridor is blocked or degraded.
   */
  public static calculateImpact(
    blockedRouteId: string,
    allRoutes: RouteSegment[],
    allShipments: Shipment[],
    allVehicles: Vehicle[]
  ): ImpactTransmissionResult {
    const blockedRoute = allRoutes.find(r => r.id === blockedRouteId) || allRoutes[0];
    
    // Find shipments assigned or committed to this route
    const affectedShipments = allShipments.filter(
      s => s.routeId === blockedRouteId && s.status !== 'DELIVERED'
    );

    // Find vehicles tracking along this route
    const affectedVehicles = allVehicles.filter(
      v => v.routeId === blockedRouteId
    );

    // Identify unique destinations impacted
    const affectedDestinations = Array.from(
      new Set(affectedShipments.map(s => s.destination))
    );

    // Identify critical shipments
    const criticalShipments = affectedShipments.filter(
      s => s.isCritical || s.priority === 'CRITICAL'
    );

    // Alternative route identification
    let alternativeRoute: RouteSegment | null = null;
    if (blockedRoute.alternativeRouteIds && blockedRoute.alternativeRouteIds.length > 0) {
      alternativeRoute = allRoutes.find(r => r.id === blockedRoute.alternativeRouteIds![0]) || null;
    }
    if (!alternativeRoute) {
      alternativeRoute = allRoutes.find(r => r.id !== blockedRouteId && r.status === 'OPEN') || null;
    }

    // Cumulative delay calculation
    const delayPerShipment = blockedRoute.delayMinutes > 0 ? blockedRoute.delayMinutes : 270;
    const totalDelayMinutes = delayPerShipment;

    let recommendedAction = 'No immediate action required.';
    if (criticalShipments.length > 0) {
      const topCrit = criticalShipments[0];
      recommendedAction = `Authorize immediate AI tactical reroute of Critical Convoy ${topCrit.vehicleId} (${topCrit.id}) via ${alternativeRoute ? alternativeRoute.name : 'designated mountain bypass'}.`;
    } else if (affectedShipments.length > 0) {
      recommendedAction = `Advise ${affectedShipments.length} queued logistics units to hold at nearest staging depot.`;
    }

    return {
      blockedRouteId,
      blockedRouteName: blockedRoute.name,
      affectedRoutes: [blockedRoute],
      affectedVehicles,
      affectedShipments,
      affectedDestinations,
      totalDelayMinutes,
      criticalShipments,
      recommendedAlternativeRoute: alternativeRoute,
      recommendedAction,
    };
  }
}
