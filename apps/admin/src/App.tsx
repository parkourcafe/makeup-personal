import { useEffect, useMemo, useState } from "react";

import { api } from "./api";
import type { Look, LookRole, Store, StoreOffer, Tutorial, TutorialStep, Vocabulary } from "./types";

const emptyLook = {
  slug: "",
  title: "",
  description: "",
  difficulty: "beginner",
  occasion: "daily",
  reference_image_url: "",
  is_active: true
};

const emptyRole = {
  role_key: "",
  title: "",
  description: "",
  native_category: "blush",
  accepted_categories: "blush",
  accepted_color_families: "",
  accepted_undertones: "",
  accepted_finishes: "",
  accepted_textures: "",
  accepted_coverage: "",
  intensity_min: "",
  intensity_max: ""
};

const emptyStep = {
  title: "",
  instruction: "",
  technique_tip: "",
  common_mistake: "",
  look_role_id: ""
};

const emptyStore = {
  name: "",
  city: "Bali",
  country: "Indonesia",
  latitude: "-8.65",
  longitude: "115.21"
};

const emptyOffer = {
  store_id: "",
  product_name: "",
  brand: "",
  category: "blush",
  color_family: "",
  price: "",
  currency: "USD",
  availability_status: "mock_in_stock",
  source_label: "Техническая демонстрация доступности. Не live-остатки."
};

