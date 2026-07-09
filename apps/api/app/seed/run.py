import argparse

from app.db.session import SessionLocal
from app.seed.data import seed_demo_data


def main() -> None:
    parser = argparse.ArgumentParser(description="Seed deterministic Russian MVP data.")
    parser.add_argument("--reset", action="store_true", help="Delete existing demo content before seeding.")
    args = parser.parse_args()

    with SessionLocal() as db:
        seeded = seed_demo_data(db, reset=args.reset)
    print("Seeded demo data." if seeded else "Seed data already exists; skipped.")


if __name__ == "__main__":
    main()
