import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { DatePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import assest from 'json/assest';
import React, { useState } from 'react';

const DatepickerWrapper = styled(Box)`
  min-width: 220px;
  width: 100%;

  .datepickerSectionWrap {
    position: relative;

    border-radius: 8px;

    .MuiFormControl-root {
      width: 100%;
      .MuiFormLabel-root {
        font-size: 16px;
        font-weight: 400;
        line-height: 1.5;
        top: -3px;
        &.MuiFormLabel-filled {
          display: none;
        }
      }
      .MuiInputBase-root {
        font-size: 16px;
        font-weight: 400;
        line-height: 1.5;
        min-height: 48px;
        border-radius: 8px;
        input {
          border: none;

          padding: 10px 12.5px;
          padding-right: 0;
          background: url(${assest.logo_img}) center right no-repeat;
        }

        .MuiButtonBase-root {
          position: absolute;
          right: 15px;
          padding: 15px;
          width: auto;
          z-index: 100;
          .MuiSvgIcon-root {
            display: none;
          }
        }
      }
    }

    .MuiIconButton-root {
      &:hover {
        background: none;
      }
    }
  }

  .abs_textField {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 99;
  }
`;
interface DatePickerProps {
  label?: string;
  className?: string;
  typeTwo?: boolean;
  typeThree?: boolean;
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

type DateTimeType = {
  hour: number;
  minute: number;
};

const TimeFormatReturn = ({ hour, minute }: DateTimeType) => {
  return ` ${
    hour > 12 ? (hour - 12 > 9 ? hour - 12 : `0${hour - 12}`) : hour > 9 ? hour : `0${hour}`
  } : ${minute > 9 ? minute : `0${minute}`} ${hour >= 12 ? `PM` : `AM`}
   `;
};

function Datepickersection({ label, className, typeTwo, typeThree }: DatePickerProps) {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs());
  const [SelectedDate, setSelectedDate] = useState(`${months[dayjs().month()]}, ${dayjs().year()}`);

  const [SelectedDateTime, setSelectedDateTime] = useState(
    `${daysOfWeek[dayjs().day()]} ${dayjs().date()} ${
      months[dayjs().month()]
    } ${dayjs().year()} , ${TimeFormatReturn({
      hour: dayjs().hour(),
      minute: dayjs().minute(),
    })}`
  );

  // console.log(SelectedDate as any, "day");

  return (
    <DatepickerWrapper>
      <Box className={`datepickerSectionWrap ${className}`}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {typeThree ? (
            <>
              <DateTimePicker
                label={label}
                value={label ? null : value}
                ampm
                onChange={newValue => {
                  setValue(newValue);

                  setSelectedDateTime(
                    `${daysOfWeek[newValue!.day()]} ${newValue!.date()} ${
                      months[newValue!.month()]
                    } ${newValue!.year()} , ${TimeFormatReturn({
                      hour: newValue!.hour(),
                      minute: newValue!.minute(),
                    })}`
                  );
                }}
              />
              <TextField fullWidth value={SelectedDateTime} className='abs_textField' />
            </>
          ) : (
            <>
              <DatePicker
                label={label}
                value={label ? null : value}
                onChange={newValue => {
                  setValue(newValue);
                  setSelectedDate(`${months[newValue!.month()]}, ${newValue!.year()}`);
                }}
                views={typeTwo ? ['month', 'year'] : ['year', 'month', 'day']}
              />
              {typeTwo && <TextField fullWidth value={SelectedDate} className='abs_textField' />}
            </>
          )}
        </LocalizationProvider>
      </Box>
    </DatepickerWrapper>
  );
}

export default Datepickersection;
