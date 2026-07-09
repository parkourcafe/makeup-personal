from sqlalchemy import delete
from sqlalchemy.orm import Session

from app.models import Look, LookRole, Tutorial, TutorialStep, User, UserProduct


def seed_demo_data(db: Session, reset: bool = True) -> None:
    if reset:
        _reset(db)

    user = User(
        display_name="Demo User",
        language="en",
        skin_depth="light-medium",
        skin_undertone="neutral",
    )
    db.add(user)
    db.flush()

    for product in _demo_products(user.id):
        db.add(UserProduct(**product))

    for look_data in _looks():
        _create_look(db, look_data)

    db.commit()


def _reset(db: Session) -> None:
    for model in [UserProduct, TutorialStep, Tutorial, LookRole, Look, User]:
        db.execute(delete(model))
    db.commit()


def _create_look(db: Session, data: dict) -> None:
    roles_by_key: dict[str, LookRole] = {}
    look = Look(
        slug=data["slug"],
        title=data["title"],
        description=data["description"],
        difficulty=data["difficulty"],
        occasion=data["occasion"],
        reference_image_url=data["reference_image_url"],
        is_active=True,
    )
    db.add(look)
    db.flush()

    for sort_order, role_data in enumerate(data["roles"], start=1):
        role = LookRole(look_id=look.id, sort_order=sort_order, **role_data)
        db.add(role)
        roles_by_key[role.role_key] = role
    db.flush()

    tutorial = Tutorial(
        look_id=look.id,
        title=data["tutorial"]["title"],
        summary=data["tutorial"]["summary"],
    )
    db.add(tutorial)
    db.flush()

    for step_number, step_data in enumerate(data["tutorial"]["steps"], start=1):
        role_key = step_data.pop("role_key")
        db.add(
            TutorialStep(
                tutorial_id=tutorial.id,
                look_role_id=roles_by_key[role_key].id if role_key else None,
                step_number=step_number,
                **step_data,
            )
        )


def _role(
    role_key: str,
    title: str,
    description: str,
    native_category: str,
    accepted_categories: list[str],
    accepted_color_families: list[str] | None = None,
    accepted_undertones: list[str] | None = None,
    accepted_finishes: list[str] | None = None,
    accepted_textures: list[str] | None = None,
    accepted_coverage: list[str] | None = None,
    intensity_min: int | None = None,
    intensity_max: int | None = None,
    required: bool = True,
) -> dict:
    return {
        "role_key": role_key,
        "title": title,
        "description": description,
        "required": required,
        "native_category": native_category,
        "accepted_categories": accepted_categories,
        "accepted_color_families": accepted_color_families or [],
        "accepted_undertones": accepted_undertones or [],
        "accepted_finishes": accepted_finishes or [],
        "accepted_textures": accepted_textures or [],
        "accepted_coverage": accepted_coverage or [],
        "intensity_min": intensity_min,
        "intensity_max": intensity_max,
    }


def _step(
    role_key: str | None,
    title: str,
    instruction: str,
    technique_tip: str,
    common_mistake: str,
) -> dict:
    return {
        "role_key": role_key,
        "title": title,
        "instruction": instruction,
        "technique_tip": technique_tip,
        "common_mistake": common_mistake,
    }


