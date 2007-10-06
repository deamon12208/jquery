/******************************
 * Unqiua
 *  removes duplicates from arrays.
 *
 ******************************/
$.uniqua = function(array){
  var current, index;
  var tmpA = new Array();
  var tmp = new Array();
  for(i=0;i<array.length;i++){
    tmp.push(array[i]);
    index = array.lastIndexOf(array[i]);
    if(tmpA.indexOf(array[index]) == -1){
      tmpA.push(array[index]);
      tmp = new Array();
    }
  }
  return tmpA;
}