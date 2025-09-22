"use client";

import { useMemo, useState } from "react";
import { places } from "@/data/places";
import { upsertEventAction } from "@/app/events/_actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";

export default function EventForm({ initialEvent }) {
  const [detailsJson, setDetailsJson] = useState(
    initialEvent?.detailsJson ?? { type: "doc", content: [] }
  );

  // Helpers
  function toTimeString(date) {
    if (!date) return "";
    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  }

  function formatForSubmission(date, timeStr) {
    // Returns local datetime string in format YYYY-MM-DDTHH:mm
    if (!date || !timeStr) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}T${timeStr}`;
  }

  // Start "today" at midnight for calendar constraints
  const todayStart = useMemo(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate());
  }, []);
  const isEditing = !!initialEvent?.id;

  // Start datetime state
  const [startDate, setStartDate] = useState(() =>
    initialEvent?.startsAt ? new Date(initialEvent.startsAt) : new Date()
  );
  const [startTime, setStartTime] = useState(() =>
    initialEvent?.startsAt ? toTimeString(new Date(initialEvent.startsAt)) : ""
  );

  // End datetime state
  const [endDate, setEndDate] = useState(() =>
    initialEvent?.endsAt ? new Date(initialEvent.endsAt) : new Date()
  );
  const [endTime, setEndTime] = useState(() =>
    initialEvent?.endsAt ? toTimeString(new Date(initialEvent.endsAt)) : ""
  );

  // Popover open state
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  const startsAtValue = useMemo(
    () => formatForSubmission(startDate, startTime),
    [startDate, startTime]
  );
  const endsAtValue = useMemo(
    () => formatForSubmission(endDate, endTime),
    [endDate, endTime]
  );

  async function onSubmit(e) {
    e.preventDefault();
    // Client-side validation: ensure end is not earlier than start
    const start = startsAtValue ? new Date(startsAtValue) : null;
    const end = endsAtValue ? new Date(endsAtValue) : null;
    if (
      !start ||
      !end ||
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      alert("Please select valid start and end date and time");
      return;
    }
    if (start > end) {
      alert("End date can't be earlier than start date");
      return;
    }
    // New: prevent creating events in the past (start must be in the future)
    const now = new Date();
    if (!isEditing && start < now) {
      alert("Start date/time can't be in the past");
      return;
    }
    try {
      const fd = new FormData(e.currentTarget);
      fd.set("detailsJson", JSON.stringify(detailsJson));
      if (initialEvent?.id) fd.set("id", String(initialEvent.id));
      await upsertEventAction(fd); // creates or updates
      // Redirect or show success message
      window.location.href = "/events";
    } catch (error) {
      console.error("Event creation error:", error);
      alert(`Error creating event: ${error.message}`);
    }
  }

  return (
    <main>
      <h1 className="text-center text-2xl font-bold">Create an Event</h1>
      <div className="flex justify-center mb-8 mt-4 px-4">
        <form onSubmit={onSubmit} className="space-y-4 w-full max-w-170">
          <div className="flex justify-center">
            <input
              name="title"
              defaultValue={initialEvent?.title ?? ""}
              required
              className="border p-2 rounded-xl w-full md:w-170"
              placeholder="Event Title"
            />
          </div>
          <div className="flex justify-center">
            <select
              name="location"
              defaultValue={initialEvent?.location ?? places[0]?.id}
              className="border p-2 rounded-xl w-full md:w-170"
            >
              {places.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="allDay"
                defaultChecked={!!initialEvent?.allDay}
              />
              <span className="text-lg font-semibold">All day</span>
            </label>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between gap-6">
            {/* Start column */}
            <div className="flex-1">
              <h1 className="text-lg font-semibold mb-2">Start Date & Time:</h1>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Start datetime picker */}
                <div className="flex gap-4 w-full">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="start-date-picker" className="px-1">
                      Date
                    </Label>
                    <Popover open={openStart} onOpenChange={setOpenStart}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="start-date-picker"
                          type="button"
                          className="w-full sm:w-32 justify-between font-normal"
                        >
                          {startDate
                            ? startDate.toLocaleDateString()
                            : "Select date"}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={startDate}
                          captionLayout="dropdown"
                          defaultMonth={startDate ?? todayStart}
                          fromDate={todayStart}
                          disabled={(d) => d < todayStart}
                          onSelect={(d) => {
                            setStartDate(d);
                            setOpenStart(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="start-time-picker" className="px-1">
                      Time
                    </Label>
                    <Input
                      type="time"
                      id="start-time-picker"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="bg-background w-full sm:w-auto appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                  </div>
                  {/* Hidden input to submit combined value */}
                  <input
                    type="hidden"
                    name="startsAt"
                    value={startsAtValue}
                    required
                  />
                </div>
              </div>
            </div>

            {/* End column */}
            <div className="flex-1">
              <h1 className="text-lg font-semibold mb-2">End Date & Time:</h1>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* End datetime picker */}
                <div className="flex gap-4 w-full">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="end-date-picker" className="px-1">
                      Date
                    </Label>
                    <Popover open={openEnd} onOpenChange={setOpenEnd}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="end-date-picker"
                          type="button"
                          className="w-full sm:w-32 justify-between font-normal"
                        >
                          {endDate
                            ? endDate.toLocaleDateString()
                            : "Select date"}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={endDate}
                          captionLayout="dropdown"
                          defaultMonth={endDate ?? todayStart}
                          fromDate={todayStart}
                          disabled={(d) => d < todayStart}
                          onSelect={(d) => {
                            setEndDate(d);
                            setOpenEnd(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="end-time-picker" className="px-1">
                      Time
                    </Label>
                    <Input
                      type="time"
                      id="end-time-picker"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="bg-background w-full sm:w-auto appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                  </div>
                  {/* Hidden input to submit combined value */}
                  <input
                    type="hidden"
                    name="endsAt"
                    value={endsAtValue}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <input
            name="description"
            defaultValue={initialEvent?.description ?? ""}
            className="border p-2 rounded-xl w-full h-20"
            placeholder="Short description (optional)"
          />
          <Button type="submit">
            {initialEvent ? "Save changes" : "Create event"}
          </Button>
        </form>
      </div>
    </main>
  );
}
