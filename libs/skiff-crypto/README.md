![Logo](https://skiff-org.github.io/assets/updates/skiff-crypto-header.png)

# skiff-crypto

Welcome! `skiff-crypto` is a versatile, open-source JavaScript cryptography library specifically designed to provide strong and efficient cryptographic functions for use in NodeJS or in the browser. This package powers cryptography inside Skiff's end-to-end encrypted, privacy-first product suite, including Mail, Pages, Drive, and Calendar applications. For more on Skiff, visit [skiff.com](https://skiff.com).

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE.txt)
[![npm latest package](https://img.shields.io/npm/v/@skiff-org/skiff-crypto/latest.svg)](https://www.npmjs.com/package/@skiff-org/skiff-crypto)
[![Follow on Twitter](https://img.shields.io/twitter/follow/Skiff_hq.svg?label=follow+Skiff)](https://twitter.com/skiffprivacy)

## Features

skiff-crypto brings together a host of cryptographic functionalities:

- **Symmetric Key Cryptography**: ChaCha20Poly1305-based symmetric encryption functions.
- **Asymmetric Key Cryptography**: TweetNaCl-based asymmetric encryption.
- **Datagram Library**: Manage object versions and metadata in an efficient way.
- **Integrity**: Support for checksum and data integrity verification.
- **Utilities**: A collection of useful utilities for working with cryptographic data, such as utf8 and string conversion.

## Getting Started

### Prerequisites

- Node.js 12.0.0 or later, or a modern browser.

### Installation

Using npm:

```bash
npm install @skiff-org/skiff-crypto
```

Using Yarn:

```bash
yarn add @skiff-org/skiff-crypto
```

### Usage

```javascript
const skiffCrypto = require('@skiff-org/skiff-crypto');
// or, `import * as skiffCrypto from '@skiff-org/skiff-crypto';`

// Asymmetric encryption example
const plaintext = "Hello, skiff-crypto!";
const keypair = skiffCrypto.generatePublicPrivateKeyPair();
const encrypted = skiffCrypto.stringEncryptAsymmetric(keypair.privateKey, { key: keypair.publicKey }, plaintext);
const decrypted = skiffCrypto.stringDecryptAsymmetric(keypair.privateKey, { key: keypair.publicKey }, encrypted);

console.log('Plaintext:', plaintext);
console.log('Ciphertext:', encrypted);
console.log('Expected to be true:', plaintext === decrypted);

// Symmetric encryption example
const symmetricKey = skiffCrypto.generateSymmetricKey();
// A datagram is used to manage object versions and metadata
const TestDatagram = skiffCrypto.createJSONWrapperDatagram('ddl://test');
const symmetricPlainText = "Hello, skiff-crypto (symmetric encryption)!";
const symmetricEncrypted = skiffCrypto.encryptSymmetric(symmetricPlainText, symmetricKey, TestDatagram);
const symmetricDecrypted = skiffCrypto.decryptSymmetric(symmetricEncrypted, symmetricKey, TestDatagram);
console.log('Symmetric encrypted content', symmetricEncrypted);
console.log('Symmetric decrypted content', symmetricDecrypted);
console.log('Expected to be true:', symmetricPlainText === symmetricDecrypted);

// Hash example
console.log('SHA-512 hash example', skiffCrypto.generateHash('Hello, skiff-crypto!'));
```

[![Edit Button](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/skiff-crypto-demo-kt7soo)

Detailed usage instructions and more examples are available in the [API documentation](https://skiff.com/skiff-crypto).

## Documentation

Comprehensive documentation is available in the [documentation site](https://skiff.com/skiff-crypto) for the repository.

## Contributing

Contributions to skiff-crypto are very much appreciated! Please see our [Contributing Guidelines](https://github.com/skiff-org/skiff-apps/blob/main/libs/skiff-crypto/CONTRIBUTING.md) for details on how you can contribute.

## Security

Cryptography is a sensitive domain. While skiff-crypto has been audited and built using widely-used, audited libraries, we urge you to use this library responsibly. Please have a sound understanding of the underlying principles of cryptography before implementation. Security issues or questions can be sent to [security@skiff.org](mailto:security@skiff.org).

## License

skiff-crypto is [MIT licensed](https://github.com/skiff-org/skiff-apps/blob/main/libs/skiff-crypto/LICENSE.txt). You're encouraged to use and adapt the code for your projects, given that you respect the original copyright and abide by the license terms.

## Contact

For questions, suggestions, or a friendly chat, feel free to contact us at [hello@skiff.org](mailto:hello@skiff-crypto.org). For bug reports or issues, please use our [Github Issues page](https://github.com/skiff-org/skiff-apps/issues).

Enjoy secure coding!
