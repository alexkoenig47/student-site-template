"use client";

import { useState, useEffect, useRef } from "react";

interface LogEntry {
  timestamp: string;
  message: string;
  log_stream?: string;
}

interface LogResponse {
  log_group: string;
  entries: LogEntry[];
  next_token?: string;
}

export default function CloudWatchLogsViewer() {
  const [logGroup, setLogGroup] = useState("/ecs/student-site");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(10); // seconds
  const logsEndRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fetchLogs = async (token?: string | null) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        limit: "100",
      });

      if (token) {
        params.append("next_token", token);
      }

      const response = await fetch(
        `${apiUrl}/api/logs/cloudwatch/${encodeURIComponent(logGroup)}?${params.toString()}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data: LogResponse = await response.json();
      
      if (token) {
        // Append older logs when loading more
        setLogs((prev) => [...data.entries, ...prev]);
      } else {
        // Replace logs when refreshing
        setLogs(data.entries);
      }
      
      setNextToken(data.next_token || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch logs");
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [logGroup]);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        fetchLogs();
      }, refreshInterval * 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh, refreshInterval, logGroup]);

  useEffect(() => {
    // Auto-scroll to bottom when new logs arrive
    if (logsEndRef.current && !nextToken) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, nextToken]);

  const loadMore = () => {
    if (nextToken && !loading) {
      fetchLogs(nextToken);
    }
  };

  return (
    <div className="p-6">
      {/* Controls */}
      <div className="mb-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="log-group" className="block text-sm font-medium text-gray-700 mb-1">
              Log Group Name
            </label>
            <input
              id="log-group"
              type="text"
              value={logGroup}
              onChange={(e) => setLogGroup(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-purple focus:border-brand-purple"
              placeholder="/ecs/your-project-name"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={() => fetchLogs()}
              disabled={loading}
              className="px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-[#3a1766] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300 text-brand-purple focus:ring-brand-purple"
            />
            <span className="text-gray-700">Auto-refresh</span>
          </label>
          {autoRefresh && (
            <div className="flex items-center gap-2">
              <span className="text-gray-700">Every</span>
              <input
                type="number"
                min="5"
                max="60"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(parseInt(e.target.value) || 10)}
                className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
              />
              <span className="text-gray-700">seconds</span>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Logs Display */}
      <div className="border border-gray-200 rounded-md bg-gray-900 text-gray-100 font-mono text-sm overflow-auto max-h-[600px]">
        {logs.length === 0 && !loading && !error && (
          <div className="p-4 text-gray-400 text-center">No logs found</div>
        )}
        {logs.map((log, index) => (
          <div
            key={`${log.timestamp}-${index}`}
            className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
          >
            <div className="flex gap-4 p-2">
              <span className="text-gray-500 text-xs whitespace-nowrap">
                {new Date(log.timestamp).toLocaleString()}
              </span>
              {log.log_stream && (
                <span className="text-brand-gold text-xs truncate max-w-[200px]">
                  {log.log_stream}
                </span>
              )}
              <span className="text-gray-300 flex-1 break-words">{log.message}</span>
            </div>
          </div>
        ))}
        {loading && logs.length === 0 && (
          <div className="p-4 text-gray-400 text-center">Loading logs...</div>
        )}
        <div ref={logsEndRef} />
      </div>

      {/* Load More Button */}
      {nextToken && (
        <div className="mt-4 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Load Older Logs"}
          </button>
        </div>
      )}

      {/* Info */}
      <div className="mt-4 p-3 bg-brand-gold/15 border border-brand-gold/40 rounded-md">
        <p className="text-sm text-zinc-900">
          <strong>Tip:</strong> Make sure your ECS task role has CloudWatch Logs read permissions.
          The log group name should match the one configured in your CloudFormation stack.
        </p>
      </div>
    </div>
  );
}


