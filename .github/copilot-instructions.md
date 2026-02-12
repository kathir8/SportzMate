Version : Ionic - 8, Angular - 20, java, sql

I'm going to do a mobile app called SportzMate.
app concept is that, if I'm intersted to play a game like cricket tomorrow evening 4:30PM at one place, I'm having 4 members but I need 11 members.

so I can post it in my app, who all interested in cricket will see by the post and if they intersted, they'll tell that I'll come to play cricket, I can choose/reject them
Will have list view/map view with filtering km by radius concept to my current location
In that app, they can also chat between two members without phone number,for chat and login verification concept we're going to use fire base
This app is not only for cricket, it is for every sports
this is the concept and features of app

This is the short explanation of our project

I'm using date-fns, date-fns-tz package for date and time concept, I need to send to backend as timestamp format.  since it is UTC, I need to show in UI in local time zone, don't forget to consider day light saving

I'm new to IONIC and other stuffs

ALWAYS use ionic framework components, ion icons and SCSS styles

Don't give any deprecated syntax /method

ALWAYS use standalone components - they are now the default and recommended approach

Always Use signal for all variables


Use clear, self-explanatory method names and variable names

Follow a method-driven approach with clean separation of concerns

Write optimized, high-performance, and best-practice code

Do not frequently change method or variable names once defined

Avoid using any or unknown types in TypeScript

Always define and use proper, strict TypeScript types

We're having seperate component for each controller like input, text area, dropdown etc., 

No NgModules required - imports directly in component decorator Simplifies dependency management and lazy loading.

Use Signals over RxJS for component state when possible Signals provide fine-grained reactivity and better performance signal(), computed(), effect() are the core primitives.

Use input() for type-safe, signal-based inputs Use output() for type-safe outputs (replaces @Output) Use model() for two-way binding.

New Control Flow Syntax (@if, @for, @switch) ALWAYS use new control flow instead of *ngIf, *ngFor, *ngSwitch Better performance, type safety, and ergonomics.

Use viewChild for type-safe, signal-based viewChild
New primitive for async data loading with signals Replaces many RxJS patterns for data fetching.

Inject Function (Constructor Injection Alternative) Prefer inject() over constructor injection for cleaner code Can be used in functions, not just constructors.

Deferrable Views (@defer) Lazy load template sections for better performance Multiple trigger strategies available.

Enhanced HttpClient with Signals. Functional Route Guards and Resolvers Use functional guards instead of class-based guards. 

Improved Reactivity with linkedSignal. Modern Dependency Injection Patterns. Anti-Patterns to Avoid

❌ Don't mix old and new control flow in same template

❌ Don't use NgModules for new projects

❌ Don't use RxJS for simple component state

❌ Don't forget track in @for loops

❌ Don't mutate signal values directly (use .set() or .update()).// Signals

import { signal, computed, effect, linkedSignal } from '@angular/core';
 
// Signal inputs/outputs

import { input, output, model } from '@angular/core';
 
// Resource

import { resource } from '@angular/core';
 
// RxJS interpolation

import { toSignal, toObservable } from '@angular/core/rxjs-interpolation';
 
// Dependency injection

import { inject, DestroyRef } from '@angular/core'


// View child

import { viewChild } from '@angular/core';


You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.
- Do not write arrow functions in templates (they are not supported).

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection
