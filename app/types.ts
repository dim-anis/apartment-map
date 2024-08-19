export type Listing = {
  ad_id: number;
  list_id: number;
  list_time: number;
  state: string;
  type: string;
  account_name: string;
  region: number;
  category: number;
  subject: string;
  body: string;
  price: number;
  image: string;
  account_id: number;
  images: string[];
  videos: {
    id: string;
    thumbnail: string;
    url: string;
  }[];
  contain_videos: number;
  apartment_type: number;
  balconydirection: number;
  rooms: number;
  size: number;
  toilets: number;
  area: number;
  longitude: number;
  latitude: number;
  property_legal_document: number;
  pty_characteristics: string[];
  region_v2: number;
  area_v2: number;
  ward: number;
  street_number: string;
  unitnumber_display: number;
  deposit: number;
  street_name: string;
  location_id: string;
  unique_street_id: string;
  is_main_street: boolean;
  location: string;
  price_million_per_m2: number;
  protection_entitlement: boolean;
  label_campaigns: string[];
  pty_jupiter: number;
  inspection_images: string[];
  is_sticky: boolean;
  date: string;
  account_oid: string;
  category_name: string;
  area_name: string;
  region_name: string;
  price_string: string;
  webp_image: string;
  has_video: boolean;
  image_thumbnails: {
    image: string;
    thumbnail: string;
  }[];
  special_display_images: string[];
  number_of_images: number;
  ad_features: string[];
  avatar: string;
  ward_name: string;
  pty_map: string;
  pty_map_modifier: number;
  thumbnail_image: string;
  params: string[];
  ad_labels: string[];
};

export type GetRegionsResponse = {
  regionFollowId: {
    entities: {
      regions: {
        [regionId: string]: {
          id: string;
          geo_region: string;
          geo: string;
          name: string;
          area: {
            [areaId: string]: {
              id: string;
              name: string;
              name_url: string;
              geo_region: string;
              geo: string;
            };
          };
        };
      };
    };
  };
};

// CREATE TABLE markers (
//     id INTEGER PRIMARY KEY,
//     name TEXT NOT NULL,
//     url TEXT,
//     latitude REAL NOT NULL,
//     longitude REAL NOT NULL,
//     num_of_reviews INTEGER,
//     avg_rating REAL,
//     type_id INTEGER NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (type_id) REFERENCES marker_types(id)
// );
// """
export type POSMarker = {
  id: number;
  name: string;
  url: string;
  latitude: number;
  longitude: number;
  num_of_reviews: number;
  avg_rating: number;
  type: string;
  created_at: string;
  updated_at: string;
};

export type MarkerType = {
  id: number;
  type_name: string;
};

export type FavoriteListing = {
  id: number;
  list_id: number;
};
