import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sharedFilter',
  pure: false
})
export class sharedListPipe implements PipeTransform {
  
  transform(items: any[], filter: Object): any {
      let finalFilterObj = {};
      if (!items || !this.checkEmptyFilter(filter)) {
        return items;
      } else {
        finalFilterObj = this.getFinalFilterObj(filter);
      }
      return items.filter(item => {
          const itemVal = item, filterVal = finalFilterObj;
          return this.checkIsValueExists(itemVal, filterVal);
      });
  }

  getFinalFilterObj(filter) {
    const filterKeys = Object.keys(filter);
    let result = {};
    for (const key of filterKeys) {
      if (filter[key]['value'] !== '') {
        result[key] = filter[key];
      }
    }
    return result;
  }

  checkIsValueExists(item, filter){
    let count = 0, result = false;
    const filterKeys = Object.keys(filter);
    for (const key of filterKeys) {
      let keyType = filter[key]['type'];
      if ((item[key] == null) || (typeof item[key] == 'undefined') ||  (item[key] == '')) {
        return false;
      }

      switch(keyType) {
        case 'text':
          result = this.compareText(item, filter, key);
          break;
        case 'date':
          result = this.compareDates(item, filter, key);
          break;
        case 'array':
          result = this.compareArray(item, filter, key);
          break;
        case 'multiSelect':
          result = this.compareMultiSelect(item, filter, key);
          break;
        default:
          break;
      }
    }
    return result;
  }

  compareText(item, filter, key) {
    let result = false;
    let itemVal = String(item[key]);
    const itemCheckValue = (filter[key]['matchFullCase']) ? itemVal : itemVal.toLowerCase();
    const filterCheckValue = (filter[key]['matchFullCase']) ? filter[key]['value'] : filter[key]['value'].toLowerCase();
    if ((itemCheckValue == null) || (typeof itemCheckValue == 'undefined') ||  (itemCheckValue == '')) {
      result = false;
    } else if ((filterCheckValue !== '') && (this.checkByCase(itemCheckValue, filterCheckValue, filter[key]['matchFullCase']))) {
      result = true;
    }
    return result;
  }

  compareDates(item, filter, key) {
    let result = false;
    const itemDateTime = new Date(item[key].split('-')[0], parseInt(item[key].split('-')[1])-1, item[key].split('-')[2]).getTime();
    const filterDateTime = new Date(filter[key]['value']).getTime();
    if ((itemDateTime == null) || (typeof itemDateTime == 'undefined')) {
      result = false;
    } else if (itemDateTime === filterDateTime) {
      result = true;
    } else if (filterDateTime === 0) {
      return true;
    }
    return result;
  }
  
  compareArray(item, filter, key){
    let result = false;
    let itemArray = [];
    if (!filter[key]['matchFullCase']) {
      for (let i=0; i<item[key].length; i++) {
          itemArray.push(item[key][i].toLowerCase());
      }
    } else {
      itemArray = item[key];
    }
    let itemJoinedValue = (itemArray.length > 0) ? (itemArray.join(',').toLowerCase()) : itemArray[0];
    const filterValue = (filter[key]['matchFullCase']) ? filter[key]['value'] : filter[key]['value'].toLowerCase();
    if ((itemJoinedValue == null) || (typeof itemJoinedValue == 'undefined') || (itemJoinedValue == '')) {
      result = false;
    } else if (this.checkByCase(itemJoinedValue, filterValue, filter[key]['matchFullCase'])) {
      result = true;
    }
    return result;
  }

  compareMultiSelect(item, filter, key) {
    let result = false;
    let itemArray = this.getItemNamesArray(item[key]);
    let filerArray = this.getItemNamesArray(filter[key]['value']);
    let itemJoinedValue = (itemArray.length > 0) ? (itemArray.join(',').toLowerCase()) : itemArray[0];
    let filterJoinedValue = (filerArray.length > 0) ? (filerArray.join(',').toLowerCase()) : filerArray[0];
    if ((itemJoinedValue == null) || (typeof itemJoinedValue == 'undefined') || (itemJoinedValue == '')) {
      result = false;
    } else if ((filterJoinedValue !== '') && (this.checkByCase(itemJoinedValue, filterJoinedValue, filter[key]['matchFullCase']))) {
      result = true;
    } else if ((filterJoinedValue == '') || (typeof filterJoinedValue == 'undefined')) {
      result = true;
    }
    return result;
  }

  checkByCase(itemVal, filterVal, matchCase) {
    let result = false;
    if (matchCase) {
      result = (itemVal === filterVal);
    } else {
      result = (itemVal.indexOf(filterVal) > -1);
    }
    return result;
  }

  getItemNamesArray(arrayObj) {
    let result = [];
    for (let i=0; i< arrayObj.length; i++) {
      result.push(arrayObj[i]['itemName']);
    }
    return result;
  }

  checkEmptyFilter(filter) {
    const filterKeys = Object.keys(filter);
    let count =0;
    for (const key of filterKeys) {
      if (filter[key]['value'] === '') {
        count++;
      }
    }
    if (count === filterKeys.length) {
      return false;
    }
    return true;
  }
}
