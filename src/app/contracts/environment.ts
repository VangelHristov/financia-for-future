import { LogLevel } from '../enumerations/log-level';

export interface IEnvironment {
  production: boolean;
  enableDebugTools: boolean;
  logLevel: LogLevel;
  apiHost: string;
}