export function App() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [selectedLookId, setSelectedLookId] = useState<number | null>(null);
  const [roles, setRoles] = useState<LookRole[]>([]);
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [offers, setOffers] = useState<StoreOffer[]>([]);
  const [vocabulary, setVocabulary] = useState<Vocabulary | null>(null);
  const [lookForm, setLookForm] = useState(emptyLook);
  const [newLookForm, setNewLookForm] = useState(emptyLook);
  const [roleForm, setRoleForm] = useState(emptyRole);
  const [stepForm, setStepForm] = useState(emptyStep);
  const [storeForm, setStoreForm] = useState(emptyStore);
  const [offerForm, setOfferForm] = useState(emptyOffer);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedLook = useMemo(
    () => looks.find((look) => look.id === selectedLookId) ?? null,
    [looks, selectedLookId]
  );

  const load = async () => {
    setError(null);
    setLoading(true);
    try {
      const [nextLooks, nextStores, nextOffers, nextVocabulary] = await Promise.all([
        api.listLooks(),
        api.listStores(),
        api.listOffers(),
        api.getVocabulary()
      ]);
      setLooks(nextLooks);
      setStores(nextStores);
      setOffers(nextOffers);
      setVocabulary(nextVocabulary);
      setSelectedLookId((current) => current ?? nextLooks[0]?.id ?? null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось загрузить админку");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (!selectedLook) {
      return;
    }
    setLookForm({
      slug: selectedLook.slug,
      title: selectedLook.title,
      description: selectedLook.description,
      difficulty: selectedLook.difficulty,
      occasion: selectedLook.occasion,
      reference_image_url: selectedLook.reference_image_url ?? "",
      is_active: selectedLook.is_active
    });

    const loadLookDetails = async () => {
      setError(null);
      try {
        const [nextRoles, nextTutorials] = await Promise.all([
          api.listRoles(selectedLook.id),
          api.listTutorials(selectedLook.id)
        ]);
        setRoles(nextRoles);
        setTutorial(nextTutorials[0] ?? null);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Не удалось загрузить детали образа");
      }
    };

    void loadLookDetails();
  }, [selectedLook]);

  const saveLook = async () => {
    if (!selectedLook) {
      return;
    }
    await runSaving(async () => {
      const updated = await api.updateLook(selectedLook.id, {
        ...lookForm,
        reference_image_url: emptyToNull(lookForm.reference_image_url)
      });
      setLooks((current) => current.map((look) => (look.id === updated.id ? updated : look)));
    });
  };

  const createLook = async () => {
    await runSaving(async () => {
      const created = await api.createLook({
        ...newLookForm,
        reference_image_url: emptyToNull(newLookForm.reference_image_url)
      });
      setLooks((current) => [...current, created]);
      setSelectedLookId(created.id);
      setNewLookForm(emptyLook);
    });
  };

  const createRole = async () => {
    if (!selectedLook) {
      return;
    }
    await runSaving(async () => {
      const created = await api.createRole({
        look_id: selectedLook.id,
        role_key: roleForm.role_key,
        title: roleForm.title,
        description: roleForm.description,
        required: true,
        native_category: roleForm.native_category,
        accepted_categories: splitTokens(roleForm.accepted_categories),
        accepted_color_families: splitTokens(roleForm.accepted_color_families),
        accepted_undertones: splitTokens(roleForm.accepted_undertones),
        accepted_finishes: splitTokens(roleForm.accepted_finishes),
        accepted_textures: splitTokens(roleForm.accepted_textures),
        accepted_coverage: splitTokens(roleForm.accepted_coverage),
        intensity_min: parseOptionalNumber(roleForm.intensity_min),
        intensity_max: parseOptionalNumber(roleForm.intensity_max),
        sort_order: roles.length + 1
      });
      setRoles((current) => [...current, created]);
      setRoleForm(emptyRole);
    });
  };

  const saveTutorial = async () => {
    if (!tutorial) {
      return;
    }
    await runSaving(async () => {
      const updated = await api.updateTutorial(tutorial.id, {
        title: tutorial.title,
        summary: tutorial.summary
      });
      setTutorial(updated);
    });
  };

  const createStep = async () => {
    if (!tutorial) {
      return;
    }
    await runSaving(async () => {
      const created = await api.createStep({
        tutorial_id: tutorial.id,
        look_role_id: parseOptionalNumber(stepForm.look_role_id),
        step_number: tutorial.steps.length + 1,
        title: stepForm.title,
        instruction: stepForm.instruction,
        technique_tip: emptyToNull(stepForm.technique_tip),
        common_mistake: emptyToNull(stepForm.common_mistake)
      });
      setTutorial({ ...tutorial, steps: [...tutorial.steps, created] });
      setStepForm(emptyStep);
    });
  };

  const createStore = async () => {
    await runSaving(async () => {
      const created = await api.createStore({
        name: storeForm.name,
        city: storeForm.city,
        country: storeForm.country,
        latitude: Number(storeForm.latitude),
        longitude: Number(storeForm.longitude)
      });
      setStores((current) => [...current, created]);
      setStoreForm(emptyStore);
    });
  };

  const createOffer = async () => {
    await runSaving(async () => {
      const created = await api.createOffer({
        store_id: Number(offerForm.store_id),
        product_name: offerForm.product_name,
        brand: offerForm.brand,
        category: offerForm.category,
        color_family: emptyToNull(offerForm.color_family),
        price: Number(offerForm.price),
        currency: offerForm.currency,
        availability_status: offerForm.availability_status,
        source_label: offerForm.source_label
      });
      setOffers((current) => [...current, created]);
      setOfferForm(emptyOffer);
    });
  };

  const runSaving = async (action: () => Promise<void>) => {
    setSaving(true);
    setError(null);
    try {
      await action();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main>
      <header className="top">
        <div>
          <p className="eyebrow">Makeup Personal Admin</p>
          <h1>Контент и каталог</h1>
        </div>
        <button onClick={() => void load()} type="button">
          Обновить
        </button>
      </header>

      {error ? <div className="error">{error}</div> : null}
      {loading ? <div className="muted">Загрузка</div> : null}

      <section className="layout">
        <aside className="sidebar">
          <h2>Образы</h2>
          {looks.map((look) => (
            <button
              className={look.id === selectedLookId ? "lookButton active" : "lookButton"}
              key={look.id}
              onClick={() => setSelectedLookId(look.id)}
              type="button"
            >
              <span>{look.title}</span>
              <small>{look.slug}</small>
            </button>
          ))}
        </aside>

        <div className="workspace">
          <section className="panel">
            <h2>Новый look</h2>
            <LookFields form={newLookForm} setForm={setNewLookForm} />
            <button disabled={saving} onClick={() => void createLook()} type="button">
              Создать look
            </button>
          </section>

          {selectedLook ? (
            <section className="panel">
              <h2>Редактирование look</h2>
              <LookFields form={lookForm} setForm={setLookForm} />
              <div className="actions">
                <button disabled={saving} onClick={() => void saveLook()} type="button">
                  Сохранить
                </button>
                <button
                  className="danger"
                  disabled={saving}
                  onClick={() => void runSaving(async () => {
                    await api.deleteLook(selectedLook.id);
                    setLooks((current) => current.filter((look) => look.id !== selectedLook.id));
                    setSelectedLookId(looks.find((look) => look.id !== selectedLook.id)?.id ?? null);
                  })}
                  type="button"
                >
                  Удалить
                </button>
              </div>
            </section>
          ) : null}

          <section className="panel">
            <h2>Роли образа</h2>
            <div className="list">
              {roles.map((role) => (
                <div className="row" key={role.id}>
                  <div>
                    <strong>{role.title}</strong>
                    <small>{role.role_key} · {role.native_category}</small>
                  </div>
                  <button className="ghost" onClick={() => void runSaving(async () => {
                    await api.deleteRole(role.id);
                    setRoles((current) => current.filter((item) => item.id !== role.id));
                  })} type="button">
                    Удалить
                  </button>
                </div>
              ))}
            </div>
            <div className="grid two">
              <Field label="role_key" value={roleForm.role_key} onChange={(value) => setRoleForm({ ...roleForm, role_key: value })} />
              <Field label="Название" value={roleForm.title} onChange={(value) => setRoleForm({ ...roleForm, title: value })} />
              <Field label="Описание" value={roleForm.description} onChange={(value) => setRoleForm({ ...roleForm, description: value })} />
              <SelectField label="Категория" options={vocabulary?.categories ?? []} value={roleForm.native_category} onChange={(value) => setRoleForm({ ...roleForm, native_category: value, accepted_categories: value })} />
              <Field label="accepted categories" value={roleForm.accepted_categories} onChange={(value) => setRoleForm({ ...roleForm, accepted_categories: value })} />
              <Field label="color families" value={roleForm.accepted_color_families} onChange={(value) => setRoleForm({ ...roleForm, accepted_color_families: value })} />
              <Field label="undertones" value={roleForm.accepted_undertones} onChange={(value) => setRoleForm({ ...roleForm, accepted_undertones: value })} />
              <Field label="finishes" value={roleForm.accepted_finishes} onChange={(value) => setRoleForm({ ...roleForm, accepted_finishes: value })} />
              <Field label="textures" value={roleForm.accepted_textures} onChange={(value) => setRoleForm({ ...roleForm, accepted_textures: value })} />
              <Field label="coverage" value={roleForm.accepted_coverage} onChange={(value) => setRoleForm({ ...roleForm, accepted_coverage: value })} />
              <Field label="min intensity" value={roleForm.intensity_min} onChange={(value) => setRoleForm({ ...roleForm, intensity_min: value })} />
              <Field label="max intensity" value={roleForm.intensity_max} onChange={(value) => setRoleForm({ ...roleForm, intensity_max: value })} />
            </div>
            <button disabled={saving || !selectedLook} onClick={() => void createRole()} type="button">
              Добавить роль
            </button>
          </section>

          {tutorial ? (
            <section className="panel">
              <h2>Урок</h2>
              <Field label="Название урока" value={tutorial.title} onChange={(value) => setTutorial({ ...tutorial, title: value })} />
              <Textarea label="Summary" value={tutorial.summary} onChange={(value) => setTutorial({ ...tutorial, summary: value })} />
              <button disabled={saving} onClick={() => void saveTutorial()} type="button">
                Сохранить урок
              </button>
              <div className="list">
                {tutorial.steps.map((step) => (
                  <div className="row" key={step.id}>
                    <div>
                      <strong>{step.step_number}. {step.title}</strong>
                      <small>{step.instruction}</small>
                    </div>
                    <button className="ghost" onClick={() => void runSaving(async () => {
                      await api.deleteStep(step.id);
                      setTutorial({ ...tutorial, steps: tutorial.steps.filter((item) => item.id !== step.id) });
                    })} type="button">
                      Удалить
                    </button>
                  </div>
                ))}
              </div>
              <div className="grid two">
                <Field label="Название шага" value={stepForm.title} onChange={(value) => setStepForm({ ...stepForm, title: value })} />
                <SelectField label="Роль" options={roles.map((role) => String(role.id))} value={stepForm.look_role_id} onChange={(value) => setStepForm({ ...stepForm, look_role_id: value })} />
                <Textarea label="Инструкция" value={stepForm.instruction} onChange={(value) => setStepForm({ ...stepForm, instruction: value })} />
                <Textarea label="Техника" value={stepForm.technique_tip} onChange={(value) => setStepForm({ ...stepForm, technique_tip: value })} />
                <Textarea label="Ошибка" value={stepForm.common_mistake} onChange={(value) => setStepForm({ ...stepForm, common_mistake: value })} />
              </div>
              <button disabled={saving} onClick={() => void createStep()} type="button">
                Добавить шаг
              </button>
            </section>
          ) : null}

          <section className="panel">
            <h2>Stores и offers</h2>
            <div className="grid two">
              <Field label="Store name" value={storeForm.name} onChange={(value) => setStoreForm({ ...storeForm, name: value })} />
              <Field label="City" value={storeForm.city} onChange={(value) => setStoreForm({ ...storeForm, city: value })} />
              <Field label="Country" value={storeForm.country} onChange={(value) => setStoreForm({ ...storeForm, country: value })} />
              <Field label="Latitude" value={storeForm.latitude} onChange={(value) => setStoreForm({ ...storeForm, latitude: value })} />
              <Field label="Longitude" value={storeForm.longitude} onChange={(value) => setStoreForm({ ...storeForm, longitude: value })} />
            </div>
            <button disabled={saving} onClick={() => void createStore()} type="button">
              Добавить store
            </button>

            <div className="grid two">
              <SelectField label="Store" options={stores.map((store) => String(store.id))} value={offerForm.store_id} onChange={(value) => setOfferForm({ ...offerForm, store_id: value })} />
              <Field label="Product" value={offerForm.product_name} onChange={(value) => setOfferForm({ ...offerForm, product_name: value })} />
              <Field label="Brand" value={offerForm.brand} onChange={(value) => setOfferForm({ ...offerForm, brand: value })} />
              <SelectField label="Category" options={vocabulary?.categories ?? []} value={offerForm.category} onChange={(value) => setOfferForm({ ...offerForm, category: value })} />
              <Field label="Color" value={offerForm.color_family} onChange={(value) => setOfferForm({ ...offerForm, color_family: value })} />
              <Field label="Price" value={offerForm.price} onChange={(value) => setOfferForm({ ...offerForm, price: value })} />
              <Field label="Currency" value={offerForm.currency} onChange={(value) => setOfferForm({ ...offerForm, currency: value })} />
              <SelectField label="Status" options={vocabulary?.offer_statuses ?? []} value={offerForm.availability_status} onChange={(value) => setOfferForm({ ...offerForm, availability_status: value })} />
            </div>
            <button disabled={saving} onClick={() => void createOffer()} type="button">
              Добавить offer
            </button>

            <div className="list">
              {offers.map((offer) => (
                <div className="row" key={offer.id}>
                  <div>
                    <strong>{offer.brand} · {offer.product_name}</strong>
                    <small>{offer.store?.name ?? offer.store_id} · {offer.category} · {offer.price} {offer.currency}</small>
                  </div>
                  <button className="ghost" onClick={() => void runSaving(async () => {
                    await api.deleteOffer(offer.id);
                    setOffers((current) => current.filter((item) => item.id !== offer.id));
                  })} type="button">
                    Удалить
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

type LookForm = typeof emptyLook;

function LookFields({ form, setForm }: { form: LookForm; setForm: (form: LookForm) => void }) {
  return (
    <div className="grid two">
      <Field label="Slug" value={form.slug} onChange={(value) => setForm({ ...form, slug: value })} />
      <Field label="Название" value={form.title} onChange={(value) => setForm({ ...form, title: value })} />
      <Textarea label="Описание" value={form.description} onChange={(value) => setForm({ ...form, description: value })} />
      <Field label="Difficulty" value={form.difficulty} onChange={(value) => setForm({ ...form, difficulty: value })} />
      <Field label="Occasion" value={form.occasion} onChange={(value) => setForm({ ...form, occasion: value })} />
      <Field label="Reference URL" value={form.reference_image_url} onChange={(value) => setForm({ ...form, reference_image_url: value })} />
      <label className="check">
        <input checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} type="checkbox" />
        Активен
      </label>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="field wide">
      <span>{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function SelectField({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (value: string) => void }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Не выбрано</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function splitTokens(value: string): string[] {
  return value.split(",").map((token) => token.trim()).filter(Boolean);
}

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function parseOptionalNumber(value: string): number | null {
  const parsed = Number(value);
  return value.trim() && Number.isFinite(parsed) ? parsed : null;
}
