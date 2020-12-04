import { api, LightningElement } from 'lwc';

export default class Package extends LightningElement {
    @api definitionId;
    @api namespace;
    @api version;
    @api password;
    @api col;
}