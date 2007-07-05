jQuery.validator.addMethod('maxWords', function(value, element, params) { 
    return !$(element).val() || $(element).val().match(/bw+b/g).length < params; 
}, 'Please enter {0} words or less.'); 
 
jQuery.validator.addMethod('minWords', function(value, element, params) { 
    return !$(element).val() || $(element).val().match(/bw+b/g).length >= params; 
}, 'Please enter at least {0} words.'); 
 
jQuery.validator.addMethod(’rangeWords’, function(value, element, params) { 
    return !$(element).val() || ($(element).val().match(/bw+b/g).length >= params[0] && $(element).val().match(/bw+b/g).length < params[1]); 
}, 'Please enter between {0} and {1} words.');


jQuery.validator.addMethod("letterswithbasicpunc", function(value, element) {
	return !jQuery.validator.methods.required(value, element) || /^[a-z-.,()'\"s]+$/i.test(value);
}, "Letters or punctuation only please");  

jQuery.validator.addMethod("alphanumeric", function(value, element) {
	return !jQuery.validator.methods.required(value, element) || /^w+$/i.test(value);
}, "Letters, numbers, spaces or underscores only please");  

jQuery.validator.addMethod("lettersonly", function(value, element) {
	return !jQuery.validator.methods.required(value, element) || /^[a-z]+$/i.test(value);
}, "Letters only please"); 

jQuery.validator.addMethod("nowhitespace", function(value, element) {
	return !jQuery.validator.methods.required(value, element) || /^S+$/i.test(value);
}, "No white space please"); 

jQuery.validator.addMethod("anything", function(value, element) {
	return !jQuery.validator.methods.required(value, element) || /^.+$/i.test(value);
}, "May contain any characters."); 

jQuery.validator.addMethod("integer", function(value, element) {
	return !jQuery.validator.methods.required(value, element) || /^d+$/i.test(value);
}, "Numbers only please");

jQuery.validator.addMethod("phone", function(value, element) {
	return !jQuery.validator.methods.required(value, element) || /^d{3}-d{3}-d{4}$/.test(value);
}, "Must be XXX-XXX-XXXX");

jQuery.validator.addMethod("ziprange", function(value, element) {
	return !jQuery.validator.methods.required(value, element) || /^90[2-5]\d\{2}-\d{4}$/.test(value);
}, "Your ZIP-code must be in the range 902xx-xxxx to 905-xx-xxxx");

jQuery.validator.addMethod(
	"VIN",
	function(v){
		if ( v.length != 17 )
			return false;
		var i, n, d, f, cd, cdv;
		var LL = ["A","B","C","D","E","F","G","H","J","K","L","M","N","P","R","S","T","U","V","W","X","Y","Z"];
		var VL = [1,2,3,4,5,6,7,8,1,2,3,4,5,7,9,2,3,4,5,6,7,8,9];
		var FL = [8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2];
		var rs = 0;
		for(i = 0; i < 17; i++){
			f = FL[i];
			d = v.slice(i,i+1);
			if(i == 8){
				cdv = d;
			}
			if(!isNaN(d)){
				d *= f;
			}
			else{
				for(n = 0; n < LL.length; n++){
					if(d.toUpperCase() === LL[n]){
						d = VL[n];
						d *= f;
						if(isNaN(cdv) && n == 8){
							cdv = VL[n];
						}
						break;
					}
				}
			}
			rs += d;
		}
		cd = rs % 11;
		if(cd == 10){cd = "x";}
		if(cd == cdv){return true;}
		return false;
	},
	"The specified VIN is invalid."
);
