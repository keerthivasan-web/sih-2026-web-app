/**
 * OpenStreetMap (OSM) & Overpass API Service
 * Fetches real-time highway nodes and road network topology for the North Eastern Region.
 */

export interface OsmNode {
  id: number;
  lat: number;
  lon: number;
  tags?: Record<string, string>;
}

export interface OsmWay {
  id: number;
  nodes: number[];
  tags?: Record<string, string>;
}

export interface OsmQueryResult {
  nodes: OsmNode[];
  ways: OsmWay[];
  totalNodes: number;
  fetchedAt: string;
}

// Bounding box for North Eastern Region (Siliguri - Gangtok corridor)
// [south, west, north, east] = [26.6, 88.3, 27.4, 88.8]
const DEFAULT_BBOX = [26.6, 88.3, 27.4, 88.8];

// Memory cache to prevent repetitive network requests
const osmCache: Map<string, OsmQueryResult> = new Map();

export const fetchOsmRoadNetwork = async (
  bbox: number[] = DEFAULT_BBOX
): Promise<OsmQueryResult> => {
  const cacheKey = bbox.join(',');
  if (osmCache.has(cacheKey)) {
    return osmCache.get(cacheKey)!;
  }

  const [south, west, north, east] = bbox;

  // Overpass API Query for primary and trunk highways in the corridor
  const overpassQuery = `
    [out:json][timeout:20];
    (
      node["highway"](${south},${west},${north},${east});
      way["highway"~"trunk|primary|secondary"](${south},${west},${north},${east});
    );
    out body 200;
    >;
    out skel qt;
  `;

  const overpassUrl = 'https://overpass-api.de/api/interpreter';

  try {
    const response = await fetch(overpassUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'data=' + encodeURIComponent(overpassQuery),
    });

    if (!response.ok) {
      throw new Error(`Overpass API responded with status ${response.status}`);
    }

    const data = await response.json();
    const elements: Array<any> = data.elements || [];

    const nodes: OsmNode[] = [];
    const ways: OsmWay[] = [];

    elements.forEach(el => {
      if (el.type === 'node' && typeof el.lat === 'number' && typeof el.lon === 'number') {
        nodes.push({
          id: el.id,
          lat: el.lat,
          lon: el.lon,
          tags: el.tags,
        });
      } else if (el.type === 'way' && Array.isArray(el.nodes)) {
        ways.push({
          id: el.id,
          nodes: el.nodes,
          tags: el.tags,
        });
      }
    });

    const result: OsmQueryResult = {
      nodes,
      ways,
      totalNodes: nodes.length,
      fetchedAt: new Date().toLocaleTimeString() + ' IST',
    };

    osmCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.warn('Overpass API fetch failed, falling back to simulated OSM topology:', error);

    // Fallback simulated highway nodes for NH-10 corridor
    const fallbackNodes: OsmNode[] = [
      { id: 10001, lat: 26.7271, lon: 88.4315, tags: { highway: 'primary', name: 'NH-10 Siliguri Junction' } },
      { id: 10002, lat: 26.8500, lon: 88.4700, tags: { highway: 'primary', name: 'NH-10 Sevoke Bridge' } },
      { id: 10003, lat: 26.9800, lon: 88.5200, tags: { highway: 'primary', name: 'NH-10 Teesta Bazar' } },
      { id: 10004, lat: 27.0600, lon: 88.4700, tags: { highway: 'primary', name: 'NH-10 Kalimpong Crossing (Mile 29)' } },
      { id: 10005, lat: 27.1700, lon: 88.5100, tags: { highway: 'primary', name: 'NH-10 Rangpo Checkpost' } },
      { id: 10006, lat: 27.2400, lon: 88.5600, tags: { highway: 'primary', name: 'NH-10 Singtam' } },
      { id: 10007, lat: 27.3300, lon: 88.6100, tags: { highway: 'primary', name: 'NH-10 Gangtok Terminal' } },
    ];

    const result: OsmQueryResult = {
      nodes: fallbackNodes,
      ways: [],
      totalNodes: fallbackNodes.length,
      fetchedAt: new Date().toLocaleTimeString() + ' IST (Fallback)',
    };

    return result;
  }
};
