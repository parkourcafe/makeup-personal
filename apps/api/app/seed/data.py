from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.models import AuthSession, Look, LookRole, Store, StoreOffer, Tutorial, TutorialStep, User, UserProduct


REFERENCE_IMAGE_URLS = [
    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
]


def seed_demo_data(db: Session, reset: bool = True) -> bool:
    if reset:
        _reset(db)
    elif db.scalar(select(Look.id).limit(1)) is not None:
        return False

    user = User(
        display_name="Алина",
        language="ru",
        skin_depth="light-medium",
        skin_undertone="neutral",
    )
    db.add(user)
    db.flush()

    for product in _demo_products(user.id):
        db.add(UserProduct(**product))

    for look_data in _looks():
        _create_look(db, look_data)

    _create_mock_stores(db)

    db.commit()
    return True


def _reset(db: Session) -> None:
    for model in [AuthSession, StoreOffer, Store, UserProduct, TutorialStep, Tutorial, LookRole, Look, User]:
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
            "title": "Мягкий розовый на каждый день",
            "description": "Носимый розовый макияж с чистой кожей, мягким акцентом на глазах и спокойной губой.",
            "difficulty": "beginner",
            "occasion": "daily",
            "reference_image_url": REFERENCE_IMAGE_URLS[0],
            "roles": [
                _role(
                    "skin_prep",
                    "Легкая подготовка кожи",
                    "Тонкий слой праймера или базы, чтобы кожа выглядела свежей без тяжелого покрытия.",
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
                    "Свежий нейтральный тон",
                    "Легкое нейтральное покрытие, которое выравнивает кожу и не скрывает ее естественную текстуру.",
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
                    "Мягкие розовые румяна",
                    "Розовый кремовый румянец, нанесенный высоко на щеки.",
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
                    "Мягкая коричневая линия",
                    "Матовые коричневые тени или карандаш, нанесенные близко к линии ресниц.",
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
                    "Аккуратные ресницы",
                    "Черная или коричневая тушь, которая удлиняет без комочков.",
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
                    "Деликатное сияние",
                    "Прозрачное сияние на скулах без заметных блесток.",
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
                    "Нюдовый блеск для губ",
                    "Спокойный нюдовый блеск, который сохраняет макияж мягким.",
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
                "title": "Урок: мягкий розовый макияж",
                "summary": "Сначала собери свежую кожу, затем добавь розовый румянец и мягкую линию у ресниц.",
                "steps": [
                    _step("skin_prep", "Подготовь кожу", "Нанеси тонкий слой на центр лица и растушуй к краям.", "Возьми меньше продукта, чем кажется нужным.", "Слишком много праймера может сделать кожу скользкой."),
                    _step("fresh_base", "Выровняй тон", "Растушуй легкий слой там, где есть покраснения или неровный тон.", "Оставь естественную кожу видимой по периметру лица.", "Не собирай плотное покрытие для этого образа."),
                    _step("cream_blush", "Добавь розовый румянец", "Похлопывающими движениями нанеси розовый тон высоко на щеки и растушуй к вискам.", "Для кремовых текстур и помады используй тепло пальцев.", "Не растягивай продукт по коже, чтобы не сдвинуть тон."),
                    _step("soft_liner", "Сделай мягкую линию", "Прижми коричневый пигмент близко к верхней линии ресниц.", "Линия должна быть тонкой и мягкой.", "Толстая стрелка меняет настроение образа."),
                    _step("mascara", "Прокрась ресницы", "Прочеши верхние ресницы тушью от корней к кончикам.", "Сними лишний продукт с щеточки.", "Избыток туши утяжеляет этот макияж."),
                    _step("glow_balm", "Добавь сияние", "Похлопывающими движениями нанеси прозрачное сияние только на верх скул.", "Остановись до появления заметных блесток.", "Не наноси сияние на зоны, где не хочешь подчеркивать текстуру."),
                    _step("glossy_lip", "Заверши нюдовым блеском", "Нанеси прозрачный или нюдовый блеск тонким слоем.", "Губы должны быть спокойнее, чем румянец.", "Глубокая матовая губа спорит с мягким розовым акцентом."),
                ],
            },
        },
        {
            "slug": "latte-soft-smoke",
            "title": "Латте soft smoke",
            "description": "Теплая коричневая растушевка, сбалансированная кожа и мягкая скульптура щек.",
            "difficulty": "intermediate",
            "occasion": "evening",
            "reference_image_url": REFERENCE_IMAGE_URLS[1],
            "roles": [
                _role("natural_base", "Сатиновая база", "Сатиновый тон или тинт, который выравнивает кожу и не перегружает ее.", "foundation", ["foundation", "skin_tint"], accepted_color_families=["beige"], accepted_undertones=["neutral", "warm"], accepted_finishes=["natural", "satin"], accepted_textures=["liquid", "cream"], accepted_coverage=["light", "medium"], intensity_min=1, intensity_max=5),
                _role("soft_conceal", "Точечный консилер", "Консилер только там, где нужно добавить свежести или скрыть покраснение.", "concealer", ["concealer"], accepted_color_families=["beige", "peach"], accepted_undertones=["neutral", "warm"], accepted_finishes=["natural"], accepted_textures=["cream", "liquid"], accepted_coverage=["medium", "full"], intensity_min=1, intensity_max=4),
                _role("warm_sculpt", "Мягкая теплая скульптура", "Теплый бронзер под скулой и по периметру лица без жесткой полосы.", "bronzer", ["bronzer"], accepted_color_families=["bronze", "brown"], accepted_undertones=["warm", "neutral"], accepted_finishes=["matte", "satin"], accepted_textures=["powder", "cream"], intensity_min=3, intensity_max=7),
                _role("brown_smoke", "Коричневая дымка на веке", "Теплый коричневый оттенок, растушеванный близко к линии ресниц.", "eyeshadow", ["eyeshadow"], accepted_color_families=["brown", "bronze"], accepted_undertones=["warm", "neutral"], accepted_finishes=["matte", "satin"], accepted_textures=["powder", "cream"], intensity_min=3, intensity_max=7),
                _role("lash_frame", "Выразительные ресницы", "Тушь, которая собирает мягкую коричневую растушевку и добавляет глубину.", "mascara", ["mascara"], accepted_color_families=["black", "brown"], accepted_finishes=["natural"], accepted_textures=["cream"], intensity_min=4, intensity_max=8),
                _role("muted_lip", "Приглушенная теплая губа", "Теплая спокойная губа, которая не спорит с интенсивностью глаз.", "lipstick", ["lipstick", "lip_tint"], accepted_color_families=["nude", "rose", "brown"], accepted_undertones=["warm", "neutral"], accepted_finishes=["satin", "matte"], accepted_textures=["cream", "liquid"], intensity_min=2, intensity_max=6),
            ],
            "tutorial": {
                "title": "Урок: латте soft smoke",
                "summary": "Наслаивай теплые коричневые оттенки тонко, чтобы дымка осталась носимой.",
                "steps": [
                    _step("natural_base", "Собери сатиновую базу", "Растушуй тонкий слой только там, где нужно выравнивание.", "Работай тонкими слоями.", "Не стирай всю естественную текстуру кожи."),
                    _step("soft_conceal", "Подсвети точечно", "Похлопывающими движениями добавь консилер у внутреннего уголка глаза и на покраснения.", "Оставь внешний угол глаза подвижным.", "Избыток консилера может собраться в складках под тенями."),
                    _step("warm_sculpt", "Согрей щеку", "Мягко проведи бронзером под скулой и у висков.", "Растушуй края до теней.", "Жесткая скульптурная линия ломает мягкость образа."),
                    _step("brown_smoke", "Построй дымку", "Растушуй коричневый оттенок от линии ресниц вверх.", "Для мягкой версии остановись ниже складки века.", "Слишком высокая растушевка меняет форму глаза."),
                    _step("lash_frame", "Оформи ресницы", "Нанеси тушь после того, как тени растушеваны.", "Сфокусируйся на внешних ресницах.", "Влажная тушь может отпечататься на тенях."),
                    _step("muted_lip", "Приглуши губы", "Нанеси теплый приглушенный оттенок тонким слоем.", "Промокни один раз для более мягкого финиша.", "Яркая глянцевая губа спорит с коричневой дымкой."),
                ],
            },
        },
        {
            "slug": "clean-girl-polished",
            "title": "Чистый polished-макияж",
            "description": "Сдержанный ухоженный макияж с бровями, мягкой кожей и прозрачным блеском на губах.",
            "difficulty": "beginner",
            "occasion": "work",
            "reference_image_url": REFERENCE_IMAGE_URLS[2],
            "roles": [
                _role("skin_tint", "Почти невидимый тинт", "Легкое покрытие, которое выглядит как собственная кожа.", "skin_tint", ["skin_tint", "foundation"], accepted_color_families=["beige"], accepted_undertones=["neutral"], accepted_finishes=["natural", "dewy"], accepted_textures=["liquid", "cream"], accepted_coverage=["light"], intensity_min=1, intensity_max=3),
                _role("soft_powder", "Тонкая фиксирующая вуаль", "Прозрачная пудра только там, где появляется лишний блеск.", "powder", ["powder"], accepted_color_families=["translucent"], accepted_finishes=["matte"], accepted_textures=["powder"], accepted_coverage=["sheer"], intensity_min=0, intensity_max=2),
                _role("brow_shape", "Форма бровей", "Карандаш или гель, который спокойно собирает форму брови.", "eyebrow_pencil", ["eyebrow_pencil", "brow_gel"], accepted_color_families=["brown", "clear"], accepted_finishes=["matte", "natural"], accepted_textures=["pencil", "gel"], intensity_min=0, intensity_max=6),
                _role("cream_flush", "Кремовый розовый румянец", "Небольшое количество розовых кремовых румян.", "blush", ["blush"], accepted_color_families=["pink", "rose"], accepted_undertones=["cool", "neutral"], accepted_finishes=["dewy", "satin"], accepted_textures=["cream", "liquid"], intensity_min=2, intensity_max=5),
                _role("clean_mascara", "Чистый лифтинг ресниц", "Сдержанный слой туши, который сохраняет образ аккуратным.", "mascara", ["mascara"], accepted_color_families=["black", "brown"], accepted_finishes=["natural"], accepted_textures=["cream"], intensity_min=2, intensity_max=6),
                _role("clear_lip", "Прозрачный бальзам", "Прозрачный бальзам или блеск с минимальным пигментом.", "lip_balm", ["lip_balm", "lip_gloss"], accepted_color_families=["clear", "nude"], accepted_finishes=["gloss", "natural"], accepted_textures=["balm", "gel"], accepted_coverage=["sheer"], intensity_min=0, intensity_max=2),
            ],
            "tutorial": {
                "title": "Урок: чистый polished-макияж",
                "summary": "Каждый слой должен быть заметен только там, где он улучшает финиш.",
                "steps": [
                    _step("skin_tint", "Нанеси тинт только где нужно", "Растушуй тинт через центр лица.", "Для эффекта кожи используй пальцы.", "Нанесение на все лицо может выглядеть тяжелее, чем задумано."),
                    _step("soft_powder", "Зафиксируй стратегически", "Припудри крылья носа и центр лба.", "Скулы оставь без пудры.", "Пудра на всем лице убирает свежесть."),
                    _step("brow_shape", "Собери брови", "Зачеши брови вверх и заполни редкие зоны.", "Делай короткие штрихи.", "Сплошной блок выглядит менее ухоженно."),
                    _step("cream_flush", "Поставь румянец высоко", "Похлопывающими движениями нанеси румяна высоко и растушуй тонко.", "Растушуй перед тем, как добавить еще.", "Слишком много румян делает образ менее сдержанным."),
                    _step("clean_mascara", "Приподними ресницы", "Нанеси один чистый слой туши.", "Прочеши ресницы, пока тушь влажная.", "Несколько слоев могут утяжелить образ."),
                    _step("clear_lip", "Добавь прозрачное сияние", "Заверши прозрачным бальзамом или блеском.", "Края губ оставь мягкими.", "Сильный оверлайн меняет чистое настроение."),
                ],
            },
        },
        {
            "slug": "berry-date-night",
            "title": "Ягодный вечерний акцент",
            "description": "Макияж с ягодной губой, сбалансированными щеками, выразительными ресницами и аккуратной базой.",
            "difficulty": "intermediate",
            "occasion": "date night",
            "reference_image_url": REFERENCE_IMAGE_URLS[3],
            "roles": [
                _role("polished_base", "Аккуратная база", "Среднее покрытие с естественным финишем.", "foundation", ["foundation"], accepted_color_families=["beige"], accepted_undertones=["neutral"], accepted_finishes=["natural", "satin"], accepted_textures=["liquid", "cream"], accepted_coverage=["medium"], intensity_min=2, intensity_max=5),
                _role("soft_correct", "Мягкая коррекция", "Персиковая или бежевая коррекция только там, где видна неоднородность.", "concealer", ["concealer"], accepted_color_families=["beige", "peach"], accepted_undertones=["neutral", "warm"], accepted_finishes=["natural"], accepted_textures=["cream"], accepted_coverage=["medium", "full"], intensity_min=2, intensity_max=5),
                _role("berry_cheek", "Ягодный тинт на щеках", "Прозрачный ягодный оттенок на щеках.", "blush", ["blush", "lip_tint"], accepted_color_families=["berry", "plum"], accepted_undertones=["cool", "neutral"], accepted_finishes=["satin", "dewy"], accepted_textures=["cream", "liquid", "powder"], intensity_min=3, intensity_max=7),
                _role("mauve_eye", "Mauve-вуаль на веках", "Mauve или сливовый оттенок, мягко растушеванный по веку.", "eyeshadow", ["eyeshadow"], accepted_color_families=["mauve", "plum"], accepted_undertones=["cool", "neutral"], accepted_finishes=["satin", "matte"], accepted_textures=["cream", "powder"], intensity_min=2, intensity_max=6),
                _role("defined_lash", "Четкие ресницы", "Черная тушь, которая собирает ягодную гамму.", "mascara", ["mascara"], accepted_color_families=["black"], accepted_finishes=["natural"], accepted_textures=["cream"], intensity_min=4, intensity_max=8),
                _role("berry_lip", "Ягодная губа", "Ягодная или сливовая губа с мягким сатиновым финишем.", "lipstick", ["lipstick", "lip_tint"], accepted_color_families=["berry", "plum"], accepted_undertones=["cool", "neutral"], accepted_finishes=["satin"], accepted_textures=["cream", "liquid"], intensity_min=4, intensity_max=8),
            ],
            "tutorial": {
                "title": "Урок: ягодный вечерний акцент",
                "summary": "Держи ягодные оттенки в одной гамме, чтобы губа осталась главным фокусом.",
                "steps": [
                    _step("polished_base", "Отполируй базу", "Нанеси среднее покрытие тонкими слоями.", "Дай каждому слою осесть.", "Плотная база может спорить с ягодной губой."),
                    _step("soft_correct", "Скорректируй малые зоны", "Скорректируй тени или покраснения только там, где они отвлекают.", "Работай похлопывающими движениями.", "Широкое нанесение консилера может уплощать лицо."),
                    _step("berry_cheek", "Добавь ягодный румянец", "Растушуй прозрачный ягодный цвет по верхней части щеки.", "Сначала возьми маленькое количество.", "Насыщенная щека конкурирует с губой."),
                    _step("mauve_eye", "Сделай вуаль на веке", "Мягко растушуй mauve-оттенок по подвижному веку.", "Края должны быть рассеянными.", "Жесткая граница выглядит слишком графично для этого образа."),
                    _step("defined_lash", "Закрепи ресницы", "Используй черную тушь, чтобы обозначить глаз.", "Прочеши ресницы до высыхания.", "Комочки делают образ менее аккуратным."),
                    _step("berry_lip", "Нанеси ягодную губу", "Нанеси ягодный цвет, затем смягчи край подушечкой пальца.", "Промокни один раз для контроля.", "Без смягчения края губа может выглядеть слишком жестко."),
                ],
            },
        },
    ] + _generated_looks()


