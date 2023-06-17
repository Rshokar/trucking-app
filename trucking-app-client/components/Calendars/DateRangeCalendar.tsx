import React, { Children, FunctionComponent, useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { ExpandableCalendar, CalendarProvider, DateData, LocaleConfig } from 'react-native-calendars'
import moment from 'moment'

import { ScreenHeight } from '../shared'
import { colors } from '../colors'

const CalandarView = styled.View`
`

LocaleConfig.locales['en'] = {
    monthNames: [
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
    ],
    monthNamesShort: [
        'Jan.',
        'Feb.',
        'Mar.',
        'Apr.',
        'May.',
        'Jun.',
        'Jul.',
        'Aug.',
        'Sep.',
        'Oct.',
        'Nov.',
        'Dec.',
    ],
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'],
    today: 'Today',
};

LocaleConfig.defaultLocale = 'en';

import { CalendarProps } from './types'
import { UpdateSources } from 'react-native-calendars/src/expandableCalendar/commons'

export interface DateRangeCalendar extends CalendarProps {
    children?: React.ReactNode
}

const DateRangeCalendar: FunctionComponent<DateRangeCalendar> = (props) => {

    const [markedDates, setMarkedDates] = useState<any>({})
    const currentDate = new Date().toISOString().split('T')[0]; // get current date as ISO string and extract date part

    useEffect(() => {
        if (props.startDate) {
            let tempMarkedDate: any = {}
            tempMarkedDate[props.startDate.dateString] = { selected: true, selectedColor: colors.tertiary }

            if (props.startDate && props.endDate) {

                let i: number = 0;
                const startDate = moment(props.startDate.dateString);
                const endDate = moment(props.endDate.dateString);


                while (startDate <= endDate) {
                    tempMarkedDate[startDate.format("YYYY-MM-DD")] = {
                        selected: true,
                        selectedColor: colors.tertiary,
                    }
                    startDate.add(1, 'day');
                }
            }

            setMarkedDates(tempMarkedDate)
        }


    }, [props.startDate, props.endDate])


    return <CalendarProvider
        onDateChanged={(date: string, updateSource: UpdateSources) => {
            const [y, m, d] = date.split("-");
            const dateData: DateData = {
                year: parseInt(y),
                month: parseInt(m),
                day: parseInt(d),
                dateString: date,
                timestamp: moment(date).valueOf()
            };

            props.setDate(dateData);
        }}
        style={{ width: '100%', zIndex: 99999 }}
        disabledOpacity={0.6}
        date={currentDate} // set current date as default date
    >
        <ExpandableCalendar

            hideArrows={true}
            hideKnob={false}
            initialPosition={ExpandableCalendar.positions.CLOSED}
            theme={{
                backgroundColor: colors.graylight,
                calendarBackground: colors.graylight,
                textSectionTitleColor: '#b6c1cd',
            }}
            allowShadow={false}
            calendarHeight={ScreenHeight * .4}
            closeOnDayPress={false}
            markedDates={markedDates}
        />
        {props.children}
    </CalendarProvider>
}

export default DateRangeCalendar