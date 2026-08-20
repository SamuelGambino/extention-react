import ru from "./ru.ts";

type TranslationShape<T> = T extends string
  ? string
  : { [Key in keyof T]: TranslationShape<T[Key]> };

export type Translation = TranslationShape<typeof ru>;
export type Locale = "ru";

type TranslationKey<T> = {
  [Key in keyof T & string]: T[Key] extends string
    ? Key
    : T[Key] extends Record<string, unknown>
      ? `${Key}.${TranslationKey<T[Key]>}`
      : never;
}[keyof T & string];

type Interpolation = Record<string, string | number>;
export type LocalizedTextKey = TranslationKey<Translation>;

// Новая локаль должна реализовать Translation: TypeScript потребует все ключи,
// но позволит задать собственные значения строк.
const dictionaries: Record<Locale, Translation> = { ru };
let activeLocale: Locale = "ru";

const resolveMessage = (dictionary: Translation, key: string): string => {
  const value = key.split(".").reduce<unknown>((current, segment) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[segment];
  }, dictionary);

  if (typeof value !== "string") {
    throw new Error(`Не найден текст локализации: ${key}`);
  }

  return value;
};

export const setLocale = (locale: Locale) => {
  activeLocale = locale;
};

export const getLocale = (): Locale => activeLocale;

export const t = (key: LocalizedTextKey, interpolation: Interpolation = {}): string => {
  const message = resolveMessage(dictionaries[activeLocale], key);

  return message.replace(/{{(\w+)}}/g, (_, name: string) => String(interpolation[name] ?? `{{${name}}}`));
};

export { dictionaries };
