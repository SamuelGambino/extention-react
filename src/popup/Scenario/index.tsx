import "./index.css";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Step from "../Step";
import type { ParserTabConfig } from "../../globalTypes/parser_сonfig";

// ── step type meta ──────────────────────────────────────────────────────────

export type StepType =
  | "navigate"
  | "collect"
  | "extract"
  | "click"
  | "loop"
  | "wait"
  | "store"
  | "condition";

export const STEP_META: Record<
  StepType,
  { color: string; placeholder: string; desc: string }
> = {
  navigate: { color: "#4a85c8", placeholder: "$vars.source", desc: "Перейти по URL" },
  collect: { color: "#4aaa8a", placeholder: ".category-link", desc: "Собрать ссылки по селектору" },
  extract: { color: "#5acf8a", placeholder: ".name, .price, img", desc: "Извлечь данные из DOM" },
  click: { color: "#9a8acc", placeholder: ".btn-selector", desc: "Клик по элементу" },
  loop: { color: "#7aaee0", placeholder: ".product-card", desc: "Цикл по элементам" },
  wait: { color: "#c8963a", placeholder: "1200", desc: "Пауза (мс)" },
  store: { color: "#c07acc", placeholder: "$vars.key", desc: "Сохранить в переменную" },
  condition: { color: "#cc7a5a", placeholder: "$$current.length > 0", desc: "Условное ветвление" },
};

const STEP_TYPES = Object.keys(STEP_META) as StepType[];

// ── component ────────────────────────────────────────────────────────────────

const Scenario = () => {
  const { control } = useFormContext<ParserTabConfig>();
  const [selectedType, setSelectedType] = useState<StepType>("navigate");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { fields, move, append, remove } = useFieldArray({
    control,
    name: "data.steps",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);
    move(oldIndex, newIndex);
  };

  const handleAddStep = () => {
    const meta = STEP_META[selectedType];
    append({
      type: selectedType,
      // fill in required fields by type
      ...(selectedType === "navigate" && { url: meta.placeholder }),
      ...(selectedType === "collect" && { selector: meta.placeholder, urlMode: false }),
      ...(selectedType === "extract" && { fields: [] }),
      ...(selectedType === "click" && { selector: meta.placeholder }),
      ...(selectedType === "loop" && { selector: meta.placeholder, children: [] }),
      ...(selectedType === "wait" && { ms: 1200 }),
      ...(selectedType === "store" && { key: "key", value: "" }),
      ...(selectedType === "condition" && { condition: meta.placeholder, children: [] }),
    } as any);
  };

  const selectedMeta = STEP_META[selectedType];

  return (
    <fieldset className="scenario">
      <legend className="scenario__title">Scenario Builder</legend>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={fields} strategy={verticalListSortingStrategy}>
          <div className="scenario__steps">
            {fields.length === 0 && (
              <div className="scenario__empty">
                — no steps · add one below —
              </div>
            )}
            {fields.map((step, index) => (
              <Step
                key={step.id}
                index={index}
                step={step as any}
                onRemove={() => remove(index)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* ── add step row ── */}
      <div className="scenario__add">
        {/* dropdown */}
        <div
          className={`scenario__sel ${dropdownOpen ? "scenario__sel--open" : ""}`}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setDropdownOpen(false);
            }
          }}
          tabIndex={-1}
        >
          <div className="scenario__sel-corner" />
          <button
            type="button"
            className="scenario__sel-btn"
            onClick={() => setDropdownOpen((v) => !v)}
          >
            <span
              className="scenario__sel-dot"
              style={{ background: selectedMeta.color }}
            />
            <span
              className="scenario__sel-val"
              style={{ color: selectedMeta.color }}
            >
              {selectedType}
            </span>
            <svg
              className="scenario__sel-arrow"
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
            >
              <path
                d="M1 1L5 5L9 1"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {dropdownOpen && (
            <ul className="scenario__dropdown">
              {STEP_TYPES.map((type) => {
                const m = STEP_META[type];
                return (
                  <li
                    key={type}
                    className={`scenario__opt ${type === selectedType ? "scenario__opt--active" : ""}`}
                    onClick={() => {
                      setSelectedType(type);
                      setDropdownOpen(false);
                    }}
                  >
                    <span
                      className="scenario__opt-dot"
                      style={{ background: m.color }}
                    />
                    <span
                      className="scenario__opt-label"
                      style={{ color: m.color }}
                    >
                      {type}
                    </span>
                    <span className="scenario__opt-desc">{m.desc}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* add button */}
        <button
          type="button"
          className="scenario__add-btn"
          onClick={handleAddStep}
        >
          <div className="scenario__btn-tl" />
          <div className="scenario__btn-br" />
          + Add step
        </button>
      </div>
    </fieldset>
  );
};

export default Scenario;