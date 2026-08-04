# @kar-mi/spirit-vale-tools-market

## 1.0.0

### Major Changes

- e4a1451: Update capture decoding for the current Spirit Vale network protocol and build fingerprint. Bundle the complete regenerated RPC map, recover client-writer-only ServerRPC registrations, correct current prefab component layouts, add signed packed 64-bit decoding, and reject RPC matches whose known signatures do not consume the payload exactly.

  Migrate market decoding to the current JSON vending contracts and update persisted market stalls to use `stallId` and `slotId`. This removes the public `stallIndex` and `rotationY` fields, replaces the old binary vending DTO decoder, and bumps the market read-model schema.

### Patch Changes

- Updated dependencies [e4a1451]
  - @kar-mi/spirit-vale-tools-capture@1.3.0

## 0.2.0

### Minor Changes

- eca9381: Add revisioned SQLite market indexing, bounded metadata followers, and cursor-paged listing queries.

## 0.1.7

### Patch Changes

- Updated dependencies [029c050]
  - @kar-mi/spirit-vale-tools-logging@0.4.0

## 0.1.6

### Patch Changes

- Updated dependencies [94f4d2e]
  - @kar-mi/spirit-vale-tools-logging@0.3.0

## 0.1.5

### Patch Changes

- Updated dependencies [32cdaba]
- Updated dependencies [32cdaba]
  - @kar-mi/spirit-vale-tools-capture@1.0.0
  - @kar-mi/spirit-vale-tools-logging@0.2.3
  - @kar-mi/spirit-vale-tools-items@0.1.5

## 0.1.4

### Patch Changes

- 4a996f0: Add usage samples to package READMEs, fix the package-guide link to resolve on the registry, and mark the logging package as internal.
- Updated dependencies [4a996f0]
  - @kar-mi/spirit-vale-tools-capture@0.2.2
  - @kar-mi/spirit-vale-tools-logging@0.2.2
  - @kar-mi/spirit-vale-tools-items@0.1.4

## 0.1.3

### Patch Changes

- 9ecf64b: Release the status catalog and tracking support.
- Updated dependencies [9ecf64b]
- Updated dependencies [9ecf64b]
  - @kar-mi/spirit-vale-tools-logging@0.2.1
  - @kar-mi/spirit-vale-tools-capture@0.2.1
  - @kar-mi/spirit-vale-tools-items@0.1.3

## 0.1.2

### Patch Changes

- Updated dependencies [d2d24da]
  - @kar-mi/spirit-vale-tools-logging@0.2.0
  - @kar-mi/spirit-vale-tools-capture@0.2.0
  - @kar-mi/spirit-vale-tools-items@0.1.2

## 0.1.1

### Patch Changes

- f3d4d22: Publish the initial public Spirit Vale Tools packages.
- Updated dependencies [f3d4d22]
  - @kar-mi/spirit-vale-tools-capture@0.1.1
  - @kar-mi/spirit-vale-tools-logging@0.1.1
  - @kar-mi/spirit-vale-tools-items@0.1.1
