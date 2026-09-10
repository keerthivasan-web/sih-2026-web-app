import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useCommand } from '../context/CommandContext';
import { fetchOsmRoadNetwork, OsmQueryResult } from '../services/osmService';
import L from 'leaflet';
import { 
  Layers, 
  MapPin, 
  AlertTriangle, 
  Truck, 
  RotateCcw, 
  CheckCircle2, 
  Compass,
  ArrowRight,
  Info,
  Globe,
  RefreshCw
} from 'lucide-react';

export const LiveMapView: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  const { 
    theme,
    routes, 
    shipments, 
    vehicles, 
    incidents, 
    selectedRoute, 
    setSelectedRoute, 
    selectedShipment, 
    setSelectedShipment,
    selectedVehicle,
    setSelectedVehicle,
    openRerouteModal,
    rerouteShipment,
    activeScenario,
    showToast,
    layers,
    toggleLayer
  } = useCommand();

  const [selectedAssetType, setSelectedAssetType] = useState<'route' | 'vehicle' | 'incident'>('route');
  const [osmData, setOsmData] = useState<OsmQueryResult | null>(null);
  const [isLoadingOsm, setIsLoadingOsm] = useState<boolean>(false);
  const [showOsmLayer, setShowOsmLayer] = useState<boolean>(true);

  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const handleFetchOsm = useCallback(async () => {
    setIsLoadingOsm(true);
    showToast('FETCHING OSM DATA', 'Querying live OpenStreetMap road network nodes via Overpass API...', 'safe');
    try {
      const data = await fetchOsmRoadNetwork([26.6, 88.3, 27.4, 88.8]);
      setOsmData(data);
      showToast('OSM NETWORK LOADED', `Received ${data.totalNodes} live highway nodes from OpenStreetMap API.`, 'safe');
    } catch (e) {
      showToast('OSM FETCH ERROR', 'Unable to reach Overpass API.', 'alert');
    } finally {
      setIsLoadingOsm(false);
    }
  }, [showToast]);

  // North East India center coordinates: Siliguri - Assam corridor
  const defaultCenter: [number, number] = [26.6, 90.5];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 7,
        zoomControl: false,
      });

      const tileUrl = theme === 'dark' 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

      const tileLayer = L.tileLayer(tileUrl, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 18,
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      leafletMapRef.current = map;
      markersRef.current = L.layerGroup().addTo(map);
    } else if (tileLayerRef.current) {
      const tileUrl = theme === 'dark' 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
      tileLayerRef.current.setUrl(tileUrl);
    }

    const map = leafletMapRef.current;
    const markersGroup = markersRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // 1. Draw Routes Polyline
    if (layers.roads) {
      routes.forEach((route) => {
        const latlngs = route.waypoints.map(wp => [wp.lat, wp.lng] as [number, number]);
        
        let color = '#16a34a'; // Green: Safe / Open
        let weight = 4;
        let dashArray: string | undefined = undefined;

        if (route.status === 'BLOCKED') {
          color = '#dc2626'; // Red: Blocked
          weight = 6;
          dashArray = '8, 6';
        } else if (route.status === 'HIGH-RISK') {
          color = '#ea580c'; // Orange: High Risk
          weight = 5;
        } else if (route.status === 'DEGRADED') {
          color = '#ca8a04'; // Yellow: Degraded
          weight = 4;
        } else if (route.isAlternative) {
          color = '#2563eb'; // Blue: Alternative / Information
          weight = 4;
          dashArray = '4, 4';
        }

        const polyline = L.polyline(latlngs, {
          color,
          weight,
          dashArray,
          opacity: 0.9,
        }).addTo(markersGroup);

        polyline.on('click', () => {
          setSelectedRoute(route);
          setSelectedAssetType('route');
          showToast('ROUTE SELECTED', `${route.name} (${route.status})`, route.status === 'BLOCKED' ? 'critical' : 'safe');
        });
      });
    }

    // 2. Draw Incidents
    if (layers.incidents) {
      incidents.forEach((inc) => {
        const isCritical = inc.severity === 'CRITICAL' || inc.type === 'LANDSLIDE';
        const bgColor = isCritical ? '#dc2626' : '#ea580c';
        
        const iconHtml = `
          <div style="background-color: ${bgColor}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid #ffffff; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);" class="${isCritical ? 'animate-bounce' : ''}">
            !
          </div>
        `;
        const customIcon = L.divIcon({
          className: 'custom-incident-marker',
          html: iconHtml,
          iconSize: [24, 24],
        });

        const marker = L.marker([inc.gps.lat, inc.gps.lng], { icon: customIcon }).addTo(markersGroup);
        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px;">
            <div style="font-size: 10px; font-weight: bold; color: ${bgColor};">● INCIDENT ${inc.id}</div>
            <div style="font-weight: bold; font-size: 12px; margin: 4px 0; color: #0f172a;">${inc.title}</div>
            <div style="font-size: 11px; color: #475569;">${inc.location}</div>
            <div style="font-size: 11px; margin-top: 4px; font-weight: 600; color: #dc2626;">Route: ${inc.routeName}</div>
          </div>
        `);
      });
    }

    // 3. Draw Vehicles
    if (layers.vehicles) {
      vehicles.forEach((veh) => {
        const isHalted = veh.status === 'HALTED' || veh.riskLevel === 'CRITICAL';
        const iconColor = isHalted ? '#dc2626' : '#2563eb';
        
        const iconHtml = `
          <div style="background-color: ${iconColor}; width: 22px; height: 22px; border-radius: 50%; border: 2px solid #ffffff; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.25);">
            🚚
          </div>
        `;

        const customIcon = L.divIcon({
          className: 'custom-veh-marker',
          html: iconHtml,
          iconSize: [22, 22],
        });

        const marker = L.marker([veh.lat, veh.lng], { icon: customIcon }).addTo(markersGroup);
        marker.on('click', () => {
          setSelectedVehicle(veh);
          setSelectedAssetType('vehicle');
        });
        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px;">
            <div style="font-size: 10px; font-weight: bold; color: ${iconColor};">● VEHICLE ${veh.id}</div>
            <div style="font-weight: bold; font-size: 12px; color: #0f172a;">${veh.vehicleNumber}</div>
            <div style="font-size: 11px; color: #475569;">Driver: ${veh.driverName} (${veh.driverPhone})</div>
            <div style="font-size: 11px; margin-top: 4px; color: #0284c7; font-weight: 600;">Cargo: ${veh.commodity}</div>
            <div style="font-size: 11px; color: ${isHalted ? '#dc2626' : '#16a34a'}; font-weight: bold;">Status: ${veh.status} (${veh.speedKmh} km/h)</div>
          </div>
        `);
      });
    }

    // 4. Draw Live OSM Highway Nodes
    if (showOsmLayer && osmData && osmData.nodes.length > 0) {
      osmData.nodes.forEach((node) => {
        const circle = L.circleMarker([node.lat, node.lon], {
          radius: 4,
          fillColor: '#06b6d4',
          color: '#0891b2',
          weight: 1.5,
          opacity: 0.9,
          fillOpacity: 0.7,
        }).addTo(markersGroup);

        circle.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px;">
            <div style="font-size: 10px; font-weight: bold; color: #0891b2;">🌐 OSM LIVE HIGHWAY NODE</div>
            <div style="font-weight: bold; font-size: 12px; color: #0f172a; margin-top: 2px;">Node ID: #${node.id}</div>
            <div style="font-size: 11px; color: #475569;">Tags: ${node.tags?.name || node.tags?.highway || 'Highway Point'}</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 2px;">GPS: ${node.lat.toFixed(4)}, ${node.lon.toFixed(4)}</div>
          </div>
        `);
      });
    }
  }, [routes, incidents, vehicles, layers, osmData, showOsmLayer, setSelectedRoute, setSelectedVehicle, showToast]);

  const activeRoute = selectedRoute || routes[0];
  const medShipment = shipments.find(s => s.id === 'MED-2045') || shipments[0];
  const isNh10Blocked = routes.find(r => r.id === 'ROUTE-NH-10')?.status === 'BLOCKED' || activeScenario === 'LANDSLIDE';

  return (
    <div className="flex flex-col w-full space-y-4 pb-12 transition-colors duration-300">
      {/* Top Header & Layer Toggles */}
      <div className="bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800">
            <Compass className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              Live GIS Route Intelligence Map
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive vector telemetry layers for North Eastern Region corridors
            </p>
          </div>
        </div>

        {/* Action Controls & Layer Switches */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Live OpenStreetMap Fetcher Button */}
          <button
            onClick={handleFetchOsm}
            disabled={isLoadingOsm}
            className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-950/80 dark:hover:bg-cyan-900 text-white dark:text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-50"
            title="Fetch real OpenStreetMap road nodes via Overpass API"
          >
            {isLoadingOsm ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Globe className="w-3.5 h-3.5 text-cyan-200" />
            )}
            <span>{osmData ? `OSM Nodes (${osmData.totalNodes})` : 'Fetch Live OSM Nodes'}</span>
          </button>
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Layers:
          </span>

          <button
            onClick={() => toggleLayer('roads')}
            className={`px-2.5 py-1 rounded text-xs font-semibold border transition-all ${
              layers.roads ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            🛣 Roads
          </button>

          <button
            onClick={() => toggleLayer('vehicles')}
            className={`px-2.5 py-1 rounded text-xs font-semibold border transition-all ${
              layers.vehicles ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            🚚 Vehicles ({vehicles.length})
          </button>

          <button
            onClick={() => toggleLayer('incidents')}
            className={`px-2.5 py-1 rounded text-xs font-semibold border transition-all ${
              layers.incidents ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            ⚠ Hazards ({incidents.length})
          </button>
        </div>
      </div>

      {/* Map + Side Inspector Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Leaflet Map Stage */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[420px] sm:h-[600px] relative transition-colors">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Floating Color Legend on Map */}
          {/* Floating Map Legend Overlay */}
          <div className="absolute bottom-4 left-4 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md text-xs transition-colors duration-300">
            <span className="font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px] block mb-2">
              Corridor Status Key
            </span>
            <div className="space-y-1.5 font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-slate-700 dark:text-slate-300">Green = Safe / Open</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="text-slate-700 dark:text-slate-300">Yellow = Degraded</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                <span className="text-slate-700 dark:text-slate-300">Orange = High Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-600"></span>
                <span className="text-slate-700 dark:text-slate-300">Red = Blocked</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                <span className="text-slate-700 dark:text-slate-300">Blue = Alternate Bypass</span>
              </div>
            </div>
          </div>

          {/* Emergency Alert Banner Overlay (when Landslide active) */}
          {isNh10Blocked && (
            <div className="absolute top-4 left-4 right-4 z-20 bg-red-600/95 dark:bg-red-900/90 backdrop-blur-md text-white px-4 py-3 rounded-xl shadow-lg flex items-center justify-between gap-3 animate-pulse-subtle border border-red-500/40">
              <div className="flex items-center gap-2.5 min-w-0">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-bounce text-amber-300" />
                <div className="text-xs truncate">
                  <strong className="font-extrabold uppercase tracking-wide">Emergency Road Blockage:</strong> NH-10 closed at Mile 29. Critical medical shipment MED-2045 halted.
                </div>
              </div>

              {medShipment.status !== 'REROUTED' ? (
                <button
                  onClick={() => rerouteShipment('MED-2045', 'ROUTE-ALT-B')}
                  className="px-3.5 py-1.5 rounded-lg bg-white text-red-700 font-extrabold text-xs hover:bg-red-50 transition-all shadow-xs flex-shrink-0"
                >
                  USE SAFER ROUTE
                </button>
              ) : (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white font-extrabold text-xs flex-shrink-0">
                  REROUTED VIA ALT-B
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right Side Inspector & Intelligence Panel */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Route / Asset Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col justify-between transition-colors duration-300">
            <div>
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Selected Corridor</span>
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-extrabold border ${
                  activeRoute.status === 'BLOCKED' 
                    ? 'bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800' 
                    : activeRoute.status === 'HIGH-RISK' 
                    ? 'bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800' 
                    : activeRoute.status === 'DEGRADED' 
                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800' 
                    : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                }`}>
                  {activeRoute.status}
                </span>
              </div>

              <div className="mt-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white">{activeRoute.name}</h3>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{activeRoute.origin} → {activeRoute.destination}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Distance:</span>
                  <div className="font-extrabold text-slate-800 dark:text-slate-200">{activeRoute.distanceKm} km</div>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Standard ETA:</span>
                  <div className="font-extrabold text-slate-800 dark:text-slate-200">{Math.floor(activeRoute.stdEtaMinutes / 60)}h {activeRoute.stdEtaMinutes % 60}m</div>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Risk Score:</span>
                  <div className={`font-extrabold ${activeRoute.riskScore > 70 ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {activeRoute.riskScore}%
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Rainfall:</span>
                  <div className="font-extrabold text-slate-800 dark:text-slate-200">{activeRoute.precipitationMmHr} mm/hr</div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                {activeRoute.description}
              </p>
            </div>

            {/* Quick Route Switcher */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-2">Quick Switch Corridor:</span>
              <div className="flex flex-wrap gap-1.5">
                {routes.slice(0, 4).map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setSelectedRoute(r);
                      setSelectedAssetType('route');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                      r.id === activeRoute.id 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {r.code}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Critical Shipment Watch Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm transition-colors duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Critical Cargo Watch</span>
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-extrabold border ${
                medShipment.status === 'AT RISK' 
                  ? 'bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 animate-pulse' 
                  : medShipment.status === 'REROUTED'
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
              }`}>
                {medShipment.status}
              </span>
            </div>

            <div className="mt-3">
              <div className="text-xs font-extrabold text-slate-900 dark:text-white">{medShipment.id}: {medShipment.commodity}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Vehicle: {medShipment.vehicleId} • Driver: {medShipment.driverName}</div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1.5">ETA: {medShipment.eta}</div>
            </div>

            {isNh10Blocked && medShipment.status !== 'REROUTED' && (
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => rerouteShipment('MED-2045', 'ROUTE-ALT-B')}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <span>AUTHORIZE SAFER ROUTE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
