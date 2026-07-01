<div align="center">

# ProductParser

### Universal browser extension for extracting product catalogs from online marketplaces

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Manifest V3](https://img.shields.io/badge/Chrome-Manifest_V3-orange)
![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)

> Modular • Reactive • Extensible

</div>

---

<p align="center">

<img src="./docs/images/demo.gif" width="900"/>

</p>

---

## Overview

ProductParser is an open-source browser extension designed to extract product catalogs from multiple online services into a unified export format.

Unlike traditional one-off parsers, ProductParser is built around a modular architecture where every marketplace implements the same parsing interface while sharing a common parsing pipeline.

The goal of the project is to make adding support for new marketplaces simple without changing the core application.

---

## Why ProductParser?

Most marketplace parsers are tightly coupled to a single website.

ProductParser separates the parsing engine from marketplace-specific logic.

This makes it possible to:

- support multiple services
- reuse the same export pipeline
- debug parsers independently
- implement new integrations with minimal changes

---

# Features

- Modular parser architecture
- Real-time parser state
- Step-by-step parsing mode
- Automatic configuration (where supported)
- Manual configuration for complex APIs
- Unified export format
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

<img src="./docs/images/interface.png" width="900"/>

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
```
Releases
    ↓
Extract archive
    ↓
chrome://extensions
    ↓
Developer Mode
    ↓
Load unpacked
```

Done.

---

## For Developers

Clone repository
```bash
git clone https://github.com/SamuelGambino/extention-react.git
```

Install dependencies
```bash
npm install
```

Development
```bash
npm run dev
```

Production build
```bash
npm run build
```

Then load the generated extension from the `dist` directory.

---

# Project Structure
```
background/
```

Core parsing logic, parser controller and exporter.
```
popup/
```

React application.
```
content/
```

Interaction with active browser tabs.
```
globalTypes/
```

Shared application types.

---

# Creating a Parser

Every marketplace parser extends the same base class.

```ts
class NewMarketplaceParser extends BaseParser {}
```

Register the parser and implement the required methods.

No changes to the parsing pipeline are required.

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

The parser may optionally pause after every stage.

This mode is primarily intended for debugging, parser development and API inspection.

---

# Roadmap

- [x] Modular parser system
- [x] VK
- [x] Yandex
- [x] Chibbis
- [x] Kuper
- [x] Flowwow
- [x] WhatsApp
- [x] Unified exporter
- [ ] Firefox support
- [ ] Custom parser constructor
- [ ] Localization
- [ ] Automated tests

---

# Contributing

Pull Requests are welcome.

If you would like to implement support for a new marketplace, please open an Issue before starting work.

---

# License

MIT
