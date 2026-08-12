import type { StepCollect } from "../../globalTypes/parser_сonfig";
import type { ElementContext } from "../../globalTypes/messages";
import { getAttributeOrText, getText } from "./dom";

const toNumber = (value: string): number => {
  const normalized = value.replace(/[^\d,.-]/g, "").replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export const handleCollect = (payload: StepCollect, context?: ElementContext) => {
  const params = payload.params as Extract<StepCollect["params"], { price: string }> | Extract<StepCollect["params"], { entity?: "category" | "modifier_group" }>;
  const source = params.source;
  const base = {
    entity: params.entity,
    name: getText(params.name, source, context),
  };

  if (params.entity === "category" || params.entity === "modifier_group") {
    return { status: "success" as const, data: base };
  }

  const productParams = params as Extract<StepCollect["params"], { price: string }>;

  return {
    status: "success" as const,
    data: {
      ...base,
      picture: getAttributeOrText(productParams.picture, source, context),
      description: getText(productParams.description, source, context),
      price: toNumber(getText(productParams.price, source, context)),
      old_price: productParams.old_price ? toNumber(getText(productParams.old_price, source, context)) : undefined,
      proteins: productParams.proteins ? toNumber(getText(productParams.proteins, source, context)) : undefined,
      fats: productParams.fats ? toNumber(getText(productParams.fats, source, context)) : undefined,
      carbohydrates: productParams.carbohydrates ? toNumber(getText(productParams.carbohydrates, source, context)) : undefined,
      calories: productParams.calories ? toNumber(getText(productParams.calories, source, context)) : undefined,
      weight: getText(productParams.weight, source, context),
    },
  };
}