def _generated_looks() -> list[dict]:
    specs = [
        ("soft-coral-brunch", "Мягкий коралл для бранча", "Свежий коралловый акцент, легкая кожа и мягкие ресницы.", "beginner", "daily", "coral", "peach", "brown", "nude"),
        ("office-neutral-polish", "Нейтральный офисный макияж", "Собранный дневной образ с нейтральной гаммой и аккуратными бровями.", "beginner", "work", "nude", "beige", "taupe", "rose"),
        ("golden-hour-glow", "Сияние золотого часа", "Теплый сияющий образ для мягкого вечернего света.", "intermediate", "evening", "champagne", "bronze", "brown", "peach"),
        ("soft-plum-focus", "Мягкий сливовый акцент", "Сливовый фокус на губах и спокойная кожа без тяжелого контура.", "intermediate", "date night", "plum", "mauve", "plum", "plum"),
        ("rose-matte-workday", "Розовый матовый рабочий день", "Матовый розово-бежевый образ для долгого рабочего дня.", "beginner", "work", "rose", "beige", "brown", "rose"),
        ("espresso-lashline", "Эспрессо у линии ресниц", "Кофейная линия у ресниц, нейтральные щеки и мягкая губа.", "intermediate", "evening", "brown", "bronze", "brown", "nude"),
        ("fresh-peach-weekend", "Свежий персиковый выходной", "Персиковый румянец, мягкий тон и прозрачная губа.", "beginner", "daily", "peach", "beige", "taupe", "clear"),
        ("cool-mauve-minimal", "Минималистичный cool mauve", "Холодный mauve-акцент с деликатной базой и спокойной тушью.", "intermediate", "date night", "mauve", "pink", "mauve", "mauve"),
    ]
    return [_generated_look(*spec) for spec in specs]


