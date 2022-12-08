import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Input as NativeBaseInput, IInputProps } from 'native-base';
import { Keyboard } from 'react-native';
import { dateStr } from '../utils/convert.utils';
import { Input } from './Input';

interface Props extends IInputProps {
  setDate: Function;
  date: Date;
  typeShow?: 'DATE' | 'TIMER';
}


export function InputDateAndroid({setDate, date, typeShow = 'DATE', ...rest }: Props) {


  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
      maximumDate: new Date()
    });
  };

  const showDatepicker = () => {
    Keyboard.dismiss();
    showMode('date');
  };

  const showTimepicker = () => {
    Keyboard.dismiss();
    showMode('time');
  };

  const showCalendar = () => {

  }

  

  return (
    <Input 
        mb={2}  
        placeholder='Data'
        onFocus={typeShow == 'DATE' ? showDatepicker : showTimepicker}
        onPressIn={typeShow == 'DATE' ? showDatepicker : showTimepicker}
        value={dateStr(date)}
        {...rest}
    />
  );
}