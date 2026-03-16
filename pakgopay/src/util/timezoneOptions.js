function parseUtcOffsetMinutes(text) {
  const match = String(text || "").match(/(?:UTC|GMT)\s*([+-])\s*(\d{1,2})(?::?(\d{2}))?/i);
  if (!match) return null;
  const sign = match[1] === "-" ? -1 : 1;
  const hours = Number(match[2] || 0);
  const minutes = Number(match[3] || 0);
  return sign * (hours * 60 + minutes);
}

function formatUtcOffset(minutes) {
  if (minutes === null || minutes === undefined || Number.isNaN(Number(minutes))) {
    return "UTC";
  }
  const sign = minutes >= 0 ? "+" : "-";
  const abs = Math.abs(Number(minutes));
  const hours = String(Math.floor(abs / 60)).padStart(2, "0");
  const mins = String(abs % 60).padStart(2, "0");
  return `UTC${sign}${hours}:${mins}`;
}

function buildTimeZoneLabel(zone) {
  const offset = getTimeZoneOffsetMinutes(zone, Date.now());
  return `${zone}[${formatUtcOffset(offset)}]`;
}

export function buildFullTimeZoneOptions() {
  if (typeof Intl !== "undefined" && typeof Intl.supportedValuesOf === "function") {
    try {
      const zones = Intl.supportedValuesOf("timeZone");
      if (Array.isArray(zones) && zones.length > 0) {
        return zones.map((zone) => ({ value: zone, label: buildTimeZoneLabel(zone) }));
      }
    } catch (e) {
      // fallback below
    }
  }
  return [
    { value: "UTC", label: buildTimeZoneLabel("UTC") },
    { value: "Asia/Shanghai", label: buildTimeZoneLabel("Asia/Shanghai") },
    { value: "Asia/Kolkata", label: buildTimeZoneLabel("Asia/Kolkata") },
    { value: "Asia/Tokyo", label: buildTimeZoneLabel("Asia/Tokyo") },
    { value: "Europe/Berlin", label: buildTimeZoneLabel("Europe/Berlin") },
    { value: "Europe/London", label: buildTimeZoneLabel("Europe/London") },
    { value: "America/Los_Angeles", label: buildTimeZoneLabel("America/Los_Angeles") },
    { value: "Australia/Sydney", label: buildTimeZoneLabel("Australia/Sydney") }
  ];
}

export function getTimeZoneOffsetMinutes(timeZone, referenceMs = Date.now()) {
  if (!timeZone) return null;

  const utcOffset = parseUtcOffsetMinutes(timeZone);
  if (utcOffset !== null) return utcOffset;

  if (typeof Intl === "undefined") return null;
  const date = new Date(Number(referenceMs));
  if (Number.isNaN(date.getTime())) return null;

  try {
    const withOffset = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "shortOffset",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23"
    });
    const offsetText = withOffset.formatToParts(date).find((p) => p.type === "timeZoneName")?.value;
    const parsed = parseUtcOffsetMinutes(offsetText);
    if (parsed !== null) return parsed;
  } catch (e) {
    // fallback below
  }

  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23"
    }).formatToParts(date);

    const map = {};
    for (const p of parts) {
      if (p.type !== "literal") map[p.type] = p.value;
    }
    const utcMs = Date.UTC(
      Number(map.year),
      Number(map.month) - 1,
      Number(map.day),
      Number(map.hour),
      Number(map.minute),
      Number(map.second)
    );
    return Math.round((utcMs - date.getTime()) / 60000);
  } catch (e) {
    return null;
  }
}