def _generated_look(
    slug: str,
    title: str,
    description: str,
    difficulty: str,
    occasion: str,
    cheek_color: str,
    base_color: str,
    eye_color: str,
    lip_color: str,
) -> dict:
    roles = [
        _role("skin_base", "Легкая база", "Тон или тинт, который выравнивает кожу без плотной маски.", "foundation", ["foundation", "skin_tint"], accepted_color_families=["beige", base_color], accepted_undertones=["neutral", "warm", "cool"], accepted_finishes=["natural", "dewy", "satin"], accepted_textures=["liquid", "cream"], accepted_coverage=["light", "medium"], intensity_min=1, intensity_max=5),
        _role("target_conceal", "Точечная коррекция", "Консилер только там, где нужна дополнительная аккуратность.", "concealer", ["concealer"], accepted_color_families=["beige", "peach"], accepted_undertones=["neutral", "warm"], accepted_finishes=["natural"], accepted_textures=["cream", "liquid"], accepted_coverage=["medium", "full"], intensity_min=1, intensity_max=5),
        _role("cheek_color", "Цвет на щеках", "Основной цветовой акцент на щеках в тон образа.", "blush", ["blush", "lip_tint"], accepted_color_families=[cheek_color, "rose", "pink", "peach", "plum"], accepted_undertones=["neutral", "warm", "cool"], accepted_finishes=["satin", "dewy", "matte"], accepted_textures=["cream", "liquid", "powder"], intensity_min=2, intensity_max=7),
        _role("eye_wash", "Мягкий цвет на глазах", "Растушеванный оттенок на веке без жесткой графики.", "eyeshadow", ["eyeshadow"], accepted_color_families=[eye_color, "brown", "bronze", "mauve", "taupe"], accepted_undertones=["neutral", "warm", "cool"], accepted_finishes=["matte", "satin"], accepted_textures=["powder", "cream"], intensity_min=2, intensity_max=7),
        _role("lash_definition", "Ресницы", "Один или два слоя туши для чистого обрамления глаз.", "mascara", ["mascara"], accepted_color_families=["black", "brown"], accepted_finishes=["natural"], accepted_textures=["cream"], intensity_min=3, intensity_max=8),
        _role("lip_finish", "Финиш губ", "Губы поддерживают общий цветовой акцент, но не спорят с глазами и щеками.", "lipstick", ["lipstick", "lip_tint", "lip_balm"], accepted_color_families=[lip_color, "nude", "rose", "berry", "clear"], accepted_undertones=["neutral", "warm", "cool"], accepted_finishes=["satin", "gloss", "natural", "matte"], accepted_textures=["cream", "liquid", "balm", "gel"], intensity_min=0, intensity_max=8),
    ]
    steps = [
        _step("skin_base", "Собери базу", "Нанеси тонкий слой базы только там, где нужно выравнивание.", "Начинай с центра лица.", "Не перекрывай естественную кожу полностью."),
        _step("target_conceal", "Скорректируй точечно", "Добавь консилер на покраснения или тени.", "Растушевывай похлопывающими движениями.", "Не растягивай консилер слишком далеко."),
        _step("cheek_color", "Добавь цвет щекам", "Нанеси цвет маленькими порциями и растушуй к вискам.", "Сначала проверь интенсивность при дневном свете.", "Слишком низкое нанесение визуально опускает лицо."),
        _step("eye_wash", "Растушуй глаза", "Нанеси мягкий оттенок близко к ресницам и растушуй вверх.", "Край должен исчезать постепенно.", "Жесткая граница делает образ тяжелее."),
        _step("lash_definition", "Оформи ресницы", "Прокрась ресницы от корней к кончикам.", "Убери лишнюю тушь со щеточки.", "Комочки утяжеляют мягкий образ."),
        _step("lip_finish", "Заверши губы", "Нанеси выбранный финиш губ тонким слоем.", "Поддержи оттенок щек или глаз.", "Слишком яркий слой может перетянуть фокус."),
    ]
    return {
        "slug": slug,
        "title": title,
        "description": description,
        "difficulty": difficulty,
        "occasion": occasion,
        "reference_image_url": REFERENCE_IMAGE_URLS[sum(ord(character) for character in slug) % len(REFERENCE_IMAGE_URLS)],
        "roles": roles,
        "tutorial": {
            "title": f"Урок: {title}",
            "summary": "Двигайся от кожи к цветовым акцентам, затем заверши ресницами и губами.",
            "steps": steps,
        },
    }


