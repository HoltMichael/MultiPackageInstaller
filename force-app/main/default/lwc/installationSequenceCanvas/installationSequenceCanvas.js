import { LightningElement, track, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
const FIELDS = ['MHolt__Package_Definition__c.MHolt__Namespace__c', 'MHolt__Package_Definition__c.MHolt__Package_Version__c', 'MHolt__Package_Definition__c.MHolt__Password__c'];

export default class InstallationSequenceCanvas extends LightningElement {
    @track columns = {};
    @track showNewPackageModal = false;
    @track currentPackageDefRecordId;
    
    @wire(getRecord, { recordId: '$currentPackageDefRecordId', fields:FIELDS })
    getPackageDefinition({error, data}){
        if(error){
            let message = 'Unknown error';
            if (Array.isArray(error.body)) {
                message = error.body.map(e => e.message).join(', ');
            } else if (typeof error.body.message === 'string') {
                message = error.body.message;
            }
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading package',
                    message,
                    variant: 'error',
                }),
            );
        } else if (data) {
            console.log(data);
            this.addItem(data);
        }
    }
    //currentPackageDef;

    connectedCallback(){
        this.columns = [{id: '1', items: []}];
    }

    /*
        handleOndragstart
        Takes the details of the current item and column being dragged and adds it to 
        the dataTransfer 
    */
    handleOndragstart(event) {
        event.target.style.opacity = 0.5;
        const dataTransfer = JSON.stringify({id: event.target.dataset.id, column: event.target.dataset.column});
        event.dataTransfer.setData("text/plain", dataTransfer);
    }

    /*
        handleOndragover
        Stop default dragover functionality. Without this, the items
        will return to their previous position ondrop
    */
    handleOndragover(event) {
        event.preventDefault();
    }

    /*
        handleOndragenter
        Make the dragged over object slightly see-through
        when we drag over it
    */
    handleOndragenter(event) {
        event.target.style.opacity = 0.5
    }

    /*
        handleOndragleave
        Return the dragged over object's opacity to normal when
        we exit the dragover
    */
    handleOndragleave(event) {
        event.target.style.opacity = 1.0
    }

    /*
        handleAddPackage
        Set the showNewPackageModal var to true
        This brings up the createRecord cmp in a modal
        for creating the package record
    */
    handleAddPackage(){
        this.showNewPackageModal = true;
    }

    /*
        handleCreateNewPackage
        Change the value of the current package definition record id
        This will trigger an @wire call to get all the values we want for this record
    */
    handleCreateNewPackage(event){
        this.currentPackageDefRecordId = event.detail;
        this.handleCloseModals();
    }

    /*
        addColumn
        Adds a new row to the column object
    */
    addColumn(){
        var columnId = this.columns.length + 1;
        this.columns.push({id: columnId, items: []});
    }

    /*
        addItem
        Takes the details of a package and adds all information into the 
        first row of the column object.
    */
    addItem(packageDefinition){
        this.columns[0].items.push({id: this.currentPackageDefRecordId, 
                                    name: packageDefinition.fields.MHolt__Namespace__c.value,
                                    version: packageDefinition.fields.MHolt__Package_Version__c.value,
                                    password: packageDefinition.fields.MHolt__Password__c.value,
                                    col: 0});
    }

    /*
        handleCloseModals
        Sets all modal vars to false in order to close them on-screen
    */
    handleCloseModals(){
        this.showNewPackageModal = false;
    }


    /*
        getColumnIndexById    
        Takes an Id of an item in the columns and returns it's position
        in the array
    */
    getColumnIndexById(id){
        var idFilter = (element) => element.id == id;
        return this.columns.findIndex(idFilter);
    }

    /*
        getItemIndexByValue
        Takes an Id and an array, finds the index of the item in
        the given array and returns the index
    */
    getItemIndexByValue(id, obj){
        var idFilter = (element) => element.id == id;
        var x = obj.findIndex(idFilter);
        return obj.findIndex(idFilter);
    }

    /*
        handleOndrop
        Handles the moving of a package between columns (or within the same column)
        Takes the values of the dataTransfer provided in the handleOndragstart function
        Removes the item from the dragged column, adds the item to the target column 
        Shifts the other elements in that column accordingly, depending on where the item
        was dropped
    */
    handleOndrop(event) {
        event.currentTarget.style.opacity = 1.0;
        event.target.style.opacity = 1.0;
        
        const dataTransfer = JSON.parse(event.dataTransfer.getData('text/plain'));
        const {id: startId, column: startColumn} = dataTransfer;
        const {id: endId, column: endColumn} = event.target.dataset;

        var startColIndex = this.getColumnIndexById(startColumn);
        var endColIndex = this.getColumnIndexById(endColumn);
        
        var targetItemIndexInColumn = this.getItemIndexByValue(endId, this.columns[endColIndex].items);
        var itemIndexInColumn = this.getItemIndexByValue(startId, this.columns[startColIndex].items)
        var itemObject = this.columns[startColIndex].items[itemIndexInColumn];
        
        //Functionally, this doesn't matter, but from a UI perspective it looks nicer if dropping an item into empty column 
        //space goes at the end of the column, rather than being shoved into the top
        if(targetItemIndexInColumn < 0){
            targetItemIndexInColumn = this.columns[endColIndex].items.length;
        }

        //Add the item to the new column
        this.columns[endColIndex].items.splice(targetItemIndexInColumn +1, 0, itemObject);
        //Remove the item from the previous column 
        if(startColIndex == endColIndex && targetItemIndexInColumn < itemIndexInColumn){
            //If we're in the same same column and the target item is beneath the item to be dropped we will have already spliced the 
            //item below it in the list and therefore the indexes will all have shifted down compared to where the dragged item now sits
            this.columns[startColIndex].items.splice(itemIndexInColumn + 1, 1, )
        }else{
            //This would remove the item in the list before it, if applied when moving in the same column
            this.columns[startColIndex].items.splice(itemIndexInColumn, 1);
            
        }
    }
}
