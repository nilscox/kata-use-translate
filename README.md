In this exercice, we'll implement the building block of a simple React translation library, just for fun. I
created this to practice TDD, and thought I could share it with the world. So here I am, writing this
readme... Hope you'll enjoy doing it!

Estimated time: about an hour if you know react, certainly more if you don't
Practicing skills: JS / TS, React API and a bit of algorithmic

## 0 - A react hook

Let's setup this thing. First, we want to use a `useTranslate` hook, that will return a translation function.
When calling this translation function with a translation key (a string) as first parameter, it should return
the corresponding translated value.

To provide the mapping between keys and values, we'll just use an object and a React context. Here is the
expected output:

```tsx
import { TranslationProvider, useTranslate } from "./your-code";

const translations = {
  greetings: "Hello!",
};

const Greetings = () => {
  const t = useTranslate();

  return <>{t("greetings")}</>;
};

// This should just render "Hello!"
const App = () => (
  <TranslationProvider values={translations}>
    <Greetings />
  </TranslationProvider>
);
```

## 1 - Nested keys

Now, we want to handle nested translations, that we'll be referencing with a dot notation in our translation
key.

```tsx
const translations = {
  very: {
    deeply: {
      nested: {
        key: "Hello!",
      },
    },
  },
};

// Still renders "Hello!"
<>{t('very.deeply.nested.key')}<>
```

## 2 - String interpolations

For now, our system is pretty static. Let's make it a more dynamic by allowing to specify placeholders in the
translated value!

```tsx
const translations = {
  welcome: "Hi {who}, welcome on board!",
  welcomeWhere: "Hi {who}, welcome {where}!",
};

// renders "Hi Bertrand, welcome on board!"
<>{t("welcome", { who: "Bertrand" })}</>;

// renders "Hi Juliette, welcome here!"
<>{t("welcome", { who: "Juliette", where: "here" })}</>;
```

## 3 - Translation or interpolation not found

When the translation key does not exist, the code miserably fails. We should throw a friendly descriptive
error instead.

Same goes for the interpolations, let's throw an error when it is not provided.

```tsx
const translations = {
  what: "is {love}",
};

// throws an error with message `No translation found for key "baby"`
<>{t("baby")}</>;

// throws an error with message `No interpolation found for "love"`
<>{t("what")}</>;
```

## 4 - Elements interpolation

Now, we will handle html tags in the translated value.

```tsx
const translations = {
  warning: "Be <strong>very</strong> <em>careful</em>!",
};

// renders "Be very careful!", but with "very" and "careful" being inside `strong` and `em` tags respectively
<>{t("warning")}</>;
```

> Note: you don't need to handle nested tags

## 5 - Custom interpolation

To be more permissive, we'll allow providing a custom render function in the interpolation object. This will
also allow to render a custom component.

```tsx
const translations = {
  like: "I am <boss>the boss</boss>!!",
};

// renders "I am THE BOSS!!"
<>
  {t("warning", {
    boss: (children) => <span className="uppercase">children</span>,
  })}
</>;
```

## 6 - Everything

Of course, everything should work at the same time!

```tsx
const translations = {
  navbar: {
    unreadMessages:
      "You have <strong>{count}</strong> unread message(s). <Link>(open)</Link>",
  },
};

// you know what it does :)
<>
  {t("navbar.unreadMessages", {
    count: 1,
    Link: (text) => <Link to="/messages">{text}</Link>,
  })}
</>;
```
