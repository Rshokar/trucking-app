import { ViewStyle } from "react-native";
import { DateData } from "react-native-calendars/src/types";

export interface CalendarProps {
    setDate: (date: DateData) => void;
    startDate?: DateData
    endDate?: DateData
}


