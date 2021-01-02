import { EnvironmentTypes } from '../config/environmentTypes.enum';
import { EnvironmentBase } from './environment.base';

export class ProdEnvironment extends EnvironmentBase {
    mode = EnvironmentTypes.Prod;
}

const environment = new ProdEnvironment();

export default environment;