[Русский](../README.md) | English

<div align="center">

<h1 align="center"><img src="../public/icons/icon.png" width="32" heigth="32" /> ProductParser</h1>

### Universal browser extension for extracting product catalogs from online marketplaces

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Chrome](https://img.shields.io/badge/Chrome-Supported-success?logo=googlechrome)
![Firefox](https://img.shields.io/badge/Firefox-Supported-orange?logo=firefoxbrowser)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue)
![Release Please](https://img.shields.io/badge/Releases-Automated-success)
![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)

> Modular • Reactive • Extensible

</div>

---

<p align="center">

<img src="../docs/images/demo.gif" width="900"/>

</p>

---

## Overview

ProductParser is an open-source browser extension designed to extract product catalogs from multiple online services into a unified export format (XML).

ProductParser is automatically built for Google Chrome and Mozilla Firefox. Each new version is accompanied by ready-to-use installation files for both browsers, and the Firefox version is automatically signed via the Mozilla Add-ons API during the CI/CD process.

Unlike traditional one-off parsers, ProductParser is built around a modular architecture where every marketplace implements the same parsing interface while sharing a common parsing pipeline.

The goal of the project is to make adding support for new marketplaces simple without changing the core application.

---

## Project Features

- Unified parser architecture;
- Support for multiple marketplaces;
- React + TypeScript;
- Manifest V3;
- Google Chrome and Mozilla Firefox;
- Fully automated CI/CD;
- Automatic release generation;
- Automatic signing of Firefox builds;
- Ready-to-install release artifacts.

---

## Why ProductParser?
 
ProductParser makes periodic product extraction effortless and regular catalog updates a matter of a single click.

This makes it possible to:

- support multiple services
- reuse the same export pipeline
- implement new integrations with minimal changes

---

# Features

- Modular parser architecture
- Real-time parser state
- Step-by-step parsing mode
- Automatic configuration (where supported)
- Manual configuration for complex APIs
- Unified export format in XML
- Live logging
- Manifest V3
- React UI

---

# Supported Services

| Service | Status | Auto-fill |
|----------|--------|-----------|
| VK | ✅ | ✅ |
| Yandex Food | ✅ | ✅ |
| Delivery Club | ✅ | ✅ |
| Yandex Maps *(partial)* | ✅ | ✅ |
| Chibbis | ✅ | ✅ |
| Kuper | ✅ | ❌ |
| Flowwow | ✅ | ❌ |
| WhatsApp Catalog | ✅ | ❌ |
| Custom | 🚧 | Planned |

---

# Interface

The interface intentionally avoids the appearance of a typical browser extension.

It is inspired by retro-futuristic operating systems and developer tools where every parser action, state transition and log message is visible in real time.

<p align="center">

<img src="./images/interface.png" width="900"/>

</p>

---

# Architecture

```mermaid
flowchart LR

Popup["React Popup"]

Storage["chrome.storage.local"]

Background["Background Controller"]

Parser["Selected Parser"]

Exporter["Exporter"]

Website["Marketplace API"]

Popup <--> Storage

Popup -->|"Start / Continue"| Background

Background <--> Storage

Background <--> Parser

Parser <--> Website

Parser --> Storage

Background --> Exporter
```

```mermaid
flowchart LR

Release["GitHub Release"]

Please["Release Please"]

Actions["GitHub Actions"]

Chrome["Chrome Build"]

Firefox["Firefox Build"]

Mozilla["Mozilla Signing API"]

Signed["Signed .xpi"]

ChromeZip["Chrome ZIP"]

FirefoxXpi["Firefox XPI"]

Release --> Please

Please --> Actions

Actions --> Chrome

Actions --> Firefox

Firefox --> Mozilla

Mozilla --> Signed

Signed --> ChromeZip

Signed --> FirefoxXpi
```

### Design Principles

- Popup contains no parsing logic.
- Background owns the parsing pipeline.
- Every marketplace is isolated in its own parser.
- Shared state is synchronized through `chrome.storage.local`.
- UI reacts to state instead of controlling it.

---

# Installation

## For Users

Download the latest build from **Releases**.

### Chrome
```
Releases
    ↓
Download zip archive
    ↓
chrome://extensions
    ↓
Developer Mode
    ↓
Load unpacked
```

### Firefox
```
Releases
    ↓
Download .xpi file
    ↓
The browser will immediately offer to install the extension
```

Done

---

## For Developers

Clone repository
```bash
git clone https://github.com/SamuelGambino/extention-react.git
```

Install dependencies
```bash
npm i
```

Development
```bash
npm run dev
```

Chrome or firefox build
```bash
npm run build
```

Individual builds
```bash
npm run build:chrome

npm run build:firefox
```

Then load the generated extension from the `dist` directory

---

# Project Structure
```
background/
```
Core parsing logic, parser controller and exporter

```
popup/
```
React application

```
content/
```
Not in use yet

```
globalTypes/
```
Shared application types

---

# Creating a Parser

Every marketplace parser extends the same base class

```ts
class NewMarketplaceParser extends BaseParser {}
```

Create a parser module and implement the necessary methods

In addition to developing the module, you need to add its value for calling the module in background/index.ts
Add the type to globalTypes/parser_config.ts
Add the value to the drop-down list in popup/Form/constants.ts
And define the required fields for filling in the configuration in popup/Form/blocks/ConfigurationBlock.tsx

If desired and possible, you can add configuration autofill in popup/hooks/useAutoFill.ts

---

# Parsing Pipeline

```
User
↓
Configuration
↓
Marketplace validation
↓
Metadata
↓
Products
↓
Categories
↓
Export
↓
Completed
```

The parser may optionally pause after every stage

This mode is primarily intended for debugging, parser development and API inspection

---

# CI/CD

Each new release automatically goes through the full publishing cycle:

- Version update via Release Please;
- Version synchronization in all manifest files;
- Chrome build;
- Firefox build;
- Automatic Firefox signing via the Mozilla AMO API;
- Publishing completed artifacts to GitHub Releases.

As a result, each release contains:

- Chrome (.zip)
- Firefox (.xpi)

```mermaid
flowchart LR

Release["GitHub Release"]

Please["Release Please"]

Actions["GitHub Actions"]

Chrome["Chrome Build"]

Firefox["Firefox Build"]

Mozilla["Mozilla Signing API"]

Signed["Signed .xpi"]

ChromeZip["Chrome ZIP"]

FirefoxXpi["Firefox XPI"]

Release --> Please

Please --> Actions

Actions --> Chrome

Actions --> Firefox

Firefox --> Mozilla

Mozilla --> Signed

Signed --> ChromeZip

Signed --> FirefoxXpi
```

---

# Roadmap

- [x] Modular parser system
- [x] Exporter
- [x] VK
- [x] Yandex
- [x] Chibbis
- [x] Kuper
- [x] Flowwow
- [x] WhatsApp
- [x] Cross-browser support (Chrome / Firefox)
- [x] Automatic Firefox signing
- [x] Automatic GitHub releases
- [ ] Custom parser constructor
- [ ] Localization
- [ ] Automated tests

---

# Contributing

Pull Requests are welcome.

If you would like to implement support for a new marketplace, please open an Issue before starting work.

Fork or give a star - that would be nice too :)

---

# License

[MIT](./LICENSE)
