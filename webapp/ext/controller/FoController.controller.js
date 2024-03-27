sap.ui.define(['sap/ui/core/mvc/ControllerExtension','sap/ui/core/Fragment','sap/m/MessageToast'], function (ControllerExtension,Fragment,MessageToast) {
	'use strict';

	return ControllerExtension.extend('freightordermgt.ext.controller.FoController', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		pDialog : null,
		pdf_content: null,
		uploadfiles: function() {

			if (!this.pDialog) { 
				this.base.getExtensionAPI()
				.loadFragment({
					name: "freightordermgt.ext.fragment.fileselector",
					controller: this
				}).then((oDialog)=>{
					this.pDialog = oDialog;
					oDialog.open();
				 var oFileUploader = this.pDialog.getContent('uploadSet')[0];
				 if(oFileUploader){
					oFileUploader.removeAllItems();
				 }				
				}).catch(error=>{alert(error.message)})
			}else{
				var oFileUploader =  this.pDialog.getContent('uploadSet')[0];
				if(oFileUploader){
				   oFileUploader.removeAllItems();
				}
				this.pDialog.open();

			}
		
		},

		onUploadSet:  function(oEvent) {
			var oFileUploader = this.pDialog.getContent('uploadSet')[0];
			var oFile = oFileUploader.getItems()[0].getFileObject();
			var sFileName = oFile.name;
			var iFileLen = oFile.size;
			var sFileType = oFile.type;
			// console.log(this.pdf_content);
			const oExtensionAPI = this.base.getExtensionAPI();
			// var view1 = this.getView();
			var oModel = oExtensionAPI.getModel();
			const sFunctionname = "com.sap.gateway.srvd.zfreightorder_service.v0001.uploadfile";
			var sPath = this.getView().getBindingContext().getPath();

			let sRaw = String.raw`${this.pdf_content}`;
			let sMimtype = sFileName.split(".")[sFileName.split(".").length-1]

			const oFunction = oModel.bindContext(`${sPath}/${sFunctionname}(...)`);
			oFunction.setParameter("filename",sFileName);
			oFunction.setParameter("mime_type",sMimtype);
			oFunction.setParameter("stream",sRaw); 
		   oFunction.execute().then(result=>{
			console.log(result);
			this.pDialog.close();
		}).catch(err=>{
			console.log(err);
		   }).finally(this.pDialog.close());
			
	
			  /* TODO:Call to OData */
		  },
		  onCloseDialog: function (oEvent) {        
			// alert("close clicked");   
			  this.pDialog.close();
		  },
		  onItemRemoved:function (oEvent) {
            console.log("File Remove/delete Event Fired!!!")  
            /* TODO: Clear the already read excel file data */          
        },
        onUploadSetComplete: function (oEvent) {

            var oFileUploader = this.pDialog.getContent('uploadSet')[0];
            var oFile = oFileUploader.getItems()[0].getFileObject();
            var reader = new FileReader();

            reader.onload = (e)=>{
                this.pdf_content = e.currentTarget.result;
                // console.log(this.pdf_content);
            }
            reader.readAsBinaryString(oFile);
            MessageToast.show("Upload Successful");

            /* TODO: Read excel file data*/
        },
        onItemRemoved:function (oEvent) {
            console.log("File Remove/delete Event Fired!!!")  
            /* TODO: Clear the already read excel file data */          
         },
		override: {
			/**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf freightordermgt.ext.controller.FoController
             */
			onInit: function () {
				// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
				var oModel = this.base.getExtensionAPI().getModel();
			}
		}
	});
});
