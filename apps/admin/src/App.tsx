import { useEffect, useMemo, useState } from "react";

import { api, getAdminToken, setAdminToken as persistAdminToken } from "./api";
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
  required: true,
  native_category: "blush",
  accepted_categories: "blush",
  accepted_color_families: "",
  accepted_undertones: "",
  accepted_finishes: "",
  accepted_textures: "",
  accepted_coverage: "",
  intensity_min: "",
  intensity_max: "",
  sort_order: ""
};

const emptyStep = {
  step_number: "",
  title: "",
  instruction: "",
  technique_tip: "",
  common_mistake: "",
  look_role_id: ""
};

const emptyTutorial = {
  title: "",
  summary: ""
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
  const [tutorialForm, setTutorialForm] = useState(emptyTutorial);
  const [stepForm, setStepForm] = useState(emptyStep);
  const [storeForm, setStoreForm] = useState(emptyStore);
  const [offerForm, setOfferForm] = useState(emptyOffer);
  const [adminToken, setAdminToken] = useState(getAdminToken());
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

  const saveAdminToken = () => {
    persistAdminToken(adminToken);
    void load();
  };

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (!selectedLook) {
      setRoles([]);
      setTutorial(null);
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
        ...rolePayload(roleForm, roles.length + 1)
      });
      setRoles((current) => sortRoles([...current, created]));
      setRoleForm(emptyRole);
    });
  };

  const updateRole = async (roleId: number, form: RoleForm) => {
    await runSaving(async () => {
      const updated = await api.updateRole(roleId, rolePayload(form));
      setRoles((current) => sortRoles(current.map((role) => (role.id === updated.id ? updated : role))));
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

  const createTutorial = async () => {
    if (!selectedLook) {
      return;
    }
    await runSaving(async () => {
      const created = await api.createTutorial({
        look_id: selectedLook.id,
        title: tutorialForm.title,
        summary: tutorialForm.summary
      });
      setTutorial(created);
      setTutorialForm(emptyTutorial);
    });
  };

  const deleteTutorial = async () => {
    if (!tutorial) {
      return;
    }
    await runSaving(async () => {
      await api.deleteTutorial(tutorial.id);
      setTutorial(null);
      setStepForm(emptyStep);
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
        step_number: parseOptionalNumber(stepForm.step_number) ?? tutorial.steps.length + 1,
        title: stepForm.title,
        instruction: stepForm.instruction,
        technique_tip: emptyToNull(stepForm.technique_tip),
        common_mistake: emptyToNull(stepForm.common_mistake)
      });
      setTutorial({ ...tutorial, steps: sortSteps([...tutorial.steps, created]) });
      setStepForm(emptyStep);
    });
  };

  const updateStep = async (stepId: number, form: StepForm) => {
    if (!tutorial) {
      return;
    }
    await runSaving(async () => {
      const updated = await api.updateStep(stepId, {
        look_role_id: parseOptionalNumber(form.look_role_id),
        step_number: parseOptionalNumber(form.step_number) ?? undefined,
        title: form.title,
        instruction: form.instruction,
        technique_tip: emptyToNull(form.technique_tip),
        common_mistake: emptyToNull(form.common_mistake)
      });
      setTutorial({
        ...tutorial,
        steps: sortSteps(tutorial.steps.map((step) => (step.id === updated.id ? updated : step)))
      });
    });
  };

  const createStore = async () => {
    await runSaving(async () => {
      const created = await api.createStore({
        ...storePayload(storeForm)
      });
      setStores((current) => sortStores([...current, created]));
      setStoreForm(emptyStore);
    });
  };

  const updateStore = async (storeId: number, form: StoreForm) => {
    await runSaving(async () => {
      const updated = await api.updateStore(storeId, storePayload(form));
      setStores((current) => sortStores(current.map((store) => (store.id === updated.id ? updated : store))));
      setOffers((current) =>
        current.map((offer) => (offer.store_id === updated.id ? { ...offer, store: updated } : offer))
      );
    });
  };

  const deleteStore = async (storeId: number) => {
    await runSaving(async () => {
      await api.deleteStore(storeId);
      setStores((current) => current.filter((store) => store.id !== storeId));
      setOffers((current) => current.filter((offer) => offer.store_id !== storeId));
    });
  };

  const createOffer = async () => {
    await runSaving(async () => {
      const created = await api.createOffer(offerPayload(offerForm));
      setOffers((current) => [...current, created]);
      setOfferForm(emptyOffer);
    });
  };

  const updateOffer = async (offerId: number, form: OfferForm) => {
    await runSaving(async () => {
      const updated = await api.updateOffer(offerId, offerPayload(form));
      setOffers((current) => current.map((offer) => (offer.id === updated.id ? updated : offer)));
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
        <div className="topActions">
          <label className="tokenField">
            <span>Admin token</span>
            <input
              autoComplete="off"
              value={adminToken}
              onChange={(event) => setAdminToken(event.target.value)}
              placeholder="X-Admin-Token"
              type="password"
            />
          </label>
          <button onClick={saveAdminToken} type="button">
            Применить
          </button>
          <button className="ghost" onClick={() => void load()} type="button">
            Обновить
          </button>
        </div>
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
                <RoleEditor
                  disabled={saving}
                  key={role.id}
                  role={role}
                  vocabulary={vocabulary}
                  onDelete={() => runSaving(async () => {
                    await api.deleteRole(role.id);
                    setRoles((current) => current.filter((item) => item.id !== role.id));
                  })}
                  onSave={(form) => updateRole(role.id, form)}
                />
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
              <Field label="sort order" value={roleForm.sort_order} onChange={(value) => setRoleForm({ ...roleForm, sort_order: value })} />
              <label className="check">
                <input checked={roleForm.required} onChange={(event) => setRoleForm({ ...roleForm, required: event.target.checked })} type="checkbox" />
                Обязательная роль
              </label>
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
              <div className="actions">
                <button disabled={saving} onClick={() => void saveTutorial()} type="button">
                  Сохранить урок
                </button>
                <button className="danger" disabled={saving} onClick={() => void deleteTutorial()} type="button">
                  Удалить урок
                </button>
              </div>
              <div className="list">
                {tutorial.steps.map((step) => (
                  <StepEditor
                    disabled={saving}
                    key={step.id}
                    roles={roles}
                    step={step}
                    onDelete={() => runSaving(async () => {
                      await api.deleteStep(step.id);
                      setTutorial({ ...tutorial, steps: tutorial.steps.filter((item) => item.id !== step.id) });
                    })}
                    onSave={(form) => updateStep(step.id, form)}
                  />
                ))}
              </div>
              <div className="grid two">
                <Field label="Номер шага" value={stepForm.step_number} onChange={(value) => setStepForm({ ...stepForm, step_number: value })} />
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
          ) : selectedLook ? (
            <section className="panel">
              <h2>Урок</h2>
              <Field label="Название урока" value={tutorialForm.title} onChange={(value) => setTutorialForm({ ...tutorialForm, title: value })} />
              <Textarea label="Summary" value={tutorialForm.summary} onChange={(value) => setTutorialForm({ ...tutorialForm, summary: value })} />
              <button disabled={saving} onClick={() => void createTutorial()} type="button">
                Создать урок
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

            <div className="list">
              {stores.map((store) => (
                <StoreEditor
                  disabled={saving}
                  key={store.id}
                  store={store}
                  onDelete={() => deleteStore(store.id)}
                  onSave={(form) => updateStore(store.id, form)}
                />
              ))}
            </div>

            <div className="grid two">
              <SelectField label="Store" options={stores.map((store) => String(store.id))} value={offerForm.store_id} onChange={(value) => setOfferForm({ ...offerForm, store_id: value })} />
              <Field label="Product" value={offerForm.product_name} onChange={(value) => setOfferForm({ ...offerForm, product_name: value })} />
              <Field label="Brand" value={offerForm.brand} onChange={(value) => setOfferForm({ ...offerForm, brand: value })} />
              <SelectField label="Category" options={vocabulary?.categories ?? []} value={offerForm.category} onChange={(value) => setOfferForm({ ...offerForm, category: value })} />
              <Field label="Color" value={offerForm.color_family} onChange={(value) => setOfferForm({ ...offerForm, color_family: value })} />
              <Field label="Price" value={offerForm.price} onChange={(value) => setOfferForm({ ...offerForm, price: value })} />
              <Field label="Currency" value={offerForm.currency} onChange={(value) => setOfferForm({ ...offerForm, currency: value })} />
              <SelectField label="Status" options={vocabulary?.offer_statuses ?? []} value={offerForm.availability_status} onChange={(value) => setOfferForm({ ...offerForm, availability_status: value })} />
              <Textarea label="Source label" value={offerForm.source_label} onChange={(value) => setOfferForm({ ...offerForm, source_label: value })} />
            </div>
            <button disabled={saving} onClick={() => void createOffer()} type="button">
              Добавить offer
            </button>

            <div className="list">
              {offers.map((offer) => (
                <OfferEditor
                  disabled={saving}
                  key={offer.id}
                  offer={offer}
                  stores={stores}
                  vocabulary={vocabulary}
                  onDelete={() => runSaving(async () => {
                    await api.deleteOffer(offer.id);
                    setOffers((current) => current.filter((item) => item.id !== offer.id));
                  })}
                  onSave={(form) => updateOffer(offer.id, form)}
                />
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

type LookForm = typeof emptyLook;
type RoleForm = typeof emptyRole;
type StepForm = typeof emptyStep;
type StoreForm = typeof emptyStore;
type OfferForm = typeof emptyOffer;

function RoleEditor({
  disabled,
  role,
  vocabulary,
  onDelete,
  onSave
}: {
  disabled: boolean;
  role: LookRole;
  vocabulary: Vocabulary | null;
  onDelete: () => Promise<void>;
  onSave: (form: RoleForm) => Promise<void>;
}) {
  const [form, setForm] = useState<RoleForm>(roleToForm(role));

  useEffect(() => {
    setForm(roleToForm(role));
  }, [role]);

  return (
    <div className="row editableRow">
      <div className="rowTitle">
        <strong>{role.sort_order}. {role.title}</strong>
        <small>{role.role_key} · {role.native_category}</small>
      </div>
      <div className="grid two">
        <Field label="role_key" value={form.role_key} onChange={(value) => setForm({ ...form, role_key: value })} />
        <Field label="Название" value={form.title} onChange={(value) => setForm({ ...form, title: value })} />
        <Textarea label="Описание" value={form.description} onChange={(value) => setForm({ ...form, description: value })} />
        <SelectField label="Категория" options={vocabulary?.categories ?? []} value={form.native_category} onChange={(value) => setForm({ ...form, native_category: value })} />
        <Field label="accepted categories" value={form.accepted_categories} onChange={(value) => setForm({ ...form, accepted_categories: value })} />
        <Field label="color families" value={form.accepted_color_families} onChange={(value) => setForm({ ...form, accepted_color_families: value })} />
        <Field label="undertones" value={form.accepted_undertones} onChange={(value) => setForm({ ...form, accepted_undertones: value })} />
        <Field label="finishes" value={form.accepted_finishes} onChange={(value) => setForm({ ...form, accepted_finishes: value })} />
        <Field label="textures" value={form.accepted_textures} onChange={(value) => setForm({ ...form, accepted_textures: value })} />
        <Field label="coverage" value={form.accepted_coverage} onChange={(value) => setForm({ ...form, accepted_coverage: value })} />
        <Field label="min intensity" value={form.intensity_min} onChange={(value) => setForm({ ...form, intensity_min: value })} />
        <Field label="max intensity" value={form.intensity_max} onChange={(value) => setForm({ ...form, intensity_max: value })} />
        <Field label="sort order" value={form.sort_order} onChange={(value) => setForm({ ...form, sort_order: value })} />
        <label className="check">
          <input checked={form.required} onChange={(event) => setForm({ ...form, required: event.target.checked })} type="checkbox" />
          Обязательная роль
        </label>
      </div>
      <div className="actions">
        <button disabled={disabled} onClick={() => void onSave(form)} type="button">
          Сохранить роль
        </button>
        <button className="ghost" disabled={disabled} onClick={() => setForm(roleToForm(role))} type="button">
          Сбросить
        </button>
        <button className="danger" disabled={disabled} onClick={() => void onDelete()} type="button">
          Удалить
        </button>
      </div>
    </div>
  );
}

function StepEditor({
  disabled,
  roles,
  step,
  onDelete,
  onSave
}: {
  disabled: boolean;
  roles: LookRole[];
  step: TutorialStep;
  onDelete: () => Promise<void>;
  onSave: (form: StepForm) => Promise<void>;
}) {
  const [form, setForm] = useState<StepForm>(stepToForm(step));

  useEffect(() => {
    setForm(stepToForm(step));
  }, [step]);

  return (
    <div className="row editableRow">
      <div className="rowTitle">
        <strong>{step.step_number}. {step.title}</strong>
        <small>{step.instruction}</small>
      </div>
      <div className="grid two">
        <Field label="Номер шага" value={form.step_number} onChange={(value) => setForm({ ...form, step_number: value })} />
        <Field label="Название шага" value={form.title} onChange={(value) => setForm({ ...form, title: value })} />
        <SelectField label="Роль" options={roles.map((role) => String(role.id))} value={form.look_role_id} onChange={(value) => setForm({ ...form, look_role_id: value })} />
        <Textarea label="Инструкция" value={form.instruction} onChange={(value) => setForm({ ...form, instruction: value })} />
        <Textarea label="Техника" value={form.technique_tip} onChange={(value) => setForm({ ...form, technique_tip: value })} />
        <Textarea label="Ошибка" value={form.common_mistake} onChange={(value) => setForm({ ...form, common_mistake: value })} />
      </div>
      <div className="actions">
        <button disabled={disabled} onClick={() => void onSave(form)} type="button">
          Сохранить шаг
        </button>
        <button className="ghost" disabled={disabled} onClick={() => setForm(stepToForm(step))} type="button">
          Сбросить
        </button>
        <button className="danger" disabled={disabled} onClick={() => void onDelete()} type="button">
          Удалить
        </button>
      </div>
    </div>
  );
}

function StoreEditor({
  disabled,
  store,
  onDelete,
  onSave
}: {
  disabled: boolean;
  store: Store;
  onDelete: () => Promise<void>;
  onSave: (form: StoreForm) => Promise<void>;
}) {
  const [form, setForm] = useState<StoreForm>(storeToForm(store));

  useEffect(() => {
    setForm(storeToForm(store));
  }, [store]);

  return (
    <div className="row editableRow">
      <div className="rowTitle">
        <strong>{store.name}</strong>
        <small>{store.city}, {store.country} · {store.latitude}, {store.longitude}</small>
      </div>
      <div className="grid two">
        <Field label="Store name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
        <Field label="City" value={form.city} onChange={(value) => setForm({ ...form, city: value })} />
        <Field label="Country" value={form.country} onChange={(value) => setForm({ ...form, country: value })} />
        <Field label="Latitude" value={form.latitude} onChange={(value) => setForm({ ...form, latitude: value })} />
        <Field label="Longitude" value={form.longitude} onChange={(value) => setForm({ ...form, longitude: value })} />
      </div>
      <div className="actions">
        <button disabled={disabled} onClick={() => void onSave(form)} type="button">
          Сохранить store
        </button>
        <button className="ghost" disabled={disabled} onClick={() => setForm(storeToForm(store))} type="button">
          Сбросить
        </button>
        <button className="danger" disabled={disabled} onClick={() => void onDelete()} type="button">
          Удалить
        </button>
      </div>
    </div>
  );
}

function OfferEditor({
  disabled,
  offer,
  stores,
  vocabulary,
  onDelete,
  onSave
}: {
  disabled: boolean;
  offer: StoreOffer;
  stores: Store[];
  vocabulary: Vocabulary | null;
  onDelete: () => Promise<void>;
  onSave: (form: OfferForm) => Promise<void>;
}) {
  const [form, setForm] = useState<OfferForm>(offerToForm(offer));

  useEffect(() => {
    setForm(offerToForm(offer));
  }, [offer]);

  return (
    <div className="row editableRow">
      <div className="rowTitle">
        <strong>{offer.brand} · {offer.product_name}</strong>
        <small>{offer.store?.name ?? offer.store_id} · {offer.category} · {offer.price} {offer.currency}</small>
      </div>
      <div className="grid two">
        <SelectField label="Store" options={stores.map((store) => String(store.id))} value={form.store_id} onChange={(value) => setForm({ ...form, store_id: value })} />
        <Field label="Product" value={form.product_name} onChange={(value) => setForm({ ...form, product_name: value })} />
        <Field label="Brand" value={form.brand} onChange={(value) => setForm({ ...form, brand: value })} />
        <SelectField label="Category" options={vocabulary?.categories ?? []} value={form.category} onChange={(value) => setForm({ ...form, category: value })} />
        <Field label="Color" value={form.color_family} onChange={(value) => setForm({ ...form, color_family: value })} />
        <Field label="Price" value={form.price} onChange={(value) => setForm({ ...form, price: value })} />
        <Field label="Currency" value={form.currency} onChange={(value) => setForm({ ...form, currency: value })} />
        <SelectField label="Status" options={vocabulary?.offer_statuses ?? []} value={form.availability_status} onChange={(value) => setForm({ ...form, availability_status: value })} />
        <Textarea label="Source label" value={form.source_label} onChange={(value) => setForm({ ...form, source_label: value })} />
      </div>
      <div className="actions">
        <button disabled={disabled} onClick={() => void onSave(form)} type="button">
          Сохранить offer
        </button>
        <button className="ghost" disabled={disabled} onClick={() => setForm(offerToForm(offer))} type="button">
          Сбросить
        </button>
        <button className="danger" disabled={disabled} onClick={() => void onDelete()} type="button">
          Удалить
        </button>
      </div>
    </div>
  );
}

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

function roleToForm(role: LookRole): RoleForm {
  return {
    role_key: role.role_key,
    title: role.title,
    description: role.description,
    required: role.required,
    native_category: role.native_category,
    accepted_categories: role.accepted_categories.join(", "),
    accepted_color_families: role.accepted_color_families.join(", "),
    accepted_undertones: role.accepted_undertones.join(", "),
    accepted_finishes: role.accepted_finishes.join(", "),
    accepted_textures: role.accepted_textures.join(", "),
    accepted_coverage: role.accepted_coverage.join(", "),
    intensity_min: numberToForm(role.intensity_min),
    intensity_max: numberToForm(role.intensity_max),
    sort_order: String(role.sort_order)
  };
}

function rolePayload(form: RoleForm, fallbackSortOrder = 0): Partial<LookRole> {
  return {
    role_key: form.role_key,
    title: form.title,
    description: form.description,
    required: form.required,
    native_category: form.native_category,
    accepted_categories: splitTokens(form.accepted_categories),
    accepted_color_families: splitTokens(form.accepted_color_families),
    accepted_undertones: splitTokens(form.accepted_undertones),
    accepted_finishes: splitTokens(form.accepted_finishes),
    accepted_textures: splitTokens(form.accepted_textures),
    accepted_coverage: splitTokens(form.accepted_coverage),
    intensity_min: parseOptionalNumber(form.intensity_min),
    intensity_max: parseOptionalNumber(form.intensity_max),
    sort_order: parseOptionalNumber(form.sort_order) ?? fallbackSortOrder
  };
}

function stepToForm(step: TutorialStep): StepForm {
  return {
    step_number: String(step.step_number),
    title: step.title,
    instruction: step.instruction,
    technique_tip: step.technique_tip ?? "",
    common_mistake: step.common_mistake ?? "",
    look_role_id: numberToForm(step.look_role_id)
  };
}

function storeToForm(store: Store): StoreForm {
  return {
    name: store.name,
    city: store.city,
    country: store.country,
    latitude: String(store.latitude),
    longitude: String(store.longitude)
  };
}

function storePayload(form: StoreForm): Partial<Store> {
  return {
    name: form.name,
    city: form.city,
    country: form.country,
    latitude: Number(form.latitude),
    longitude: Number(form.longitude)
  };
}

function offerToForm(offer: StoreOffer): OfferForm {
  return {
    store_id: String(offer.store_id),
    product_name: offer.product_name,
    brand: offer.brand,
    category: offer.category,
    color_family: offer.color_family ?? "",
    price: String(offer.price),
    currency: offer.currency,
    availability_status: offer.availability_status,
    source_label: offer.source_label
  };
}

function offerPayload(form: OfferForm): Partial<StoreOffer> {
  return {
    store_id: Number(form.store_id),
    product_name: form.product_name,
    brand: form.brand,
    category: form.category,
    color_family: emptyToNull(form.color_family),
    price: Number(form.price),
    currency: form.currency,
    availability_status: form.availability_status,
    source_label: form.source_label
  };
}

function sortRoles(roles: LookRole[]): LookRole[] {
  return [...roles].sort((left, right) => left.sort_order - right.sort_order || left.id - right.id);
}

function sortSteps(steps: TutorialStep[]): TutorialStep[] {
  return [...steps].sort((left, right) => left.step_number - right.step_number || left.id - right.id);
}

function sortStores(stores: Store[]): Store[] {
  return [...stores].sort((left, right) => left.name.localeCompare(right.name));
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

function numberToForm(value: number | null): string {
  return value === null ? "" : String(value);
}
