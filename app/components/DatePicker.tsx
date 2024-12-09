"use client";

import { addDays, format, isBefore, startOfDay } from "date-fns";
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

  const isDateInRange = (date: Date) => {
    const start = startOfDay(minDate);
    return !isBefore(date, start);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200 hover:border-emerald-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Pickup On</h2>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
            {date ? (
              <span className="truncate">
                {format(date, "EEE, d MMM yyyy")}
              </span>
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
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
