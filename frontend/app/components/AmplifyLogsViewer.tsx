"use client";

import { useState, useEffect } from "react";

interface AmplifyLogsInfo {
  message: string;
  app_id: string;
  console_url: string;
  instructions: string[];
  note: string;
}

export default function AmplifyLogsViewer() {
  const [appId, setAppId] = useState("");
  const [info, setInfo] = useState<AmplifyLogsInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fetchInfo = async () => {
    if (!appId.trim()) {
      setError("Please enter an Amplify App ID");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${apiUrl}/api/logs/amplify/${encodeURIComponent(appId)}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data: AmplifyLogsInfo = await response.json();
      setInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch Amplify info");
      console.error("Error fetching Amplify info:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Amplify Build Logs</h2>
        <p className="text-sm text-gray-600">
          Amplify logs are best viewed through the AWS Console. Enter your Amplify App ID to get
          direct links and instructions.
        </p>
      </div>

      {/* App ID Input */}
      <div className="mb-6">
        <label htmlFor="app-id" className="block text-sm font-medium text-gray-700 mb-2">
          Amplify App ID
        </label>
        <div className="flex gap-2">
          <input
            id="app-id"
            type="text"
            value={appId}
            onChange={(e) => setAppId(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && fetchInfo()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-purple focus:border-brand-purple"
            placeholder="d1234567890abc (found in AWS Amplify Console)"
          />
          <button
            onClick={fetchInfo}
            disabled={loading || !appId.trim()}
            className="px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-[#3a1766] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Get Info"}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          You can find your App ID in the AWS Amplify Console URL or in your CloudFormation stack
          outputs.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Info Display */}
      {info && (
        <div className="space-y-4">
          <div className="p-4 bg-brand-purple/5 border border-brand-purple/20 rounded-md">
            <p className="text-sm text-foreground mb-2">{info.message}</p>
            <p className="text-xs text-zinc-700 dark:text-zinc-300">
              <strong>App ID:</strong> {info.app_id}
            </p>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">How to View Amplify Logs:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
              {info.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="text-sm font-semibold text-green-900 mb-2">Quick Access:</h3>
            <a
              href={info.console_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Open Amplify Console
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>

          <div className="p-3 bg-brand-gold/15 border border-brand-gold/40 rounded-md">
            <p className="text-xs text-zinc-900">
              <strong>Note:</strong> {info.note}
            </p>
          </div>
        </div>
      )}

      {/* Instructions when no app ID */}
      {!info && !error && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Finding Your Amplify App ID:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            <li>Go to AWS Amplify Console</li>
            <li>Select your app</li>
            <li>The App ID is in the URL: <code className="bg-gray-200 px-1 rounded">amplify/home?region=us-east-1#/d1234567890abc</code></li>
            <li>Or check your CloudFormation stack outputs for <code className="bg-gray-200 px-1 rounded">AmplifyAppId</code></li>
          </ul>
        </div>
      )}
    </div>
  );
}


