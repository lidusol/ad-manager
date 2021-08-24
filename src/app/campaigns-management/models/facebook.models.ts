import { LOCATION } from 'src/app/utils/data';

export interface Facebook {
    id?: string;
    id_campagne?: number;
    name?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    targetedLocations?: LOCATION[];
    excludedLocations?: LOCATION[];
    numberOfDays?: number;
    budgetId?: number;
}