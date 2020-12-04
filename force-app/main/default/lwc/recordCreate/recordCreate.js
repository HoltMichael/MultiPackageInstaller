import { LightningElement, api } from 'lwc';

export default class RecordCreate extends LightningElement {
    @api objectApiName;
    @api objectName;

    handleSuccess(event){
        this.dispatchEvent(new CustomEvent('success', {detail: event.detail.id}));
    }

    handleCancel(){
        this.dispatchEvent(new CustomEvent('cancel'));
    }
}