def _demo_products(user_id: int) -> list[dict]:
    return [
        _product(user_id, "Bobbi Brown", "Vitamin Enriched Face Base", "primer", "clear", "neutral", "dewy", "cream", "sheer", 1),
        _product(user_id, "Erborian", "CC Red Correct", "foundation", "beige", "neutral", "natural", "liquid", "light", 2),
        _product(user_id, "Romanovamakeup", "Sexy Lipstick Pen Rose", "lipstick", "rose", "neutral", "satin", "cream", "medium", 4, is_multi_use_safe=True),
        _product(user_id, "Natasha Denona", "Mini Nude Matte Brown", "eyeshadow", "brown", "neutral", "matte", "powder", "medium", 4, confidence=0.45),
        _product(user_id, "Maybelline", "Lash Sensational Black", "mascara", "black", "neutral", "natural", "cream", "medium", 5),
        _product(user_id, "MAC", "Chili Matte Lipstick", "lipstick", "orange", "warm", "matte", "cream", "full", 8),
        _product(user_id, "Benefit", "Precisely My Brow Taupe", "eyebrow_pencil", "brown", "neutral", "matte", "pencil", "medium", 4),
        _product(user_id, "OK Beauty", "Clear Brow Fix", "brow_gel", "clear", "neutral", "natural", "gel", "sheer", 1),
        _product(user_id, "NARS", "Radiant Creamy Corrector Peach", "concealer", "peach", "warm", "natural", "cream", "medium", 3),
        _product(user_id, "Rare Beauty", "Soft Pinch Faith", "blush", "plum", "cool", "satin", "powder", "medium", 7),
        _product(user_id, "Urban Decay", "24/7 Navy Liner", "eyeliner", "blue", "cool", "satin", "gel", "medium", 7),
        _product(user_id, "Benefit", "Benetint", "lip_tint", "berry", "cool", "satin", "liquid", "sheer", 5, is_multi_use_safe=True),
        _product(user_id, "Fenty Beauty", "Sun Stalk'r Bronzer", "bronzer", "bronze", "warm", "matte", "powder", "medium", 6, is_multi_use_safe=True),
        _product(user_id, "Tarte", "Shape Tape Light Neutral", "concealer", "beige", "neutral", "natural", "cream", "full", 2),
        _product(user_id, "Laura Mercier", "Translucent Loose Setting Powder", "powder", "translucent", "neutral", "matte", "powder", "sheer", 1),
        _product(user_id, "Charlotte Tilbury", "Eyes to Mesmerise Pillow Talk", "eyeshadow", "mauve", "neutral", "satin", "cream", "medium", 3),
        _product(user_id, "Laneige", "Lip Glowy Balm Clear", "lip_balm", "clear", "neutral", "natural", "balm", "sheer", 1),
        _product(user_id, "Clinique", "Cheek Pop Pink Honey", "blush", "pink", "cool", "dewy", "powder", "medium", 5),
        _product(user_id, "Make Up For Ever", "Aqua Resist Black", "eyeliner", "black", "neutral", "matte", "pencil", "medium", 6),
        _product(user_id, "Huda Beauty", "Lavender Shimmer Shadow", "eyeshadow", "lavender", "cool", "shimmer", "powder", "medium", 4),
        _product(user_id, "Dior", "Backstage Face & Body 2N", "foundation", "beige", "neutral", "natural", "liquid", "medium", 4),
        _product(user_id, "Kiko Milano", "Smart Colour Peach Blush", "blush", "peach", "warm", "satin", "powder", "medium", 4),
        _product(user_id, "NYX", "Soft Matte Cannes", "lipstick", "rose", "neutral", "matte", "cream", "medium", 5),
        _product(user_id, "Sephora Collection", "Taupe Cream Shadow", "eyeshadow", "taupe", "neutral", "satin", "cream", "medium", 4),
        _product(user_id, "Max Factor", "Brown Volume Mascara", "mascara", "brown", "neutral", "natural", "cream", "medium", 5),
        _product(user_id, "Catrice", "Liquid Camouflage Neutral", "concealer", "beige", "neutral", "natural", "liquid", "medium", 3),
        _product(user_id, "Essence", "Make Me Brow Clear", "brow_gel", "clear", "neutral", "natural", "gel", "sheer", 1),
        _product(user_id, "ColourPop", "Super Shock Bronze", "eyeshadow", "bronze", "warm", "satin", "cream", "medium", 6),
        _product(user_id, "Pat McGrath", "Plum Satin Lip", "lipstick", "plum", "cool", "satin", "cream", "full", 7),
        _product(user_id, "Milk Makeup", "Werk Lip + Cheek", "lip_tint", "rose", "neutral", "satin", "cream", "sheer", 4, is_multi_use_safe=True),
        _product(user_id, "Anastasia Beverly Hills", "Brow Wiz Dark Brown", "eyebrow_pencil", "brown", "neutral", "matte", "pencil", "medium", 5),
        _product(user_id, "L'Oreal Paris", "True Match Powder", "powder", "translucent", "neutral", "matte", "powder", "sheer", 1),
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


def _create_mock_stores(db: Session) -> None:
    stores = [
        Store(name="Mock Beauty Central", city="Bali", country="Indonesia", latitude=-8.6500, longitude=115.2167),
        Store(name="Mock Sephora Corner", city="Bali", country="Indonesia", latitude=-8.6725, longitude=115.1900),
        Store(name="Mock Makeup Studio", city="Bali", country="Indonesia", latitude=-8.7042, longitude=115.2600),
    ]
    db.add_all(stores)
    db.flush()

    offers = [
        _offer(stores[0].id, "Hollywood Flawless Filter", "Charlotte Tilbury", "highlighter", "champagne", 52.0, "USD", "mock_in_stock"),
        _offer(stores[1].id, "Positive Light Liquid Luminizer", "Rare Beauty", "highlighter", "champagne", 30.0, "USD", "mock_limited"),
        _offer(stores[2].id, "Baby Cheeks Highlighter Balm", "Westman Atelier", "highlighter", "clear", 48.0, "USD", "mock_in_stock"),
        _offer(stores[0].id, "Lip Maximizer Nude", "Dior", "lip_gloss", "nude", 42.0, "USD", "mock_in_stock"),
        _offer(stores[1].id, "Gloss Bomb Fenty Glow", "Fenty Beauty", "lip_gloss", "nude", 26.0, "USD", "mock_limited"),
        _offer(stores[2].id, "Juicy Tube Neutral", "Lancome", "lip_gloss", "nude", 24.0, "USD", "mock_in_stock"),
        _offer(stores[0].id, "Cloud Paint Puff", "Glossier", "blush", "pink", 22.0, "USD", "mock_in_stock"),
        _offer(stores[1].id, "Sky High Mascara Brownish Black", "Maybelline", "mascara", "brown", 15.0, "USD", "mock_in_stock"),
        _offer(stores[2].id, "Soft Matte Complete Concealer", "NARS", "concealer", "beige", 32.0, "USD", "mock_in_stock"),
        _offer(stores[0].id, "Hydrating Skin Tint", "ILIA", "skin_tint", "beige", 48.0, "USD", "mock_limited"),
    ]
    db.add_all(StoreOffer(**offer) for offer in offers)


def _offer(
    store_id: int,
    product_name: str,
    brand: str,
    category: str,
    color_family: str,
    price: float,
    currency: str,
    availability_status: str,
) -> dict:
    return {
        "store_id": store_id,
        "product_name": product_name,
        "brand": brand,
        "category": category,
        "color_family": color_family,
        "price": price,
        "currency": currency,
        "availability_status": availability_status,
        "source_label": "Техническая демонстрация доступности. Не live-остатки.",
    }
