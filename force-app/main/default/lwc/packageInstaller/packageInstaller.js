import { LightningElement, track } from 'lwc';

export default class PackageInstaller extends LightningElement {
    @track sequenceId;
    @track showNewSequenceModal = false;
    @track selectedPackageId;
    
    
    /*
        handleCreateNewSequence
        Causes the Modal Popup to appear to enter the name of the new sequence
    */
    handleCreateNewSequence(){
        this.showNewSequenceModal = true;
    }

    /*
        handleNewSequence
        Handles updating the UI to create a new installation sequence
    */
    handleNewSequence(event){
        this.handleCloseModals();
        this.sequenceId = event.detail;
    }

    /*
        handleCloseModals
        Sets all modal pop ups to close
    */
    handleCloseModals(){
        this.showNewSequenceModal = false;
    }

    handleSave(){

    }

    handleBack(){

    }
}