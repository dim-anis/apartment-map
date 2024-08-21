import { Row } from "@libsql/client";
import {
  ActionFunctionArgs,
  json,
  LinksFunction,
  LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { useLoaderData, useLocation, useSearchParams } from "@remix-run/react";
import { marker } from "leaflet";
import { useState } from "react";
import { ClientOnly } from "remix-utils/client-only";
import { LeafletMapWithClusters } from "~/components/LeafletMap.client";
import ListingList from "~/components/ListingList";
import { DN_GEO_LOC } from "~/constants";
import { turso } from "~/turso";
import invariant from "tiny-invariant";
import {
  FavoriteListing,
  GetRegionsResponse,
  Listing,
  MarkerType,
  POSMarker,
} from "~/types";
import { addToFavorites, getFavorites } from "~/data";

export const meta: MetaFunction = () => {
  return [
    { title: "Apartments for rent in Da Nang" },
    {
      name: "description",
      content:
        "Find the best apartment for rent for you in Da Nang, Vietnam. Utilize dozens of filters to find the perfect location whether it's next to a gym or a co-working place.",
    },
  ];
};

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "https://unpkg.com/leaflet@1.8.0/dist/leaflet.css",
  },
];

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const listingId = formData.get("listingId");
  const favorite = formData.get("favorite") === "true";

  if (!listingId) {
    return json({ error: "Listing ID is required" }, { status: 400 });
  }

  return addToFavorites(Number(listingId));
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const BASE_URL = process.env.CHO_BASE_URL || "";
  const GET_REGIONS_ENDPOINT = process.env.GET_REGIONS_ENDPOINT || "";

  type SearchParams = {
    limit?: string;
    outset?: string;
    price?: string;
    area_v2?: string;
  };

  function constructUrl(
    baseUrl: string,
    { limit = "50", outset = "50", price, area_v2 }: SearchParams
  ) {
    const url = new URL(baseUrl);

    url.searchParams.set("limit", limit);
    url.searchParams.set("outset", outset);

    price && url.searchParams.set("price", price);
    area_v2 && url.searchParams.set("area_v2", area_v2);

    return url;
  }

  async function getAllListings({
    price,
    area_v2,
  }: {
    price: string;
    area_v2: string;
  }) {
    const ads = [];

    let limit = "50";
    let outset = "0";

    const response = await fetch(
      constructUrl(BASE_URL, { limit, outset, price, area_v2 })
    );
    const data = (await response.json()) as any as {
      total: number;
      ads: Listing[];
    };

    let numOfAds = ads.push(...data.ads);

    while (numOfAds < data.total) {
      outset = (Number(outset) + 50).toString();
      const response = await fetch(
        constructUrl(BASE_URL, { limit, outset, price, area_v2 })
      );
      const data = (await response.json()) as any as {
        total: number;
        ads: Listing[];
      };

      numOfAds = ads.push(...data.ads);

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    return { total: ads.length, ads };
  }

  async function getListings({
    price,
    area_v2,
  }: {
    price: string;
    area_v2: string;
  }) {
    const ads = [];

    let limit = "50";
    let outset = "0";

    const response = await fetch(
      constructUrl(BASE_URL, { limit, outset, price, area_v2 })
    );
    const data = (await response.json()) as any as {
      total: number;
      ads: Listing[];
    };

    let numOfAds = ads.push(...data.ads);

    return { total: ads.length, ads };
  }

  const getRegions = async () => {
    const res = await fetch(GET_REGIONS_ENDPOINT);
    return (await res.json()) as GetRegionsResponse;
  };
  const url = new URL(request.url);
  const minPrice = url.searchParams.get("minPrice") || "0";
  const maxPrice = url.searchParams.get("maxPrice") || "*";
  const priceRange = `${minPrice}-${maxPrice}`;
  const district = url.searchParams.get("district") || "";
  const markers = url.searchParams.get("markers") || "";

  const [
    listingsData,
    regionsData,
    markersData,
    markerTypesData,
    favoritesData,
  ] = await Promise.all([
    // getListings({ price: priceRange, area_v2: district }),
    getAllListings({ price: priceRange, area_v2: district }),
    getRegions(),
    turso.execute(`SELECT * from markers WHERE type_id IN (${markers})`),
    turso.execute(`SELECT * from marker_types`),
    getFavorites(),
  ]);

  const posMarkers = markersData.rows as any as POSMarker[];
  const markerTypes = markerTypesData.rows as any as MarkerType[];
  const favorites = favoritesData.rows as any as FavoriteListing[];

  return json({
    listings: listingsData.ads,
    regions: regionsData,
    markers: posMarkers,
    markerTypes,
    favorites,
  });
};

export default function Index() {
  const [center, setCenter] = useState(DN_GEO_LOC);
  const [searchParams] = useSearchParams();
  const districtId = searchParams.get("district");

  const { listings, regions, markers } = useLoaderData<typeof loader>();

  const districtName = districtId
    ? regions.regionFollowId.entities.regions["3017"].area[districtId].name
    : "";

  return (
    <div className="h-screen">
      <ListingList data={listings} districtName={districtName} />
      <ClientOnly>
        {() => (
          <LeafletMapWithClusters
            listings={listings}
            posMarkers={markers}
            center={center}
          />
        )}
      </ClientOnly>
    </div>
  );
}
