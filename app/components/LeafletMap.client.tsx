// @ts-expect-error Missing type definitions
import BaseMarkerCluster from "@changey/react-leaflet-markercluster";
import { DivIcon, divIcon, MapOptions, point } from "leaflet";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  FunctionComponent,
  Suspense,
} from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  ZoomControl,
  MapContainerProps,
} from "react-leaflet";
import L, { Icon, icon } from "leaflet";

import type { Listing, POSMarker } from "../types";
import { createLink, formatPrice } from "../utils";
import { Button } from "./ui/button";
import { LocateFixed } from "lucide-react";
import { useLoaderData } from "@remix-run/react";
import { loader } from "~/routes/_index";

const myLocationIcon = new DivIcon({
  html: `<span></span>`,
  className: "flex h-2 w-2 rounded-full bg-blue-600",
  iconSize: point(12, 12, true),
});

const listingIcon = new Icon({
  iconUrl: "/leaflet/marker.png",
  iconRetinaUrl: "/leaflet/marker.png",
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

const favoriteIcon = new Icon({
  iconUrl: "/leaflet/heart-icon.png",
  iconRetinaUrl: "/leaflet/heart-icon.png",
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

const createClusterCustomIcon = (cluster: any) => {
  return divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className:
      "bg-[#e74c3c] bg-opacity-100 text-white font-bold !flex items-center justify-center rounded-3xl border-white border-4 border-opacity-50",
    iconSize: point(40, 40, true),
  });
};

export const MarkerCluster: FunctionComponent<{
  children: ReactNode;
}> = ({ children }) => {
  return (
    <BaseMarkerCluster
      iconCreateFunction={createClusterCustomIcon}
      showCoverageOnHover={false}
    >
      {children}
    </BaseMarkerCluster>
  );
};

export function LeafletMapWithClusters({
  center,
  listings,
  posMarkers,
}: {
  center: [number, number];
  listings: Listing[];
  posMarkers: POSMarker[];
} & MapOptions) {
  const { favorites } = useLoaderData<typeof loader>();
  const favoritesSet = new Set(favorites.map((item) => item.list_id));
  const [myLocation, setMyLocation] = useState<[number, number] | null>(null);
  const detailsRef = useRef(null);

  function locateSelf() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMyLocation([position.coords.latitude, position.coords.longitude]);
      },
      (err) => console.error(err)
    );
  }

  useEffect(() => {
    locateSelf();
  }, []);

  useEffect(() => {
    if (detailsRef.current) {
      L.DomEvent.disableClickPropagation(detailsRef.current);
    }
  });

  return (
    <Suspense fallback={<div className="h-[200px]" />}>
      <MapContainer
        center={center}
        className="h-full w-full"
        zoom={13}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <ZoomControl position="topright" />
        {myLocation && (
          <Marker position={myLocation} icon={myLocationIcon}>
            <Popup>You are here!</Popup>
          </Marker>
        )}
        <MarkerCluster>
          {listings.map((marker, index) => {
            if (favoritesSet.has(marker.list_id)) {
              return (
                <Marker
                  icon={favoriteIcon}
                  key={index}
                  position={[marker.latitude, marker.longitude]}
                >
                  <Popup>
                    <img
                      src={marker.thumbnail_image}
                      width={300}
                      height={300}
                      className="aspect-square object-cover rounded-md"
                    ></img>

                    <p>{marker.subject}</p>
                    <p>{formatPrice(marker.price)}</p>
                    <div className="flex flex-col gap-2">
                      <a href={createLink(marker.list_id)} target="_blank">
                        Link to ChoTot
                      </a>
                      <a
                        href={`https://www.google.com/maps?q=${marker.latitude},${marker.longitude}`}
                      >
                        Link to Google Maps
                      </a>
                    </div>
                  </Popup>
                </Marker>
              );
            } else {
              return (
                <Marker
                  icon={listingIcon}
                  key={index}
                  position={[marker.latitude, marker.longitude]}
                >
                  <Popup>
                    <img
                      src={marker.thumbnail_image}
                      width={300}
                      height={300}
                      className="aspect-square object-cover rounded-md"
                    ></img>

                    <p>{marker.subject}</p>
                    <p>{formatPrice(marker.price)}</p>
                    <div className="flex flex-col gap-2">
                      <a href={createLink(marker.list_id)} target="_blank">
                        Link to ChoTot
                      </a>
                      <a
                        href={`https://www.google.com/maps?q=${marker.latitude},${marker.longitude}`}
                      >
                        Link to Google Maps
                      </a>
                    </div>
                  </Popup>
                </Marker>
              );
            }
          })}
        </MarkerCluster>

        {posMarkers.map((marker) => {
          const popup = (
            <Popup>
              <p>{marker.name}</p>
              <p>
                Avg. rating: <b>{marker.avg_rating}</b>
              </p>
              <p>
                Number of reviews: <b>{marker.num_of_reviews}</b>
              </p>
              <a href={marker.url} target="_blank">
                Link
              </a>
            </Popup>
          );

          switch (marker.type) {
            case "gym":
              return (
                <Marker
                  key={marker.id}
                  position={[marker.latitude, marker.longitude]}
                >
                  {popup}
                </Marker>
              );

            case "beach":
              return (
                <Marker
                  key={marker.id}
                  position={[marker.latitude, marker.longitude]}
                >
                  {popup}
                </Marker>
              );

            default:
              return (
                <Marker
                  key={marker.id}
                  position={[marker.latitude, marker.longitude]}
                >
                  {popup}
                </Marker>
              );
          }
        })}

        <Button
          onClick={locateSelf}
          variant="outline"
          size="icon"
          className="absolute bottom-6 right-[10px] z-[500]"
        >
          <LocateFixed className="h-4 w-4" />
        </Button>
      </MapContainer>
    </Suspense>
  );
}
