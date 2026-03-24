import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminApprovedEvents, getAdminApprovedFilterOptions } from "../../../config/api";
import Alert from "../../components/Alert";
import SearchableSelect from "../../components/SearchableSelect";
import { getAuthToken } from "../../utils/auth";

const getEventDateLabel = (eventItem) => {
  if (eventItem.fromDate && eventItem.toDate) {
    return `${eventItem.fromDate} to ${eventItem.toDate}`;
  }

  if (eventItem.fromDate) {
    return eventItem.fromDate;
  }

  return "-";
};

export default function AdminApprovedDashboard() {
  const token = useMemo(() => getAuthToken(), []);

  const [quarter, setQuarter] = useState("");
  const [date, setDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [facultyName, setFacultyName] = useState("");
  const [options, setOptions] = useState({ quarters: [], faculties: [] });
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [alertState, setAlertState] = useState({ isOpen: false, message: "", severity: "info" });

  const loadData = async (filters = {}) => {
    setLoading(true);
    try {
      const payload = await getAdminApprovedEvents({ token, ...filters });
      setEvents(payload.data || []);
    } catch (error) {
      setAlertState({
        isOpen: true,
        message: error.message || "Failed to fetch approved events.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [eventsPayload, optionsPayload] = await Promise.all([
          getAdminApprovedEvents({ token }),
          getAdminApprovedFilterOptions(token),
        ]);

        setEvents(eventsPayload.data || []);
        setOptions({
          quarters: optionsPayload.data?.quarters || [],
          faculties: optionsPayload.data?.faculties || [],
        });
      } catch (error) {
        setAlertState({
          isOpen: true,
          message: error.message || "Failed to fetch approved events.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [token]);

  const handleApplyFilters = async (event) => {
    event.preventDefault();

    await loadData({
      quarter,
      date,
      fromDate,
      toDate,
      facultyName,
    });
  };

  const handleResetFilters = async () => {
    setQuarter("");
    setDate("");
    setFromDate("");
    setToDate("");
    setFacultyName("");
    await loadData();
  };

  return (
    <section className="-m-6 min-h-[calc(100vh-4rem)] bg-white">
      <form
        onSubmit={handleApplyFilters}
        className="grid gap-4 border-b border-gray-200 px-6 py-5 md:grid-cols-2 xl:grid-cols-5"
      >
        <SearchableSelect
          label="Quarter"
          value={quarter}
          onChange={setQuarter}
          options={options.quarters}
          emptyLabel="All Quarters"
        />

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>

        <SearchableSelect
          label="Faculty Name"
          value={facultyName}
          onChange={setFacultyName}
          options={options.faculties}
          emptyLabel="All Faculty"
        />

        <div className="flex items-end gap-2 md:col-span-2 xl:col-span-5">
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            disabled={loading}
          >
            {loading ? "Applying..." : "Apply Filters"}
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Reset
          </button>
        </div>
      </form>

      <div className="px-6 py-5">
        <div className="mb-4 flex items-center justify-end">
          <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
            {events.length} events
          </span>
        </div>

        {!loading && events.length === 0 && (
          <div className="rounded-md border border-gray-200 p-6 text-center text-sm text-gray-500">No approved events found.</div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {events.map((eventItem) => (
            <Link
              to={`/event/${eventItem.id}`}
              key={eventItem.id}
              className="rounded-md border border-gray-200 bg-white p-4 transition-colors hover:border-primary"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="line-clamp-1 text-base font-semibold text-gray-900">{eventItem.eventName || `Event #${eventItem.id}`}</h3>
                <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">approved</span>
              </div>

              <p className="mt-3 line-clamp-3 text-sm text-gray-700">{eventItem.majorReason || "No major reason provided."}</p>

              <div className="mt-4 space-y-1 text-xs text-gray-600">
                <p><span className="font-semibold">Quarter:</span> {eventItem.quarter || "-"}</p>
                <p><span className="font-semibold">Date:</span> {getEventDateLabel(eventItem)}</p>
                <p><span className="font-semibold">Owner:</span> {eventItem.ownerName || "-"}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Alert
        isOpen={alertState.isOpen}
        onClose={() => setAlertState((previous) => ({ ...previous, isOpen: false }))}
        severity={alertState.severity}
        message={alertState.message}
      />
    </section>
  );
}
