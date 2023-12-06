
export function checkUrlExtension(url) {
  if(!url) return null;
    var extension = url.split('.').pop().toLowerCase();
  
    var imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
    var videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv'];
  
    if (imageExtensions.includes(extension)) {
      return 'image';
    } else if (videoExtensions.includes(extension)) {
      return 'video';
    } else {
      return null;
    }
  }

  export function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
  
    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;
  
    return [year, month, day].join('-');
  }


  export function showShorttext(text,length){
    if(text?.length > length){
      return text?.slice(0,length)+"..."
    }
    return text
  }