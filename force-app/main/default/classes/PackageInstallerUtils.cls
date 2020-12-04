public with sharing class PackageInstallerUtils {

    public class MetadataServiceExamplesException extends Exception { }

    public static void installPackages()
    {
        // Install packageA, then pacakgeB
        MetadataService.InstalledPackage installedPackageA = new MetadataService.InstalledPackage();
        installedPackageA.password = '';
        installedPackageA.versionNumber = '4.2';
        installedPackageA.fullName = 'AccountDelete';

        // Install the packages
        MetadataService.MetadataPort service = createService();
        List<MetadataService.SaveResult> results = service.createMetadata(new MetadataService.Metadata[] { installedPackageA });
        handleSaveResults(results[0]);
        handleSaveResults(results[1]);
    }

    private static MetadataService.MetadataPort createService(){ 
        MetadataService.MetadataPort service = new MetadataService.MetadataPort();
        service.SessionHeader = new MetadataService.SessionHeader_element();
        service.SessionHeader.sessionId = UserInfo.getSessionId();
        return service;     
    }

    /**
     * Example helper method to interpret a SaveResult, throws an exception if errors are found
     **/
    public static void handleSaveResults(MetadataService.SaveResult saveResult)
    {
        // Nothing to see?
        if(saveResult==null || saveResult.success)
            return;
        // Construct error message and throw an exception
        if(saveResult.errors!=null)
        {
            List<String> messages = new List<String>();
            messages.add(
                (saveResult.errors.size()==1 ? 'Error ' : 'Errors ') +
                    'occured processing component ' + saveResult.fullName + '.');
            for(MetadataService.Error error : saveResult.errors)
                messages.add(
                    error.message + ' (' + error.statusCode + ').' +
                    ( error.fields!=null && error.fields.size()>0 ?
                        ' Fields ' + String.join(error.fields, ',') + '.' : '' ) );
            if(messages.size()>0)
                throw new MetadataServiceExamplesException(String.join(messages, ' '));
        }
        if(!saveResult.success)
            throw new MetadataServiceExamplesException('Request failed with no specified error.');
    }
}

