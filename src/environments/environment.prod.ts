import { IEnvironment } from '../app/contracts/i-environment';
import { LogLevel } from '../app/enumerations/log-level';

export const environment: IEnvironment = {
  production: true,
  enableDebugTools: false,
  logLevel: LogLevel.Info,
  apiHost: 'http://localhost:3001',
};
