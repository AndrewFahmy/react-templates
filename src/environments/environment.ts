import { EnvironmentTypes } from '../config/environmentTypes.enum';
import { EnvironmentBase } from './environment.base';

export class DevEnvironment extends EnvironmentBase {
    mode = EnvironmentTypes.Dev;
}

const environment = new DevEnvironment();

export default environment;