# react-native-firebase-perf-apollo-link

Firebase Performance Monitoring for Apollo GraphQL Client using Apollo Link (for Apollo Client 3)

Forked from: https://github.com/KirioXX/apollo-link-react-native-firebase-perf (for Apollo Client < 2))
Based on: https://github.com/Gerrel/apollo-link-firebase-performance-monitoring

## Installing / Getting Started

```sh
npm install react-native-firebase-perf-apollo-link
```

Or:

```sh
yarn add react-native-firebase-perf-apollo-link
```

### Prerequisites

* Apollo Client: ^3
* @react-native-firebase/app: ^7.2.1
* @react-native-firebase/perf: ^7.1.4
* react-native: ^0.62.2

```ts
// Add import for Apollo Link
import { ApolloLink } from 'apollo-link';

// Add import for @react-native-firebase
import perf from '@react-native-firebase/perf';

// Add the import for this library
import createFPMLink from 'react-native-firebase-perf-apollo-link';

// ...
ApolloLink.from([
  /**
   * Create a Firebase perf monitoring link
   *
   * @param {ReactNativeFirebase.FirebaseModuleWithStatics<FirebasePerformanceTypes.Module, FirebasePerformanceTypes.Statics>} perf - React Native Firebase Performance module
   * @param {boolean} [debug=false] - Enable debug mode
   */
  createFPMLink(perf, true),
  // ...
]);
```

## License

This project is licensed under the MIT License - see the
[license](https://github.com/elmotan95/react-native-firebase-perf-apollo-link/blob/master/LICENSE) file for details.
