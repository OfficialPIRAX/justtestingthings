import { Vector3 } from '../../shared/interfaces/vector';

export interface Interaction {
    description?: string;
    position?: Vector3;
    range?: number;
    identifier?: string;
    type?: string;
    dimension?: number;
    callback?: Function;
    disableMarker?: boolean;
    data?: Array<any>;
}