def _looks() -> list[dict]:
    return [
        {
            "slug": "soft-rose-everyday",
            "title": "Soft Rose Everyday",
            "description": "A wearable rose-toned look with clean skin, soft definition, and a gentle lip.",
            "difficulty": "beginner",
            "occasion": "daily",
            "reference_image_url": "https://example.com/reference/soft-rose-everyday.jpg",
            "roles": [
                _role(
                    "skin_prep",
                    "Grip and glow skin prep",
                    "A light primer or gripping base that keeps skin fresh without heavy coverage.",
                    "primer",
                    ["primer"],
                    accepted_color_families=["clear"],
                    accepted_finishes=["dewy", "natural"],
                    accepted_textures=["cream", "gel"],
                    intensity_min=0,
                    intensity_max=2,
                ),
                _role(
                    "fresh_base",
                    "Fresh neutral base",
                    "Light neutral base coverage that evens skin while keeping texture visible.",
                    "foundation",
                    ["foundation", "skin_tint"],
                    accepted_color_families=["beige"],
                    accepted_undertones=["neutral"],
                    accepted_finishes=["natural", "dewy"],
                    accepted_textures=["liquid", "cream"],
                    accepted_coverage=["light", "medium"],
                    intensity_min=1,
                    intensity_max=4,
                ),
                _role(
                    "cream_blush",
                    "Soft rose cream blush",
                    "A rosy cream flush placed high on the cheeks.",
                    "blush",
                    ["blush"],
                    accepted_color_families=["rose", "pink"],
                    accepted_undertones=["neutral", "cool"],
                    accepted_finishes=["satin", "dewy"],
                    accepted_textures=["cream", "liquid"],
                    accepted_coverage=["sheer", "medium"],
                    intensity_min=2,
                    intensity_max=5,
                ),
                _role(
                    "soft_liner",
                    "Soft brown definition",
                    "Matte brown shadow or liner pressed close to the lash line.",
                    "eyeshadow",
                    ["eyeshadow", "eyeliner"],
                    accepted_color_families=["brown"],
                    accepted_undertones=["neutral", "warm"],
                    accepted_finishes=["matte"],
                    accepted_textures=["powder", "pencil", "gel"],
                    intensity_min=2,
                    intensity_max=6,
                ),
                _role(
                    "mascara",
                    "Clean lash definition",
                    "Black or brown mascara that lengthens without clumping.",
                    "mascara",
                    ["mascara"],
                    accepted_color_families=["black", "brown"],
                    accepted_finishes=["natural"],
                    accepted_textures=["cream"],
                    intensity_min=3,
                    intensity_max=7,
                ),
                _role(
                    "glow_balm",
                    "Subtle glow balm",
                    "A sheer glow on cheekbones that is not glittery.",
                    "highlighter",
                    ["highlighter"],
                    accepted_color_families=["champagne", "clear"],
                    accepted_finishes=["dewy", "satin"],
                    accepted_textures=["balm", "cream", "liquid"],
                    accepted_coverage=["sheer"],
                    intensity_min=1,
                    intensity_max=4,
                ),
                _role(
                    "glossy_lip",
                    "Nude glossy lip",
                    "A low-intensity nude glossy lip that keeps the look soft.",
                    "lip_gloss",
                    ["lip_gloss", "lipstick"],
                    accepted_color_families=["nude"],
                    accepted_undertones=["neutral", "warm"],
                    accepted_finishes=["gloss"],
                    accepted_textures=["gel", "liquid"],
                    accepted_coverage=["sheer"],
                    intensity_min=1,
                    intensity_max=4,
                ),
            ],
            "tutorial": {
                "title": "Soft Rose Everyday Tutorial",
                "summary": "Build fresh skin first, then add rose warmth and soft lash-line definition.",
                "steps": [
                    _step("skin_prep", "Prep lightly", "Apply a thin layer over the center of the face and blend outward.", "Use less than you think; the base should still move.", "Applying too much primer can make the skin feel slick."),
                    _step("fresh_base", "Even the base", "Blend a light layer where redness or uneven tone shows.", "Leave natural skin visible around the perimeter.", "Do not build full coverage for this look."),
                    _step("cream_blush", "Tap on rose warmth", "Tap the rose tone high on the cheeks and blend toward the temples.", "Use fingertip warmth for cream or lipstick adaptations.", "Dragging the product can lift the base."),
                    _step("soft_liner", "Press soft definition", "Press brown pigment close to the upper lash line.", "Keep the line thin and soft.", "A thick wing changes the mood of the look."),
                    _step("mascara", "Define lashes", "Comb mascara through the top lashes from root to tip.", "Wipe excess off the wand first.", "Too much mascara makes this look heavier."),
                    _step("glow_balm", "Add controlled glow", "Tap a sheer glow only on the high points of the cheeks.", "Stop before visible sparkle appears.", "Avoid placing glow over texture you do not want to emphasize."),
                    _step("glossy_lip", "Finish with a nude shine", "Apply a sheer nude gloss or equivalent lip finish.", "Keep the lip lower intensity than the cheeks.", "A deep matte lip competes with the soft rose focus."),
                ],
            },
        },
        {
            "slug": "latte-soft-smoke",
            "title": "Latte Soft Smoke",
            "description": "Warm brown definition with balanced skin and softly sculpted cheeks.",
            "difficulty": "intermediate",
            "occasion": "evening",
            "reference_image_url": "https://example.com/reference/latte-soft-smoke.jpg",
            "roles": [
                _role("natural_base", "Natural satin base", "A satin base that keeps the skin balanced.", "foundation", ["foundation", "skin_tint"], accepted_color_families=["beige"], accepted_undertones=["neutral", "warm"], accepted_finishes=["natural", "satin"], accepted_textures=["liquid", "cream"], accepted_coverage=["light", "medium"], intensity_min=1, intensity_max=5),
                _role("soft_conceal", "Targeted concealer", "Concealer only where brightness is needed.", "concealer", ["concealer"], accepted_color_families=["beige", "peach"], accepted_undertones=["neutral", "warm"], accepted_finishes=["natural"], accepted_textures=["cream", "liquid"], accepted_coverage=["medium", "full"], intensity_min=1, intensity_max=4),
                _role("warm_sculpt", "Warm soft sculpt", "Warm bronzer softly placed under cheekbones.", "bronzer", ["bronzer"], accepted_color_families=["bronze", "brown"], accepted_undertones=["warm", "neutral"], accepted_finishes=["matte", "satin"], accepted_textures=["powder", "cream"], intensity_min=3, intensity_max=7),
                _role("brown_smoke", "Brown smoke lid", "Warm brown shadow blended close to the lashes.", "eyeshadow", ["eyeshadow"], accepted_color_families=["brown", "bronze"], accepted_undertones=["warm", "neutral"], accepted_finishes=["matte", "satin"], accepted_textures=["powder", "cream"], intensity_min=3, intensity_max=7),
                _role("lash_frame", "Defined lashes", "Mascara that frames the soft smoke.", "mascara", ["mascara"], accepted_color_families=["black", "brown"], accepted_finishes=["natural"], accepted_textures=["cream"], intensity_min=4, intensity_max=8),
                _role("muted_lip", "Muted warm lip", "A muted warm lip that stays below the eye intensity.", "lipstick", ["lipstick", "lip_tint"], accepted_color_families=["nude", "rose", "brown"], accepted_undertones=["warm", "neutral"], accepted_finishes=["satin", "matte"], accepted_textures=["cream", "liquid"], intensity_min=2, intensity_max=6),
            ],
            "tutorial": {
                "title": "Latte Soft Smoke Tutorial",
                "summary": "Layer warm browns in thin passes to keep the smoke wearable.",
                "steps": [
                    _step("natural_base", "Lay down base", "Blend a satin base only where needed.", "Use thin layers.", "Do not erase all skin texture."),
                    _step("soft_conceal", "Brighten selectively", "Tap concealer under the inner eye and around redness.", "Keep the outer eye flexible.", "Too much concealer can crease under shadow."),
                    _step("warm_sculpt", "Warm the cheek", "Sweep bronzer softly under cheekbones and around the temples.", "Blend edges before adding eye color.", "A harsh sculpt line breaks the softness."),
                    _step("brown_smoke", "Build the smoke", "Blend brown shadow from the lash line upward.", "Stop below the crease for a soft version.", "Over-blending too high changes the eye shape."),
                    _step("lash_frame", "Frame lashes", "Apply mascara after the shadow is blended.", "Focus on the outer lashes.", "Wet mascara can transfer onto shadow."),
                    _step("muted_lip", "Mute the lip", "Apply a warm muted lip in a thin layer.", "Blot once for a softer finish.", "A glossy bright lip competes with the smoke."),
                ],
            },
        },
        {
            "slug": "clean-girl-polished",
            "title": "Clean Girl Polished",
            "description": "A restrained polished face with brows, soft skin, and clear lip shine.",
            "difficulty": "beginner",
            "occasion": "work",
            "reference_image_url": "https://example.com/reference/clean-girl-polished.jpg",
            "roles": [
                _role("skin_tint", "Barely-there tint", "Light coverage that looks like skin.", "skin_tint", ["skin_tint", "foundation"], accepted_color_families=["beige"], accepted_undertones=["neutral"], accepted_finishes=["natural", "dewy"], accepted_textures=["liquid", "cream"], accepted_coverage=["light"], intensity_min=1, intensity_max=3),
                _role("soft_powder", "Soft setting veil", "A sheer powder used only where shine breaks through.", "powder", ["powder"], accepted_color_families=["translucent"], accepted_finishes=["matte"], accepted_textures=["powder"], accepted_coverage=["sheer"], intensity_min=0, intensity_max=2),
                _role("brow_shape", "Brow shape", "A brow pencil or gel that quietly defines the brow.", "eyebrow_pencil", ["eyebrow_pencil", "brow_gel"], accepted_color_families=["brown", "clear"], accepted_finishes=["matte", "natural"], accepted_textures=["pencil", "gel"], intensity_min=0, intensity_max=6),
                _role("cream_flush", "Cream pink flush", "A small amount of pink cream blush.", "blush", ["blush"], accepted_color_families=["pink", "rose"], accepted_undertones=["cool", "neutral"], accepted_finishes=["dewy", "satin"], accepted_textures=["cream", "liquid"], intensity_min=2, intensity_max=5),
                _role("clear_lip", "Clear lip balm", "Clear balm or low-pigment shine.", "lip_balm", ["lip_balm", "lip_gloss"], accepted_color_families=["clear", "nude"], accepted_finishes=["gloss", "natural"], accepted_textures=["balm", "gel"], accepted_coverage=["sheer"], intensity_min=0, intensity_max=2),
            ],
            "tutorial": {
                "title": "Clean Girl Polished Tutorial",
                "summary": "Keep each layer controlled and visible only where it improves the finish.",
                "steps": [
                    _step("skin_tint", "Tint only where needed", "Blend tint through the center of the face.", "Use fingers for a skin-like finish.", "Applying everywhere can look heavier than intended."),
                    _step("soft_powder", "Set strategically", "Powder the sides of the nose and center of the forehead.", "Keep cheekbones unpowdered.", "Powdering the whole face removes freshness."),
                    _step("brow_shape", "Shape brows", "Brush brows up and define sparse areas.", "Use short strokes.", "Drawing a solid block looks less polished."),
                    _step("cream_flush", "Place blush high", "Tap blush high and sheer it out.", "Blend before adding more.", "Too much blush makes the look less restrained."),
                    _step("clear_lip", "Add clear shine", "Finish with a clear balm or gloss.", "Keep edges soft.", "Overlining changes the clean feel."),
                ],
            },
        },
        {
            "slug": "berry-date-night",
            "title": "Berry Date Night",
            "description": "A berry-focused look with balanced cheeks, defined lashes, and a softly polished base.",
            "difficulty": "intermediate",
            "occasion": "date night",
            "reference_image_url": "https://example.com/reference/berry-date-night.jpg",
            "roles": [
                _role("polished_base", "Polished base", "Medium coverage with a natural finish.", "foundation", ["foundation"], accepted_color_families=["beige"], accepted_undertones=["neutral"], accepted_finishes=["natural", "satin"], accepted_textures=["liquid", "cream"], accepted_coverage=["medium"], intensity_min=2, intensity_max=5),
                _role("soft_correct", "Soft correction", "Peach or beige correction where discoloration shows.", "concealer", ["concealer"], accepted_color_families=["beige", "peach"], accepted_undertones=["neutral", "warm"], accepted_finishes=["natural"], accepted_textures=["cream"], accepted_coverage=["medium", "full"], intensity_min=2, intensity_max=5),
                _role("berry_cheek", "Berry cheek stain", "A sheer berry tone on the cheeks.", "blush", ["blush", "lip_tint"], accepted_color_families=["berry", "plum"], accepted_undertones=["cool", "neutral"], accepted_finishes=["satin", "dewy"], accepted_textures=["cream", "liquid", "powder"], intensity_min=3, intensity_max=7),
                _role("mauve_eye", "Mauve eye wash", "A mauve or plum wash across the lid.", "eyeshadow", ["eyeshadow"], accepted_color_families=["mauve", "plum"], accepted_undertones=["cool", "neutral"], accepted_finishes=["satin", "matte"], accepted_textures=["cream", "powder"], intensity_min=2, intensity_max=6),
                _role("defined_lash", "Defined lash", "Black mascara to anchor the berry tones.", "mascara", ["mascara"], accepted_color_families=["black"], accepted_finishes=["natural"], accepted_textures=["cream"], intensity_min=4, intensity_max=8),
                _role("berry_lip", "Berry lip", "A berry or plum lip in a soft satin finish.", "lipstick", ["lipstick", "lip_tint"], accepted_color_families=["berry", "plum"], accepted_undertones=["cool", "neutral"], accepted_finishes=["satin"], accepted_textures=["cream", "liquid"], intensity_min=4, intensity_max=8),
            ],
            "tutorial": {
                "title": "Berry Date Night Tutorial",
                "summary": "Keep the berry tones coordinated so the lip remains the focus.",
                "steps": [
                    _step("polished_base", "Polish the base", "Apply medium coverage in thin layers.", "Let each layer settle.", "Heavy base can fight with the berry lip."),
                    _step("soft_correct", "Correct small areas", "Correct darkness or redness only where it distracts.", "Use a tapping motion.", "Wide concealer placement can flatten the face."),
                    _step("berry_cheek", "Add berry cheek", "Sheer berry color over the upper cheek.", "Use a small amount first.", "A saturated cheek competes with the lip."),
                    _step("mauve_eye", "Wash the lid", "Blend mauve tone softly across the mobile lid.", "Keep edges diffused.", "A hard edge looks too graphic for this look."),
                    _step("defined_lash", "Anchor lashes", "Use black mascara to define the eye.", "Comb through before it dries.", "Clumps make the look less polished."),
                    _step("berry_lip", "Apply berry lip", "Apply berry color, then soften the edge with a fingertip.", "Blot once for control.", "Skipping edge softening can make the lip look severe."),
                ],
            },
        },
    ]


