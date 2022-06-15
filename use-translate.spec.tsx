import { renderHook } from "@testing-library/react";

import {
  TranslationContext,
  TranslationProvider,
  useTranslate,
} from "./use-translate";

const render = (translations: TranslationContext) => {
  const { result } = renderHook(() => useTranslate(), {
    wrapper: ({ children }) => (
      <TranslationProvider value={translations}>{children}</TranslationProvider>
    ),
  });

  return result.current;
};

describe("useTranslate", () => {
  test("simple translation key", () => {
    const translate = render({ key: "Hello!" });

    expect(translate("key")).toEqual("Hello!");
  });

  test("nested translation key", () => {
    const translate = render({ nested: { key: "Hello nested!" } });

    expect(translate("nested.key")).toEqual("Hello nested!");
  });

  test("translation key not found", () => {
    const translate = render({ key: "Hello!" });

    expect(() => translate("nope")).toThrow(
      new Error('No translation found for key "nope"')
    );
    expect(() => translate("nested.nope")).toThrow(
      new Error('No translation found for key "nested.nope"')
    );
  });

  test("with interpolation", () => {
    const translate = render({ key: "Hello {who}!" });

    expect(translate("key", { who: "you" })).toEqual("Hello you!");
  });

  test("with the same interpolation twice", () => {
    const translate = render({ key: "Hello {who} and {who} again!" });

    expect(translate("key", { who: "you" })).toEqual(
      "Hello you and you again!"
    );
  });

  test("with interpolation not found", () => {
    const translate = render({ key: "Hello {who}!" });

    const error = new Error('No interpolation found for "who"');

    expect(() => translate("key")).toThrow(error);
    expect(() => translate("key", { not: "you" })).toThrow(error);
  });

  test("with multiple interpolations", () => {
    const translate = render({ key: "Hello {one} and {two}!" });

    expect(translate("key", { one: "1", two: "2" })).toEqual("Hello 1 and 2!");
  });

  test("with element interpolation", () => {
    const translate = render({ key: "Hello <strong>world</strong>!" });

    expect(translate("key")).toEqual(
      <>
        Hello <strong key={0}>world</strong>!
      </>
    );
  });

  test("with multiple elements interpolations", () => {
    const translate = render({
      key: "Hello <em>the</em> <strong>world</strong>!",
    });

    expect(translate("key")).toEqual(
      <>
        Hello <em key={0}>the</em> <strong key={1}>world</strong>!
      </>
    );
  });

  test("with custom component interpolation", () => {
    const translate = render({ key: "Hello <strong>world</strong>!" });

    expect(
      translate("key", {
        strong: (value) => <span className="text-bold">{value}</span>,
      })
    ).toEqual(
      // prettier-ignore
      <>
        Hello <span key={0} className="text-bold">world</span>!
      </>
    );
  });

  test("string and component interpolations", () => {
    const translate = render({ key: "Hello <strong>{who}</strong>!" });

    expect(translate("key", { who: "you" })).toEqual(
      <>
        Hello <strong key={0}>you</strong>!
      </>
    );
  });
});
