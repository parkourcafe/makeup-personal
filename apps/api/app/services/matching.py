from dataclasses import dataclass

from app.models import Look, LookRole, UserProduct
from app.schemas.domain import ReadinessReport, RoleMatch, ShoppingGap


CONFIDENCE_THRESHOLD = 0.70
STATUS_SCORES = {
    "enough": 100,
    "use_differently": 80,
    "needs_confirmation": 40,
    "not_suitable": 20,
    "missing": 0,
}
CROSS_USE_BY_NATIVE_CATEGORY = {
    "blush": {"lipstick", "lip_tint"},
    "eyeshadow": {"bronzer", "eyeliner"},
}


@dataclass(frozen=True)
class CandidateEvaluation:
    status: str
    score: int
    product: UserProduct | None
    reason: str
    how_to_use: str | None


def build_readiness_report(look: Look, products: list[UserProduct], user_id: int) -> ReadinessReport:
    role_matches = [_match_role(role, products) for role in look.roles]
    required_matches = [match for match in role_matches if match.required]

    if any(match.status in {"missing", "not_suitable"} for match in required_matches):
        overall_status = "shopping_gaps"
    elif any(match.status == "needs_confirmation" for match in required_matches):
        overall_status = "needs_confirmation"
    else:
        overall_status = "ready_now"

    readiness_score = 0
    if required_matches:
        readiness_score = round(sum(match.score for match in required_matches) / len(required_matches))

    return ReadinessReport(
        user_id=user_id,
        look_id=look.id,
        overall_status=overall_status,
        readiness_score=readiness_score,
        role_matches=role_matches,
    )


def _match_role(role: LookRole, products: list[UserProduct]) -> RoleMatch:
    enough: list[CandidateEvaluation] = []
    use_differently: list[CandidateEvaluation] = []
    needs_confirmation: list[CandidateEvaluation] = []
    not_suitable: list[CandidateEvaluation] = []

    for product in products:
        if _is_direct_category_match(role, product):
            evaluation = _evaluate_direct_candidate(role, product)
        elif _is_cross_use_candidate(role, product):
            evaluation = _evaluate_cross_use_candidate(role, product)
        else:
            continue

        if evaluation.status == "enough":
            enough.append(evaluation)
        elif evaluation.status == "use_differently":
            use_differently.append(evaluation)
        elif evaluation.status == "needs_confirmation":
            needs_confirmation.append(evaluation)
        elif evaluation.status == "not_suitable":
            not_suitable.append(evaluation)

    chosen = _choose_best(enough) or _choose_best(use_differently) or _choose_best(needs_confirmation) or _choose_best(not_suitable)
    if chosen is None:
        chosen = CandidateEvaluation(
            status="missing",
            score=STATUS_SCORES["missing"],
            product=None,
            reason="No owned product matches or can safely adapt to this role.",
            how_to_use=None,
        )

    shopping_gap = None
    if role.required and chosen.status in {"missing", "not_suitable"}:
        shopping_gap = ShoppingGap(
            gap_id=f"look-{role.look_id}-role-{role.id}",
            needed_category=role.native_category,
            needed_description=f"{role.title}: {role.description}",
        )

    return RoleMatch(
        look_role_id=role.id,
        role_key=role.role_key,
        required=role.required,
        status=chosen.status,
        score=chosen.score,
        matched_product_id=chosen.product.id if chosen.product else None,
        reason=chosen.reason,
        how_to_use=chosen.how_to_use,
        shopping_gap=shopping_gap,
    )


def _choose_best(evaluations: list[CandidateEvaluation]) -> CandidateEvaluation | None:
    if not evaluations:
        return None
    return sorted(
        evaluations,
        key=lambda item: (item.score, -(item.product.id if item.product else 0)),
        reverse=True,
    )[0]


