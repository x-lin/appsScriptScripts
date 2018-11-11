/**
 * Hides all rows that have a date later than the targetDate.
 * Assumes that dates are sorted in ascending order and that dates are in the same row as the data to be hidden.
 */
function hideRowsOfFutureDate() {
  //parameters
  var sheetName = "Sheet1"; //sheet where script shall be applied
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var targetDate = new Date(); //target date of rows that shall be shown, dates later than the given one, will be hidden; here: today
  
  var dateRangeStartRow = 5; //Start row of date values
  var dateRangeEndRow = sheet.getDataRange().getLastRow(); //End row of date values
  var dateRangeColumn = 1; //Column of date values
  
  //get all date values; note that dates must be formatted in sheet as date
  var numberOfRows = dateRangeEndRow - dateRangeStartRow + 1;
  var dates = sheet.getRange(dateRangeStartRow, dateRangeColumn, numberOfRows).getValues();
  
  //calculate first row that is in the future
  var earlierOrEqualTargetDateIndex = -1; //marks dates earlier or same as target date
  var smallestRowIndexOfFutureDate = dates
  .map(function(cellDate, index) {
    return targetDate.valueOf() < new Date(cellDate).valueOf() ? index : earlierOrEqualTargetDateIndex;
  })
  .reduce(function(cellDate1, cellDate2) {
    if(cellDate1 === earlierOrEqualTargetDateIndex) {
      return cellDate2;
    } else if(cellDate2 === earlierOrEqualTargetDateIndex) {
      return cellDate1;
    } else {
      return cellDate1 < cellDate2 ? cellDate1 : cellDate2;
    }
  }, earlierOrEqualTargetDateIndex);

  //show all rows until today and hide rows that are later
  var showStart = dateRangeStartRow;
  if(smallestRowIndexOfFutureDate === earlierOrEqualTargetDateIndex) { //all rows are smaller or equal target date
    var showNrRows = dateRangeEndRow - dateRangeStartRow + 1;
    sheet.showRows(showStart, showNrRows);
    Logger.log("Excution successful. Showing all %s rows starting from row %s.", showStart, showNrRows );
  }
  else { //at least one row has a date later than target 
    var showNrRows = smallestRowIndexOfFutureDate;
    var hideStart = dateRangeStartRow + smallestRowIndexOfFutureDate;
    var hideNrRows = dateRangeEndRow - dateRangeStartRow - smallestRowIndexOfFutureDate + 1;
    sheet.showRows(showStart, showNrRows);   
    sheet.hideRows(hideStart, hideNrRows);
    Logger.log("Execution successful. Hiding %s rows starting from row %s. Showing %s rows starting from row %s.", hideNrRows, hideStart, showNrRows, showStart );
  }
}