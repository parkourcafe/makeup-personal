export type LookRole = {
  id: number;
  look_id: number;
  role_key: string;
  title: string;
  description: string;
  required: boolean;
  native_category: string;
  accepted_categories: string[];
  accepted_color_families: string[];
  accepted_undertones: string[];
  accepted_finishes: string[];
  accepted_textures: string[];
  accepted_coverage: string[];
  intensity_min: number | null;
  intensity_max: number | null;
  sort_order: number;
};

export type Look = {
  id: number;
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  occasion: string;
  reference_image_url: string | null;
  is_active: boolean;
  roles: LookRole[];
};

export type TutorialStep = {
  id: number;
  tutorial_id: number;
  look_role_id: number | null;
  step_number: number;
  title: string;
  instruction: string;
  technique_tip: string | null;
  common_mistake: string | null;
};

export type Tutorial = {
  id: number;
  look_id: number;
  title: string;
  summary: string;
  steps: TutorialStep[];
};

export type Store = {
  id: number;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
};

export type StoreOffer = {
  id: number;
  store_id: number;
  product_name: string;
  brand: string;
  category: string;
  color_family: string | null;
  price: number;
  currency: string;
  availability_status: string;
  source_label: string;
  store: Store | null;
};

export type Vocabulary = {
  categories: string[];
  color_families: string[];
  undertones: string[];
  finishes: string[];
  textures: string[];
  coverage: string[];
  sources: string[];
  offer_statuses: string[];
};
