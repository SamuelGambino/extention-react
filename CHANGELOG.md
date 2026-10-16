# Changelog

## [2.5.0](https://github.com/SamuelGambino/extention-react/compare/v2.4.3...v2.5.0) (2026-10-16)


### Features

* add all fields in StepEditor ([976e56e](https://github.com/SamuelGambino/extention-react/commit/976e56e4b12326e66ef6267788c70596910535a9))
* add availability check before parsing in multiple parser classes ([b8710f1](https://github.com/SamuelGambino/extention-react/commit/b8710f1bb55b9149e54b951693b808943ad8537e))
* add configurable loop context strategies ([7a4c1dd](https://github.com/SamuelGambino/extention-react/commit/7a4c1ddadbbc5d05d1509a4093c3669240b77c29))
* add dnd-kit dependencies and update parser configuration ([4daeaee](https://github.com/SamuelGambino/extention-react/commit/4daeaeef1dd7be43d884e3a942e0a94719127d2b))
* add dnd-kit utilities and sortable tree dependencies ([d1172d4](https://github.com/SamuelGambino/extention-react/commit/d1172d4dd6d5bdd5aa5a19372a5a7b23aace6eb4))
* add entity context to custom parser loops ([12cc6ba](https://github.com/SamuelGambino/extention-react/commit/12cc6ba5816f5cae9a48b068bfc0dc32b094b058))
* add RadioField component and add in StepEditor for collect step ([ee2e1cb](https://github.com/SamuelGambino/extention-react/commit/ee2e1cb71fbfcedf10d246a1e994a5c2ba75dcea))
* add wait functionality and enhance action handling; update manifest files for content scripts ([393c5da](https://github.com/SamuelGambino/extention-react/commit/393c5daa959f98e364cf35a1bbf740a8c7c1336c))
* add waitUntilContentReady function and integrate it into StepExecutor; update content script to handle PING action ([9c216ce](https://github.com/SamuelGambino/extention-react/commit/9c216ce6f4f60148a64a98f3433fea1572ad92df))
* enhance indentation display for nested steps in ScenarioList ([be1190f](https://github.com/SamuelGambino/extention-react/commit/be1190f2a5a9eeefd74366350f50f7a2349ea11b))
* enhance SelectField component with description and dynamic styling options ([cb03f42](https://github.com/SamuelGambino/extention-react/commit/cb03f424fda2ac4041ec54aba9ed4bc199f28d0d))
* enhance step configuration with source and selector parameters; update related components for improved functionality ([1005569](https://github.com/SamuelGambino/extention-react/commit/10055695bab1cfa5e24b3788b9f59ede33e56121))
* enhance step execution logic to handle context based on source; clean up whitespace in action handlers ([eddb7b7](https://github.com/SamuelGambino/extention-react/commit/eddb7b79bd18947499d29f212607a8a1530f1311))
* enhance StepEditor and ScenarioList components, update StepMeta descriptions, and improve auto-fill logic ([309b2d6](https://github.com/SamuelGambino/extention-react/commit/309b2d6fed56573a2a3af9bf6db48e11520db8a2))
* implement action execution and tab handling in StepExecutor; add waitForTabComplete utility ([2a30372](https://github.com/SamuelGambino/extention-react/commit/2a303721de9b3fdf0fc2637378d85a403040090c))
* implement action handling in content script; add handlers for click and hover actions ([5012ce1](https://github.com/SamuelGambino/extention-react/commit/5012ce12daf6d44a369b509a900d3980249e25f3))
* Implement correct DnD functionality and ensure nesting in loops is displayed ([a9ac59c](https://github.com/SamuelGambino/extention-react/commit/a9ac59ceee058d2d138bdde6d6bdba8d6caa71e4))
* implement scenario builder and refactor parser configuration ([3531dbd](https://github.com/SamuelGambino/extention-react/commit/3531dbd6d53a92d60d8bb71117285af03d05ec01))
* implement scenario builder with drag-and-drop functionality and refactor step handling ([cb0a519](https://github.com/SamuelGambino/extention-react/commit/cb0a519fa9edb3278a1ba1c489af276e62bbecd5))
* implement ScenarioList component with drag-and-drop functionality and integrate with StepMeta ([164ecf4](https://github.com/SamuelGambino/extention-react/commit/164ecf43df6ac62f88f4e63c51b95590b9261e32))
* implement step execution handling; enhance message processing and add new handlers for collect, condition, and wait actions ([9cf3824](https://github.com/SamuelGambino/extention-react/commit/9cf3824e2aa169b249b6ac74ddb5c7ab094fc069))
* refactor message sending and waiting logic; improve error handling and streamline step parameter management ([5ad8e5a](https://github.com/SamuelGambino/extention-react/commit/5ad8e5a4cf05c92abef3d5a49ea3c6eac9f8fa44))
* refactor StepExecutor and related handlers; remove executeAction function and enhance message handling ([04a308b](https://github.com/SamuelGambino/extention-react/commit/04a308babe5fe296871fd3eeb8b74df494dafa30))
* support multiple product parameters in custom parser ([6dbc107](https://github.com/SamuelGambino/extention-react/commit/6dbc10717aea1970ae2dec35a18236b7c9f6e452))
* support nested drag and drop for scenario steps ([2e13740](https://github.com/SamuelGambino/extention-react/commit/2e137400e7ca138ebf3a9ef27e5af8bbd8a214c1))
* track custom parser progress by loop context ([3b896ce](https://github.com/SamuelGambino/extention-react/commit/3b896ced5dcbe11a8e8a5d0d109ee2bf47b0f0ab))
* update step types and enhance StepEditor, ScenarioList, and constants for action handling ([b2346f2](https://github.com/SamuelGambino/extention-react/commit/b2346f2ae8d21fde3e673b434dbef732412b7742))
* update step types and enhance StepEditor, ScenarioList, and SwitchField components for improved functionality ([06193d6](https://github.com/SamuelGambino/extention-react/commit/06193d62b6f0f5c8bf0dbe6d351084d4dcbecfac))


### Bug Fixes

* add custom parser context and enhance queryElement for root selection ([0840d45](https://github.com/SamuelGambino/extention-react/commit/0840d45e289d27970082cbf82c87c55c1ada664e))
* add scenario list drag autoscroll ([d50da9f](https://github.com/SamuelGambino/extention-react/commit/d50da9ff95f974342586cfc0d6f51a89a4f6c394))
* adjust height property for form indentation ([a7ea2a8](https://github.com/SamuelGambino/extention-react/commit/a7ea2a81c9259366b179522097b04a0f62d7436b))
* fix content script initialization ([b02a390](https://github.com/SamuelGambino/extention-react/commit/b02a390268c801eb91feda2d0c10f31390067c6c))
* increase z-index for dropdown to improve visibility ([caaf915](https://github.com/SamuelGambino/extention-react/commit/caaf9151458d1994246308704c36b59bf0ddbf88))
* isolate parsing from scenario check ([9e98cf7](https://github.com/SamuelGambino/extention-react/commit/9e98cf72009144989d27f59c11cef0cb958c0ce4))
* make nested scenario dragging reliable ([40381c8](https://github.com/SamuelGambino/extention-react/commit/40381c86a89c0982205db402f566355b9c01fc49))
* preserve opened scenario editors during form updates ([b3bb382](https://github.com/SamuelGambino/extention-react/commit/b3bb382219fa3cca6370370ceb1f61046fe34f84))
* preserve step expansion during form autosave ([ae27a91](https://github.com/SamuelGambino/extention-react/commit/ae27a9146cf773084a4eb485a1b00f8d607b230b))
* restore compact nested scenario tree layout ([067146b](https://github.com/SamuelGambino/extention-react/commit/067146bc8b696bf5dc037ad7126ef0b201a20db5))
* restore nested scenario drag and drop ([79f622e](https://github.com/SamuelGambino/extention-react/commit/79f622e7a982a926c47bb560f54f02617c6177d1))
* stabilize parser contexts and state updates ([044d7e1](https://github.com/SamuelGambino/extention-react/commit/044d7e1dc9c1ae4f12e2bc787616524f1f580412))
* stabilize sticky scenario controls and step selector ([fe6cd1c](https://github.com/SamuelGambino/extention-react/commit/fe6cd1c7f0993cc124bd238038db47561153b4c9))
* update button background and add gradient effect to list add button ([ac0228b](https://github.com/SamuelGambino/extention-react/commit/ac0228b4c9cbfd037d722cdc2c0fd5b8b29f3db3))
* update chibbis API endpoint for geo-objects ([c70c451](https://github.com/SamuelGambino/extention-react/commit/c70c451d9ea2edf00289808a0b723be2831e335c))
* update product pricing logic to include promotional prices ([bba5220](https://github.com/SamuelGambino/extention-react/commit/bba5220da88ba715505d1dc8a6e7f16dd7a30691))
* update SelectField component to support selected value ([228a1ee](https://github.com/SamuelGambino/extention-react/commit/228a1ee7623b0ce53fd20136fd8ea7accd0340c7))
* wait for async action targets in custom parser ([0391a1a](https://github.com/SamuelGambino/extention-react/commit/0391a1abc06fec104d763a67cc6b49f7851f7787))

## [2.4.3](https://github.com/SamuelGambino/extention-react/compare/v2.4.2...v2.4.3) (2026-07-05)


### Bug Fixes

* Add a try-catch construct to URL processing in State comp ([c6572f6](https://github.com/SamuelGambino/extention-react/commit/c6572f6d1fbdd4c063dbdc14fd6a7cf5885f1cf1))

## [2.4.2](https://github.com/SamuelGambino/extention-react/compare/v2.4.1...v2.4.2) (2026-07-05)


### Bug Fixes

* Change Firefox's signature action from mozilla/sign-addon to web-ext ([198553a](https://github.com/SamuelGambino/extention-react/commit/198553a72f8cd9556638495f571f5379a5463893))

## [2.4.1](https://github.com/SamuelGambino/extention-react/compare/v2.4.0...v2.4.1) (2026-07-05)


### Bug Fixes

* change firefox signing action to official mozilla tool ([2306b25](https://github.com/SamuelGambino/extention-react/commit/2306b251c8dd9c3e20caf4657baf2b80ea306e93))

## [2.4.0](https://github.com/SamuelGambino/extention-react/compare/v2.3.0...v2.4.0) (2026-07-05)


### Features

* Implement automatic assembly of the extension for two target browsers ([c246362](https://github.com/SamuelGambino/extention-react/commit/c246362374eaf5abc43c49b2aeac6a2aab4a8529))

## [2.3.0](https://github.com/SamuelGambino/extention-react/compare/v2.2.0...v2.3.0) (2026-07-04)


### Features

* add auto fill for Chibbis preset ([7b74b61](https://github.com/SamuelGambino/extention-react/commit/7b74b61b249221fab5d6bdbc00aa30ec528f006f))
* add auto fill parser configuration ([13ba265](https://github.com/SamuelGambino/extention-react/commit/13ba2655c36348d3bd9259318746beed6a2db40b))
* add Chibbis parser module ([9c6b631](https://github.com/SamuelGambino/extention-react/commit/9c6b631a1fc636baca714556ce241bd11b2c6f3d))
* add debounce for from values ([d6f2874](https://github.com/SamuelGambino/extention-react/commit/d6f28742fa5c2a47cc7d148541770d979dde3df3))
* add Flowwow parser and update related configurations ([b4b2f51](https://github.com/SamuelGambino/extention-react/commit/b4b2f51a56cd24d6051e6c314d937da440d11ca3))
* add Flowwow parser logic ([b1c6daf](https://github.com/SamuelGambino/extention-react/commit/b1c6daf8efffb71e5aa1c664038cc7414ffe7983))
* add Kuper parser and update related configurations ([7ead8ca](https://github.com/SamuelGambino/extention-react/commit/7ead8cac798075e771506322fe0ab13604cda0d9))
* add Kurer parse logic ([fe8c392](https://github.com/SamuelGambino/extention-react/commit/fe8c392b34c3599f996d2990bdce161f72b6bc4c))
* add mods tracking ([583732e](https://github.com/SamuelGambino/extention-react/commit/583732e11df312f95b4a9672f4ae910a406f422a))
* add new preset and parser from WhatsApp ([18ba92f](https://github.com/SamuelGambino/extention-react/commit/18ba92f436182e736af01df18b7c628bf2eb5c3a))
* add nutrients support, merge YandexEda and YandexMap presets ([e33ea9b](https://github.com/SamuelGambino/extention-react/commit/e33ea9b14cf709374e25e54a28ea66070f610be8))
* add parse by steps logic ([15b05a6](https://github.com/SamuelGambino/extention-react/commit/15b05a61b25514f43f6b6fdab99ec05a26a44975))
* add parser module VK and add export module ([5ef6770](https://github.com/SamuelGambino/extention-react/commit/5ef6770923a2d6bfd737f1ee050731e855927edf))
* add progres bar in state comp ([0dcff12](https://github.com/SamuelGambino/extention-react/commit/0dcff129192311cf6189297748e8ed6b790fce8e))
* add the build and publish process of the extension with version update to the manifest ([4584ab1](https://github.com/SamuelGambino/extention-react/commit/4584ab15137ce4a94e1ad92cfa16adcbb752fb95))
* create background structure ([ba56889](https://github.com/SamuelGambino/extention-react/commit/ba5688940a5b6f727008352fba11b2a22d3a8d96))
* display version form manifest ([2d45eb9](https://github.com/SamuelGambino/extention-react/commit/2d45eb9950800c29cc6b8c5b47c4d63d518bd96d))
* edit parsing_state interface and edit State component ([2bf1cc8](https://github.com/SamuelGambino/extention-react/commit/2bf1cc897a653372af16e5de9370f820c67cb0ce))
* enhance ConfigurationBlock and MainBlock with improved hints and descriptions ([64013d8](https://github.com/SamuelGambino/extention-react/commit/64013d88f630ed63cf09a3973ff9d597746205cc))
* enhance Yandex domain detection for auto-fill functionality ([6dd5442](https://github.com/SamuelGambino/extention-react/commit/6dd5442d4cc48eeada6960fbafcae0cfb7b32dd0))
* implement update checker and version handling ([4d470bb](https://github.com/SamuelGambino/extention-react/commit/4d470bb87fbc61a67d044751cf2cc3078a269265))
* organizate architecture ([3fd2edc](https://github.com/SamuelGambino/extention-react/commit/3fd2edc73338a9f440e3457d4139476c2c0c708b))
* tipify API resp from Chibbis ([fce9625](https://github.com/SamuelGambino/extention-react/commit/fce96253a5748ea21a9be5f1c0920232102b590a))
* typify API resp and make YandexEda parser ([ff498dc](https://github.com/SamuelGambino/extention-react/commit/ff498dc338b18a5f0b1344f351c8a024b7b80e6e))
* **ui:** add in Tabs component crud logic ([c88123e](https://github.com/SamuelGambino/extention-react/commit/c88123e02a4d0ebaf3fbaf5f3a8a39be3230c035))
* **ui:** add tab component for page navigation ([3bed5f1](https://github.com/SamuelGambino/extention-react/commit/3bed5f1026d33d759152452bef02144334f69e57))
* **ui:** style Tabs ([65687de](https://github.com/SamuelGambino/extention-react/commit/65687dea89934db3d58a684a01dc33faf323ffe1))
* добавление манифеста расширения для извлечения информации о товарах ([8e390bc](https://github.com/SamuelGambino/extention-react/commit/8e390bce97e3c161fb630c65bd6eb9ad334c873f))


### Bug Fixes

* change the update check mechanism ([e9b5ecb](https://github.com/SamuelGambino/extention-react/commit/e9b5ecb8ec076b75abc042b556c7ff5eae2e0f28))
* fix module communication and file export ([bbf89c3](https://github.com/SamuelGambino/extention-react/commit/bbf89c3fc37c2b0554328d1c7d3fa2f373746ae4))
* fix progres bars and PbS logic ([4f849fb](https://github.com/SamuelGambino/extention-react/commit/4f849fbd5cb4e02077d68c496b91b61714600e11))
* fix the token expiration time display and fix source domain dispaly ([df7dd21](https://github.com/SamuelGambino/extention-react/commit/df7dd21f24b11fd25de88f8fdfbe9d336422abdf))
* make correct mods tracking in Chibbis parser ([366d111](https://github.com/SamuelGambino/extention-react/commit/366d11186b90d55af414f36c7f16aa7b84af9893))
* **ui:** fix logs container ([e039bda](https://github.com/SamuelGambino/extention-react/commit/e039bda8137d325a78c98ca7def84549e41af5fa))
* use global state for extention data ([2c05094](https://github.com/SamuelGambino/extention-react/commit/2c05094f27f2a4c0c047bc032a7a636dc959e0a3))

## [2.2.0](https://github.com/SamuelGambino/extention-react/compare/v2.1.0...v2.2.0) (2026-07-03)


### Features

* add the build and publish process of the extension with version update to the manifest ([4584ab1](https://github.com/SamuelGambino/extention-react/commit/4584ab15137ce4a94e1ad92cfa16adcbb752fb95))
* display version form manifest ([2d45eb9](https://github.com/SamuelGambino/extention-react/commit/2d45eb9950800c29cc6b8c5b47c4d63d518bd96d))
* implement update checker and version handling ([4d470bb](https://github.com/SamuelGambino/extention-react/commit/4d470bb87fbc61a67d044751cf2cc3078a269265))
* добавление манифеста расширения для извлечения информации о товарах ([8e390bc](https://github.com/SamuelGambino/extention-react/commit/8e390bce97e3c161fb630c65bd6eb9ad334c873f))


### Bug Fixes

* fix the token expiration time display and fix source domain dispaly ([df7dd21](https://github.com/SamuelGambino/extention-react/commit/df7dd21f24b11fd25de88f8fdfbe9d336422abdf))
* **ui:** fix logs container ([e039bda](https://github.com/SamuelGambino/extention-react/commit/e039bda8137d325a78c98ca7def84549e41af5fa))

## [2.2.0](https://github.com/SamuelGambino/extention-react/compare/v2.1.0...v2.2.0) (2026-07-03)


### Features

* add the build and publish process of the extension with version update to the manifest ([4584ab1](https://github.com/SamuelGambino/extention-react/commit/4584ab15137ce4a94e1ad92cfa16adcbb752fb95))
* display version form manifest ([2d45eb9](https://github.com/SamuelGambino/extention-react/commit/2d45eb9950800c29cc6b8c5b47c4d63d518bd96d))
* implement update checker and version handling ([4d470bb](https://github.com/SamuelGambino/extention-react/commit/4d470bb87fbc61a67d044751cf2cc3078a269265))


### Bug Fixes

* fix the token expiration time display and fix source domain dispaly ([df7dd21](https://github.com/SamuelGambino/extention-react/commit/df7dd21f24b11fd25de88f8fdfbe9d336422abdf))
* **ui:** fix logs container ([e039bda](https://github.com/SamuelGambino/extention-react/commit/e039bda8137d325a78c98ca7def84549e41af5fa))
