import { IIsland } from "./island";

export interface IJob {
    _id:              string;
    shortDescription: string;
    longDescription:  string;
    images:           string[];
    view:             number;
    cellPhone:        string;
    email   :         string;
    slug:             string;
    island:           IIsland;
    city:             string;
    tags:             string[];
    title:            string;

    // TODO: agregar createdAt y updatedAt
    createdAt: string;
    updatedAt: string;
}