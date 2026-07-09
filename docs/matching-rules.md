# Matching Rules

The matcher is deterministic. It does not use ML, random scoring, hidden weights, or shopping-first recommendations.

## Vocabulary

- `look`: a curated makeup look.
- `look_role`: one required or optional cosmetic role in a look.
- `user_product`: one manually entered item from the user's makeup bag.
- `product_candidate`: a user product being evaluated for a look role.
- `match_status`: the role-level result.
- `readiness_report`: the full look readiness result for one user.
- `shopping_gap`: a role that needs a product recommendation because the user is missing or owns only unsuitable products.
- `needs_confirmation`: returned when the app cannot safely decide from available attributes.

## Status Precedence

For each `look_role`, products are evaluated in this order:

1. `enough`: an owned product has an accepted category and satisfies all role constraints.
2. `use_differently`: an owned product is marked `is_multi_use_safe`, is allowed by the cross-use map, and satisfies all non-category role constraints.
3. `needs_confirmation`: a relevant product may fit, but confidence is below `0.70` or a role-required attribute is missing.
4. `not_suitable`: a relevant owned product exists, but it fails a deterministic role constraint.
5. `missing`: no relevant owned product can cover the role.

The app never invents a match when required information is uncertain. It returns `needs_confirmation`.

## Direct Match Rules

A product is `enough` for a role when all of these are true:

- `user_product.category` is in `look_role.accepted_categories`.
- If `accepted_color_families` is non-empty, `color_family` must be included.
- If `accepted_undertones` is non-empty, `undertone` must be included.
- If `accepted_finishes` is non-empty, `finish` must be included.
- If `accepted_textures` is non-empty, `texture` must be included.
- If `accepted_coverage` is non-empty, `coverage` must be included.
- If `intensity_min` and `intensity_max` are set, product `intensity` must be inside the inclusive range.
- `confidence` must be at least `0.70`.

## Safe Adaptation Rules

The only cross-category adaptations allowed in Pass 1 are:

- lipstick or lip tint for blush
- bronzer for eyeshadow
- eyeliner for eyeshadow

A product can be `use_differently` only when:

- `is_multi_use_safe` is true;
- its category is allowed for the role's `native_category`;
- it satisfies all non-category constraints;
- confidence is at least `0.70`.

## Needs Confirmation Rules

Return `needs_confirmation` for a relevant product when:

- `confidence` is missing or below `0.70`;
- the role requires `color_family`, `undertone`, `finish`, `texture`, `coverage`, or `intensity`, and the product is missing that value.

## Shopping Gap Rules

A required role creates a `shopping_gap` only when its status is:

- `missing`
- `not_suitable`

`needs_confirmation` does not create a shopping gap yet because the user may already own a suitable product.

## Overall Status Rules

The readiness report uses this precedence:

1. `shopping_gaps` if any required role is `missing` or `not_suitable`.
2. `needs_confirmation` if no shopping gaps exist, but any required role is `needs_confirmation`.
3. `ready_now` when all required roles are `enough` or `use_differently`.

The readiness score is the average score of required roles:

- `enough`: 100
- `use_differently`: 80
- `needs_confirmation`: 40
- `not_suitable`: 20
- `missing`: 0

## Golden Cases

Seeded demo data contains these expected cases for the `soft-rose-everyday` look:

- `enough`: Bobbi Brown Vitamin Enriched Face Base covers skin prep.
- `use_differently`: Romanovamakeup Sexy Lipstick Pen Rose can be used as cream blush.
- `not_suitable`: owned lip color does not satisfy the nude glossy lip role.
- `missing`: no owned product covers glow balm.
- `needs_confirmation`: Natasha Denona Mini Nude Matte Brown has low confidence for soft liner.