def _evaluate_direct_candidate(role: LookRole, product: UserProduct) -> CandidateEvaluation:
    confirmation_reason = _confirmation_reason(role, product)
    if confirmation_reason:
        return CandidateEvaluation(
            status="needs_confirmation",
            score=STATUS_SCORES["needs_confirmation"],
            product=product,
            reason=confirmation_reason,
            how_to_use=f"Confirm details for {product.brand} {product.name} before using it for {role.title}.",
        )

    failure_reason = _constraint_failure_reason(role, product)
    if failure_reason:
        return CandidateEvaluation(
            status="not_suitable",
            score=STATUS_SCORES["not_suitable"],
            product=product,
            reason=failure_reason,
            how_to_use=None,
        )

    return CandidateEvaluation(
        status="enough",
        score=STATUS_SCORES["enough"],
        product=product,
        reason="Category, color, finish, texture, coverage, and intensity fit this role.",
        how_to_use=f"Use {product.brand} {product.name} for {role.title}.",
    )


def _evaluate_cross_use_candidate(role: LookRole, product: UserProduct) -> CandidateEvaluation:
    confirmation_reason = _confirmation_reason(role, product)
    if confirmation_reason:
        return CandidateEvaluation(
            status="needs_confirmation",
            score=STATUS_SCORES["needs_confirmation"],
            product=product,
            reason=confirmation_reason,
            how_to_use=f"Confirm details for {product.brand} {product.name} before adapting it for {role.title}.",
        )

    failure_reason = _constraint_failure_reason(role, product, include_category=False)
    if failure_reason:
        return CandidateEvaluation(
            status="not_suitable",
            score=STATUS_SCORES["not_suitable"],
            product=product,
            reason=failure_reason,
            how_to_use=None,
        )

    return CandidateEvaluation(
        status="use_differently",
        score=STATUS_SCORES["use_differently"],
        product=product,
        reason=f"{product.category} is marked multi-use safe and can adapt to {role.native_category}.",
        how_to_use=f"Use a small amount of {product.brand} {product.name} for {role.title}; build gradually.",
    )


def _confirmation_reason(role: LookRole, product: UserProduct) -> str | None:
    if product.confidence is None or product.confidence < CONFIDENCE_THRESHOLD:
        return f"Product confidence is below {CONFIDENCE_THRESHOLD:.2f}."

    checks = [
        ("color_family", role.accepted_color_families),
        ("undertone", role.accepted_undertones),
        ("finish", role.accepted_finishes),
        ("texture", role.accepted_textures),
        ("coverage", role.accepted_coverage),
    ]
    for attribute, accepted_values in checks:
        if accepted_values and _is_blank(getattr(product, attribute)):
            return f"Confirm product {attribute} before matching this role."

    if role.intensity_min is not None and role.intensity_max is not None and product.intensity is None:
        return "Confirm product intensity before matching this role."

    return None


def _constraint_failure_reason(role: LookRole, product: UserProduct, include_category: bool = True) -> str | None:
    if include_category and not _is_direct_category_match(role, product):
        return f"Category '{product.category}' is not accepted for this role."

    checks = [
        ("color_family", role.accepted_color_families),
        ("undertone", role.accepted_undertones),
        ("finish", role.accepted_finishes),
        ("texture", role.accepted_textures),
        ("coverage", role.accepted_coverage),
    ]
    for attribute, accepted_values in checks:
        value = getattr(product, attribute)
        if accepted_values and value not in accepted_values:
            return f"{attribute} '{value}' is not accepted for this role."

    if role.intensity_min is not None and product.intensity is not None and product.intensity < role.intensity_min:
        return f"intensity {product.intensity} is below the role range."
    if role.intensity_max is not None and product.intensity is not None and product.intensity > role.intensity_max:
        return f"intensity {product.intensity} is above the role range."

    return None


def _is_direct_category_match(role: LookRole, product: UserProduct) -> bool:
    return product.category in set(role.accepted_categories or [])


def _is_cross_use_candidate(role: LookRole, product: UserProduct) -> bool:
    if not product.is_multi_use_safe:
        return False
    allowed_categories = CROSS_USE_BY_NATIVE_CATEGORY.get(role.native_category, set())
    return product.category in allowed_categories


def _is_blank(value: str | None) -> bool:
    return value is None or value.strip() == ""
