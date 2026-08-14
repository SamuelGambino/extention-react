import type { StepCollect } from "../../globalTypes/parser_сonfig";
import type { ElementContext } from "../../globalTypes/messages";
import { getAttributeOrText, getText } from "./dom";

const toNumber = (value: string): number => {
  const normalized = value.replace(/[^\d,.-]/g, "").replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export const handleCollect = (payload: StepCollect, context?: ElementContext) => {
  const params = payload.params;
  const source = params.source;
  const base = {
    entity: params.entity,
    name: getText(params.name, source, context),
  };

  if (params.entity === "category" || params.entity === "modifier_group") {
    return { status: "success" as const, data: base };
  }

  const parameterParams = params as Extract<StepCollect["params"], { price?: string }>;
  const parameterData = {
    price: parameterParams.price ? toNumber(getText(parameterParams.price, source, context)) : undefined,
    old_price: parameterParams.old_price ? toNumber(getText(parameterParams.old_price, source, context)) : undefined,
    proteins: parameterParams.proteins ? toNumber(getText(parameterParams.proteins, source, context)) : undefined,
    fats: parameterParams.fats ? toNumber(getText(parameterParams.fats, source, context)) : undefined,
    carbohydrates: parameterParams.carbohydrates ? toNumber(getText(parameterParams.carbohydrates, source, context)) : undefined,
    calories: parameterParams.calories ? toNumber(getText(parameterParams.calories, source, context)) : undefined,
  };

  if (params.entity === "product_parameter") {
    return {
      status: "success" as const,
      data: {
        ...base,
        ...parameterData,
        index: getText(params.index, source, context),
      },
    };
  }

  const productParams = params as Extract<StepCollect["params"], { entity?: "product" }>;

  return {
    status: "success" as const,
    data: {
      ...base,
      ...parameterData,
      picture: getAttributeOrText(productParams.picture, source, context),
      description: getText(productParams.description, source, context),
      weight: getText(productParams.weight, source, context),
    },
  };
}