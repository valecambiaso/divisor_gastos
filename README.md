# Vaquita 💸

A small web app for splitting shared expenses in a group. Add people and what each one paid, and it tells you who owes whom and how much, using as few payments as possible.

The interface and the code are in Spanish 🙃.

## Why "Vaquita"?

In Argentina *hacer una vaquita* (literally "to make a little cow") means pooling money with friends to pay for something together.

## How it works

1. Add the people who took part.
2. Add each person's expenses (description and amount).
3. Click **Calcular deudas**. The app splits the total evenly and shows who pays whom.

## Tech

- TypeScript
- Bootstrap 5 and Bootstrap Icons

## Project structure

```
index.html          UI
style.css           Styles
main.ts             DOM logic (people, expenses, rendering)
divisor.ts          Expense-splitting algorithm
entidades/          Persona and Gasto types
dist/               Compiled JavaScript
```
