import { RiskAssessmentResult, RouteStatus } from '../types';

/**
 * Prototype Risk Engine (Transparent Rule-Based Model)
 * 
 * NOTE: This is a transparent prototype risk engine using multi-factor 
 * heuristic weighting across precipitation, active hazard reports,
 * field evidence density, road morphology, and historical vulnerability.
 * It is structured with a clean API interface so that an XGBoost/Scikit-learn
 * or FastAPI service can replace it without modifying UI consumers.
 */

export interface RiskInputParams {
  precipitationMmHr: number;
  activeIncidentsCount: number;
  severeIncidentsCount: number;
  soilSaturationPct: number;
  verifiedEvidenceCount: number;
  roadConditionRating: 'PRISTINE' | 'MODERATE' | 'DEGRADED' | 'COLLAPSED';
  historicalRiskBase: number; // 0 - 100
}

export class PrototypeRiskEngine {
  public static calculateRisk(params: RiskInputParams): RiskAssessmentResult {
    // 1. Rainfall factor (0 - 25 points)
    // 0 - 15 mm/hr: Normal, 15 - 50: Elevated, 50 - 100+: Critical
    const rainScore = Math.min(25, (params.precipitationMmHr / 100) * 25);

    // 2. Hazard & Incident factor (0 - 35 points)
    // Severe blockades add immediate surge
    const incidentScore = Math.min(35, params.severeIncidentsCount * 25 + params.activeIncidentsCount * 8);

    // 3. Soil Saturation & Geological vulnerability (0 - 20 points)
    const soilScore = Math.min(20, (params.soilSaturationPct / 100) * 20);

    // 4. Field evidence verification density (0 - 10 points)
    const evidenceScore = Math.min(10, params.verifiedEvidenceCount * 4);

    // 5. Historical corridor factor (0 - 10 points)
    const histScore = Math.min(10, (params.historicalRiskBase / 100) * 10);

    // Composite Raw Score (0 - 100)
    let totalScore = Math.round(rainScore + incidentScore + soilScore + evidenceScore + histScore);

    // Severe override
    if (params.roadConditionRating === 'COLLAPSED' || params.severeIncidentsCount > 0) {
      totalScore = Math.max(totalScore, 90);
    } else if (params.roadConditionRating === 'DEGRADED') {
      totalScore = Math.max(totalScore, 45);
    }

    totalScore = Math.min(100, Math.max(5, totalScore));

    // Determine Risk Level & Accessibility
    let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
    let accessibility: RouteStatus = 'OPEN';
    let estimatedDelayMinutes = 0;

    if (totalScore >= 85) {
      riskLevel = 'CRITICAL';
      accessibility = 'BLOCKED';
      estimatedDelayMinutes = 270; // +4h 30m
    } else if (totalScore >= 60) {
      riskLevel = 'HIGH';
      accessibility = 'HIGH-RISK';
      estimatedDelayMinutes = 75; // +1h 15m
    } else if (totalScore >= 35) {
      riskLevel = 'MODERATE';
      accessibility = 'DEGRADED';
      estimatedDelayMinutes = 40; // +40m
    } else {
      riskLevel = 'LOW';
      accessibility = 'OPEN';
      estimatedDelayMinutes = 0;
    }

    // Confidence estimation based on sensor and evidence data richness
    const confidence = Math.min(98, Math.max(78, 85 + params.verifiedEvidenceCount * 3));

    return {
      riskScore: totalScore,
      riskLevel,
      confidence,
      accessibility,
      estimatedDelayMinutes,
      breakdown: {
        rainfallFactor: Math.round(rainScore),
        hazardFactor: Math.round(incidentScore),
        roadConditionFactor: Math.round(soilScore),
        fieldReportsFactor: Math.round(evidenceScore),
        historicalFactor: Math.round(histScore),
      },
    };
  }
}
