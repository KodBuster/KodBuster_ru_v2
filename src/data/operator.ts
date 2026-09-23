const clean = (value: string | undefined) => (value ?? "").trim();

/**
 * Реквизиты оператора персональных данных (152-ФЗ).
 * Пустое поле не подменяется выдуманным значением: на странице политики
 * оно показывается как ещё не опубликованное.
 */
export const operator = {
  name: clean(process.env.NEXT_PUBLIC_OPERATOR_NAME) || null,
  inn: clean(process.env.NEXT_PUBLIC_OPERATOR_INN) || null,
  ogrn: clean(process.env.NEXT_PUBLIC_OPERATOR_OGRN) || null,
  address: clean(process.env.NEXT_PUBLIC_OPERATOR_ADDRESS) || null,
  email: clean(process.env.NEXT_PUBLIC_OPERATOR_EMAIL) || null,
} as const;

export const operatorReady = Boolean(operator.name && operator.inn && operator.ogrn && operator.address && operator.email);
