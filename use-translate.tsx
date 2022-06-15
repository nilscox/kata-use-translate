import {
  cloneElement,
  createContext,
  createElement,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
} from "react";

import { get } from "./get";

type Interpolation = ReactNode | ((value: string) => ReactElement);
type Interpolations = Record<string, Interpolation>;

export type TranslationContext = { [key: string]: string | TranslationContext };

const translationContext = createContext<TranslationContext>(
  {} as TranslationContext
);
export const TranslationProvider = translationContext.Provider;

export const useTranslate = () => {
  const translations = useContext(translationContext);

  return useCallback(
    (key: string, interpolations?: Interpolations) => {
      const value = get(translations, ...key.split("."));

      if (typeof value !== "string") {
        throw new Error(`No translation found for key "${key}"`);
      }

      return interpolate(value, interpolations);
    },
    [translations]
  );
};

const interpolate = (
  value: string,
  interpolations?: Interpolations
): ReactNode => {
  let result = value;
  let match: RegExpMatchArray | null = null;

  while ((match = result.match(/({[^}]+})/)) !== null) {
    result = replaceStringInterpolation(match, result, interpolations);
  }

  const elements: Array<ReactNode> = [];

  let before = "";
  let after = "";
  let element: ReactNode;

  while ((match = result.match(/<([a-zA-Z0-9]+)>([^<]+)<\/\1>/)) !== null) {
    [before, element, after] = replaceElementInterpolation(
      match,
      elements.length / 2,
      result,
      interpolations
    );

    result = after;
    elements.push(before, element);
  }

  if (!elements.length) {
    return result;
  }

  elements.push(after);

  return <>{elements}</>;
};

const replaceStringInterpolation = (
  match: RegExpMatchArray,
  value: string,
  interpolations?: Interpolations
) => {
  const { 1: matched, index = -1 } = match;
  const interpolationKey = matched.slice(1, matched.length - 1);

  const interpolationValue = interpolations?.[interpolationKey];

  if (!interpolationValue) {
    throw new Error(`No interpolation found for "${interpolationKey}"`);
  }

  return (
    value.slice(0, index) +
    interpolationValue +
    value.slice(index + matched.length)
  );
};

const replaceElementInterpolation = (
  match: RegExpMatchArray,
  matchIndex: number,
  value: string,
  interpolations?: Interpolations
): [string, ReactNode, string] => {
  const { 0: fullMatch, 1: tag, 2: children, index = -1 } = match;

  let interpolationValue = interpolations?.[tag];

  if (typeof interpolationValue === "function") {
    interpolationValue = cloneElement(interpolationValue(children), {
      key: matchIndex,
    });
  }

  if (!interpolationValue) {
    interpolationValue = createElement(tag, { key: matchIndex }, children);
  }

  return [
    value.slice(0, index),
    interpolationValue,
    value.slice(index + fullMatch.length),
  ];
};
