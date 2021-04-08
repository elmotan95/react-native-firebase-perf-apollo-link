import { ApolloLink } from '@apollo/client';
import formatMessage from './formatMessage';
import logging from './logging';
import { ReactNativeFirebase } from '@react-native-firebase/app'
import { FirebasePerformanceTypes } from '@react-native-firebase/perf';

/**
 * Create a Firebase perf monitoring link
 *
 * @param {ReactNativeFirebase.FirebaseModuleWithStatics<FirebasePerformanceTypes.Module, FirebasePerformanceTypes.Statics>} perf - React Native Firebase Performance module
 * @param {boolean} [debug=false] - Enable debug mode
 */
const createFPMLink = (perf: (ReactNativeFirebase.FirebaseModuleWithStatics<FirebasePerformanceTypes.Module, FirebasePerformanceTypes.Statics>), debug: boolean = false) => {
  return new ApolloLink((operation, forward) => {
    if (!forward) {
      return null;
    }
    const def: any = operation.query.definitions.length > 0 ? operation.query.definitions[0] : undefined;
    let operationType: string;
    if (def) {
      const operationTypeString: string = typeof def.operation === 'string' ? def.operation : undefined;
      operationType = operationTypeString.length > 0 ? operationTypeString : 'req';
    } else {
      operationType = 'req';
    }
    const perfObj = perf();
    const startTime = new Date().getTime();

    let trace: FirebasePerformanceTypes.Trace | undefined;
    if (perfObj && operationType !== 'subscription') {
      let traceName = `${operation.operationName}`.trim();
      if (traceName.length > 32) {
        traceName = traceName.substr(0, 32);
      } else if (traceName.length === 0) {
        traceName = 'unknown';
      }
      if (traceName.charAt(0) === '_') {
        traceName = traceName.substr(1, traceName.length - 1).trim();
        if (traceName.length === 0) {
          traceName = 'unknown';
        }
      }
      if (traceName.charAt(traceName.length - 1) === '_') {
        traceName = traceName.substr(0, traceName.length - 1).trim();
        if (traceName.length === 0 || traceName === '_') {
          traceName = 'unknown';
        }
      }
      try {
        trace = perfObj.newTrace(traceName);
        trace.start();
      } catch (e) {
        if (debug) {
          // tslint:disable-next-line: no-console
          console.error('Unable to start FPM trace', e);
        }
      }
    }

    return forward(operation).map(result => {
      if (trace !== undefined) {
        try {
          trace.stop();
          trace = undefined;
        } catch (e) {
          if (debug) {
            // tslint:disable-next-line: no-console
            console.error('Unable to stop FPM trace', e);
          }
        }
      }
      if (debug) {
        const ellapsed = new Date().getTime() - startTime;

        const group = formatMessage(operationType, operation, ellapsed);

        logging.groupCollapsed(...group);

        logging.log('REQ', operation);
        logging.log('RES', result);

        logging.groupEnd(...group);
      }
      return result;
    });
  });
};

export default createFPMLink;
