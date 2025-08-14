import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import {
  MapPin,
  Building,
  Clock,
  ExternalLink,
  Briefcase,
  ArrowLeft,
  Users,
  Calendar,
} from "lucide-react";

const XLSX_URL = "https://cors-anywhere.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7a7mXUTISq9SRrwi5Uhgv3EnBuaAkXH22_uDtC9laDo78Lw9bqf6iqmYreduoog2IoE9FLef7yf2w/pub?output=csv";

export default function JobPostings() {
  const [header, setHeader] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(XLSX_URL)
      .then((res) => {
        if (!res.ok)
          throw new Error(
            `FPMled to fetch XLSX file: ${res.status} ${res.statusText}`
          );
        return res.arrayBuffer();
      })
      .then((ab) => {
        const workbook = XLSX.read(ab, { type: "array" });
        const sheetName =
          workbook.SheetNames.find((name) => name === "Linkedin") ||
          workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        if (!sheet) throw new Error(`Sheet "Linkedin" not found in XLSX`);
        const data = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
        }) as string[][];
        setHeader(data[0]);
        setRows(data.slice(1));
        setLoading(false);
      })
      .catch((err) => {
        setError(`Error loading job postings: ${err.message}`);
        setLoading(false);
      });
  }, []);

  const getFieldIcon = (fieldName: string) => {
    if (!fieldName || typeof fieldName !== "string")
      return <Briefcase className="w-4 h-4 text-slate-500" />;
    const field = fieldName.toLowerCase();
    if (field.includes("company"))
      return <Building className="w-4 h-4 text-blue-600" />;
    if (field.includes("location"))
      return <MapPin className="w-4 h-4 text-emerald-600" />;
    if (field.includes("time") || field.includes("date"))
      return <Clock className="w-4 h-4 text-amber-600" />;
    if (field.includes("link"))
      return <ExternalLink className="w-4 h-4 text-indigo-600" />;
    if (field.includes("team") || field.includes("department"))
      return <Users className="w-4 h-4 text-purple-600" />;
    if (field.includes("posted") || field.includes("deadline"))
      return <Calendar className="w-4 h-4 text-rose-600" />;
    return <Briefcase className="w-4 h-4 text-slate-500" />;
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const getJobTitle = (row: string[]) => {
    const titleIndex = header.findIndex(
      (h) => h && typeof h === "string" && h.toLowerCase().includes("title")
    );
    if (titleIndex !== -1) return row[titleIndex];
    return row[0] || "Untitled Position";
  };

  const getCompany = (row: string[]) => {
    const companyIndex = header.findIndex(
      (h) => h && typeof h === "string" && h.toLowerCase().includes("company")
    );
    if (companyIndex !== -1) return row[companyIndex];
    return null;
  };

  const getLocation = (row: string[]) => {
    const locationIndex = header.findIndex(
      (h) => h && typeof h === "string" && h.toLowerCase().includes("location")
    );
    if (locationIndex !== -1) return row[locationIndex];
    return null;
  };

  const getLink = (row: string[]) => {
    const linkIndex = header.findIndex(
      (h) => h && typeof h === "string" && h.toLowerCase().includes("link")
    );
    if (linkIndex !== -1) return row[linkIndex];
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-blue-600 mx-auto mb-6"></div>
            <div
              className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-blue-400 animate-spin mx-auto"
              style={{ animationDuration: "1.5s" }}
            ></div>
          </div>
          <h2 className="text-slate-700 text-xl font-semibold mb-2">
            Loading Opportunities
          </h2>
          <p className="text-slate-500">Fetching the latest job postings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Unable to Load Data
            </h2>
            <p className="text-slate-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Try AgPMn
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
            to="/"
            className="text-gray-600 hover:text-gray-800 mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
              
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Career Opportunities
                </h1>
                <p className="text-slate-600 mt-1">
                  Discover your next professional chapter
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">
                  {rows.length} Positions
                </p>
                <p className="text-xs text-slate-500">AvPMlable Now</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MPMn Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {rows.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {rows
              .filter((row) => row.length > 0 && row[0])
              .map((row, idx) => {
                const jobTitle = getJobTitle(row);
                const company = getCompany(row);
                const location = getLocation(row);
                const link = getLink(row);

                return (
                  <div
                    key={idx}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 overflow-hidden hover:-translate-y-0.5"
                  >
                    {/* Card Header */}
                    {/* Card Header */}
                    <div className="p-4 border-b border-slate-100">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-slate-900 mb-1 leading-tight">
                            {truncateText(jobTitle, 45)}
                          </h3>
                          {company && (
                            <div className="flex items-center gap-2 text-slate-600">
                              <Building className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium">
                                {truncateText(company, 30)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-5 h-5 text-slate-600" />
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4">
                      {/* Location */}
                      {location && (
                        <div className="flex items-center gap-3 mb-2 p-3 bg-slate-50 rounded-lg">
                          <MapPin className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm text-slate-700 font-medium">
                            {truncateText(location, 35)}
                          </span>
                        </div>
                      )}

                      {/* Other Fields */}
                      <div className="space-y-2 mb-2">
                        {row.map((value, colIdx) => {
                          const fieldName = header[colIdx] || "";
                          const isTitle =
                            (fieldName &&
                              typeof fieldName === "string" &&
                              fieldName.toLowerCase().includes("title")) ||
                            colIdx === 0;
                          const isCompany =
                            fieldName &&
                            typeof fieldName === "string" &&
                            fieldName.toLowerCase().includes("company");
                          const isLocation =
                            fieldName &&
                            typeof fieldName === "string" &&
                            fieldName.toLowerCase().includes("location");
                          const isLink =
                            fieldName &&
                            typeof fieldName === "string" &&
                            fieldName.toLowerCase().includes("link");

                          if (
                            isTitle ||
                            isCompany ||
                            isLocation ||
                            isLink ||
                            !value ||
                            colIdx === 2
                          ) {
                            return null;
                          }

                          return (
                            <div
                              key={colIdx}
                              className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"
                            >
                              {getFieldIcon(fieldName)}
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                  {fieldName.toLowerCase() === "date" ? "DATE POSTED" : fieldName}

                                </div>
                                <div className="text-sm text-slate-800 break-words leading-relaxed">
                                  {truncateText(value, 60)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Action Button */}
                      <div className="pt-2 border-t border-slate-100">
                        {link ? (
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                          >
                            <span>View Position</span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        ) : (
                          <button
                            disabled
                            className="inline-flex items-center justify-center gap-2 w-full bg-slate-100 text-slate-400 px-4 py-2 rounded-lg font-medium cursor-not-allowed"
                          >
                            <span>No Link AvPMlable</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-slate-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">
                No Opportunities Found
              </h2>
              <p className="text-slate-500 mb-4">
                We couldn't find any job postings at the moment. Please check
                back later or verify the data source.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
