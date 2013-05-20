 function format(input){
  var num = input.value.replace(/\,/g,'');
   if(!isNaN(num)){
     if(num.indexOf('.') > -1){
        num = num.split('.');
        num[0] = num[0].toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1,').split('').reverse().join('').replace(/^[\,]/,'');
       if(num[1].length > 2){
          alert('Anda hanya boleh mengisi dua desimal!');
          num[1] = num[1].substring(0,num[1].length-1);
       }  input.value = num[0]+'.'+num[1];        
     } else{ input.value = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1,').split('').reverse().join('').replace(/^[\,]/,'') };
   }
   else{ alert('Anda hanya boleh mengisi angka!');
         input.value = input.value.substring(0,input.value.length-1);
   }
 }
if (Drupal.jsEnabled) {
	$(document).ready(function() {
    $(".jscalendar").datepicker({dateFormat:"dd/mm/yy",showOn: "both", buttonImageOnly: true, yearRange:"-50:+50",changeMonth: true, changeYear: true, showButtonPanel: true, dayNamesMin:["Mn", "Sn", "Sl", "Rb", "Km", "Jm", "Sb"]});	

    $(".jtabs").tabs({ collapsible: true });
     
    $(".jtabs2").tabs({ event: 'mouseover' }); 

    $( "#jtabs" ).tabs({ collapsible: true });

	$('#edit-submit').show();

    $('#edit-submitx').click(function() {
  		this.disabled=true;return true;  		
  	});
}); 
}

 