def _demo_products(user_id: int) -> list[dict]:
    return [
        _product(user_id, "Demo Beauty", "Glow Grip Primer", "primer", "clear", "neutral", "dewy", "gel", "sheer", 1),
        _product(user_id, "Demo Beauty", "Everyday Skin Tint", "foundation", "beige", "neutral", "natural", "liquid", "light", 2),
        _product(user_id, "Demo Beauty", "Rose Satin Lipstick", "lipstick", "rose", "neutral", "satin", "cream", "medium", 4, is_multi_use_safe=True),
        _product(user_id, "Demo Beauty", "Soft Brown Shadow", "eyeshadow", "brown", "neutral", "matte", "powder", "medium", 4, confidence=0.45),
        _product(user_id, "Demo Beauty", "Black Length Mascara", "mascara", "black", "neutral", "natural", "cream", "medium", 5),
        _product(user_id, "Demo Beauty", "Orange Matte Lipstick", "lipstick", "orange", "warm", "matte", "cream", "full", 8),
        _product(user_id, "Demo Beauty", "Taupe Brow Pencil", "eyebrow_pencil", "brown", "neutral", "matte", "pencil", "medium", 4),
        _product(user_id, "Demo Beauty", "Clear Brow Gel", "brow_gel", "clear", "neutral", "natural", "gel", "sheer", 1),
        _product(user_id, "Demo Beauty", "Peach Corrector", "concealer", "peach", "warm", "natural", "cream", "medium", 3),
        _product(user_id, "Demo Beauty", "Deep Plum Powder Blush", "blush", "plum", "cool", "satin", "powder", "medium", 7),
        _product(user_id, "Demo Beauty", "Navy Gel Liner", "eyeliner", "blue", "cool", "satin", "gel", "medium", 7),
        _product(user_id, "Demo Beauty", "Berry Lip Tint", "lip_tint", "berry", "cool", "satin", "liquid", "sheer", 5, is_multi_use_safe=True),
        _product(user_id, "Demo Beauty", "Warm Matte Bronzer", "bronzer", "bronze", "warm", "matte", "powder", "medium", 6, is_multi_use_safe=True),
        _product(user_id, "Demo Beauty", "Light Neutral Concealer", "concealer", "beige", "neutral", "natural", "cream", "full", 2),
        _product(user_id, "Demo Beauty", "Translucent Setting Powder", "powder", "translucent", "neutral", "matte", "powder", "sheer", 1),
        _product(user_id, "Demo Beauty", "Mauve Cream Shadow", "eyeshadow", "mauve", "neutral", "satin", "cream", "medium", 3),
        _product(user_id, "Demo Beauty", "Clear Lip Balm", "lip_balm", "clear", "neutral", "natural", "balm", "sheer", 1),
        _product(user_id, "Demo Beauty", "Cool Pink Powder Blush", "blush", "pink", "cool", "dewy", "powder", "medium", 5),
        _product(user_id, "Demo Beauty", "Black Pencil Liner", "eyeliner", "black", "neutral", "matte", "pencil", "medium", 6),
        _product(user_id, "Demo Beauty", "Lavender Shimmer Shadow", "eyeshadow", "lavender", "cool", "shimmer", "powder", "medium", 4),
    ]


def _product(
    user_id: int,
    brand: str,
    name: str,
    category: str,
    color_family: str,
    undertone: str,
    finish: str,
    texture: str,
    coverage: str,
    intensity: int,
    is_multi_use_safe: bool = False,
    confidence: float = 1.0,
) -> dict:
    return {
        "user_id": user_id,
        "brand": brand,
        "name": name,
        "category": category,
        "color_family": color_family,
        "undertone": undertone,
        "finish": finish,
        "texture": texture,
        "coverage": coverage,
        "intensity": intensity,
        "is_multi_use_safe": is_multi_use_safe,
        "source": "manual",
        "confidence": confidence,
    }
