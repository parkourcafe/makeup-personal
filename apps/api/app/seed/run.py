from app.db.session import SessionLocal
from app.seed.data import seed_demo_data


def main() -> None:
    with SessionLocal() as db:
        seed_demo_data(db, reset=True)
    print("Seeded demo data.")


if __name__ == "__main__":
    main()
