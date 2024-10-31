"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, format, isBefore, isAfter, startOfDay } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function DatePicker({
  date,
  setSelectedDate,
}: {
  date: Date | undefined;
  setSelectedDate: (date: Date) => void;
}) {
  const today = startOfDay(new Date());
  const minDate = addDays(today, 1);
  const maxDate = addDays(today, 3);

  // Set default date when component mounts
  React.useEffect(() => {
    if (!date) {
      setSelectedDate(maxDate);
    }
  }, [date, maxDate, setSelectedDate]);

  const isDateInRange = (date: Date) => {
    const start = startOfDay(minDate);
    const end = startOfDay(maxDate);
    return !isBefore(date, start) && !isAfter(date, end);
  };

  return (
    <div>
      <div className="block text-gray-600 font-bold mb-2">Pickup On</div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "EEE, d MMM yyyy") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setSelectedDate(newDate)}
            disabled={(date) => !isDateInRange(date)}
            defaultMonth={minDate}
            fromDate={minDate}
            toDate={maxDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
