In this exercice, we'll implement the building blocks of a simple React translation library, just for fun. I created this to practice TDD, and thought I could share it with the world. So here I am, writing this readme... Hope you'll enjoy doing it!

- Estimated time: about an hour if you know react, certainly more if you don't
- Practicing skills: JS / TS, React API and a bit of algorithmic

## 0 - A react hook

Let's setup this thing. First, we want a `useTranslate` hook, that will return a translation function. When calling this function with a translation key (a string) as first parameter, it should return the corresponding translated value.

To provide the mapping between keys and values, we'll just use an object and a React context. Here is the expected output:

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

Now, we want to handle nested translations, that will be referenced with a dot notation in our translation keys.

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

For now, our system is pretty static. Let's make it more dynamic by allowing to specify placeholders in the translated value.

```tsx
const translations = {
  welcome: "Hi {who}, welcome {where}!",
};

// renders "Hi Bertrand, welcome here!"
<>{t("welcome", { who: "Bertrand", where: "here" })}</>;
```

## 3 - Missing translation or interpolation

When the translation key does not exist, the code miserably fails. We should throw a friendly descriptive error instead.

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

To be more permissive, we'll allow providing a custom render function in the interpolation object. This will also allow rendering custom components.

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

And of course, everything should work at the same time!

<!-- prettier-ignore -->
```tsx
const translations = {
  navbar: {
    unreadMessages: "You have <strong>{count}</strong> unread message(s). <Link>(open)</Link>",
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
