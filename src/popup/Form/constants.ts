import type { StepType } from "../../globalTypes/parser_сonfig";

const PresertOptions = [
  { label: 'Custom', value: 'custom', description: 'Я позже опишу эту логику. Пока что модуль не доступен' },
  { label: 'VK', value: 'vk', description: 'Достаточно использования автозаполнения\nТребуется id магазина ВК' },
  { label: 'Yandex', value: 'yandex', description: 'Работает автозаполнение, проверяйте итоговую ссылку\nРаботает с Yandex Eda, Delivery Club и частично с Yandex Map' },
  { label: 'Kuper', value: 'kuper', description: 'Автозаполнение не доступно для Kuper\nДля использования необходимо зайти в devTools - Network, затем открыть любой товар на странице, чтобы появился запрос multicards?permalink... И скопировать полный url запроса' },
  { label: 'Chibbis', value: 'chibbis', description: 'Достаточно использования автозаполнения' },
  { label: 'WhatsApp', value: 'whatsapp', description: 'Автозаполнение не доступно для WhatsApp\nDevTools - Fetch/XHR - catalog - Payload - view source\nНужен payload одного из запросов "catalog" который в ответе содержит необходимые поля (указаны в подсказках)' },
  { label: 'Flowwow', value: 'flowwow', description: 'Автозаполнение не доступно для Flowwow\nДля использования необходимо зайти в devTools - Network и найти любой запрос search/?property=%..., затем скопировать полный url запроса' },
]

const ClicksOptions = [
  { label: 'None', value: 'none' },
  { label: 'Products', value: 'products' },
  { label: 'Category', value: 'category' },
  { label: 'All', value: 'all' }
]

const GroupTypes = [
  { label: 'one_one', value: 'one_one' },
  { label: 'one_unlimited', value: 'one_unlimited' },
  { label: 'all_one', value: 'all_one' },
  { label: 'all_unlimited', value: 'all_unlimited' },
]

// extract: { color: "#5acf8a", placeholder: ".name, .price, img", desc: "Извлечь данные из DOM" },
// store: { color: "#c07acc", placeholder: "$vars.key", desc: "Сохранить в переменную" },
// navigate: { color: "#4a85c8", placeholder: "$vars.source", desc: "Перейти по URL" },
const StepMeta: Record<
  StepType,
  { color: string; placeholder: string; desc: string }
> = {
  collect: { color: "#4aaa8a", placeholder: ".category-link", desc: "Собрать данные" },
  action: { color: "#9a8acc", placeholder: ".btn-selector", desc: "Клик по элементу" },
  loop: { color: "#7aaee0", placeholder: ".product-card", desc: "Цикл по элементам" },
  wait: { color: "#c8963a", placeholder: "1200", desc: "Пауза (мс)" },
  condition: { color: "#cc7a5a", placeholder: ".modifiers", desc: "Условное ветвление" },
};

export default { PresertOptions, ClicksOptions, GroupTypes, StepMeta };