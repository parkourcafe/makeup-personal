export type MatchStatus = "enough" | "use_differently" | "not_suitable" | "missing" | "needs_confirmation";
export type OverallStatus = "ready_now" | "needs_confirmation" | "shopping_gaps";

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

export type UserProduct = {
  id: number;
  user_id: number;
  brand: string;
  name: string;
  category: string;
  color_family: string | null;
  undertone: string | null;
  finish: string | null;
  texture: string | null;
  coverage: string | null;
  intensity: number | null;
  is_multi_use_safe: boolean;
  source: string;
  confidence: number | null;
  expires_at: string | null;
};

export type ProductCreate = Omit<UserProduct, "id" | "user_id">;

export type ShoppingGap = {
  needed_category: string;
  needed_description: string;
};

export type RoleMatch = {
  look_role_id: number;
  role_key: string;
  required: boolean;
  status: MatchStatus;
  score: number;
  matched_product_id: number | null;
  reason: string;
  how_to_use: string | null;
  shopping_gap: ShoppingGap | null;
};

export type ReadinessReport = {
  user_id: number;
  look_id: number;
  overall_status: OverallStatus;
  readiness_score: number;
  role_matches: RoleMatch[];
};

export type RootStackParamList = {
  LookLibrary: undefined;
  LookDetail: { lookId: number };
  MakeupBag: { lookId: number };
  ReadinessReport: { lookId: number };
  TutorialPlayer: { lookId: number };
};
