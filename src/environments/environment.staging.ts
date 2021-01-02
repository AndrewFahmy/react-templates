import { EnvironmentTypes } from '../config/environmentTypes.enum';
import { EnvironmentBase } from './environment.base';

export class StagingEnvironment extends EnvironmentBase {
    mode = EnvironmentTypes.Staging;
}

const environment = new StagingEnvironment();

export default environment;