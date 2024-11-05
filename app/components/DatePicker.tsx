"use client";

import {
  addDays,
  format,
  isAfter,
  isBefore,
  startOfDay,
} from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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

  const isDateInRange = (date: Date) => {
    const start = startOfDay(minDate);
    const end = startOfDay(maxDate);
    return !isBefore(date, start) && !isAfter(date, end);
  };

  return (
    <div>
      <div className="block text-gray-600 font-bold mb-2">
        Pickup On
      </div>
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
            {date ? (
              format(date, "EEE, d MMM yyyy")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            // since the date picker set the time to 00:00:00, we need to set the time to the current time because in the supabase, the conversion set the date to previous date
            onSelect={(newDate) => {
              const now = new Date();
              newDate!.setHours(now.getHours());
              newDate!.setMinutes(now.getMinutes());
              newDate!.setSeconds(now.getSeconds());
              newDate && setSelectedDate(newDate);
            }}
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
